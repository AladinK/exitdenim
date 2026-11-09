// Shared Serbian search-friendly labels for products, used in titles, descriptions, alt text and internal links.
type P = { category?: string | null; fit?: string | null; name?: string | null; color?: string | null };

export function productKind(p: P) {
  const c = String(p.category ?? "").toLowerCase();
  if (c === "cargo" || p.fit === "Cargo") return "muške cargo pantalone";
  if (c === "chino") return "muške chino pantalone";
  return "muške farmerke";
}

const FIT_PATHS: Record<string, string> = {
  Slim: "/slim-farmerke",
  "Regular Slim": "/regular-slim-farmerke",
  Relaxed: "/relaxed-farmerke",
  Bootcut: "/bootcut-farmerke",
  Flare: "/flare-farmerke",
  Cropped: "/cropped-farmerke",
  Cargo: "/cargo",
};
export const fitPath = (fit?: string | null) => (fit ? FIT_PATHS[fit] : undefined);

export function categoryLink(p: P) {
  const c = String(p.category ?? "").toLowerCase();
  if (c === "cargo" || p.fit === "Cargo") return { to: "/cargo", label: "Sve cargo pantalone" };
  if (c === "chino") return { to: "/chino", label: "Sve chino pantalone" };
  return { to: "/jeans", label: "Sve muške farmerke" };
}

export function productAlt(p: P, extra?: string) {
  const kind = productKind(p);
  const fit = p.fit && p.fit !== "Cargo" ? `, ${p.fit} kroj` : "";
  const color = p.color ? `, ${String(p.color).toLowerCase()}` : "";
  return `${p.name} — ${kind}${fit}${color}${extra ? ` — ${extra}` : ""}`;
}
