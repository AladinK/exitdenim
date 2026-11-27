import { describe, expect, it } from "vitest";
import { BUNDLE, bestDiscount, discountLabel, piecesToBundle } from "./discounts";

describe("bestDiscount", () => {
  it("nema popusta za jedan komad bez točka", () => {
    expect(bestDiscount(5990, 1, 0)).toEqual({ pct: 0, amount: 0, source: null });
  });
  it("10% za 2 ili više komada, zaokruženo na 10 din", () => {
    expect(bestDiscount(11980, 2, 0)).toEqual({ pct: 10, amount: 1200, source: "bundle" });
    expect(bestDiscount(20990, 3, 0).amount).toBe(2100);
  });
  it("točak sreće za jedan komad", () => {
    expect(bestDiscount(5990, 1, 5)).toEqual({ pct: 5, amount: 300, source: "wheel" });
  });
  it("ne sabira se: važi veći, a pri jednakom količinski", () => {
    expect(bestDiscount(11980, 2, 15)).toEqual({ pct: 15, amount: 1800, source: "wheel" });
    expect(bestDiscount(11980, 2, 5).source).toBe("bundle");
    expect(bestDiscount(11980, 2, 10).source).toBe("bundle");
  });
  it("odbacuje procenat koji točak ne daje", () => {
    expect(bestDiscount(5990, 1, 50)).toEqual({ pct: 0, amount: 0, source: null });
  });
});

it("koliko komada fali do popusta", () => {
  expect(piecesToBundle(1)).toBe(1);
  expect(piecesToBundle(BUNDLE.minQty)).toBe(0);
});

it("naziv popusta po kodu", () => {
  expect(discountLabel(BUNDLE.code)).toBe("Popust za 2+ komada");
  expect(discountLabel("TOCAK-10-AB12")).toBe("Točak sreće (TOCAK-10-AB12)");
  expect(discountLabel(null)).toBe("Popust");
});
