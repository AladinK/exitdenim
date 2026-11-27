import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bestDiscount } from "@/lib/discounts";
import {
  dateTime,
  din,
  emailItems,
  emailRecommendations,
  etaFor,
  shortDate,
  waPhone,
  withStock,
} from "./format";
import { PREVIEW_ORDER } from "./preview-data";
import { TEMPLATES } from "./registry";
import { renderEmail } from "./render";

const renderTemplate = async (name: string, data: Record<string, unknown>) => {
  const t = TEMPLATES[name];
  const out = await renderEmail(React.createElement(t.component, data));
  const subject = typeof t.subject === "function" ? t.subject(data) : t.subject;
  return { ...out, subject };
};

const STATUS_DATA = TEMPLATES["order-status"].previewData!;

describe("pomoćne funkcije za e-mail", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Petak 27. novembar 2026, 20:41 u Beogradu.
    vi.setSystemTime(new Date("2026-11-27T19:41:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("iznosi su u dinarima sa tačkom za hiljade", () => {
    expect(din(10780)).toBe("10.780 din");
    expect(din("5990.00")).toBe("5.990 din");
    expect(din(null)).toBe("0 din");
  });

  it("okvirna isporuka: 2–5 radnih dana za novu porudžbinu, 1–3 kad je paket kod kurira", () => {
    expect(etaFor("order")).toBe("uto 1.12. – pet 4.12.");
    expect(etaFor("shipped")).toBe("pon 30.11. – sre 2.12.");
  });

  it("datumi prate beogradsko vreme, ne UTC", () => {
    expect(shortDate("2026-11-27T23:30:00Z")).toBe("28.11.");
    expect(dateTime("2026-11-27T19:41:00Z")).toBe("27.11. u 20:41");
  });

  it("broj kupca za WhatsApp link", () => {
    expect(waPhone("064 123 4567")).toBe("381641234567");
    expect(waPhone("+381 64 123 4567")).toBe("381641234567");
    expect(waPhone("00387 61 123 456")).toBe("38761123456");
    expect(waPhone("12")).toBeNull();
  });

  it("artikli dobijaju apsolutnu adresu slike i link sa oznakom kampanje", () => {
    const [item] = emailItems(
      [{ product_id: "p1", product_name: "E-2027", size: "32", quantity: 1, unit_price: 5990 }],
      [{ id: "p1", slug: "crne-e-2027", image_url: "products/e 2027.webp", category: "jeans" }],
      "potvrda-porudzbine",
    );
    expect(item.image).toBe("https://www.exit.fashion/img/p/products/e%202027.webp");
    expect(item.url).toBe(
      "https://www.exit.fashion/proizvod/crne-e-2027?utm_source=email&utm_medium=email&utm_campaign=potvrda-porudzbine",
    );
    expect(
      emailItems([{ product_name: "X", size: "30", quantity: 1, unit_price: 1 }], [])[0].image,
    ).toBeNull();
  });

  it("preporuke: bez poručenih modela, bez rasprodatih i bez modela bez fotografije", () => {
    const base = { active: true, retail: 5990, sizes: ["32"] };
    const catalog = withStock(
      [
        { ...base, id: "a", slug: "a", name: "Poručen", category: "jeans", image_url: "a.webp" },
        { ...base, id: "b", slug: "b", name: "Bez slike", category: "chino", image_url: null },
        { ...base, id: "c", slug: "c", name: "Rasprodat", category: "chino", image_url: "c.webp" },
        { ...base, id: "d", slug: "d", name: "Chino", category: "chino", image_url: "d.webp" },
        { ...base, id: "e", slug: "e", name: "Farmerke", category: "jeans", image_url: "e.webp" },
      ],
      [
        { product_id: "c", size: "32", in_stock: false },
        { product_id: "d", size: "32", in_stock: true },
        { product_id: "e", size: "32", in_stock: true },
      ],
    );
    const picks = emailRecommendations(
      catalog,
      [{ product_id: "a", size: "32", quantity: 1 }],
      "test",
    );
    expect(picks.map((p) => p.name)).toEqual(["Chino", "Farmerke"]);
    expect(picks[0].image).toBe("https://www.exit.fashion/img/p/d.webp");
  });

  it("probna porudžbina ima isti popust koji računa server", () => {
    const pieces = PREVIEW_ORDER.items.reduce((s, i) => s + i.quantity, 0);
    const best = bestDiscount(PREVIEW_ORDER.subtotal, pieces, 0);
    expect(best.amount).toBe(PREVIEW_ORDER.discount);
    expect(PREVIEW_ORDER.subtotal - best.amount + PREVIEW_ORDER.shipping).toBe(PREVIEW_ORDER.total);
  });
});

