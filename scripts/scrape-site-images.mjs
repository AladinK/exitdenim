#!/usr/bin/env node
// Skuplja SVE slike i video sa živog sajta (logo, fotografije brenda, slika za deljenje,
// fotografije proizvoda) i čuva ih u fasciklu, kao rezervnu kopiju pre selidbe.
//
//   node scripts/scrape-site-images.mjs                       # https://exitdenim.shop → slike-sa-sajta/
//   node scripts/scrape-site-images.mjs --origin=https://... --out=neka-fascikla
//
// Raspored u izlaznoj fascikli:
//   supabase-storage/<skladište>/<putanja>   fotografije proizvoda i slike iz administracije,
//                                           sa ISTIM putanjama: ceo folder se otprema 1:1 u
//                                           novi Supabase Storage (product-images, site-assets)
//   brend/<fajl>                            logo, naslovne fotografije, video (Lovable CDN)
//   sajt/<putanja>                          favicon i ostali fajlovi sa samog sajta
//   spoljne/<server>/<fajl>                 slike sa drugih servera (npr. slika za deljenje linka)
//   izvestaj.json                           šta je nađeno, odakle i šta nije uspelo
//
// Fotografije proizvoda postoje na stranicama samo dok baza radi. Ako je baza uspavana,
// skripta to javi; probudite bazu (Lovable → Cloud → Top up → Wake up) i pokrenite je ponovo.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const arg = (name, fallback) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const ORIGIN = arg("origin", process.env.SITE_ORIGIN || "https://exitdenim.shop").replace(
  /\/+$/,
  "",
);
const OUT = path.resolve(arg("out", "slike-sa-sajta"));
const UA = "Mozilla/5.0 (compatible; EXIT-Denim-rezervna-kopija/1.0)";

// Stranice bez proizvoda (rade i dok je baza uspavana) i stranice sa proizvodima.
const STATIC_PAGES = [
  "/kontakt",
  "/faq",
  "/proizvodnja",
  "/vodic-za-farmerke",
  "/private-label",
  "/postani-partner",
  "/media-kit",
  "/privatnost",
  "/en/manufacturing",
  "/en/private-label",
  "/auth",
  "/korpa",
];
const DATA_PAGES = [
  "/",
  "/katalog",
  "/jeans",
  "/chino",
  "/cargo",
  "/slim-farmerke",
  "/regular-slim-farmerke",
  "/relaxed-farmerke",
  "/bootcut-farmerke",
  "/flare-farmerke",
  "/cropped-farmerke",
  "/wide-flare",
];
const MEDIA_EXT = /\.(jpe?g|png|webp|gif|svg|avif|ico|mp4|webm|mov)$/i;

// HTML i ugrađeni JSON beže znakove na razne načine; vraćamo ih da bi adrese bile cele.
const unescape = (s) =>
  s
    .replace(/\\u0026/gi, "&")
    .replace(/\\u002f/gi, "/")
    .replace(/\\u003d/gi, "=")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#47;/g, "/");

async function get(url, { timeout = 30_000 } = {}) {
  const res = await fetch(url, {
    headers: { "user-agent": UA },
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
  });
  return res;
}

