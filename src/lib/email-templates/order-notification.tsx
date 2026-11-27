import * as React from "react";
import type { TemplateEntry } from "./registry";
import { dateTime, din, mapsUrl, siteUrl, telHref, waPhone, type EmailItem } from "./format";
import { PREVIEW_ORDER } from "./preview-data";
import {
  Button,
  C,
  Footer,
  gutter,
  Header,
  Hero,
  Info,
  Items,
  OrderNo,
  Section,
  Shell,
  Totals,
} from "./ui";

// Obaveštenje vlasniku o novoj porudžbini. Rezerva uz Telegram: ako jedan kanal
// zakaže, porudžbina i dalje stigne drugim. Odgovor na ovaj e-mail ide kupcu.

interface Props {
  orderNumber?: string | number;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  items?: EmailItem[];
  subtotal?: number;
  shipping?: number;
  discount?: number;
  promoCode?: string | null;
  total?: number;
  note?: string | null;
  /** Kada je porudžbina primljena (ISO); podrazumevano trenutak slanja. */
  createdAt?: string;
}

const linkStyle = { color: C.ink, textDecoration: "underline" } as const;

function OrderNotification({
  orderNumber,
  name,
  phone,
  email,
  address,
  items = [],
  subtotal,
  shipping = 0,
  discount = 0,
  promoCode,
  total = 0,
  note,
  createdAt,
}: Props) {
  const pieces = items.reduce((s, i) => s + Number(i.quantity || 0), 0);
  const wa = waPhone(phone);
  const actions = [
    phone ? { label: "Pozovi", href: telHref(phone) } : null,
    wa ? { label: "WhatsApp", href: `https://wa.me/${wa}` } : null,
    { label: "Admin", href: siteUrl("/admin") },
  ].filter((a): a is { label: string; href: string } => !!a);

  return (
    <Shell
      preview={`${name ?? "Kupac"} · ${pieces} kom · ${din(total)}${note ? " · ima napomenu" : ""}`}
    >
      <Header />
      <Hero
        eyebrow="Nova porudžbina · plaćanje pouzećem"
        title={din(total)}
        big
        meta={
          <>
            <OrderNo value={orderNumber} /> · {pieces} kom · {dateTime(createdAt)}
          </>
        }
      />
      <Section pad="24px 32px 0">
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
          <tbody>
            <tr>
              {actions.map((a, i) => (
                <td
                  key={a.label}
                  width={`${Math.floor(100 / actions.length)}%`}
                  valign="top"
                  style={gutter(i, actions.length, 8)}
                >
                  <Button href={a.href} variant="outline">
                    {a.label}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Section>
      <Info
        title="Kupac"
        lines={[
          name ? <strong key="n">{name}</strong> : null,
          phone ? (
            <a key="p" href={telHref(phone)} className="x-ink" style={linkStyle}>
              {phone}
            </a>
          ) : null,
          email ? (
            <a key="e" href={`mailto:${email}`} className="x-ink" style={linkStyle}>
              {email}
            </a>
          ) : (
            <span key="e" className="x-mute" style={{ color: C.mute }}>
              bez e-maila
            </span>
          ),
          address ? (
            <a key="a" href={mapsUrl(address)} className="x-ink" style={linkStyle}>
              {address}
            </a>
          ) : null,
        ]}
      />
      {note ? <Info title="Napomena kupca" lines={[note]} /> : null}
      <Items items={items} title="Artikli" showSku />
      <Totals
        subtotal={subtotal ?? items.reduce((s, i) => s + i.unit_price * i.quantity, 0)}
        discount={discount}
        promoCode={promoCode}
        shipping={shipping}
        total={total}
        totalLabel="Za naplatu pouzećem"
        note="Porudžbina je upisana u administraciju sajta, kartica Kupci (retail)."
      />
      <Footer audience="owner" />
    </Shell>
  );
}

export const template = {
  component: OrderNotification,
  subject: (d: Record<string, any>) =>
    `Nova porudžbina #${d.orderNumber ?? ""} — ${din(Number(d.total ?? 0))}`,
  displayName: "Obaveštenje vlasniku o porudžbini",
  previewData: { ...PREVIEW_ORDER, note: "Molim vas pozovite pre dostave, radim do 16h." },
} satisfies TemplateEntry;