describe("izgled e-mailova", () => {
  it("potvrda kupcu: naslov, broj, artikli sa slikom, zbir, isporuka, WhatsApp, preporuke", async () => {
    const { html, text, subject } = await renderTemplate("order-confirmation", {
      ...PREVIEW_ORDER,
      eta: "uto 1.12. – pet 4.12.",
    });
    expect(subject).toBe("Porudžbina #EXR-261127-0042 je primljena — EXIT Denim");
    expect(html).toContain("Porudžbina je primljena");
    expect(html).toContain("#EXR-261127-0042");
    expect(html).toContain("https://www.exit.fashion/media/exit-logo.png");
    expect(html).toContain(
      "https://www.exit.fashion/img/p/products/crne-slim-farmerke-exit-e-2027",
    );
    expect(html).toContain("Crne Slim farmerke EXIT E-2027");
    expect(html).toContain("Veličina 32 · 1 kom");
    expect(html).toContain("Popust za 2+ komada");
    expect(html).toContain("−1.200 din");
    expect(html).toContain("Za kurira");
    expect(html).toContain("10.780 din");
    expect(html).toContain("Besplatna");
    expect(html).toContain("uto 1.12. – pet 4.12.");
    expect(html).toMatch(/Primljena[\s\S]*Poslata[\s\S]*Isporučena/);
    expect(html).toContain("Piši nam na WhatsApp");
    expect(html).toContain(
      "https://wa.me/381653176716?text=Zdravo%2C%20pi%C5%A1em%20u%20vezi%20porud%C5%BEbine%20EXR-261127-0042.",
    );
    expect(html).toContain("10% popusta na celu porudžbinu kad uzmeš 2 ili više komada");
    expect(html).toContain("Besplatna zamena veličine u roku od 7 dana");
    expect(html).toContain("EX-301 Cargo Black");
    expect(html).toContain("TRI-B DOO");
    expect(text).toContain("Za kurira");
    expect(text).not.toContain("tel:");
  });

  it("radi u Gmailu i Outlooku: bez spoljnog CSS-a, ispod granice sečenja, tabela za Outlook", async () => {
    for (const name of Object.keys(TEMPLATES)) {
      const { html } = await renderTemplate(name, TEMPLATES[name].previewData!);
      expect(html).not.toMatch(/<link[^>]+stylesheet/i);
      expect(html).not.toContain("data-x-mso");
      expect(html).not.toContain('name="x-mso-settings"');
      expect(html).toContain('<!--[if mso]><table role="presentation" width="600"');
      expect(html).toContain("prefers-color-scheme:dark");
      expect(html).toContain('<meta name="color-scheme" content="light dark"/>');
      // Gmail seče e-mail preko 102 KB.
      expect(Buffer.byteLength(html)).toBeLessThan(80_000);
    }
  });

  it("podaci kupca se ispisuju kao tekst, ne kao HTML", async () => {
    const { html } = await renderTemplate("order-notification", {
      ...PREVIEW_ORDER,
      name: "Marko <b>Marković</b>",
      note: "<script>alert(1)</script>",
    });
    expect(html).toContain("Marko &lt;b&gt;Marković&lt;/b&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("status: tekst prati korak, farmerke ili paket", async () => {
    const shipped = await renderTemplate("order-status", { ...STATUS_DATA, status: "shipped" });
    expect(shipped.subject).toBe("Porudžbina #EXR-261127-0042 je na putu — EXIT Denim");
    expect(shipped.html).toContain("Tvoje farmerke su na putu");
    expect(shipped.html).toContain("Za kurira pripremi 10.780 din.");
    expect(shipped.html).toContain("Stiže okvirno");

    const cargo = await renderTemplate("order-status", {
      ...STATUS_DATA,
      status: "shipped",
      items: [
        {
          product_name: "EX-301 Cargo Black",
          size: "32",
          quantity: 1,
          unit_price: 7500,
          category: "cargo",
        },
      ],
    });
    expect(cargo.html).toContain("Tvoj paket je na putu");

    const delivered = await renderTemplate("order-status", { ...STATUS_DATA, status: "delivered" });
    expect(delivered.html).toContain("Stiglo je. Kako ti stoje?");
    expect(delivered.html).toContain("Ne odgovara veličina?");
    expect(delivered.html).not.toContain("Za kurira");

    const cancelled = await renderTemplate("order-status", { ...STATUS_DATA, status: "cancelled" });
    expect(cancelled.subject).toContain("je otkazana");
    expect(cancelled.html).toContain("Porudžbina je otkazana");
    expect(cancelled.html).not.toContain("Isporučena");
    expect(cancelled.html).not.toContain("Za kurira");
  });

  it("status bez artikala (stari poziv) i dalje ima naslov, broj i WhatsApp", async () => {
    const { html } = await renderTemplate("order-status", {
      name: "Marko",
      orderNumber: "EXR-261008-8781",
      status: "confirmed",
    });
    expect(html).toContain("Porudžbina je potvrđena");
    expect(html).toContain("#EXR-261008-8781");
    expect(html).toContain("Piši nam na WhatsApp");
    expect(html).not.toContain("Tvoja porudžbina");
  });

  it("obaveštenje vlasniku: iznos, kupac sa brzim kontaktom, artikli sa šifrom", async () => {
    const { html, subject } = await renderTemplate("order-notification", {
      ...PREVIEW_ORDER,
      email: "",
      createdAt: "2026-11-27T19:41:00Z",
    });
    expect(subject).toBe("Nova porudžbina #EXR-261127-0042 — 10.780 din");
    expect(html).toContain("Za naplatu pouzećem");
    expect(html).toContain('href="tel:0641234567"');
    expect(html).toContain('href="https://wa.me/381641234567"');
    expect(html).toContain("bez e-maila");
    expect(html).toContain("https://www.google.com/maps/search/?api=1&amp;query=Knez%20Mihailova");
    expect(html).toContain("EX-JE-2027-CRN");
    expect(html).toContain("27.11. u 20:41");
  });
});
