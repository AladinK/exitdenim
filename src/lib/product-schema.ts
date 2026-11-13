import { BRAND } from "./brand";

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
};

export function productSchema(p: PublicProduct, url: string) {
  const available = p.sizes.filter((size) => (p.stock[size] ?? 0) > 0);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name: p.name,
    sku: p.sku,
    description: p.description,
    color: p.color,
    material: p.fabric || undefined,
    size: p.sizes,
    countryOfOrigin: { "@type": "Country", name: "Srbija", identifier: "RS" },
    brand: { "@type": "Brand", name: BRAND.name },
    ...(p.image_url?.startsWith("https://") ? { image: p.image_url } : {}),
    additionalProperty: [
      ...(p.fit ? [{ "@type": "PropertyValue", name: "Kroj", value: p.fit }] : []),
      ...(p.weight ? [{ "@type": "PropertyValue", name: "Težina tkanine", value: p.weight }] : []),
    ],
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "RSD",
      price: Number(p.retail),
      availability: available.length ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", "@id": `${BRAND.url}/#organization`, name: BRAND.name },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "RSD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "RS" },
      },
    },
  };
}