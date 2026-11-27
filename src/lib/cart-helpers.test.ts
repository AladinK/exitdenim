import { describe, expect, it } from "vitest";
import {
  type CatalogProduct,
  MAX_QTY_PER_LINE,
  addBusinessDays,
  clampQty,
  deliveryWindow,
  isValidPhone,
  lineInfo,
  nationalPhone,
  pickUpsell,
  samePhone,
} from "./cart-helpers";

describe("clampQty", () => {
  it("drži količinu između 0 i najviše dozvoljene", () => {
    expect(clampQty(3)).toBe(3);
    expect(clampQty(-2)).toBe(0);
    expect(clampQty(99)).toBe(MAX_QTY_PER_LINE);
    expect(clampQty(2.7)).toBe(2);
    expect(clampQty(Number.NaN)).toBe(0);
  });
});

describe("lineInfo", () => {
  const products: CatalogProduct[] = [
    { id: "a", sizes: ["30", "32", "34"], stock: { "30": 1, "32": 0, "34": 1 }, retail: 5990 },
    { id: "b", sizes: ["31", "33"], stock: {}, retail: 6990 },
    { id: "c", sizes: ["32"], stock: { "32": 1 }, active: false },
  ];
  it("vraća null dok katalog nije stigao", () => {
    expect(lineInfo({ productId: "a", size: "30" }, undefined)).toBeNull();
  });
  it("prepoznaje rasprodatu veličinu i nudi ostale", () => {
    const i = lineInfo({ productId: "a", size: "32" }, products);
    expect(i?.status).toBe("soldOut");
    expect(i?.sizes.filter((s) => s.inStock).map((s) => s.size)).toEqual(["30", "34"]);
  });
  it("ne proglašava rasprodatim kad stanje nije poznato", () => {
    expect(lineInfo({ productId: "b", size: "31" }, products)?.status).toBe("ok");
  });
  it("model koji nije u ponudi", () => {
    expect(lineInfo({ productId: "x", size: "32" }, products)?.status).toBe("unavailable");
    expect(lineInfo({ productId: "c", size: "32" }, products)?.status).toBe("unavailable");
  });
  it("veličina koje više nema u modelu", () => {
    expect(lineInfo({ productId: "a", size: "36" }, products)?.status).toBe("soldOut");
  });
});

describe("telefon", () => {
  it("prihvata uobičajene zapise", () => {
    for (const v of ["064 123 4567", "+381 64 1234567", "064/123-45-67", "00387 61 234 567", "020 314 434"]) {
      expect(isValidPhone(v)).toBe(true);
    }
  });
  it("odbija prekratke i brojeve sa slovima", () => {
    for (const v of ["123", "064 12", "pozovi me", "064abc4567"]) expect(isValidPhone(v)).toBe(false);
  });
  it("isti broj u različitim zapisima je isti", () => {
    expect(nationalPhone("+381 64 123 4567")).toBe("0641234567");
    expect(samePhone("+381641234567", "064/123-4567")).toBe(true);
    expect(samePhone("00381 64 1234567", "0641234567")).toBe(true);
    expect(samePhone("0641234567", "0641234568")).toBe(false);
  });
});

describe("rok isporuke", () => {
  it("preskače vikend", () => {
    // Petak 27.11.2026: dva radna dana su utorak 1.12.
    const fri = new Date(2026, 10, 27, 12);
    expect(addBusinessDays(fri, 2).getDate()).toBe(1);
    expect(deliveryWindow(fri)).toBe("uto 1.12. – pet 4.12.");
  });
  it("od ponedeljka do sledećeg ponedeljka", () => {
    const mon = new Date(2026, 10, 30, 9);
    expect(deliveryWindow(mon)).toBe("sre 2.12. – pon 7.12.");
  });
});

describe("pickUpsell", () => {
  const products: CatalogProduct[] = [
    { id: "j1", slug: "j1", category: "farmerke", retail: 5990, sizes: ["32", "34"], stock: { "32": 1, "34": 1 } },
    { id: "j2", slug: "j2", category: "farmerke", retail: 5990, sizes: ["32", "34"], stock: { "32": 0, "34": 1 } },
    { id: "c1", slug: "c1", category: "chino", retail: 5990, sizes: ["32"], stock: { "32": 1 } },
    { id: "k1", slug: "k1", category: "cargo", retail: 7500, sizes: ["34"], stock: { "34": 1 } },
    { id: "x1", slug: "x1", category: "chino", retail: 5990, sizes: ["32"], stock: { "32": 0 } },
  ];
  it("bez onoga što je već u korpi i bez rasprodatih modela", () => {
    const picks = pickUpsell(products, [{ productId: "j1", size: "32", quantity: 1 }], 10);
    const ids = picks.map((p) => p.product.id);
    expect(ids).not.toContain("j1");
    expect(ids).not.toContain("x1");
  });
  it("prvo modeli sa istom veličinom iz druge kategorije", () => {
    const picks = pickUpsell(products, [{ productId: "j1", size: "32", quantity: 1 }], 10);
    expect(picks[0].product.id).toBe("c1");
    expect(picks[0].size).toBe("32");
    const j2 = picks.find((p) => p.product.id === "j2");
    expect(j2?.size).toBeNull();
  });
  it("vraća najviše n preporuka", () => {
    expect(pickUpsell(products, [{ productId: "j1", size: "32" }], 2)).toHaveLength(2);
  });
});
