import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BRAND } from "@/lib/brand";
import { absoluteUrl, publicImageUrl } from "@/lib/image-urls";
import { productKind } from "@/lib/seo-labels";

// Spisak proizvoda za Google Merchant Center (besplatni prikaz u Google Shopping-u):
//   https://www.exit.fashion/merchant.xml
// Merchant Center ga sam preuzima jednom dnevno. Svaka veličina je posebna stavka
// (item_group_id = model), sa dostupnošću iz lagera, cenom u dinarima i fotografijama
// sa stalnih adresa. Cena je stvarna prodajna cena; prikazni "pre popusta" iznos se
// ne šalje, jer Google traži da precrtana cena bude cena po kojoj se zaista prodavalo.

const SHIPPING = { handling: [1, 2], transit: [1, 3] } as const; // slanje 1–2, dostava 2–5 radnih dana
const GOOGLE_CATEGORY = "204"; // Apparel & Accessories > Clothing > Pants

const xml = (value: unknown) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

type Row = {
  id: string | null;
  slug: string | null;
  sku: string | null;
  name: string | null;
  category: string | null;
  fit: string | null;
  fabric: string | null;
  color: string | null;
  description: string | null;
  sizes: string[] | null;
  retail: number | string | null;
  image_url: string | null;
  gallery: string[] | null;
};

function productItems(p: Row, inStock: Record<string, boolean>): string[] {
  if (!p.id || !p.slug || !p.sku || !p.name || p.retail == null) return [];
  const link = `${BRAND.url}/proizvod/${p.slug}`;
  const images = [p.image_url, ...(Array.isArray(p.gallery) ? p.gallery : [])]
    .map((src) => absoluteUrl(publicImageUrl(src, "p"), BRAND.url))
    .filter((src, i, all): src is string => !!src && all.indexOf(src) === i);
  if (!images.length) return [];

  const kind = productKind(p);
  const fit = p.fit && p.fit !== "Cargo" ? ` ${p.fit}` : "";
  const color = p.color ? `, ${p.color.toLowerCase()}` : "";
  const title = `${p.name} – ${kind}${fit}${color}`.slice(0, 150);
  const description = (p.description || `${cap(kind)}${fit} ${BRAND.name}.`).slice(0, 5000);
  const productType = `${cap(kind)}${fit ? ` >${fit}` : ""}`;
  const price = `${Number(p.retail).toFixed(2)} RSD`;
  const sizes = Array.isArray(p.sizes) && p.sizes.length ? p.sizes : [""];

  return sizes.map((size) => {
    const available = size ? Boolean(inStock[size]) : Object.values(inStock).some(Boolean);
    return [
      "    <item>",
      `      <g:id>${xml(size ? `${p.sku}-${size}` : p.sku)}</g:id>`,
      `      <g:item_group_id>${xml(p.sku)}</g:item_group_id>`,
      `      <g:title>${xml(title)}</g:title>`,
      `      <g:description>${xml(description)}</g:description>`,
      `      <g:link>${xml(link)}</g:link>`,
      `      <g:image_link>${xml(images[0])}</g:image_link>`,
      ...images.slice(1, 11).map((src) => `      <g:additional_image_link>${xml(src)}</g:additional_image_link>`),
      `      <g:availability>${available ? "in_stock" : "out_of_stock"}</g:availability>`,
      `      <g:price>${price}</g:price>`,
      `      <g:condition>new</g:condition>`,
      `      <g:brand>${xml(BRAND.name)}</g:brand>`,
      `      <g:identifier_exists>no</g:identifier_exists>`,
      `      <g:google_product_category>${GOOGLE_CATEGORY}</g:google_product_category>`,
      `      <g:product_type>${xml(productType)}</g:product_type>`,
      `      <g:gender>male</g:gender>`,
      `      <g:age_group>adult</g:age_group>`,
      p.color ? `      <g:color>${xml(p.color)}</g:color>` : null,
      size ? `      <g:size>${xml(size)}</g:size>` : null,
      p.fabric ? `      <g:material>${xml(p.fabric).slice(0, 200)}</g:material>` : null,
      "      <g:shipping>",
      "        <g:country>RS</g:country>",
      "        <g:service>Kurirska dostava</g:service>",
      "        <g:price>0.00 RSD</g:price>",
      `        <g:min_handling_time>${SHIPPING.handling[0]}</g:min_handling_time>`,
      `        <g:max_handling_time>${SHIPPING.handling[1]}</g:max_handling_time>`,
      `        <g:min_transit_time>${SHIPPING.transit[0]}</g:min_transit_time>`,
      `        <g:max_transit_time>${SHIPPING.transit[1]}</g:max_transit_time>`,
      "      </g:shipping>",
      "    </item>",
    ]
      .filter(Boolean)
      .join("\n");
  });
}

export const Route = createFileRoute("/merchant.xml")({
  server: {
    handlers: {
      GET: async () => {
        let rows: Row[] = [];
        const stock: Record<string, Record<string, boolean>> = {};
        try {
          const { createPublicServerClient } = await import("@/integrations/supabase/client.server");
          const sb = createPublicServerClient();
          const [products, availability] = await Promise.all([
            sb
              .from("products_public")
              .select(
                "id, slug, sku, name, category, fit, fabric, color, description, sizes, retail, image_url, gallery",
              )
              .eq("active", true)
              .order("sort_order", { ascending: true }),
            sb.rpc("get_stock_availability"),
          ]);
          if (products.error) throw new Error(products.error.message);
          if (availability.error) throw new Error(availability.error.message);
          rows = (products.data ?? []) as Row[];
          for (const s of availability.data ?? []) {
            if (s.product_id) (stock[s.product_id] ??= {})[s.size] = Boolean(s.in_stock);
          }
        } catch (error) {
          // Bez baze ne šaljemo prazan spisak: Google bi zaključio da proizvodi više ne postoje.
          console.error("[merchant] proizvodi nisu učitani:", error);
          return new Response("Product feed is temporarily unavailable", {
            status: 503,
            headers: { "Retry-After": "600", "Cache-Control": "no-store" },
          });
        }

        const items = rows.flatMap((p) => productItems(p, (p.id && stock[p.id]) || {}));
        const body = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
          "  <channel>",
          `    <title>${xml(BRAND.name)}</title>`,
          `    <link>${xml(`${BRAND.url}/`)}</link>`,
          `    <description>${xml(`${BRAND.name} — muške farmerke, chino i cargo pantalone`)}</description>`,
          ...items,
          "  </channel>",
          "</rss>",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=900, s-maxage=900",
          },
        });
      },
    },
  },
});
