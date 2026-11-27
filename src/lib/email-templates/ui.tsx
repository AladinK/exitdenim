import * as React from "react";
import { Head, Html, Preview } from "@react-email/components";
import { BRAND, SIZE_EXCHANGE } from "@/lib/brand";
import { BUNDLE, discountLabel } from "@/lib/discounts";
import {
  din,
  LOGO_URL,
  orderWhatsApp,
  siteUrl,
  telHref,
  type EmailItem,
  type EmailProduct,
} from "./format";

// Zajednički delovi svih e-mailova prodavnice.
//
// Pravila koja drže izgled u Gmailu, Outlooku i Apple Mailu:
// - raspored su tabele, svi stilovi su u samim elementima (nema spoljnog CSS-a);
// - <style> u zaglavlju samo doteruje: telefon (uži razmaci), tamni režim (Apple Mail,
//   Outlook.com) i plave linkove koje klijenti sami dodaju. Bez njega e-mail i dalje
//   izgleda kako treba;
// - Gmail aplikacija u tamnom režimu sama preokreće boje, pa logo stoji na svetloj
//   "etiketi" čija je pozadina zaključana gradijentom (Gmail ne dira pozadinske slike);
// - Outlook na Windowsu dobija tabelu od 600 px kroz uslovne komentare (render.ts).

const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

/** Boje svetlog režima; tamne su u DARK_CSS. */
export const C = {
  page: "#FAF9F6",
  card: "#FFFFFF",
  ink: "#111111",
  soft: "#4A4741",
  mute: "#6F6A61",
  line: "#E6E2D9",
  off: "#E3DFD6",
  green: "#749D02",
  greenText: "#4F6B00",
  stitch: "#C9C1B1",
} as const;

const BASE_CSS = `
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}
body{margin:0;padding:0;width:100%}
u + #body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}
@media screen and (max-width:520px){
.x-px{padding-left:20px !important;padding-right:20px !important}
.x-h1{font-size:26px !important;line-height:32px !important}
.x-big{font-size:32px !important;line-height:38px !important}
.x-rec{font-size:12px !important;line-height:16px !important}
.x-pad{padding:18px 16px !important}
}`;

const DARK_CSS = `
:root{color-scheme:light dark;supported-color-schemes:light dark}
@media (prefers-color-scheme:dark){
.x-page{background-color:#121211 !important}
.x-card{background-color:#1C1B19 !important;border-color:#2F2D29 !important}
.x-ink{color:#F4F2ED !important}
.x-soft{color:#CFCAC0 !important}
.x-mute{color:#A39D92 !important}
.x-line{border-color:#2F2D29 !important}
.x-off{background-color:#36332E !important}
.x-on{background-color:#9BC53D !important}
.x-green{color:#B5D96A !important}
.x-btn{background-color:#F4F2ED !important}
.x-btn-t{color:#111111 !important}
.x-out{border-color:#4A4741 !important}
}`;

// Odvojeno: Gmail odbacuje ceo <style> u kome nađe selektor koji ne podržava.
const CLIENT_CSS = `
[data-ogsc] .x-ink{color:#F4F2ED !important}
[data-ogsc] .x-soft{color:#CFCAC0 !important}
[data-ogsc] .x-mute{color:#A39D92 !important}
[data-ogsc] .x-green{color:#B5D96A !important}
[data-ogsc] .x-btn-t{color:#111111 !important}
[data-ogsb] .x-page{background-color:#121211 !important}
[data-ogsb] .x-card{background-color:#1C1B19 !important}
[data-ogsb] .x-btn{background-color:#F4F2ED !important}
[data-ogsb] .x-on{background-color:#9BC53D !important}
[data-ogsb] .x-off{background-color:#36332E !important}
a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}`;

const TABLE = { role: "presentation", cellPadding: 0, cellSpacing: 0, border: 0 } as const;
/** Atributi i stilovi koje TypeScript ne zna, a Outlook na Windowsu čita. */
const legacy = (attrs: Record<string, string>) => attrs as object;
const mso = (style: Record<string, string>) => style as React.CSSProperties;

type Kids = { children?: React.ReactNode };

/** Razmak između kolona tako da sve kolone imaju istu širinu sadržaja. */
export function gutter(index: number, count: number, gap: number): React.CSSProperties {
  return {
    paddingLeft: `${Math.round((gap * index) / count)}px`,
    paddingRight: `${Math.round((gap * (count - 1 - index)) / count)}px`,
  };
}

