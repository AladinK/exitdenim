import { describe, expect, it } from "vitest";
import { formatOrderNotice } from "./telegram.server";

describe("obaveštenje vlasniku o porudžbini", () => {
  const order = {
    orderNumber: "EXR-261125-0042",
    name: "Marko <b>Marković</b>",
    phone: "064 123 4567",
    email: "marko@example.com",
    address: "Knez Mihailova 1",
    city: "Beograd",
    postal: "11000",
    items: [{ product_name: "E-2104 Slim & Indigo", size: "32", quantity: 1, unit_price: 5990 }],
    shipping: 0,
    total: 5990,
  };

  it("sadrži broj porudžbine, artikle, iznos i kontakt", () => {
    const text = formatOrderNotice(order);
    expect(text).toContain("Nova porudžbina #EXR-261125-0042");
    expect(text).toContain("vel. 32 × 1");
    expect(text).toContain("Ukupno: 5990 din");
    expect(text).toContain("064 123 4567");
    expect(text).toContain("11000 Beograd");
  });

  it("neutrališe HTML koji kupac upiše u polja", () => {
    const text = formatOrderNotice(order);
    expect(text).toContain("Marko &lt;b&gt;Marković&lt;/b&gt;");
    expect(text).toContain("Slim &amp; Indigo");
  });

  it("popust prikazuje samo kada postoji", () => {
    expect(formatOrderNotice(order)).not.toContain("Točak sreće");
    expect(formatOrderNotice({ ...order, discount: 600, promoCode: "TOCAK-10-AB12" })).toContain(
      "−600 din",
    );
  });
});

describe("adrese za obaveštenje vlasniku", () => {
  it("prihvata više adresa odvojenih zarezom, bez duplikata", async () => {
    const { splitAddresses } = await import("./email-templates/send-email");
    expect(splitAddresses("office@bennelijeans.com, vlasnik@gmail.com")).toEqual([
      "office@bennelijeans.com",
      "vlasnik@gmail.com",
    ]);
    expect(splitAddresses(" a@b.rs;A@b.rs  c@d.com ")).toEqual(["a@b.rs", "c@d.com"]);
    expect(splitAddresses("")).toEqual([]);
    expect(splitAddresses(undefined)).toEqual([]);
  });
});
