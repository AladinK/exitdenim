import { describe, expect, it } from "vitest";
import { productSchema } from "./product-schema";
import { BRAND } from "./brand";

const product = {
  name: "EXIT test", sku: "TEST", retail: 5990, sizes: ["31", "32", "34"],
  stock: { "31": 0, "32": 1, "34": 0 }, fabric: "98% pamuk, 2% elastin", weight: "12 oz",
};
const url = "https://exitdenim.shop/proizvod/test";

describe("public product facts", () => {
  it("uses the confirmed customer contact without the extra digit", () => {
    expect(BRAND.phone).toBe("+381653176716");
    expect(BRAND.whatsapp).toBe("https://wa.me/381653176716");
  });
  it("preserves the standard 5990 RSD price", () => {
    expect(productSchema(product, url).offers.price).toBe(5990);
    expect(productSchema(product, url).offers.priceCurrency).toBe("RSD");
  });
  it("preserves the cargo 7500 RSD price rather than applying the standard price", () => {
    expect(productSchema({ ...product, retail: 7500 }, url).offers.price).toBe(7500);
  });
  it("uses only live availability, never marks unknown inventory as in stock", () => {
    expect(productSchema(product, url).offers.availability).toBe("https://schema.org/InStock");
    expect(productSchema({ ...product, stock: {} }, url).offers.availability).toBe("https://schema.org/OutOfStock");
    expect(productSchema({ ...product, stock: { "99": 1 } }, url).offers.availability).toBe("https://schema.org/OutOfStock");
  });
  it("takes sizes and material from the model instead of defaulting all models to 31–40", () => {
    const schema = productSchema({ ...product, sizes: ["34"], fabric: "100% pamuk" }, url);
    expect(schema.size).toEqual(["34"]);
    expect(schema.material).toBe("100% pamuk");
  });
  it("keeps delivery free for Serbia", () => {
    expect(productSchema(product, url).offers.shippingDetails.shippingRate.value).toBe(0);
    expect(productSchema(product, url).offers.shippingDetails.shippingDestination.addressCountry).toBe("RS");
  });
});