function Text({
  className = "x-ink",
  style,
  children,
}: Kids & { className?: string; style?: React.CSSProperties }) {
  return (
    <p
      className={className}
      style={{
        margin: 0,
        fontFamily: FONT,
        fontSize: "15px",
        lineHeight: "22px",
        color: C.ink,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Red glavne tabele sa standardnim bočnim razmakom. */
export function Section({ pad = "0 32px", children }: Kids & { pad?: string }) {
  return (
    <tr>
      <td className="x-px" style={{ padding: pad }}>
        {children}
      </td>
    </tr>
  );
}

export function Shell({ preview, children }: Kids & { preview: string }) {
  return (
    <Html lang="sr" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, address=no, email=no, url=no"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-mso-settings" />
        <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
        <style dangerouslySetInnerHTML={{ __html: DARK_CSS }} />
        <style dangerouslySetInnerHTML={{ __html: CLIENT_CSS }} />
      </Head>
      <body
        id="body"
        className="x-page"
        style={{ margin: 0, padding: 0, width: "100%", backgroundColor: C.page }}
      >
        <Preview>{preview}</Preview>
        <table {...TABLE} width="100%" className="x-page" style={{ backgroundColor: C.page }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: 0 }}>
                <span data-x-mso="open" />
                <table
                  {...TABLE}
                  width="100%"
                  style={{ width: "100%", maxWidth: "600px", margin: "0 auto", fontFamily: FONT }}
                >
                  <tbody>{children}</tbody>
                </table>
                <span data-x-mso="close" />
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </Html>
  );
}

/** Logo na svetloj etiketi sa štepom, kao etiketa na pojasu farmerki. */
export function Header({ campaign }: { campaign?: string }) {
  return (
    <Section pad="32px 32px 0">
      <table {...TABLE} align="center">
        <tbody>
          <tr>
            <td
              align="center"
              style={{
                backgroundColor: "#FFFFFF",
                backgroundImage: "linear-gradient(#FFFFFF,#FFFFFF)",
                border: `1px dashed ${C.stitch}`,
                borderRadius: "6px",
                padding: "10px 18px",
              }}
            >
              <a
                href={siteUrl("/", campaign)}
                data-skip-in-text="true"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={LOGO_URL}
                  width="104"
                  height="58"
                  alt="EXIT Denim"
                  style={{
                    display: "block",
                    width: "104px",
                    height: "auto",
                    border: 0,
                    fontFamily: FONT,
                    fontSize: "18px",
                    fontWeight: 700,
                    color: C.ink,
                  }}
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

/** Velika naslovna rečenica, uvod i red sa brojem porudžbine. */
export function Hero({
  eyebrow,
  title,
  lead,
  meta,
  big = false,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
  big?: boolean;
}) {
  return (
    <Section pad="32px 32px 0">
      {eyebrow ? (
        <Text
          className="x-mute"
          style={{ fontSize: "13px", lineHeight: "18px", color: C.mute, marginBottom: "8px" }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <h1
        className={`x-ink ${big ? "x-big" : "x-h1"}`}
        style={{
          margin: 0,
          fontFamily: FONT,
          fontSize: big ? "40px" : "30px",
          lineHeight: big ? "46px" : "36px",
          fontWeight: 700,
          letterSpacing: "-0.3px",
          color: C.ink,
        }}
      >
        {title}
      </h1>
      {lead ? (
        <Text
          className="x-soft"
          style={{ marginTop: "12px", fontSize: "16px", lineHeight: "24px", color: C.soft }}
        >
          {lead}
        </Text>
      ) : null}
      {meta ? (
        <Text
          className="x-mute"
          style={{ marginTop: "14px", fontSize: "13px", lineHeight: "20px", color: C.mute }}
        >
          {meta}
        </Text>
      ) : null}
    </Section>
  );
}

/** Broj porudžbine istaknut u redu ispod naslova. */
export function OrderNo({ value }: { value?: string | number | null }) {
  return (
    <>
      Porudžbina{" "}
      <strong className="x-ink" style={{ color: C.ink, fontWeight: 700 }}>
        #{String(value ?? "")}
      </strong>
    </>
  );
}

function Card({ children, pad = "20px" }: Kids & { pad?: string }) {
  return (
    <table
      {...TABLE}
      width="100%"
      className="x-card"
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: "10px",
        borderCollapse: "separate",
      }}
    >
      <tbody>
        <tr>
          <td className="x-pad" style={{ padding: pad }}>
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const STEPS = ["Primljena", "Poslata", "Isporučena"] as const;

/**
 * Traka sa koracima: primljena → poslata → isporučena, i okvirni datum isporuke.
 * `step` je poslednji završen korak (1–3).
 */
export function Tracker({
  step,
  notes,
  etaLabel = "Okvirna isporuka",
  eta,
  etaNote,
}: {
  step: 1 | 2 | 3;
  notes: [string, string, string];
  etaLabel?: string;
  eta?: string | null;
  etaNote?: React.ReactNode;
}) {
  return (
    <Section pad="28px 32px 0">
      <Card>
        <table {...TABLE} width="100%">
          <tbody>
            <tr>
              {STEPS.map((label, i) => {
                const done = i < step;
                return (
                  <td
                    key={label}
                    width="33%"
                    valign="top"
                    style={{ width: "33.33%", ...gutter(i, STEPS.length, 6) }}
                  >
                    <table {...TABLE} width="100%" data-skip-in-text="true">
                      <tbody>
                        <tr>
                          <td
                            height="4"
                            className={done ? "x-on" : "x-off"}
                            style={{
                              height: "4px",
                              fontSize: 0,
                              lineHeight: "4px",
                              ...mso({ msoLineHeightRule: "exactly" }),
                              backgroundColor: done ? C.green : C.off,
                              borderRadius: "2px",
                            }}
                          >
                            {" "}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <Text
                      className={done ? "x-ink" : "x-mute"}
                      style={{
                        marginTop: "10px",
                        fontSize: "13px",
                        lineHeight: "18px",
                        fontWeight: i === step - 1 ? 700 : 400,
                        color: done ? C.ink : C.mute,
                      }}
                    >
                      {label}
                    </Text>
                    <Text
                      className="x-mute"
                      style={{ fontSize: "12px", lineHeight: "16px", color: C.mute }}
                    >
                      {notes[i]}
                    </Text>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        {eta ? (
          <table {...TABLE} width="100%" style={{ marginTop: "16px" }}>
            <tbody>
              <tr>
                <td
                  className="x-line"
                  style={{ borderTop: `1px solid ${C.line}`, paddingTop: "14px" }}
                >
                  <Text
                    className="x-mute"
                    style={{ fontSize: "13px", lineHeight: "18px", color: C.mute }}
                  >
                    {etaLabel}
                  </Text>
                  <Text
                    style={{
                      marginTop: "2px",
                      fontSize: "20px",
                      lineHeight: "28px",
                      fontWeight: 700,
                    }}
                  >
                    {eta}
                  </Text>
                  {etaNote ? (
                    <Text
                      className="x-soft"
                      style={{
                        marginTop: "4px",
                        fontSize: "13px",
                        lineHeight: "19px",
                        color: C.soft,
                      }}
                    >
                      {etaNote}
                    </Text>
                  ) : null}
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </Card>
    </Section>
  );
}

function Thumb({ item, width }: { item: EmailItem; width: number }) {
  if (!item.image) {
    return (
      <table {...TABLE} width={width} data-skip-in-text="true">
        <tbody>
          <tr>
            <td
              height={Math.round(width * 1.25)}
              className="x-off"
              style={{
                width: `${width}px`,
                height: `${Math.round(width * 1.25)}px`,
                backgroundColor: C.off,
                borderRadius: "6px",
              }}
            >
              {" "}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
  const img = (
    <img
      src={item.image}
      width={String(width)}
      alt={item.product_name}
      style={{
        display: "block",
        width: `${width}px`,
        height: "auto",
        border: 0,
        borderRadius: "6px",
        fontFamily: FONT,
        fontSize: "11px",
        color: C.mute,
      }}
    />
  );
  return item.url ? (
    <a href={item.url} data-skip-in-text="true">
      {img}
    </a>
  ) : (
    img
  );
}

/** Artikli sa slikom, nazivom, veličinom, količinom i cenom. */
export function Items({
  items,
  title = "Tvoja porudžbina",
  showSku = false,
}: {
  items: EmailItem[];
  title?: string;
  showSku?: boolean;
}) {
  if (!items.length) return null;
  return (
    <Section pad="36px 32px 0">
      <Text style={{ fontSize: "17px", lineHeight: "24px", fontWeight: 700, marginBottom: "4px" }}>
        {title}
      </Text>
      <table {...TABLE} width="100%">
        <tbody>
          {items.map((item, index) => {
            const cell = {
              borderTop: `1px solid ${C.line}`,
              paddingTop: "16px",
              paddingBottom: "16px",
            };
            const name = item.url ? (
              <a
                href={item.url}
                data-plain="true"
                className="x-ink"
                style={{ color: C.ink, textDecoration: "none" }}
              >
                {item.product_name}
              </a>
            ) : (
              item.product_name
            );
            return (
              <tr key={`${item.product_name}-${item.size}-${index}`}>
                <td width="80" valign="top" className="x-line" style={{ ...cell, width: "80px" }}>
                  <Thumb item={item} width={80} />
                </td>
                <td valign="top" className="x-line" style={{ ...cell, paddingLeft: "16px" }}>
                  <Text style={{ fontWeight: 700, lineHeight: "20px" }}>{name}</Text>
                  <Text
                    className="x-mute"
                    style={{
                      marginTop: "4px",
                      fontSize: "13px",
                      lineHeight: "19px",
                      color: C.mute,
                    }}
                  >
                    Veličina {item.size} · {item.quantity} kom
                    {showSku && item.product_sku ? ` · ${item.product_sku}` : ""}
                  </Text>
                  <Text style={{ marginTop: "8px" }}>
                    {din(item.unit_price * item.quantity)}
                    {item.quantity > 1 ? (
                      <span className="x-mute" style={{ color: C.mute, fontSize: "13px" }}>
                        {" "}
                        ({din(item.unit_price)} po komadu)
                      </span>
                    ) : null}
                  </Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Section>
  );
}

function TotalRow({
  label,
  value,
  valueClass = "x-ink",
  valueColor = C.ink,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  valueClass?: string;
  valueColor?: string;
}) {
  return (
    <tr>
      <td
        className="x-soft"
        style={{
          paddingTop: "10px",
          fontFamily: FONT,
          fontSize: "14px",
          lineHeight: "20px",
          color: C.soft,
        }}
      >
        {label}
      </td>
      <td
        align="right"
        className={valueClass}
        style={{
          paddingTop: "10px",
          fontFamily: FONT,
          fontSize: "14px",
          lineHeight: "20px",
          color: valueColor,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </td>
    </tr>
  );
}

/** Zbir: međuzbir, popust po nazivu, dostava i iznos za kurira. */
export function Totals({
  subtotal,
  discount = 0,
  promoCode,
  shipping = 0,
  total,
  totalLabel = "Za kurira",
  note,
}: {
  subtotal?: number;
  discount?: number;
  promoCode?: string | null;
  shipping?: number;
  total: number;
  totalLabel?: string;
  note?: React.ReactNode;
}) {
  return (
    <Section pad="0 32px">
      <table
        {...TABLE}
        width="100%"
        className="x-line"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        <tbody>
          {subtotal != null ? <TotalRow label="Međuzbir" value={din(subtotal)} /> : null}
          {discount > 0 ? (
            <TotalRow
              label={discountLabel(promoCode)}
              value={`−${din(discount)}`}
              valueClass="x-green"
              valueColor={C.greenText}
            />
          ) : null}
          <TotalRow label="Dostava" value={shipping > 0 ? din(shipping) : "Besplatna"} />
          <tr>
            <td colSpan={2} style={{ paddingTop: "14px" }}>
              <table
                {...TABLE}
                width="100%"
                className="x-line"
                style={{ borderTop: `1px solid ${C.line}` }}
              >
                <tbody>
                  <tr>
                    <td
                      className="x-ink"
                      style={{
                        paddingTop: "14px",
                        fontFamily: FONT,
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 700,
                        color: C.ink,
                      }}
                    >
                      {totalLabel}
                    </td>
                    <td
                      align="right"
                      className="x-ink"
                      style={{
                        paddingTop: "14px",
                        fontFamily: FONT,
                        fontSize: "22px",
                        lineHeight: "28px",
                        fontWeight: 700,
                        color: C.ink,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {din(total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {note ? (
            <tr>
              <td
                colSpan={2}
                className="x-mute"
                style={{
                  paddingTop: "6px",
                  fontFamily: FONT,
                  fontSize: "13px",
                  lineHeight: "19px",
                  color: C.mute,
                }}
              >
                {note}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </Section>
  );
}

/** Mali blok: naslov i nekoliko redova (adresa za dostavu, podaci kupca). */
export function Info({ title, lines }: { title: string; lines: React.ReactNode[] }) {
  const shown = lines.filter(Boolean);
  if (!shown.length) return null;
  return (
    <Section pad="28px 32px 0">
      <Text className="x-mute" style={{ fontSize: "13px", lineHeight: "18px", color: C.mute }}>
        {title}
      </Text>
      {shown.map((line, i) => (
        <Text key={i} style={{ marginTop: i ? 0 : "6px", lineHeight: "23px" }}>
          {line}
        </Text>
      ))}
    </Section>
  );
}

/** Dugme koje radi i u Outlooku (pozadina u ćeliji, razmak preko mso-padding-alt). */
export function Button({
  href,
  children,
  variant = "solid",
}: Kids & { href: string; variant?: "solid" | "outline" }) {
  const solid = variant === "solid";
  return (
    <table {...TABLE} width="100%">
      <tbody>
        <tr>
          <td
            align="center"
            className={solid ? "x-btn" : "x-out"}
            {...legacy(solid ? { bgcolor: C.ink } : {})}
            style={{
              backgroundColor: solid ? C.ink : "transparent",
              border: solid ? "0" : `1px solid ${C.stitch}`,
              borderRadius: "8px",
              ...mso({ msoPaddingAlt: solid ? "16px 20px" : "12px 10px" }),
            }}
          >
            <a
              href={href}
              className={solid ? "x-btn-t" : "x-ink"}
              style={{
                display: "block",
                padding: solid ? "16px 20px" : "12px 10px",
                fontFamily: FONT,
                fontSize: solid ? "16px" : "14px",
                lineHeight: "20px",
                fontWeight: 700,
                color: solid ? "#FFFFFF" : C.ink,
                textDecoration: "none",
                borderRadius: "8px",
              }}
            >
              {children}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Kartica sa velikim WhatsApp dugmetom (promena veličine ili adrese, pitanja). */
export function HelpCard({
  title,
  text,
  orderNumber,
  extra,
}: {
  title: React.ReactNode;
  text: React.ReactNode;
  orderNumber?: string | number | null;
  extra?: React.ReactNode;
}) {
  return (
    <Section pad="36px 32px 0">
      <Card pad="24px">
        <Text style={{ fontSize: "18px", lineHeight: "24px", fontWeight: 700 }}>{title}</Text>
        <Text
          className="x-soft"
          style={{ marginTop: "6px", fontSize: "14px", lineHeight: "21px", color: C.soft }}
        >
          {text}
        </Text>
        <table {...TABLE} width="100%" style={{ marginTop: "18px" }}>
          <tbody>
            <tr>
              <td>
                <Button href={orderWhatsApp(orderNumber)}>Piši nam na WhatsApp</Button>
              </td>
            </tr>
          </tbody>
        </table>
        <Text
          className="x-mute"
          style={{
            marginTop: "12px",
            fontSize: "13px",
            lineHeight: "19px",
            color: C.mute,
            textAlign: "center",
          }}
        >
          ili pozovi{" "}
          <a
            href={telHref(BRAND.phone)}
            className="x-ink"
            style={{ color: C.ink, textDecoration: "underline" }}
          >
            {BRAND.phoneLabel}
          </a>
        </Text>
        {extra ? (
          <Text
            className="x-soft"
            style={{ marginTop: "16px", fontSize: "13px", lineHeight: "19px", color: C.soft }}
          >
            {extra}
          </Text>
        ) : null}
      </Card>
    </Section>
  );
}

/** Podsetnik na pogodnosti koje važe uz svaku porudžbinu. */
export function Perks() {
  const perks = [
    `${BUNDLE.pct}% popusta na celu porudžbinu kad uzmeš ${BUNDLE.minQty} ili više komada`,
    `Besplatna zamena veličine u roku od ${SIZE_EXCHANGE.days} dana`,
    "Besplatna dostava i plaćanje pouzećem",
  ];
  return (
    <Section pad="36px 32px 0">
      <Text style={{ fontSize: "17px", lineHeight: "24px", fontWeight: 700 }}>
        Uz svaku porudžbinu
      </Text>
      <table {...TABLE} width="100%" style={{ marginTop: "6px" }}>
        <tbody>
          {perks.map((perk) => (
            <tr key={perk}>
              <td width="18" valign="top" style={{ width: "18px", paddingTop: "15px" }}>
                <table {...TABLE} width="8" data-skip-in-text="true">
                  <tbody>
                    <tr>
                      <td
                        height="8"
                        className="x-on"
                        style={{
                          width: "8px",
                          height: "8px",
                          fontSize: 0,
                          lineHeight: "8px",
                          ...mso({ msoLineHeightRule: "exactly" }),
                          backgroundColor: C.green,
                          borderRadius: "2px",
                        }}
                      >
                        {" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td
                valign="top"
                className="x-soft"
                style={{
                  paddingTop: "8px",
                  fontFamily: FONT,
                  fontSize: "15px",
                  lineHeight: "22px",
                  color: C.soft,
                }}
              >
                {perk}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

/** Dva do tri preporučena modela sa slikom, nazivom i cenom. */
export function Recommendations({
  products,
  title = "Uz ovo dobro ide",
  campaign,
}: {
  products?: EmailProduct[] | null;
  title?: string;
  campaign?: string;
}) {
  const list = (products ?? []).filter((p) => p.image && p.url).slice(0, 3);
  if (list.length < 2) return null;
  const share = list.length === 3 ? "33.33%" : "50%";
  const imageWidth = list.length === 3 ? 172 : 262;
  return (
    <Section pad="40px 32px 0">
      <Text style={{ fontSize: "17px", lineHeight: "24px", fontWeight: 700 }}>{title}</Text>
      <table {...TABLE} width="100%" style={{ marginTop: "14px" }}>
        <tbody>
          <tr>
            {list.map((p, i) => (
              <td
                key={p.url}
                width={list.length === 3 ? "33%" : "50%"}
                valign="top"
                style={{ width: share, ...gutter(i, list.length, 12) }}
              >
                <a href={p.url} data-skip-in-text="true" style={{ textDecoration: "none" }}>
                  <img
                    src={p.image}
                    width={String(imageWidth)}
                    alt={p.name}
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: `${imageWidth}px`,
                      height: "auto",
                      border: 0,
                      borderRadius: "6px",
                      fontFamily: FONT,
                      fontSize: "11px",
                      color: C.mute,
                    }}
                  />
                </a>
                <Text
                  className="x-ink x-rec"
                  style={{ marginTop: "10px", fontSize: "13px", lineHeight: "18px" }}
                >
                  <a
                    href={p.url}
                    className="x-ink"
                    style={{ color: C.ink, textDecoration: "none" }}
                  >
                    {p.name}
                  </a>
                </Text>
                <Text
                  style={{
                    marginTop: "4px",
                    fontSize: "13px",
                    lineHeight: "18px",
                    fontWeight: 700,
                  }}
                >
                  {din(p.price)}
                </Text>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <Text style={{ marginTop: "18px", fontSize: "14px", lineHeight: "20px" }}>
        <a
          href={siteUrl("/shop", campaign)}
          className="x-ink"
          style={{ color: C.ink, textDecoration: "underline" }}
        >
          Pogledaj sve modele
        </a>
      </Text>
    </Section>
  );
}

/** Podnožje: kontakt, linkovi i podaci prodavca. */
export function Footer({
  audience = "customer",
  campaign,
}: {
  audience?: "customer" | "owner";
  campaign?: string;
}) {
  const small = { fontSize: "12px", lineHeight: "18px", color: C.mute };
  const link = { color: C.mute, textDecoration: "underline" };
  return (
    <Section pad="44px 32px 44px">
      <table
        {...TABLE}
        width="100%"
        className="x-line"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        <tbody>
          <tr>
            <td style={{ paddingTop: "24px" }}>
              {audience === "customer" ? (
                <Text className="x-mute" style={small}>
                  Pitanja? Piši nam na{" "}
                  <a href={orderWhatsApp()} className="x-mute" style={link}>
                    WhatsApp
                  </a>{" "}
                  ili pozovi{" "}
                  <a href={telHref(BRAND.phone)} className="x-mute" style={link}>
                    {BRAND.phoneLabel}
                  </a>
                  .
                </Text>
              ) : null}
              <Text
                className="x-mute"
                style={{ ...small, marginTop: audience === "customer" ? "8px" : 0 }}
              >
                <a href={siteUrl("/", campaign)} className="x-mute" style={link}>
                  exit.fashion
                </a>
                {"  ·  "}
                <a href={BRAND.instagram} className="x-mute" style={link}>
                  Instagram
                </a>
                {"  ·  "}
                <a href={siteUrl("/uslovi-kupovine")} className="x-mute" style={link}>
                  Uslovi kupovine
                </a>
              </Text>
              <Text className="x-mute" style={{ ...small, marginTop: "8px" }}>
                {BRAND.name} · {BRAND.legalName}, {BRAND.streetAddress}, 36300 {BRAND.city}, Srbija
              </Text>
              {audience === "customer" ? (
                <Text className="x-mute" style={{ ...small, marginTop: "8px" }}>
                  Poruka je poslata povodom tvoje porudžbine na exit.fashion.
                </Text>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}
