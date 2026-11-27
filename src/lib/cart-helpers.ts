// Pomoćne funkcije korpe i kase: količine, stanje artikala prema katalogu,
// provera telefona i okvirni datum isporuke. Bez zavisnosti od Reacta, da se lako testiraju.

/** Najviše komada istog modela i veličine u jednoj stavki korpe. */
export const MAX_QTY_PER_LINE = 10;

export function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(MAX_QTY_PER_LINE, Math.floor(n)));
}

export const lineKey = (i: { productId: string; size: string }) => `${i.productId}:${i.size}`;

/** Deo proizvoda iz kataloga koji korpi treba. */
export type CatalogProduct = {
  id: string | null;
  sku?: string | null;
  slug?: string | null;
  name?: string | null;
  category?: string | null;
  retail?: number | string | null;
  sizes?: string[] | null;
  active?: boolean | null;
  image_url?: string | null;
  stock?: Record<string, number> | null;
};

export type LineStatus = "ok" | "soldOut" | "unavailable";
export type LineInfo = {
  status: LineStatus;
  /** Veličine modela; inStock je null kada stanje nije poznato. */
  sizes: { size: string; inStock: boolean | null }[];
};

/**
 * Stanje jedne stavke prema katalogu. null znači da katalog još nije stigao.
 * Ako provera stanja nije uspela (prazna mapa stanja), veličina se ne proglašava rasprodatom:
 * server ionako proverava stanje pri upisu porudžbine.
 */
export function lineInfo(
  item: { productId: string; size: string },
  products: CatalogProduct[] | undefined | null,
): LineInfo | null {
  if (!products) return null;
  const p = products.find((x) => x.id === item.productId);
  if (!p || p.active === false) return { status: "unavailable", sizes: [] };
  const stockKnown = !!p.stock && Object.keys(p.stock).length > 0;
  const sizes = (p.sizes ?? []).map((size) => ({
    size,
    inStock: stockKnown ? (p.stock?.[size] ?? 0) > 0 : null,
  }));
  const own = sizes.find((s) => s.size === item.size);
  if (!own) return { status: "soldOut", sizes };
  return { status: own.inStock === false ? "soldOut" : "ok", sizes };
}

/** Telefon: samo cifre (i + na početku). Dozvoljeno 8 do 15 cifara. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 && !/[^\d\s+()./-]/.test(value.trim());
}

const COUNTRY_CODES = ["381", "387", "382", "383", "385", "386", "389"];

/** Isti broj napisan na različite načine (+381 64…, 0038164…, 064/…) svodi se na 064…. */
export function nationalPhone(value: string): string {
  let d = value.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  const cc = COUNTRY_CODES.find((c) => d.startsWith(c) && d.length > c.length + 6);
  if (cc) d = "0" + d.slice(cc.length);
  return d;
}

export function samePhone(a: string, b: string): boolean {
  const x = nationalPhone(a);
  const y = nationalPhone(b);
  return x.length >= 8 && x === y;
}

const DAY = ["ned", "pon", "uto", "sre", "čet", "pet", "sub"];

export function addBusinessDays(from: Date, n: number): Date {
  const d = new Date(from.getTime());
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) added++;
  }
  return d;
}

/**
 * Okvirni rok isporuke, podrazumevano 2 do 5 radnih dana od danas (slanje 1–2 + kurir
 * 1–3), npr. "pon 1.12. – čet 4.12.". Paket koji je već kod kurira: 1 do 3 radna dana.
 */
export function deliveryWindow(now: Date = new Date(), fromDays = 2, toDays = 5): string {
  const fmt = (d: Date) => `${DAY[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`;
  return `${fmt(addBusinessDays(now, fromDays))} – ${fmt(addBusinessDays(now, toDays))}`;
}

export type UpsellPick = {
  product: CatalogProduct;
  /** Veličina koju kupac već nosi, ako je ima na stanju u ovom modelu (jedan dodir za dodavanje). */
  size: string | null;
  sizes: { size: string; inStock: boolean | null }[];
};

/**
 * Preporuke za korpu: modeli koji nisu u korpi i imaju bar jednu veličinu na stanju.
 * Prednost imaju modeli sa veličinom koju kupac već uzima, pa modeli iz druge kategorije
 * (uz farmerke chino ili džeparke); inače ostaje redosled iz kataloga.
 */
export function pickUpsell(
  products: CatalogProduct[],
  items: { productId: string; size: string; quantity?: number }[],
  n: number,
): UpsellPick[] {
  const inCart = new Set(items.map((i) => i.productId));
  const sizeWeight = new Map<string, number>();
  for (const i of items) sizeWeight.set(i.size, (sizeWeight.get(i.size) ?? 0) + (i.quantity ?? 1));
  const preferred = [...sizeWeight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const cartCategories = new Set(
    products.filter((p) => p.id && inCart.has(p.id)).map((p) => p.category ?? ""),
  );
  const scored: (UpsellPick & { score: number; order: number })[] = [];
  products.forEach((p, order) => {
    if (!p.id || inCart.has(p.id) || p.active === false || !(Number(p.retail) > 0) || !p.slug) return;
    const stockKnown = !!p.stock && Object.keys(p.stock).length > 0;
    const sizes = (p.sizes ?? []).map((size) => ({
      size,
      inStock: stockKnown ? (p.stock?.[size] ?? 0) > 0 : null,
    }));
    if (!sizes.some((s) => s.inStock !== false)) return;
    const sameSize = !!preferred && sizes.some((s) => s.size === preferred && s.inStock !== false);
    const otherCategory = !cartCategories.has(p.category ?? "");
    scored.push({
      product: p,
      size: sameSize ? preferred : null,
      sizes,
      score: (sameSize ? 2 : 0) + (otherCategory ? 1 : 0),
      order,
    });
  });
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.slice(0, n).map(({ product, size, sizes }) => ({ product, size, sizes }));
}
