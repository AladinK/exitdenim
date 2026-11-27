// Pomoćne funkcije za e-mailove: iznosi, datumi, linkovi i podaci o artiklima.
// Bez JSX-a, da ih koriste i serverski kod i testovi.

import { BRAND } from "@/lib/brand";
import { deliveryWindow, pickUpsell, type CatalogProduct } from "@/lib/cart-helpers";
import { whatsappHref } from "@/lib/contact";
import { absoluteUrl, publicImageUrl } from "@/lib/image-urls";

export const SITE = BRAND.url;
export const LOGO_URL = `${SITE}/media/exit-logo.png`;

/** Artikal porudžbine kako ga prikazuje e-mail (slika i link su apsolutne adrese). */
export interface EmailItem {
  product_name: string;
  product_sku?: string | null;
  size: string;
  quantity: number;
  unit_price: number;
  image?: string | null;
  url?: string | null;
  category?: string | null;
}

/** Preporučeni model na dnu e-maila. */
export interface EmailProduct {
  name: string;
  price: number;
  image: string;
  url: string;
}

/** "Marko Marković" → "Marko" (za pozdrav). */
export function firstName(name?: string | null): string {
  return (
    String(name ?? "")
      .trim()
      .split(/\s+/)[0] ?? ""
  );
}

/** 12580 → "12.580 din" */
export function din(value: number | string | null | undefined): string {
  return `${Math.round(Number(value) || 0).toLocaleString("sr-RS")} din`;
}

/**
 * Sadašnje vreme kao zidni sat u Beogradu. Server radi u UTC-u, a datumi u e-mailu
 * (danas, okvirna isporuka) treba da prate kalendar kupca.
 */
export function belgradeNow(now: Date = new Date()): Date {
  return new Date(now.toLocaleString("en-US", { timeZone: "Europe/Belgrade" }));
}

/** Okvirna isporuka: porudžbina koja tek kreće (2–5 radnih dana) ili paket kod kurira (1–3). */
export function etaFor(stage: "order" | "shipped", now: Date = belgradeNow()): string {
  return stage === "shipped" ? deliveryWindow(now, 1, 3) : deliveryWindow(now, 2, 5);
}

/** "27.11." za dati trenutak, po beogradskom vremenu. */
export function shortDate(value: Date | string | null | undefined = new Date()): string {
  const d = belgradeNow(value ? new Date(value) : new Date());
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

/** "27.11. u 20:41" po beogradskom vremenu. */
export function dateTime(value: Date | string | null | undefined = new Date()): string {
  const d = belgradeNow(value ? new Date(value) : new Date());
  const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${d.getDate()}.${d.getMonth() + 1}. u ${hm}`;
}

/** Adresa na sajtu, uz oznake kampanje kad link vodi nazad u prodavnicu. */
export function siteUrl(path: string, campaign?: string): string {
  const url = new URL(path, SITE);
  if (campaign) {
    url.searchParams.set("utm_source", "email");
    url.searchParams.set("utm_medium", "email");
    url.searchParams.set("utm_campaign", campaign);
  }
  return url.toString();
}

/** WhatsApp poruka prodavnici sa već upisanim brojem porudžbine. */
export function orderWhatsApp(orderNumber?: string | number | null): string {
  return whatsappHref(orderNumber ? `Zdravo, pišem u vezi porudžbine ${orderNumber}.` : undefined);
}

/** Broj kupca za wa.me link: "064 123 4567" → "381641234567". Nepoznat oblik → null. */
export function waPhone(phone: string | null | undefined): string | null {
  let digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `381${digits.slice(1)}`;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export function telHref(phone: string): string {
  const raw = String(phone).trim();
  return `tel:${raw.startsWith("+") ? "+" : ""}${raw.replace(/\D/g, "")}`;
}

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Putanja fotografije iz skladišta → apsolutna adresa na sajtu (/img/p/...). */
export function productImage(path: string | null | undefined): string | null {
  return absoluteUrl(publicImageUrl(path, "p"), SITE);
}

/** Sve stavke su farmerke: naslov može da kaže "farmerke" umesto "paket". */
export function allJeans(items: Pick<EmailItem, "category" | "product_name">[]): boolean {
  return (
    items.length > 0 &&
    items.every((i) => i.category === "jeans" || /farmer/i.test(i.product_name ?? ""))
  );
}

/** Polja modela koja e-mail koristi (slika, link, cena, veličine za preporuke). */
export const EMAIL_PRODUCT_FIELDS =
  "id, sku, slug, name, category, retail, sizes, active, image_url";

/** Katalog sa stanjem po veličini (1/0), kao u prodavnici. Bez podataka o stanju: null. */
export function withStock(
  rows: Omit<CatalogProduct, "stock">[] | null | undefined,
  availability:
    | { product_id: string | null; size: string | null; in_stock: boolean | null }[]
    | null
    | undefined,
): CatalogProduct[] {
  const stock: Record<string, Record<string, number>> = {};
  for (const row of availability ?? []) {
    if (!row.product_id || !row.size) continue;
    (stock[row.product_id] ??= {})[row.size] = row.in_stock ? 1 : 0;
  }
  return (rows ?? []).map((p) => ({
    ...p,
    stock: availability ? (p.id && stock[p.id]) || {} : null,
  }));
}

export type OrderRow = {
  product_id?: string | null;
  product_name: string;
  product_sku?: string | null;
  size: string;
  quantity: number;
  unit_price: number;
};
type ProductRef = Pick<CatalogProduct, "id" | "slug" | "image_url" | "category">;

/** Stavke porudžbine sa slikom i linkom do modela (ako je model poznat). */
export function emailItems(
  items: OrderRow[],
  products: ProductRef[],
  campaign?: string,
): EmailItem[] {
  const byId = new Map(products.filter((p) => p.id).map((p) => [p.id as string, p]));
  return items.map((i) => {
    const p = i.product_id ? byId.get(i.product_id) : undefined;
    return {
      product_name: i.product_name,
      product_sku: i.product_sku ?? null,
      size: i.size,
      quantity: Number(i.quantity),
      unit_price: Number(i.unit_price),
      image: productImage(p?.image_url),
      url: p?.slug ? siteUrl(`/proizvod/${p.slug}`, campaign) : null,
      category: p?.category ?? null,
    };
  });
}

/**
 * Do tri modela za dno e-maila: isto pravilo kao preporuke u korpi (modeli koji nisu
 * poručeni, sa stanjem, prvo u veličini koju kupac nosi i iz druge kategorije).
 */
export function emailRecommendations(
  catalog: CatalogProduct[],
  items: Pick<OrderRow, "product_id" | "size" | "quantity">[],
  campaign: string,
  n = 3,
): EmailProduct[] {
  const ordered = items
    .filter((i) => i.product_id)
    .map((i) => ({ productId: i.product_id as string, size: i.size, quantity: i.quantity }));
  // Ceo katalog ide u izbor (kategorije poručenih modela utiču na redosled), a u e-mail
  // ulaze samo modeli sa fotografijom.
  const picks = pickUpsell(catalog, ordered, catalog.length)
    .filter(({ product: p }) => p.image_url && p.name)
    .slice(0, n);
  return picks.map(({ product: p }) => ({
    name: String(p.name),
    price: Number(p.retail),
    image: productImage(p.image_url) as string,
    url: siteUrl(`/proizvod/${p.slug}`, campaign),
  }));
}
