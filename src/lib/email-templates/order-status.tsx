import * as React from "react";
import { SIZE_EXCHANGE } from "@/lib/brand";
import type { TemplateEntry } from "./registry";
import {
  allJeans,
  din,
  etaFor,
  firstName,
  shortDate,
  type EmailItem,
  type EmailProduct,
} from "./format";
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

// E-mail kupcu kad vlasnik u administraciji promeni status porudžbine.

interface Props {
  name?: string;
  orderNumber?: string;
  status?: string;
  items?: EmailItem[];
  subtotal?: number;
  shipping?: number;
  discount?: number;
  promoCode?: string | null;
  total?: number;
  address?: string;
  phone?: string;
  /** Kada je porudžbina primljena (ISO). */
  orderedAt?: string | null;
  /** Okvirna isporuka; bez nje se računa od trenutka slanja. */
  eta?: string;
  recommendations?: EmailProduct[];
}

type Copy = {
  subject: string;
  title: (jeans: boolean) => string;
  lead: (p: Props) => string;
  preview: (p: Props, eta: string) => string;
  step?: 1 | 2 | 3;
  notes?: (p: Props) => [string, string, string];
  eta?: { label: string; stage: "order" | "shipped" };
  help: { title: string; text: string; extra?: string };
  showTotals: boolean;
  recTitle: string;
};

const ordered = (p: Props) => (p.orderedAt ? shortDate(p.orderedAt) : "");

const COPY: Record<string, Copy> = {
  confirmed: {
    subject: "potvrđena",
    title: () => "Porudžbina je potvrđena",
    lead: (p) =>
      `${firstName(p.name) ? `${firstName(p.name)}, pakujemo` : "Pakujemo"} je i šaljemo u roku od 1–2 radna dana.`,
    preview: (_p, eta) => `Šaljemo je u roku od 1–2 radna dana. Okvirna isporuka: ${eta}`,
    step: 1,
    notes: (p) => [ordered(p) || "potvrđena", "1–2 radna dana", "2–5 radnih dana"],
    eta: { label: "Okvirna isporuka", stage: "order" },
    help: {
      title: "Treba da promeniš veličinu ili adresu?",
      text: "Javi nam se što pre, dok paket još nije poslat.",
    },
    showTotals: true,
    recTitle: "Uz ovo dobro ide",
  },
  shipped: {
    subject: "na putu",
    title: (jeans) => (jeans ? "Tvoje farmerke su na putu" : "Tvoj paket je na putu"),
    lead: (p) =>
      `Predali smo paket kurirskoj službi.${p.total ? ` Za kurira pripremi ${din(p.total)}.` : " Plaćaš kuriru pri preuzimanju."}`,
    preview: (p, eta) =>
      `Stiže okvirno ${eta}${p.total ? ` Za kurira pripremi ${din(p.total)}.` : ""}`,
    step: 2,
    notes: (p) => [ordered(p), "danas", "1–3 radna dana"],
    eta: { label: "Stiže okvirno", stage: "shipped" },
    help: {
      title: "Pitanje o isporuci?",
      text: "Piši nam ako nešto treba da proverimo ili promenimo kod kurira.",
    },
    showTotals: true,
    recTitle: "Uz ovo dobro ide",
  },
  delivered: {
    subject: "isporučena",
    title: (jeans) => (jeans ? "Stiglo je. Kako ti stoje?" : "Paket je isporučen"),
    lead: () =>
      `Hvala što nosiš EXIT. Ako veličina ne odgovara, zamena je besplatna u roku od ${SIZE_EXCHANGE.days} dana.`,
    preview: () => `Zamena veličine je besplatna u roku od ${SIZE_EXCHANGE.days} dana.`,
    step: 3,
    notes: (p) => [ordered(p), "", "danas"],
    help: {
      title: "Ne odgovara veličina?",
      text: "Piši nam i dogovaramo zamenu, bez troška za tebe.",
      extra: "Pošalji nam i sliku u njima, volimo da vidimo kako stoje.",
    },
    showTotals: false,
    recTitle: "Uz ovo dobro ide",
  },
  cancelled: {
    subject: "otkazana",
    title: () => "Porudžbina je otkazana",
    lead: () => "Plaćanje je pouzećem, pa ništa ne plaćaš.",
    preview: () => "Ako je greška, javi nam se i proverićemo.",
    help: {
      title: "Misliš da je greška?",
      text: "Javi nam se i proverićemo porudžbinu.",
    },
    showTotals: false,
    recTitle: "Možda ti se dopadne",
  },
};

const FALLBACK: Copy = {
  subject: "ažurirana",
  title: () => "Status porudžbine je promenjen",
  lead: () => "Ako imaš pitanje o porudžbini, javi nam se.",
  preview: () => "Status porudžbine je promenjen.",
  help: { title: "Imaš pitanje?", text: "Piši nam, odgovaramo brzo." },
  showTotals: false,
  recTitle: "Možda ti se dopadne",
};

const copyFor = (status?: string) => COPY[status ?? ""] ?? FALLBACK;

function OrderStatus(props: Props) {
  const { name, orderNumber, status, items = [], recommendations, address, phone } = props;
  const c = copyFor(status);
  const campaign = `status-${status || "promena"}`;
  const eta = c.eta ? props.eta || etaFor(c.eta.stage) : "";
  return (
    <Shell preview={c.preview(props, eta)}>
      <Header campaign={campaign} />
      <Hero
        title={c.title(allJeans(items))}
        lead={c.lead(props)}
        meta={<OrderNo value={orderNumber} />}
      />
      {c.step && c.notes ? (
        <Tracker step={c.step} notes={c.notes(props)} etaLabel={c.eta?.label} eta={eta || null} />
      ) : null}
      <Items items={items} />
      {c.showTotals && props.total != null ? (
        <Totals
          subtotal={props.subtotal}
          discount={props.discount}
          promoCode={props.promoCode}
          shipping={props.shipping}
          total={props.total}
          note="Plaćaš pouzećem, kuriru pri preuzimanju paketa."
        />
      ) : null}
      {status === "confirmed" || status === "shipped" ? (
        <Info title="Adresa za dostavu" lines={[name, address, phone]} />
      ) : null}
      <HelpCard
        title={c.help.title}
        text={c.help.text}
        extra={c.help.extra}
        orderNumber={orderNumber}
      />
      <Perks />
      <Recommendations products={recommendations} title={c.recTitle} campaign={campaign} />
      <Footer campaign={campaign} />
    </Shell>
  );
}

export const template = {
  component: OrderStatus,
  subject: (d: Record<string, any>) =>
    `Porudžbina #${d.orderNumber ?? ""} je ${copyFor(d.status).subject} — EXIT Denim`,
  displayName: "Promena statusa porudžbine",
  previewData: { ...PREVIEW_ORDER, status: "shipped", orderedAt: "2026-11-27T19:41:00Z" },
} satisfies TemplateEntry;
