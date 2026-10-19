import type { ProductWithStock } from "@/lib/products.functions";

export type LandingPage = {
  path: string;
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  match: (p: ProductWithStock) => boolean;
  sections: { h: string; p: string }[];
  faq: { q: string; a: string }[];
};

const fitIs = (...f: string[]) => (p: ProductWithStock) => f.includes(String(p.fit ?? ""));
const catIs = (c: string) => (p: ProductWithStock) => String(p.category ?? "").toLowerCase() === c;

const COMMON_FAQ = [
  { q: "Koliko košta i kako se plaća?", a: "Svi modeli koštaju 5.990 din. Plaćaš pouzećem, kuriru kad paket stigne, bez kartice i bez avansa." },
  { q: "Koliko košta dostava i kada stiže?", a: "Dostava je besplatna na sve porudžbine po celoj Srbiji. Porudžbinu šaljemo u roku od 1–2 radna dana." },
  { q: "Koje veličine postoje?", a: "Šijemo veličine 31, 32, 33, 34, 36, 38 i 40. Ako nisi siguran za broj, javi nam se pre porudžbine." },
];

const FABRIC = { h: "Od čega su", p: "Najveći broj naših modela šijemo od teksasa sa 98% pamuka i 2% elastina, prosečne težine oko 12 oz. Pamuk daje čvrst, pravi denim osećaj, a malo elastina daje udobnost pri sedenju i hodu. Tačan sastav svakog modela piše na njegovoj strani." };
const MADE = { h: "Ko ih šije", p: "EXIT je domaći proizvođač denima. Krojimo i šijemo u vlastitoj radionici u Srbiji, pa kroj i veličine ostaju isti od serije do serije." };

export const LANDING_PAGES: LandingPage[] = [
  {
    path: "/jeans", label: "Muške farmerke",
    title: "Muške farmerke i jeans — teksas pantalone | EXIT Denim",
    description: "Muške farmerke od teksasa: slim, regular, relaxed, bootcut, flare. 5.990 din, plaćanje pouzećem, besplatna dostava po Srbiji.",
    h1: "Muške farmerke",
    intro: "Farmerke od pravog teksasa, u krojevima od uskog slim do širokog flare. Domaća proizvodnja, plaćaš kad stigne.",
    match: catIs("jeans"),
    sections: [
      { h: "Kako da izabereš kroj farmerki", p: "Slim je uzak celom dužinom i ide uz telo. Regular Slim ima malo više mesta u butini, a sužava se ka dnu. Relaxed je širok i opušten. Bootcut se blago širi od kolena, a Flare je uzak u kolenu i najširi na dnu. Cropped ima skraćenu nogavicu." },
      FABRIC, MADE,
    ],
    faq: COMMON_FAQ,
  },
  {
    path: "/chino", label: "Chino pantalone",
    title: "Muške chino pantalone | EXIT Denim",
    description: "Muške chino pantalone za posao i svaki dan. 5.990 din, plaćanje pouzećem, besplatna dostava po Srbiji.",
    h1: "Muške chino pantalone",
    intro: "Chino je mirnija alternativa farmerkama: uredan izgled za posao, a udobnost za ceo dan.",
    match: catIs("chino"),
    sections: [
      { h: "Kada nositi chino", p: "Chino ide uz košulju i sako za posao, ali i uz majicu i patike vikendom. Ako ti farmerke deluju previše ležerno, a odelo previše formalno, chino je sredina." },
      MADE,
    ],
    faq: COMMON_FAQ,
  },
  {
    path: "/cargo", label: "Cargo pantalone",
    title: "Muške cargo pantalone | EXIT Denim",
    description: "Muške cargo pantalone sa bočnim džepovima. 5.990 din, plaćanje pouzećem, besplatna dostava po Srbiji.",
    h1: "Muške cargo pantalone",
    intro: "Cargo sa bočnim džepovima, opušten kroj i čvrst materijal za svakodnevno nošenje.",
    match: (p) => catIs("cargo")(p) || fitIs("Cargo")(p),
    sections: [
      { h: "Zašto cargo", p: "Bočni džepovi nose telefon, ključeve i novčanik bez torbe. Kroj je širi i opušteniji od klasičnih farmerki, pa ide uz streetwear stil i veće patike." },
      MADE,
    ],
    faq: COMMON_FAQ,
  },
  {
    path: "/wide-flare", label: "Široke farmerke",
    title: "Široke muške farmerke — relaxed, bootcut i flare | EXIT Denim",
    description: "Široke muške farmerke: relaxed, bootcut i flare kroj. 5.990 din, pouzećem, besplatna dostava.",
    h1: "Široke farmerke",
    intro: "Relaxed, Bootcut i Flare: tri načina da nogavica bude šira.",
    match: fitIs("Relaxed", "Bootcut", "Flare"),
    sections: [
      { h: "Razlika između relaxed, bootcut i flare", p: "Relaxed je širok od butine do dna. Bootcut je kao regular do kolena, pa se blago širi. Flare je uzak u kolenu i jako širok na dnu." },
      FABRIC,
    ],
    faq: COMMON_FAQ,
  },
  ...([
    ["slim", "Slim", "Slim farmerke su uske celom dužinom nogavice i prate liniju noge. Najbolje stoje uz patike ili čizme i daju čist, moderan izgled."],
    ["regular-slim", "Regular Slim", "Regular Slim ima malo više mesta u butini od slim kroja, a nogavica se sužava ka dnu. Udoban kroj za svaki dan."],
    ["relaxed", "Relaxed", "Relaxed farmerke su široke i opuštene od butine do dna. Udobne za ceo dan i idu uz streetwear stil."],
    ["bootcut", "Bootcut", "Bootcut farmerke su kao regular do kolena, a od kolena se blago šire. Lepo padaju preko čizama i većih patika."],
    ["flare", "Flare", "Flare farmerke su uske u kolenu i jako široke na dnu. Upečatljiv kroj koji se vratio u modu."],
    ["cropped", "Cropped", "Cropped farmerke imaju skraćenu nogavicu, iznad članka. Pokazuju patike i čarape i deluju lagano."],
  ] as const).map(([slug, fit, text]): LandingPage => ({
    path: `/${slug}-farmerke`, label: `${fit} farmerke`,
    title: `${fit} farmerke za muškarce | EXIT Denim`,
    description: `Muške ${fit.toLowerCase()} farmerke od teksasa. 5.990 din, plaćanje pouzećem, besplatna dostava po Srbiji.`,
    h1: `${fit} farmerke`,
    intro: text,
    match: fitIs(fit),
    sections: [FABRIC, MADE],
    faq: COMMON_FAQ,
  })),
];

export const landingByPath = (path: string) => LANDING_PAGES.find((l) => l.path === path)!;
