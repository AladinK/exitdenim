import { BRAND, MANUFACTURING, organizationSchema } from "./brand";

export const ENGLISH_HISTORY = `EXIT Denim is a Serbian denim brand founded in ${BRAND.foundedYear} in ${BRAND.city}. Production is located at ${BRAND.streetAddress}, ${BRAND.city}, Serbia. TRI-B DOO employs ${MANUFACTURING.employees} people and produces approximately ${MANUFACTURING.averageMonthlyJeans.toLocaleString("en-GB")} pairs of jeans per month on average.`;
export const ENGLISH_EXPORT = "Our exports are primarily directed to all European Union countries and the countries of the former Yugoslavia. Production quantities, pricing and delivery terms for business customers are agreed individually.";
export const B2B_ENGLISH = {
  manufacturing: {
    path: "/en/manufacturing", srPath: "/proizvodnja",
    title: "Denim Manufacturing in Serbia — EXIT Denim",
    description: "EXIT Denim, founded in Novi Pazar in 1991: approximately 5,000 pairs of jeans per month, 35 employees, EU exports and Jeanologia laser technology.",
  },
  privateLabel: {
    path: "/en/private-label", srPath: "/private-label",
    title: "Private Label Denim Manufacturing for EU Brands — EXIT Denim",
    description: "Private-label denim and trousers by EXIT Denim in Serbia. Production in Novi Pazar, exports to the EU and individually agreed collection requirements.",
  },
} as const;
export type EnglishB2BPage = keyof typeof B2B_ENGLISH;

export function b2bLanguageLinks(srPath: string, enPath: string) {
  return [
    { rel: "alternate", hrefLang: "sr", href: `${BRAND.url}${srPath}` },
    { rel: "alternate", hrefLang: "en", href: `${BRAND.url}${enPath}` },
    { rel: "alternate", hrefLang: "x-default", href: `${BRAND.url}${srPath}` },
  ];
}

export function englishB2BHead(page: EnglishB2BPage) {
  const data = B2B_ENGLISH[page];
  const url = `${BRAND.url}${data.path}`;
  const provider = {
    "@type": "Organization", "@id": organizationSchema["@id"], name: BRAND.name,
    legalName: BRAND.legalName, address: organizationSchema.address,
    email: BRAND.email, telephone: BRAND.phone, url: BRAND.url,
    taxID: BRAND.taxId, identifier: organizationSchema.identifier,
  };
  return {
    meta: [
      { title: data.title }, { name: "description", content: data.description },
      { property: "og:title", content: data.title }, { property: "og:description", content: data.description },
      { property: "og:type", content: "website" }, { property: "og:url", content: url },
      { property: "og:locale", content: "en_GB" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }, ...b2bLanguageLinks(data.srPath, data.path)],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org", "@type": "WebPage", name: data.title,
      description: data.description, url, inLanguage: "en", publisher: provider,
      mainEntity: page === "privateLabel" ? {
        "@type": "Service", name: "Private-label denim manufacturing", provider,
        description: data.description, url,
      } : provider,
    }) }],
  };
}