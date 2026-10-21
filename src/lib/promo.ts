// Spin-to-win promo (casino effect). Won discount is stored on the device
// and re-validated server-side at checkout (pct must be one of ALLOWED_PCT).

export type Promo = { pct: number; code: string; wonAt: number };

export const PROMO_KEY = "exit_promo_v1";
export const ALLOWED_PCT = [5, 10, 15] as const;

export function readPromo(): Promo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROMO_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Promo;
    if (!p || !ALLOWED_PCT.includes(p.pct as any) || typeof p.code !== "string") return null;
    return p;
  } catch {
    return null;
  }
}

export function savePromo(p: Promo) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROMO_KEY, JSON.stringify(p));
  } catch {}
}

export function clearStoredPromo() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PROMO_KEY);
  } catch {}
}

export function makeCode(pct: number): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TOCAK-${pct}-${rand}`;
}

export function discountFor(subtotal: number, pct: number): number {
  if (!ALLOWED_PCT.includes(pct as any) || subtotal <= 0) return 0;
  return Math.round((subtotal * pct) / 100 / 10) * 10;
}
