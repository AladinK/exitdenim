import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Check, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { CartLine, CartTotals, gaItems } from "@/components/CartParts";
import { useCart } from "@/hooks/useCart";
import { createCustomerOrder } from "@/lib/customer-orders.functions";
import { useAuth } from "@/hooks/useAuth";
import { ecommerce } from "@/lib/analytics";
import { reportPurchaseConversion } from "@/lib/google-ads";
import { BRAND } from "@/lib/brand";
import { orderMessage, phoneHref, viberHref, whatsappHref } from "@/lib/contact";
import { formatRsd } from "@/lib/format";

export const Route = createFileRoute("/kasa")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Kasa — EXIT Denim" },
      { property: "og:description", content: "Završite narudžbinu. Plaćanje pouzećem, brza dostava." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },

      { name: "robots", content: "noindex" },
      { title: "Kasa — EXIT Denim" },
      { name: "description", content: "Završite narudžbinu. Plaćanje pouzećem, brza dostava." },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Ime je obavezno").max(120),
  email: z.string().trim().email("Upišite ispravnu e-mail adresu").max(255),
  phone: z.string().trim().min(6, "Telefon je obavezan").max(40),
  address: z.string().trim().min(3, "Adresa je obavezna").max(200),
  city: z.string().trim().min(2, "Grad je obavezan").max(80),
  postal: z.string().trim().max(12),
  country: z.string().trim().min(2).max(80),
  note: z.string().trim().max(500).optional(),
});
type Form = z.infer<typeof schema>;

const POSTAL: Record<string, string> = {
  beograd: "11000", "novi sad": "21000", nis: "18000", kragujevac: "34000", subotica: "24000",
  zrenjanin: "23000", pancevo: "26000", cacak: "32000", "novi pazar": "36300", kraljevo: "36000",
  smederevo: "11300", leskovac: "16000", valjevo: "14000", krusevac: "37000", vranje: "17500",
  sabac: "15000", uzice: "31000", sombor: "25000", pozarevac: "12000", pirot: "18300",
  zajecar: "19000", kikinda: "23300", "sremska mitrovica": "22000", jagodina: "35000", vrsac: "26300",
  bor: "19210", prokuplje: "18400", loznica: "15300", "backa palanka": "21400", indjija: "22320",
  ruma: "22400", "stara pazova": "22300", paracin: "35250", cuprija: "35230", arandjelovac: "34300",
  "gornji milanovac": "32300", negotin: "19300", becej: "21220", vrbas: "21460", aleksinac: "18220",
  sjenica: "36310", tutin: "36320", prijepolje: "31300", priboj: "31330", "nova varos": "31320",
  ivanjica: "32250", raska: "36350", "vrnjacka banja": "36210", trstenik: "37240", obrenovac: "11500",
  lazarevac: "11550", mladenovac: "11400", zemun: "11080", "novi beograd": "11070", kula: "25230",
  apatin: "25260", senta: "24400", kanjiza: "24420", "smederevska palanka": "11420", velika_plana: "11320",
  "velika plana": "11320", svilajnac: "35210", despotovac: "35213", knjazevac: "19350", surdulica: "17530",
  bujanovac: "17520", presevo: "17523", "bela crkva": "26340", kovin: "26220", sid: "22240",
  temerin: "21235", futog: "21410", "petrovaradin": "21131", "sremski karlovci": "21205", lebane: "16230",
  vlasotince: "16210", topola: "34310", kosjeric: "31260", bajina_basta: "31250", "bajina basta": "31250",
  zlatibor: "31315", cajetina: "31310", lucani: "32240", ljig: "14240", ub: "14210", lajkovac: "14224",
};
const norm = (s: string) =>
  s.toLowerCase().trim().replace(/đ/g, "dj").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
function postalFor(city: string): string | undefined {
  return POSTAL[norm(city)];
}

