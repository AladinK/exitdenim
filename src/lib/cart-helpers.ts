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
  slug?: string | null;
  name?: string | null;
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

/** Okvirni rok isporuke, 2 do 5 radnih dana od danas, npr. "pon 1.12. – čet 4.12.". */
export function deliveryWindow(now: Date = new Date()): string {
  const fmt = (d: Date) => `${DAY[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`;
  return `${fmt(addBusinessDays(now, 2))} – ${fmt(addBusinessDays(now, 5))}`;
}
