// Public, confirmed identity only. Do not infer a street address or tax IDs.
export const BRAND = {
  name: "EXIT Denim",
  legalName: "TRI-B DOO",
  url: "https://exitdenim.shop",
  phone: "+381653176716",
  phoneLabel: "+381 65 317 6716",
  whatsapp: "https://wa.me/381653176716",
  instagram: "https://instagram.com/exit.denim",
} as const;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "OnlineStore"],
  "@id": `${BRAND.url}/#organization`,
  name: BRAND.name,
  legalName: BRAND.legalName,
  url: `${BRAND.url}/`,
  telephone: BRAND.phone,
  description: "Srpski proizvođač muških farmerki, chino i cargo pantalona. Veleprodaja za butike i private-label proizvodnja uz 35 godina iskustva u izvoznim poslovima. U proizvodnji koristi Jeanologia lasersku tehnologiju.",
  address: { "@type": "PostalAddress", addressCountry: "RS" },
  areaServed: { "@type": "Country", name: "Srbija" },
  sameAs: [BRAND.instagram],
  subjectOf: { "@type": "WebPage", url: `${BRAND.url}/media-kit`, name: "EXIT Denim media kit" },
  knowsAbout: ["muške farmerke", "chino pantalone", "cargo pantalone", "private label proizvodnja denima", "laserska obrada denima"],
  contactPoint: { "@type": "ContactPoint", telephone: BRAND.phone, contactType: "customer service", availableLanguage: ["sr"] },
  paymentAccepted: "Plaćanje pouzećem",
  currenciesAccepted: "RSD",
};