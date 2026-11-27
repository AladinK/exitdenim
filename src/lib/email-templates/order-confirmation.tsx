import * as React from "react";
import type { TemplateEntry } from "./registry";
import { etaFor, firstName, type EmailItem, type EmailProduct } from "./format";
import { PREVIEW_ORDER } from "./preview-data";
import {
  Footer,
  Header,
  HelpCard,
  Hero,
  Info,
  Items,
  OrderNo,
  Perks,
  Recommendations,
  Shell,
  Totals,
  Tracker,
} from "./ui";

// Potvrda kupcu odmah posle porudžbine (šalje se samo ako je kupac upisao e-mail).

interface Props {
  name?: string;
  orderNumber?: string | number;
  items?: EmailItem[];
  subtotal?: number;
  shipping?: number;
  discount?: number;
  promoCode?: string | null;
  total?: number;
  address?: string;
  phone?: string;
  /** Okvirna isporuka; bez nje se računa od trenutka slanja. */
  eta?: string;
  recommendations?: EmailProduct[];
}

const CAMPAIGN = "potvrda-porudzbine";

function OrderConfirmation({
  name,
  orderNumber,
  items = [],
  subtotal,
  shipping = 0,
  discount = 0,
  promoCode,
  total = 0,
  address,
  phone,
  eta,
  recommendations,
}: Props) {
  const when = eta || etaFor("order");
  const first = firstName(name);
  return (
    <Shell preview={`Plaćaš kuriru kad paket stigne. Okvirna isporuka: ${when}`}>
      <Header campaign={CAMPAIGN} />
      <Hero
        title="Porudžbina je primljena"
        lead={`${first ? `Hvala, ${first}. ` : "Hvala. "}Pakujemo je i šaljemo u roku od 1–2 radna dana. Plaćaš kuriru kad paket stigne.`}
        meta={<OrderNo value={orderNumber} />}
      />
      <Tracker step={1} notes={["danas", "1–2 radna dana", "2–5 radnih dana"]} eta={when} />
      <Items items={items} />
      <Totals
        subtotal={subtotal ?? items.reduce((s, i) => s + i.unit_price * i.quantity, 0)}
        discount={discount}
        promoCode={promoCode}
        shipping={shipping}
        total={total}
        note="Plaćaš pouzećem, kuriru pri preuzimanju paketa."
      />
      <Info title="Adresa za dostavu" lines={[name, address, phone]} />
      <HelpCard
        title="Treba da promeniš veličinu ili adresu?"
        text="Javi nam se što pre, dok paket još nije poslat."
        orderNumber={orderNumber}
      />
      <Perks />
      <Recommendations products={recommendations} campaign={CAMPAIGN} />
      <Footer campaign={CAMPAIGN} />
    </Shell>
  );
}

export const template = {
  component: OrderConfirmation,
  subject: (d: Record<string, any>) =>
    `Porudžbina #${d.orderNumber ?? ""} je primljena — EXIT Denim`,
  displayName: "Potvrda porudžbine",
  previewData: PREVIEW_ORDER,
} satisfies TemplateEntry;
