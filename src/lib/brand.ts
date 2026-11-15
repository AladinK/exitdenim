// Public, confirmed identity only. Brand founding is not legal incorporation.
export const BRAND = {
  name: "EXIT Denim",
  legalName: "TRI-B DOO",
  url: "https://exitdenim.shop",
  phone: "+381653176716",
  phoneLabel: "+381 65 317 6716",
  whatsapp: "https://wa.me/381653176716",
  instagram: "https://instagram.com/exit.denim",
  email: "office@bennelijeans.com",
  taxId: "101792816",
  registrationId: "07717741",
  foundedYear: 1991,
  streetAddress: "Save Kovačevića 31b",
  city: "Novi Pazar",
} as const;

export const MANUFACTURING = {
  averageMonthlyJeans: 5000,
  employees: 35,
  exportMarkets: ["Sve zemlje Evropske unije", "Zemlje bivše Jugoslavije"],
} as const;
export const BRAND_HISTORY_TEXT = `EXIT Denim je srpski brend farmerki osnovan ${BRAND.foundedYear}. godine u Novom Pazaru. Proizvodnja je na adresi ${BRAND.streetAddress}, ${BRAND.city}. Firma TRI-B DOO zapošljava ${MANUFACTURING.employees} radnika i u proseku proizvodi oko 5.000 komada jeansa mesečno.`;
export const EXPORT_TEXT = "Izvoz je prvenstveno usmeren ka svim zemljama Evropske unije i zemljama bivše Jugoslavije. Uslovi proizvodnje, količine i rokovi za poslovne kupce dogovaraju se pojedinačno.";

export const SIZE_EXCHANGE = { days: 7, customerCost: 0 } as const;
export const SIZE_EXCHANGE_TEXT = `Zamena veličine je moguća u roku od ${SIZE_EXCHANGE.days} dana; troškove zamene snosi EXIT. Javite nam se na ${BRAND.phoneLabel} ili ${BRAND.email} radi dogovora. Ova pogodnost ne ograničava zakonska prava potrošača.`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "OnlineStore"],
  "@id": `${BRAND.url}/#organization`,
  name: BRAND.name,
  legalName: BRAND.legalName,
  url: `${BRAND.url}/`,
  telephone: BRAND.phone,
  email: BRAND.email,
  taxID: BRAND.taxId,
  identifier: { "@type": "PropertyValue", propertyID: "Matični broj", value: BRAND.registrationId },
  description: `${BRAND_HISTORY_TEXT} ${EXPORT_TEXT} U proizvodnji koristi Jeanologia lasersku tehnologiju.`,
  address: { "@type": "PostalAddress", streetAddress: BRAND.streetAddress, addressLocality: BRAND.city, addressCountry: "RS" },
  areaServed: { "@type": "Country", name: "Srbija" },
  sameAs: [BRAND.instagram],
  subjectOf: { "@type": "WebPage", url: `${BRAND.url}/media-kit`, name: "EXIT Denim media kit" },
  knowsAbout: ["muške farmerke", "chino pantalone", "cargo pantalone", "private label proizvodnja denima", "laserska obrada denima"],
  contactPoint: { "@type": "ContactPoint", telephone: BRAND.phone, contactType: "customer service", availableLanguage: ["sr"] },
  paymentAccepted: "Plaćanje pouzećem",
  currenciesAccepted: "RSD",
};