import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

// Obaveštenje vlasniku o novoj porudžbini. Rezerva uz Telegram: ako jedan kanal
// zakaže, porudžbina i dalje stigne drugim.

interface Item {
  product_name: string;
  product_sku?: string;
  size: string;
  quantity: number;
  unit_price: number;
}
interface Props {
  orderNumber?: string | number;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  items?: Item[];
  discount?: number;
  promoCode?: string | null;
  total?: number;
  note?: string | null;
}

const fmt = (n: number) => `${Number(n).toLocaleString("sr-RS")} din`;

const OrderNotification = ({
  orderNumber,
  name,
  phone,
  email,
  address,
  items = [],
  discount = 0,
  promoCode,
  total = 0,
  note,
}: Props) => (
  <Html lang="sr" dir="ltr">
    <Head />
    <Preview>{`Nova porudžbina #${String(orderNumber ?? "")} — ${fmt(total)}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>EXIT DENIM · NOVA PORUDŽBINA</Text>
        <Heading style={h1}>
          #{orderNumber} — {fmt(total)}
        </Heading>
        <Section>
          {items.map((i, idx) => (
            <Text key={idx} style={row}>
              {i.product_name}
              {i.product_sku ? ` (${i.product_sku})` : ""} · vel. {i.size} × {i.quantity} —{" "}
              {fmt(i.unit_price * i.quantity)}
            </Text>
          ))}
        </Section>
        {discount > 0 ? (
          <Text style={row}>
            Točak sreće{promoCode ? ` (${promoCode})` : ""}: −{fmt(discount)}
          </Text>
        ) : null}
        <Text style={total_}>Ukupno pouzećem: {fmt(total)}</Text>
        <Hr style={hr} />
        <Text style={row}>
          <b>{name}</b>
        </Text>
        <Text style={row}>Telefon: {phone}</Text>
        <Text style={row}>E-mail: {email}</Text>
        <Text style={row}>Adresa: {address}</Text>
        {note ? <Text style={row}>Napomena: {note}</Text> : null}
        <Hr style={hr} />
        <Text style={muted}>
          Porudžbina je upisana u administraciju sajta (www.exit.fashion/admin).
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: OrderNotification,
  subject: (d: Record<string, any>) =>
    `Nova porudžbina #${d.orderNumber ?? ""} — ${fmt(Number(d.total ?? 0))}`,
  displayName: "Obaveštenje vlasniku o porudžbini",
  previewData: {
    orderNumber: "EXR-261125-0042",
    name: "Marko Marković",
    phone: "+381 64 000 0000",
    email: "marko@example.com",
    address: "Knez Mihailova 1, 11000 Beograd",
    items: [
      {
        product_name: "E-5012 Slim",
        product_sku: "E-5012",
        size: "32",
        quantity: 1,
        unit_price: 6990,
      },
    ],
    total: 6990,
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  color: "#0F1B33",
};
const container = { padding: "32px 24px", maxWidth: "560px" };
const brand = {
  fontSize: "12px",
  letterSpacing: "0.2em",
  fontWeight: 700,
  color: "#1A2A48",
  margin: "0 0 20px",
};
const h1 = { fontSize: "24px", margin: "0 0 16px", color: "#0F1B33" };
const row = { fontSize: "14px", margin: "4px 0", color: "#333" };
const total_ = { fontSize: "17px", fontWeight: 700, margin: "10px 0", color: "#0F1B33" };
const muted = { fontSize: "13px", color: "#777" };
const hr = { borderColor: "#E2DED5", margin: "18px 0" };
