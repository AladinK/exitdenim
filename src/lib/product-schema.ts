import { BRAND } from "./brand";
import { absoluteUrl } from "./image-urls";

type PublicProduct = {
  name: string;
  sku: string;
  description?: string | null;
  color?: string | null;
  fabric?: string | null;
  weight?: string | null;
  fit?: string | null;
  retail: number | string;
  sizes: string[];
  stock: Record<string, number>;
  image_url?: string | null;
  gallery?: string[] | null;
};

// Rokovi kako ih sajt navodi: slanje u roku od 1–2 radna dana, dostava 2–5 radnih dana.
const HANDLING_DAYS = { min: 1, max: 2 };
const TRANSIT_DAYS = { min: 1, max: 3 };

export function productSchema(p: PublicProduct, url: string) {
  const available = p.sizes.filter((size) => (p.stock[size] ?? 0) > 0);
  const images = [p.image_url, ...(p.gallery ?? [])]
    .map((src) => absoluteUrl(src, BRAND.url))
    .filter((src, i, all): src is string => !!src && all.indexOf(src) === i);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name: p.name,
    sku: p.sku,
    mpn: p.sku,
    description: p.description,
    color: p.color,
    material: p.fabric || undefined,
    size: p.sizes,
    countryOfOrigin: { "@type": "Country", name: "Srbija", identifier: "RS" },
    brand: { "@type": "Brand", name: BRAND.name },
    ...(images.length ? { image: images } : {}),
    additionalProperty: [
      ...(p.fit ? [{ "@type": "PropertyValue", name: "Kroj", value: p.fit }] : []),
      ...(p.weight ? [{ "@type": "PropertyValue", name: "Težina tkanine", value: p.weight }] : []),
    ],
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "RSD",
      price: Number(p.retail),
      itemCondition: "https://schema.org/NewCondition",
      availability: available.length ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", "@id": `${BRAND.url}/#organization`, name: BRAND.name },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "RSD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "RS" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: HANDLING_DAYS.min,
            maxValue: HANDLING_DAYS.max,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: TRANSIT_DAYS.min,
            maxValue: TRANSIT_DAYS.max,
            unitCode: "DAY",
          },
        },
      },
    },
  };
}
/** Putanja do proizvoda za pretraživače: Početna → kategorija → model. */
export function productBreadcrumbSchema(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BRAND.url}${item.path}`,
    })),
  };
}
