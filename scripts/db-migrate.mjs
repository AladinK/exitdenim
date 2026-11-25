#!/usr/bin/env node
// Pravi i ažurira tabele baze iz supabase/migrations/*.sql, samo jednom po fajlu.
//
// Pokreće se sam pre svakog build-a (npm run build). Na Vercel-u radi samo za produkciju,
// da probne verzije sajta ne menjaju pravu bazu. Adresu baze uzima iz promenljivih koje
// Supabase integracija sama upisuje na Vercel-u (POSTGRES_URL_NON_POOLING, POSTGRES_URL),
// ili iz DATABASE_URL. Bez adrese ne radi ništa.
//
//   node scripts/db-migrate.mjs            # primeni ono što nedostaje
//   node scripts/db-migrate.mjs --status   # samo prikaži stanje
//
// Već primenjeni fajlovi se pamte u tabeli private.schema_migrations. Ako baza već ima
// šemu (npr. uvezenu sa Lovable-a), osnovna šema se samo zabeleži, ne pokreće se ponovo.
// Svaki fajl se primenjuje u jednoj transakciji: ili ceo, ili ništa.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, "..", "supabase", "migrations");
const statusOnly = process.argv.includes("--status");
const log = (msg) => console.log(`Baza: ${msg}`);

const url =
  process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!url) {
  log("adresa baze nije podešena (POSTGRES_URL_NON_POOLING), preskačem.");
  process.exit(0);
}
if (process.env.VERCEL && process.env.VERCEL_ENV !== "production" && !process.env.MIGRATE_PREVIEW) {
  log(`ovo je probna verzija (${process.env.VERCEL_ENV}), bazu ne diram.`);
  process.exit(0);
}

const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
const sql = postgres(url, {
  ssl: local ? false : "require",
  max: 1,
  connect_timeout: 20,
  idle_timeout: 5,
  prepare: false, // radi i preko Supabase pooler-a
  onnotice: () => {},
});

const LOCK = 727_274_771; // isti broj za sve build-ove: dva build-a nikad ne menjaju bazu u isto vreme

let exitCode = 0;
try {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  await sql.unsafe(`
    create schema if not exists private;
    create table if not exists private.schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now(),
      how text not null default 'primenjeno'
    );
    revoke all on private.schema_migrations from public;
  `);

  for (const [index, file] of files.entries()) {
    const outcome = await sql.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(${LOCK})`;
      const [done] = await tx`select 1 from private.schema_migrations where name = ${file}`;
      if (done) return "već postoji";
      if (statusOnly) return "ČEKA";

      const [{ count }] = await tx`select count(*)::int as count from private.schema_migrations`;
      const [{ existing }] =
        await tx`select to_regclass('public.products') is not null as existing`;
      if (index === 0 && count === 0 && existing) {
        await tx`insert into private.schema_migrations (name, how) values (${file}, 'zatečeno u bazi')`;
        return "šema je već u bazi (zabeleženo, nije pokretano)";
      }

      await tx.unsafe(await readFile(path.join(dir, file), "utf8"));
      await tx`insert into private.schema_migrations (name) values (${file})`;
      return "primenjeno";
    });
    log(`${file}: ${outcome}`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const unreachable =
    /ECONNREFUSED|ECONNRESET|ENOTFOUND|ENETUNREACH|EHOSTUNREACH|ETIMEDOUT|EAI_AGAIN|CONNECT_TIMEOUT|timeout|getaddrinfo|password authentication|Tenant or user not found/i.test(
      message,
    );
  if (unreachable) {
    // Baza ne odgovara (npr. još se pravi): sajt se ipak objavljuje, šema stiže sledećim build-om.
    log(
      `ne mogu da se povežem (${message.split("\n")[0]}). Preskačem; pokušaću pri sledećem objavljivanju.`,
    );
  } else {
    // Greška u samom SQL-u: build staje, pa ostaje prethodna, ispravna verzija sajta.
    console.error(`Baza: GREŠKA pri pravljenju tabela: ${message}`);
    exitCode = 1;
  }
} finally {
  await sql.end({ timeout: 5 }).catch(() => {});
}
process.exit(exitCode);
