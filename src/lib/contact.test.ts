import { describe, expect, it } from "vitest";
import { orderMessage, productQuestion, whatsappHref } from "./contact";

describe("porudžbina porukom (rezervni put kada kasa ne radi)", () => {
  const lines = [
    { name: "E-2104 Slim Indigo", sku: "E-2104", size: "32", quantity: 2, unitPrice: 5990 },
    { name: "K-7001 Cargo", size: "34", quantity: 1, unitPrice: 7500 },
  ];

  it("sadrži svaki artikal, veličinu, količinu i ukupan iznos", () => {
    const text = orderMessage(lines, 19480, {
      name: "Marko Marković",
      phone: "064 123 4567",
      address: "Knez Mihailova 1",
      city: "Beograd",
      postal: "11000",
    });
    expect(text).toContain("E-2104 Slim Indigo (E-2104), veličina 32 × 2");
    expect(text).toContain("K-7001 Cargo, veličina 34 × 1");
    expect(text).toContain("Ukupno: 19.480 din (plaćanje pouzećem)");
    expect(text).toContain("Ime: Marko Marković");
    expect(text).toContain("Adresa: Knez Mihailova 1, 11000 Beograd");
  });

  it("izostavlja prazna polja umesto da ostavi prazne redove", () => {
    const text = orderMessage(lines, 19480, { name: "", phone: "" });
    expect(text).not.toContain("Ime:");
    expect(text).not.toContain("Adresa:");
    expect(text.split("\n").every((line) => line.trim().length > 0)).toBe(true);
  });

  it("pravi ispravnu WhatsApp vezu sa kodiranim tekstom", () => {
    const href = whatsappHref("Zdravo, šaljem porudžbinu & pitanje");
    expect(href.startsWith("https://wa.me/381653176716?text=")).toBe(true);
    expect(decodeURIComponent(href.split("?text=")[1])).toBe("Zdravo, šaljem porudžbinu & pitanje");
    expect(whatsappHref()).toBe("https://wa.me/381653176716");
  });

  it("pitanje o modelu navodi veličinu samo kada je izabrana", () => {
    expect(productQuestion("E-5012 Slim", "E-5012", "33")).toContain("veličina 33");
    expect(productQuestion("E-5012 Slim", "E-5012")).not.toContain("veličina");
  });
});
