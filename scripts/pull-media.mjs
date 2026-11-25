#!/usr/bin/env node
// Preuzima fotografije i video sa starog (Lovable) CDN-a u public/media/, da sajt
// više ne zavisi od tuđeg servera. Posle prvog uspešnog pokretanja fajlove treba
// komitovati u repo; skripta tada više ništa ne preuzima.
//
//   npm run assets:pull                         # preuzmi sve što nedostaje
//   node scripts/pull-media.mjs --soft          # isto, ali nikad ne obara build
//   MEDIA_ORIGIN=https://nesto.lovable.app npm run assets:pull
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "..", "public", "media");
const manifest = JSON.parse(await readFile(path.join(here, "media.manifest.json"), "utf8"));

const soft = process.argv.includes("--soft");
const originArg = process.argv.find((a) => a.startsWith("--origin="))?.slice("--origin=".length);
const origin = (originArg || process.env.MEDIA_ORIGIN || manifest.defaultOrigin).replace(/\/+$/, "");

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const exists = async (file) => stat(file).then((s) => s.size > 0, () => false);

async function download(item) {
  if (!SAFE_NAME.test(item.file)) throw new Error(`nedozvoljeno ime fajla: ${item.file}`);
  const target = path.join(outDir, item.file);
  if (await exists(target)) return "postoji";

  const response = await fetch(origin + item.source, { redirect: "follow", signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  // Stranica greške umesto slike znači da izvor više ne služi ovaj fajl.
  if (type.includes("text/html")) throw new Error("server je vratio HTML umesto fajla");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0) throw new Error("prazan odgovor");
  if (item.bytes && bytes.length !== item.bytes) {
    console.warn(`  ! ${item.file}: ${bytes.length} B, a očekivano ${item.bytes} B (sačuvano, proverite fajl)`);
  }
  const partial = `${target}.part`;
  await writeFile(partial, bytes);
  await rename(partial, target);
  return `preuzeto (${(bytes.length / 1024).toFixed(0)} KB)`;
}

await mkdir(outDir, { recursive: true });
let failed = 0;
for (const item of manifest.items) {
  try {
    console.log(`  ${item.file}: ${await download(item)}`);
  } catch (error) {
    failed++;
    console.error(`  x ${item.file}: ${error instanceof Error ? error.message : error}`);
  }
}

if (failed) {
  console.error(`\n${failed} od ${manifest.items.length} fajlova nije preuzeto sa ${origin}.`);
  console.error("Pokrenite ponovo ili ručno stavite fajlove u public/media/ (imena su u scripts/media.manifest.json).");
  process.exit(soft ? 0 : 1);
}
console.log(`\nSvi fajlovi (${manifest.items.length}) su u public/media/.`);
