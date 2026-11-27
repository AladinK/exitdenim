// Probni podaci za pregled e-mailova i testove. Modeli, cene i fotografije su pravi
// (iz kataloga), kupac i porudžbina su izmišljeni.

import { productImage, siteUrl, type EmailItem, type EmailProduct } from "./format";

const item = (
  product_name: string,
  product_sku: string,
  slug: string,
  image: string,
  unit_price: number,
  size = "32",
  quantity = 1,
): EmailItem => ({
  product_name,
  product_sku,
  size,
  quantity,
  unit_price,
  image: productImage(image),
  url: siteUrl(`/proizvod/${slug}`, "pregled"),
  category: "jeans",
});

const product = (name: string, slug: string, image: string, price: number): EmailProduct => ({
  name,
  price,
  image: productImage(image) as string,
  url: siteUrl(`/proizvod/${slug}`, "pregled"),
});

export const PREVIEW_ITEMS: EmailItem[] = [
  item(
    "Crne Slim farmerke EXIT E-2027",
    "EX-JE-2027-CRN",
    "crne-slim-farmerke-exit-e-2027",
    "products/crne-slim-farmerke-exit-e-2027-1795698581122-vezfj.webp",
    5990,
  ),
  item(
    "Tamno plave farmerke Regular Slim EXIT E-1013",
    "EX-JE-1013-TPL",
    "tamno-plave-farmerke-regular-slim-exit-e-1013",
    "products/tamno-plave-farmerke-regular-slim-exit-e-1014-1795698495098-2u20d.webp",
    5990,
  ),
];

export const PREVIEW_RECOMMENDATIONS: EmailProduct[] = [
  product(
    "Slim fashion farmerica Exit E-3017",
    "slim-farmerica-exit-e-3017",
    "products/slim-farmerica-exit-e-3017-1791913452406-e8bul.webp",
    6990,
  ),
  product(
    "EX-301 Cargo Black",
    "ex-301-cargo-black",
    "products/ex-301-cargo-black-1783196148575.webp",
    7500,
  ),
  product(
    "Regular ravna nogavica Exit E-4005",
    "regular-ravna-nogavica-exit-e-4005",
    "products/regular-ravna-nogavica-exit-e-4005-1792428229838-5jwt6.webp",
    5990,
  ),
];

/** Dva komada: 11.980 din, 10% za 2+ komada (1.200 din), za kurira 10.780 din. */
export const PREVIEW_ORDER = {
  orderNumber: "EXR-261127-0042",
  name: "Marko Marković",
  phone: "064 123 4567",
  email: "marko@example.com",
  address: "Knez Mihailova 1, 11000 Beograd",
  items: PREVIEW_ITEMS,
  subtotal: 11980,
  shipping: 0,
  discount: 1200,
  promoCode: "2+ KOMADA",
  total: 10780,
  recommendations: PREVIEW_RECOMMENDATIONS,
};