function CheckoutPage() {
  const { items, shipping, promo, discount, total, clear, clearPromo } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const submit = useServerFn(createCustomerOrder);

  const [form, setForm] = useState<Form>({
    name: "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    postal: "",
    country: "Srbija",
    note: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !form.email) setForm((f) => ({ ...f, email: user.email! }));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (items.length === 0 && !submitting) {
      navigate({ to: "/korpa" });
    }
  }, [items.length, submitting]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (items.length > 0) ecommerce.beginCheckout(gaItems(items), total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onCity = (v: string) =>
    setForm((f) => {
      const code = postalFor(v);
      const prevAuto = postalFor(f.city);
      const keep = f.postal && f.postal !== prevAuto;
      return { ...f, city: v, postal: keep ? f.postal : code ?? (f.postal === prevAuto ? "" : f.postal) };
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      parsed.error.issues.forEach((iss) => {
        const key = iss.path[0] as keyof Form | undefined;
        if (key && !fe[key]) fe[key] = iss.message;
      });
      setErrors(fe);
      // fokus na prvo polje sa greškom
      const first = Object.keys(fe)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setErrors({});
    ecommerce.addShippingInfo(gaItems(items), total);
    ecommerce.addPaymentInfo(gaItems(items), total);
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
          contact: { email: form.email, name: form.name, phone: form.phone },
          shipping: { address: form.address, city: form.city, postal: form.postal, country: form.country },
          note: form.note || null,
          promo: promo && discount > 0 ? { code: promo.code, pct: promo.pct } : null,
        },
      });
      ecommerce.purchase(res.orderNumber, gaItems(items), total, shipping);
      void reportPurchaseConversion(res.orderNumber, total);
      clear();
      clearPromo();
      navigate({ to: "/porudzbina/$number", params: { number: res.orderNumber }, search: { email: form.email } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      // Poruke o artiklu su namenjene kupcu; tehničke greške ne prikazujemo doslovno.
      setServerError(
        /^(Veličina|Artikal)/.test(message)
          ? message
          : "Porudžbina trenutno nije upisana. Vaši podaci su sačuvani u ovom obrascu: pokušajte ponovo ili je pošaljite porukom.",
      );
      setSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  // Ista porudžbina kao poruka: rezervni put kada sajt ne može da je upiše.
  const messageText = orderMessage(
    items.map((i) => ({ name: i.name, sku: i.sku, size: i.size, quantity: i.quantity, unitPrice: i.unitPrice })),
    total,
    { name: form.name, phone: form.phone, address: form.address, city: form.city, postal: form.postal, note: form.note },
  );

  return (
    <Layout>
      <section className="container-x pt-8 pb-36 md:pt-12 lg:pb-16">
        <h1>Završite porudžbinu</h1>
        <p className="mt-3 text-ink-2">Bez kartice i bez naloga. Plaćate kuriru kada preuzmete paket.</p>

        <form onSubmit={onSubmit} noValidate className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
          <div className="grid min-w-0 content-start gap-6">
            <fieldset className="panel">
              <legend>Kontakt</legend>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field label="Ime i prezime" name="name" autoComplete="name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} />
                </div>
                <Field label="Telefon" name="phone" type="tel" inputMode="tel" autoComplete="tel" hint="Kurir vas zove pre isporuke" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
                <Field label="E-mail" name="email" type="email" inputMode="email" autoComplete="email" hint="Na njega stiže potvrda" value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
              </div>
              {!user && (
                <p className="mt-4 text-[0.8125rem] text-ink-3">
                  Imate nalog? <Link to="/auth" search={{ redirect: "/kasa" }} className="link-underline text-ink-2">Prijavite se</Link> da biste videli svoje porudžbine.
                </p>
              )}
            </fieldset>

            <fieldset className="panel">
              <legend>Adresa za isporuku</legend>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field label="Ulica i broj" name="address" autoComplete="street-address" value={form.address} onChange={(v) => set("address", v)} error={errors.address} />
                </div>
                <Field label="Grad" name="city" autoComplete="address-level2" value={form.city} onChange={onCity} error={errors.city} />
                <Field label="Poštanski broj" name="postal" inputMode="numeric" autoComplete="postal-code" hint="Za veće gradove se upisuje sam" value={form.postal} onChange={(v) => set("postal", v)} error={errors.postal} optional />
              </div>
              <p className="mt-4 text-[0.8125rem] text-ink-3">
                Dostavljamo na adrese u Srbiji. Za druge zemlje nam se javite na {BRAND.phoneLabel}.
              </p>
            </fieldset>

            <div className="panel">
              <h2 className="panel__title">Plaćanje</h2>
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-foreground bg-paper-2 p-4">
                <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-action-text" />
                <div>
                  <div className="font-semibold">Pouzećem</div>
                  <p className="mt-1 text-sm text-ink-2">Plaćate gotovinom kuriru pri isporuci. Dostava je besplatna i stiže za 2–5 radnih dana.</p>
                </div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="note">Napomena <span className="font-normal text-ink-3">(nije obavezno)</span></label>
              <textarea
                id="note"
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                maxLength={500}
                className="input"
                placeholder="Sprat, interfon, kada ste kod kuće"
              />
            </div>

            {serverError && (
              <div className="notice notice--strong" role="alert">
                <div>
                  <h2>Porudžbina nije poslata</h2>
                  <p className="mt-2">{serverError}</p>
                </div>
                <div className="notice__actions">
                  <a className="btn-dark" href={whatsappHref(messageText)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" /> Pošaljite na WhatsApp
                  </a>
                  <a className="btn-outline" href={viberHref}>
                    <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" /> Viber
                  </a>
                  <a className="btn-outline" href={phoneHref}>
                    <Phone aria-hidden="true" className="h-[18px] w-[18px]" /> {BRAND.phoneLabel}
                  </a>
                </div>
                <p className="text-[0.8125rem]">Poruka za WhatsApp već sadrži artikle, veličine i podatke koje ste uneli.</p>
              </div>
            )}
          </div>

          <aside>
            <div className="panel lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <h2 className="panel__title">Vaša porudžbina</h2>
              <ul className="mt-2 max-h-80 divide-y divide-line overflow-y-auto [&>li]:px-0">
                {items.map((it) => (
                  <CartLine key={`${it.productId}-${it.size}`} item={it} editable={false} />
                ))}
              </ul>
              <div className="mt-2 border-t border-line pt-4">
                <CartTotals />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary mt-6 hidden w-full lg:inline-flex">
                {submitting ? "Šaljem porudžbinu…" : "Potvrdite porudžbinu"}
              </button>
              <ul className="assurances mt-6">
                <li><Check aria-hidden="true" /> Plaćate tek kada preuzmete paket</li>
                <li><Check aria-hidden="true" /> Besplatna dostava kurirskom službom</li>
                <li><Check aria-hidden="true" /> Potvrda porudžbine stiže na e-mail</li>
                <li><Check aria-hidden="true" /> Pomoć oko broja: {BRAND.phoneLabel}</li>
              </ul>
              <p className="mt-4 text-[0.8125rem] text-ink-3">
                Slanjem porudžbine prihvatate <Link to="/faq" className="underline underline-offset-4">uslove kupovine</Link>.
              </p>
            </div>
          </aside>

          <div className="sticky-bar" data-visible="true">
            <div className="flex items-center gap-3">
              <div className="shrink-0 leading-tight">
                <div className="text-[0.8125rem] text-ink-3">Ukupno</div>
                <div className="text-base font-bold">{formatRsd(total)}</div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? "Šaljem…" : "Potvrdite porudžbinu"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
}

function Field({
  label, name, value, onChange, error, hint, type = "text", inputMode, autoComplete, optional,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
  optional?: boolean;
}) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {optional && <span className="font-normal text-ink-3"> (nije obavezno)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={!optional}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="input"
      />
      {error ? (
        <p id={`${name}-error`} className="field__error">{error}</p>
      ) : hint ? (
        <p id={`${name}-hint`} className="field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
