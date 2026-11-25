import { BRAND } from "@/lib/brand";

/** Veze za brz kontakt. Koriste se i kao rezervni put za porudžbinu kad sajt ne može da je upiše. */
export const phoneHref = `tel:${BRAND.phone}`;
export const viberHref = `viber://chat?number=${encodeURIComponent(BRAND.phone)}`;
export const whatsappHref = (text?: string) =>
  text ? `${BRAND.whatsapp}?text=${encodeURIComponent(text)}` : BRAND.whatsapp;

export type OrderLine = { name: string; sku?: string; size: string; quantity: number; unitPrice: number };
export type OrderContact = {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal?: string;
  note?: string | null;
};

const din = (n: number) => `${n.toLocaleString("sr-RS")} din`;

/** Tekst porudžbine spreman za slanje porukom: isti podaci koje bi upisala kasa. */
export function orderMessage(lines: OrderLine[], total: number, contact: OrderContact = {}): string {
  const items = lines.map(
    (l) => `• ${l.name}${l.sku ? ` (${l.sku})` : ""}, veličina ${l.size} × ${l.quantity} = ${din(l.unitPrice * l.quantity)}`,
  );
  const where = [contact.address, [contact.postal, contact.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  return [
    "Zdravo, želim da poručim sa exitdenim.shop:",
    ...items,
    `Ukupno: ${din(total)} (plaćanje pouzećem)`,
    contact.name ? `Ime: ${contact.name}` : null,
    contact.phone ? `Telefon: ${contact.phone}` : null,
    where ? `Adresa: ${where}` : null,
    contact.note ? `Napomena: ${contact.note}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function productQuestion(name: string, sku: string, size?: string | null): string {
  return `Zdravo, zanima me model ${name} (${sku})${size ? `, veličina ${size}` : ""}. Da li je dostupan?`;
}
