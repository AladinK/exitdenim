import { describe, it, expect } from "vitest";
import { recommendSize } from "./size-calc";

describe("recommendSize", () => {
  it("180–185 cm, 94 kg, uže → 34", () => {
    expect(recommendSize(180, 94, "usko")).toBe("34");
    expect(recommendSize(185, 94, "usko")).toBe("34");
  });
  it("180–185 cm, 94 kg, komotnije → 36", () => {
    expect(recommendSize(182, 94, "komotno")).toBe("36");
  });
  it("skips sizes that are out of stock to the next larger", () => {
    expect(recommendSize(182, 94, "usko", ["33", "36"])).toBe("36");
  });
});
