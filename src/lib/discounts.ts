// Popusti u korpi: količinski (2+ komada) i točak sreće. Ne sabiraju se: važi veći.
// Isto pravilo koriste korpa (prikaz) i server (naplata), pa se iznosi uvek slažu.
import { ALLOWED_PCT } from "@/lib/promo";

/** Količinski popust koji je vlasnik odobrio 27.11.2026: 10% na celu porudžbinu od 2 komada. */
export const BUNDLE = { minQty: 2, pct: 10, code: "2+ KOMADA" } as const;

export type DiscountSource = "bundle" | "wheel";
export type Discount = { pct: number; amount: number; source: DiscountSource | null };

const roundTo10 = (n: number) => Math.round(n / 10) * 10;

export function bestDiscount(subtotal: number, count: number, wheelPct: number): Discount {
  const bundlePct = count >= BUNDLE.minQty ? BUNDLE.pct : 0;
  const wPct = (ALLOWED_PCT as readonly number[]).includes(wheelPct) ? wheelPct : 0;
  const pct = Math.max(bundlePct, wPct);
  if (subtotal <= 0 || pct === 0) return { pct: 0, amount: 0, source: null };
  // Isti procenat: važi količinski popust (kod sa točka ostaje neiskorišćen).
  const source: DiscountSource = wPct > bundlePct ? "wheel" : "bundle";
  return { pct, amount: roundTo10((subtotal * pct) / 100), source };
}

/** Koliko komada još treba do količinskog popusta (0 kad je ostvaren). */
export function piecesToBundle(count: number): number {
  return Math.max(0, BUNDLE.minQty - count);
}

/** Naziv popusta za obaveštenja i potvrde, prema sačuvanom kodu. */
export function discountLabel(code: string | null | undefined): string {
  if (code === BUNDLE.code) return `Popust za ${BUNDLE.minQty}+ komada`;
  if (code?.startsWith("TOCAK-")) return `Točak sreće (${code})`;
  return code ? `Popust (${code})` : "Popust";
}