function extractUrls(html, pageUrl) {
  const text = unescape(html);
  const found = new Set();
  const add = (raw) => {
    if (!raw) return;
    const value = raw.trim().replace(/[\\"')]+$/, "");
    if (!value || value.startsWith("data:") || value.startsWith("blob:")) return;
    let url;
    try {
      url = new URL(value, pageUrl);
    } catch {
      return;
    }
    if (!/^https?:$/.test(url.protocol)) return;
    const isStorage =
      /\.supabase\.co$/.test(url.hostname) && url.pathname.startsWith("/storage/v1/object/");
    const isLovableCdn = url.pathname.startsWith("/__l5e/assets-v1/");
    if (isStorage || isLovableCdn || MEDIA_EXT.test(url.pathname)) found.add(url.href);
  };
  for (const m of text.matchAll(/\b(?:src|href|poster|content|data-src)\s*=\s*["']([^"']+)["']/gi))
    add(m[1]);
  for (const m of text.matchAll(/\b(?:srcset|imagesrcset)\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of m[1].split(",")) add(part.trim().split(/\s+/)[0]);
  }
  for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) add(m[1]);
  for (const m of text.matchAll(
    /https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/[^\s"'<>\\)]+/gi,
  ))
    add(m[0]);
  for (const m of text.matchAll(/\/__l5e\/assets-v1\/[0-9a-f-]+\/[A-Za-z0-9._-]+/gi)) add(m[0]);
  for (const m of text.matchAll(/https:\/\/storage\.googleapis\.com\/[^\s"'<>\\)]+/gi)) add(m[0]);
  const products = new Set();
  for (const m of text.matchAll(/\/proizvod\/([a-z0-9][a-z0-9-]*)/gi))
    products.add(`/proizvod/${m[1].toLowerCase()}`);
  // Kod sajta (JavaScript) pominje i slike koje se pojave tek posle klika ili promene slajda.
  const scripts = new Set();
  for (const m of text.matchAll(
    /<(?:script|link)\b[^>]*\b(?:src|href)\s*=\s*["']([^"']+\.m?js)["']/gi,
  )) {
    try {
      const u = new URL(m[1], pageUrl);
      if (u.origin === new URL(pageUrl).origin) scripts.add(u.href);
    } catch {}
  }
  return { media: found, products, scripts };
}

const safe = (p) =>
  p
    .split("/")
    .filter((s) => s && s !== "." && s !== "..")
    .map((s) => decodeURIComponent(s).replace(/[^A-Za-z0-9._ -]/g, "_"))
    .join("/");

// Gde fajl ide i pod kojim imenom; ista slika sa više adresa (npr. potpisane adrese
// sa različitim tokenom) čuva se jednom.
function target(href) {
  const url = new URL(href);
  if (/\.supabase\.co$/.test(url.hostname)) {
    const m = url.pathname.match(
      /^\/storage\/v1\/object\/(?:sign|public|authenticated)\/([^/]+)\/(.+)$/,
    );
    if (m)
      return {
        group: "supabase-storage",
        key: `${m[1]}/${decodeURIComponent(m[2])}`,
        file: `supabase-storage/${safe(m[1])}/${safe(m[2])}`,
      };
  }
  if (url.pathname.startsWith("/__l5e/assets-v1/")) {
    const name = url.pathname.split("/").pop();
    return { group: "brend", key: `brend/${name}`, file: `brend/${safe(name)}` };
  }
  if (url.origin === ORIGIN)
    return { group: "sajt", key: `sajt${url.pathname}`, file: `sajt/${safe(url.pathname)}` };
  return {
    group: "spoljne",
    key: `${url.hostname}${url.pathname}`,
    file: `spoljne/${safe(url.hostname)}/${safe(url.pathname.split("/").pop() || "fajl")}`,
  };
}

await mkdir(OUT, { recursive: true });
const report = {
  origin: ORIGIN,
  vreme: new Date().toISOString(),
  stranice: [],
  fajlovi: [],
  greske: [],
};
const media = new Map(); // key -> { href, file, group, pages:Set }
const queue = [...STATIC_PAGES, ...DATA_PAGES, "/favicon.ico"];
const seenPages = new Set();
const scriptQueue = new Set();
let dataPagesDown = 0;

// Spisak proizvoda iz sitemap-a (radi samo dok baza radi).
try {
  const res = await get(`${ORIGIN}/sitemap.xml`);
  if (res.ok) {
    const xml = await res.text();
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      const u = new URL(m[1]);
      if (u.pathname.startsWith("/proizvod/")) queue.push(u.pathname);
    }
  }
} catch {}

while (queue.length) {
  const page = queue.shift();
  if (seenPages.has(page)) continue;
  seenPages.add(page);
  if (page === "/favicon.ico") {
    const t = target(`${ORIGIN}/favicon.ico`);
    media.set(t.key, { href: `${ORIGIN}/favicon.ico`, ...t, pages: new Set(["(sajt)"]) });
    continue;
  }
  let status = 0;
  try {
    const res = await get(ORIGIN + page);
    status = res.status;
    const html = await res.text();
    if (res.ok) {
      const { media: urls, products, scripts } = extractUrls(html, ORIGIN + page);
      for (const href of urls) {
        const t = target(href);
        const entry = media.get(t.key) ?? { href, ...t, pages: new Set() };
        entry.pages.add(page);
        media.set(t.key, entry);
      }
      for (const p of products) if (!seenPages.has(p)) queue.push(p);
      for (const js of scripts) scriptQueue.add(js);
    } else if (DATA_PAGES.includes(page) || page.startsWith("/proizvod/")) {
      dataPagesDown++;
    }
  } catch (error) {
    report.greske.push({ stranica: page, greska: String(error?.message ?? error) });
  }
  report.stranice.push({ stranica: page, status });
  console.log(`${String(status || "ERR").padEnd(4)} ${page}`);
}

// Fotografije brenda sa spiska u repou (neke se na stranicama pojave tek posle klika).
try {
  const manifestPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "media.manifest.json",
  );
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  for (const item of manifest.items ?? []) {
    const href = item.url || new URL(item.source, ORIGIN).href;
    const t = target(href);
    const entry = media.get(t.key) ?? { href, ...t, pages: new Set() };
    entry.pages.add("(spisak u repou)");
    media.set(t.key, entry);
  }
} catch {}

// Slike koje pominje kod sajta (samo adrese sa Lovable CDN-a; ostalo je već nađeno na stranicama).
for (const js of scriptQueue) {
  try {
    const res = await get(js);
    if (!res.ok) continue;
    const code = unescape(await res.text());
    for (const m of code.matchAll(/\/__l5e\/assets-v1\/[0-9a-f-]+\/[A-Za-z0-9._-]+/gi)) {
      const href = new URL(m[0], ORIGIN).href;
      const t = target(href);
      const entry = media.get(t.key) ?? { href, ...t, pages: new Set() };
      entry.pages.add("(kod sajta)");
      media.set(t.key, entry);
    }
  } catch {}
}
report.skripti = scriptQueue.size;

console.log(`\nNađeno ${media.size} fajlova. Preuzimam…`);
for (const entry of media.values()) {
  try {
    const res = await get(entry.href, { timeout: 120_000 });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (type.includes("text/html")) throw new Error("server je vratio stranicu umesto fajla");
    const bytes = Buffer.from(await res.arrayBuffer());
    if (!bytes.length) throw new Error("prazan fajl");
    const file = path.join(OUT, entry.file);
    if (!file.startsWith(OUT + path.sep)) throw new Error("nedozvoljena putanja");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, bytes);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    report.fajlovi.push({
      fajl: entry.file,
      grupa: entry.group,
      bajtova: bytes.length,
      sha256,
      tip: type,
      izvor: entry.href.split("?")[0],
      stranice: [...entry.pages],
    });
    console.log(`  ok  ${entry.file} (${(bytes.length / 1024).toFixed(0)} KB)`);
  } catch (error) {
    report.greske.push({
      fajl: entry.file,
      izvor: entry.href.split("?")[0],
      greska: String(error?.message ?? error),
    });
    console.log(`  x   ${entry.file}: ${error?.message ?? error}`);
  }
}

const count = (g) => report.fajlovi.filter((f) => f.grupa === g).length;
const productPhotos = count("supabase-storage");
const reachable = report.stranice.some((p) => p.status > 0);
report.baza = !reachable
  ? "nepoznato"
  : dataPagesDown > 0 && productPhotos === 0
    ? "uspavana"
    : "radi";
await writeFile(path.join(OUT, "izvestaj.json"), JSON.stringify(report, null, 2));

const lines = [
  `## Slike sa sajta ${ORIGIN}`,
  "",
  `| Grupa | Fajlova |`,
  `| --- | --- |`,
  `| Logo, fotografije i video brenda | ${count("brend")} |`,
  `| Fotografije proizvoda i slike iz administracije | ${productPhotos} |`,
  `| Favicon i ostali fajlovi sajta | ${count("sajt")} |`,
  `| Sa drugih servera (npr. slika za deljenje linka) | ${count("spoljne")} |`,
  `| Nije uspelo | ${report.greske.length} |`,
  "",
  !reachable
    ? `**Sajt ${ORIGIN} se ne otvara**, pa ništa nije preuzeto. Proverite adresu i pokrenite ponovo.`
    : report.baza === "uspavana"
      ? "**Baza je uspavana**, pa fotografije proizvoda nisu dostupne. Probudite je (Lovable → Cloud → Top up → Wake up), pa ponovo pokrenite ovaj posao (Re-run all jobs)."
      : report.greske.length
        ? `Preuzeto je ${report.fajlovi.length} fajlova; ${report.greske.length} nije uspelo (spisak je u izvestaj.json). Fajlovi su u prilogu ovog pokretanja (Artifacts → slike-sa-sajta).`
        : `Preuzeto je svih ${report.fajlovi.length} fajlova. Nalaze se u prilogu ovog pokretanja (Artifacts → slike-sa-sajta).`,
];
console.log("\n" + lines.join("\n"));
if (process.env.GITHUB_STEP_SUMMARY)
  await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
if (process.env.GITHUB_ACTIONS && report.baza === "uspavana") {
  console.log(
    "::warning::Baza je uspavana: fotografije proizvoda nisu preuzete. Probudite bazu i pokrenite ponovo.",
  );
}
if (!reachable) process.exit(1);
