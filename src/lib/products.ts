export type Fit = "Slim" | "Regular Slim" | "Relaxed" | "Cargo";
export type Category = "jeans" | "chino" | "cargo";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: Category;
  fit: Fit;
  fabric: string;
  weight: string;
  sizes: string[];
  wholesale: number; // EUR
  retail: number;
  moq: number;
  delivery: string;
  stock: Record<string, number>;
  description: string;
  color: string;
};

const SIZES = ["31", "32", "33", "34", "36", "38", "40"];

const stockEven = (n: number): Record<string, number> =>
  Object.fromEntries(SIZES.map((s) => [s, n]));

export const PRODUCTS: Product[] = [
  {
    slug: "ex-101-indigo",
    sku: "EX-101",
    name: "EX-101 Indigo Slim",
    category: "jeans",
    fit: "Slim",
    fabric: "98% Cotton / 2% Elastane",
    weight: "12.5 oz",
    sizes: SIZES,
    wholesale: 14.9,
    retail: 39.9,
    moq: 12,
    delivery: "5–7 dana",
    stock: stockEven(40),
    description:
      "Klasični tamno indigo model, čvrsta tkanina, stabilan fit koji ne razvlači. Najprodavaniji artikal u kategoriji.",
    color: "Indigo",
  },
  {
    slug: "ex-102-black-rinse",
    sku: "EX-102",
    name: "EX-102 Black Rinse Slim",
    category: "jeans",
    fit: "Regular Slim",
    fabric: "99% Cotton / 1% Elastane",
    weight: "12 oz",
    sizes: SIZES,
    wholesale: 14.9,
    retail: 39.9,
    moq: 12,
    delivery: "5–7 dana",
    stock: stockEven(60),
    description: "Black rinse, bez izbjeljivanja. Univerzalan komad za svaki butik.",
    color: "Black",
  },
  {
    slug: "ex-110-stone-wash",
    sku: "EX-110",
    name: "EX-110 Stone Wash Relaxed",
    category: "jeans",
    fit: "Relaxed",
    fabric: "100% Cotton",
    weight: "13.5 oz",
    sizes: SIZES,
    wholesale: 16.5,
    retail: 44.9,
    moq: 10,
    delivery: "7–10 dana",
    stock: stockEven(28),
    description: "Stone wash, opušteniji kroj, trenutno najbrže rastući fit u regiji.",
    color: "Stone Blue",
  },
  {
    slug: "ex-201-chino-beige",
    sku: "EX-201",
    name: "EX-201 Chino Beige",
    category: "chino",
    fit: "Slim",
    fabric: "97% Cotton / 3% Elastane",
    weight: "9 oz",
    sizes: SIZES,
    wholesale: 12.9,
    retail: 34.9,
    moq: 12,
    delivery: "5–7 dana",
    stock: stockEven(50),
    description: "Klasični beige chino, mekana tkanina sa elastinom, evergreen artikal.",
    color: "Beige",
  },
  {
    slug: "ex-202-chino-navy",
    sku: "EX-202",
    name: "EX-202 Chino Navy",
    category: "chino",
    fit: "Slim",
    fabric: "97% Cotton / 3% Elastane",
    weight: "9 oz",
    sizes: SIZES,
    wholesale: 12.9,
    retail: 34.9,
    moq: 12,
    delivery: "5–7 dana",
    stock: stockEven(35),
    description: "Tamno plavi chino, prirodan partner uz EX-101.",
    color: "Navy",
  },
  {
    slug: "ex-203-chino-olive",
    sku: "EX-203",
    name: "EX-203 Chino Olive",
    category: "chino",
    fit: "Regular Slim",
    fabric: "100% Cotton",
    weight: "9.5 oz",
    sizes: SIZES,
    wholesale: 13.5,
    retail: 36.9,
    moq: 10,
    delivery: "5–7 dana",
    stock: stockEven(22),
    description: "Olive boja, snažna jesenja prodaja, popularan na društvenim mrežama.",
    color: "Olive",
  },
  {
    slug: "ex-301-cargo-black",
    sku: "EX-301",
    name: "EX-301 Cargo Black",
    category: "cargo",
    fit: "Cargo",
    fabric: "100% Cotton Twill",
    weight: "10 oz",
    sizes: SIZES,
    wholesale: 17.9,
    retail: 49.9,
    moq: 10,
    delivery: "7–10 dana",
    stock: stockEven(30),
    description: "Cargo crni, funkcionalni džepovi, najtraženija silueta sezone.",
    color: "Black",
  },
  {
    slug: "ex-302-cargo-sand",
    sku: "EX-302",
    name: "EX-302 Cargo Sand",
    category: "cargo",
    fit: "Cargo",
    fabric: "100% Cotton Twill",
    weight: "10 oz",
    sizes: SIZES,
    wholesale: 17.9,
    retail: 49.9,
    moq: 10,
    delivery: "7–10 dana",
    stock: stockEven(20),
    description: "Sand boja, snažan vizuelni komad za izloge.",
    color: "Sand",
  },
];

export const findProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const byCategory = (c: Category) => PRODUCTS.filter((p) => p.category === c);
