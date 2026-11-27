import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { useCart, CART_CONSTANTS } from "@/hooks/useCart";
import { useCartCatalog } from "@/hooks/useCartCatalog";
import { createCustomerOrder } from "@/lib/customer-orders.functions";
import { useAuth } from "@/hooks/useAuth";
import { ecommerce } from "@/lib/analytics";
import { reportPurchaseConversion } from "@/lib/google-ads";
import { Button } from "@/components/ui/button";
import { orderMessage, phoneHref, whatsappHref } from "@/lib/contact";
import { BRAND, SIZE_EXCHANGE } from "@/lib/brand";
import { deliveryWindow, isValidPhone, lineKey } from "@/lib/cart-helpers";

export const Route = createFileRoute("/kasa")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Kasa — EXIT Denim" },
      { property: "og:description", content: "Završite narudžbinu. Plaćanje pouzećem, brza dostava." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },

      { title: "Kasa — EXIT Denim" },
      { name: "description", content: "Završite narudžbinu. Plaćanje pouzećem, brza dostava." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Upišite ime i prezime").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "Telefon je obavezan")
    .max(40)
    .refine(isValidPhone, "Proverite broj, na primer 064 123 4567"),
  email: z
    .string()
    .trim()
    .max(255)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Proverite email ili ostavite polje prazno"),
  address: z.string().trim().min(3, "Upišite ulicu i broj").max(200),
  city: z.string().trim().min(2, "Upišite grad ili mesto").max(80),
  postal: z.string().trim().max(12),
  country: z.string().trim().min(2, "Upišite državu").max(80),
  note: z.string().trim().max(500).optional(),
});
type Form = z.infer<typeof schema>;
type FieldKey = Exclude<keyof Form, "note">;
/** Redosled polja na stranici: prva greška u ovom redu dobija fokus. */
const FIELD_ORDER: FieldKey[] = ["name", "phone", "email", "address", "city", "postal", "country"];

const SAVED_KEY = "exit_checkout_v1";
/** Kupac je isključio pamćenje podataka na ovom uređaju. */
const NO_SAVE_KEY = "exit_checkout_nosave";
type Saved = Pick<Form, FieldKey>;

function readSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && typeof s === "object" ? (s as Saved) : null;
  } catch {
    return null;
  }
}

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
  s.toLowerCase().trim().replace(/đ/g, "dj").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ");
function postalFor(city: string): string | undefined {
  return POSTAL[norm(city)];
}

function CheckoutPage() {
  const { items, ready, subtotal, shipping, promo, discount, total, clear, clearPromo } = useCart();
  const { info, blocking } = useCartCatalog(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const submit = useServerFn(createCustomerOrder);

  const [form, setForm] = useState<Form>({
    name: "",
    phone: "",
    email: user?.email ?? "",
    address: "",
    city: "",
    postal: "",
    country: "Srbija",
    note: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // Tehnički neuspeh upisa (ne greška kupca): nudi se slanje iste porudžbine porukom.
  const [orderFailed, setOrderFailed] = useState(false);
  const [remember, setRemember] = useState(true);
  const [eta, setEta] = useState<string | null>(null);
  const refs = useRef<Partial<Record<FieldKey, HTMLInputElement | null>>>({});
  const restored = useRef(false);

  // Podaci sa prošle kupovine (samo na ovom uređaju) popunjavaju prazna polja.
  useEffect(() => {
    setEta(deliveryWindow());
    try { if (localStorage.getItem(NO_SAVE_KEY) === "1") setRemember(false); } catch {}
    const saved = readSaved();
    if (saved) {
      setForm((f) => {
        const next = { ...f };
        for (const k of FIELD_ORDER) {
          const v = saved[k];
          if (typeof v === "string" && v && (!f[k] || (k === "country" && f[k] === "Srbija"))) next[k] = v;
        }
        return next;
      });
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    if (user?.email && !form.email) setForm((f) => ({ ...f, email: user.email! }));
  }, [user]); // eslint-disable-line

  // Upisano se čuva dok kupac kuca, pa se ne gubi ako zatvori karticu ili ode po broj.
  useEffect(() => {
    if (!restored.current) return;
    const t = setTimeout(() => {
      try {
        if (remember) {
          const saved: Saved = {
            name: form.name, phone: form.phone, email: form.email, address: form.address,
            city: form.city, postal: form.postal, country: form.country,
          };
          localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
        } else {
          localStorage.removeItem(SAVED_KEY);
        }
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [form, remember]);

  useEffect(() => {
    // Čeka se da korpa bude pročitana iz pregledača: inače osvežavanje kase (ili povratak
    // na karticu koju je telefon ugasio) vraća kupca u korpu i briše mu upisane podatke.
    if (ready && items.length === 0 && !submitting) {
      navigate({ to: "/korpa" });
    }
  }, [ready, items.length, submitting]); // eslint-disable-line

  const gaItems = () =>
    items.map((i) => ({ item_id: i.sku, item_name: i.name, item_variant: i.size, price: i.unitPrice, quantity: i.quantity }));

  useEffect(() => {
    if (ready && items.length > 0) ecommerce.beginCheckout(gaItems(), total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const set = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validateField = (k: FieldKey) => {
    const r = schema.shape[k].safeParse(form[k]);
    setErrors((e) => ({ ...e, [k]: r.success ? undefined : r.error.issues[0]?.message }));
  };

  const onCity = (v: string) => {
    setForm((f) => {
      const code = postalFor(v);
      const prevAuto = postalFor(f.city);
      const keep = f.postal && f.postal !== prevAuto;
      return { ...f, city: v, postal: keep ? f.postal : code ?? (f.postal === prevAuto ? "" : f.postal) };
    });
    if (errors.city) setErrors((e) => ({ ...e, city: undefined }));
  };

  const focusFirstError = (fe: Partial<Record<keyof Form, string>>) => {
    const first = FIELD_ORDER.find((k) => fe[k]);
    const el = first ? refs.current[first] : null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setServerError(null);
    setOrderFailed(false);
    if (blocking) {
      setServerError("U korpi je veličina koje više nema. Promenite je ili uklonite artikal u korpi, pa potvrdite porudžbinu.");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      parsed.error.issues.forEach((iss) => {
        const k = iss.path[0] as keyof Form | undefined;
        if (k && !fe[k]) fe[k] = iss.message;
      });
      setErrors(fe);
      focusFirstError(fe);
      return;
    }
    setErrors({});
    ecommerce.addShippingInfo(gaItems(), total);
    ecommerce.addPaymentInfo(gaItems(), total);
    setSubmitting(true);
    const email = parsed.data.email;
    try {
      const res = await submit({
        data: {
          items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
          contact: { email, name: parsed.data.name, phone: parsed.data.phone },
          shipping: { address: parsed.data.address, city: parsed.data.city, postal: parsed.data.postal, country: parsed.data.country },
          note: parsed.data.note || null,
          promo: promo && discount > 0 ? { code: promo.code, pct: promo.pct } : null,
        },
      });
      ecommerce.purchase(res.orderNumber, gaItems(), res.total ?? total, shipping);
      void reportPurchaseConversion(res.orderNumber, res.total ?? total);
      // Stranica potvrde čita porudžbinu sa ovim podacima; email i telefon ne idu u adresu stranice.
      try {
        sessionStorage.setItem(
          "exit_last_order",
          JSON.stringify({ number: res.orderNumber, email, phone: parsed.data.phone }),
        );
      } catch {}
      clear();
      clearPromo();
      navigate({ to: "/porudzbina/$number", params: { number: res.orderNumber } });
    } catch (err: any) {
      const message = typeof err?.message === "string" ? err.message : "";
      // Poruke o artiklu i podacima su namenjene kupcu; tehničke greške se ne prikazuju doslovno.
      const forCustomer = /^(Veličina|Artikal|Telefon|Email)/.test(message);
      setServerError(
        forCustomer
          ? message
          : "Porudžbina trenutno nije upisana. Vaši podaci su sačuvani u ovom obrascu: pokušajte ponovo ili je pošaljite porukom.",
      );
      setOrderFailed(!forCustomer);
      setSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  const fieldProps = (k: FieldKey) => ({
    name: k,
    value: form[k],
    error: errors[k],
    inputRef: (el: HTMLInputElement | null) => { refs.current[k] = el; },
    onBlur: () => { if (form[k]) validateField(k); },
  });

  return (
    <Layout>
      <section className="container-x py-12 md:py-16 pb-32 lg:pb-16">
        <div className="eyebrow">Kasa</div>
        <h1 className="mt-4 text-4xl md:text-5xl">Završite porudžbinu</h1>

        <form onSubmit={onSubmit} noValidate className="mt-10 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-12 gap-10">
          {/* LEFT: form */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            <fieldset className="border border-border p-6 min-w-0">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Kontakt</legend>
              <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-4 mt-2">
                <Field label="Ime i prezime" {...fieldProps("name")} onChange={(v) => set("name", v)} autoComplete="name" placeholder="Marko Marković" required />
                <Field label="Telefon" {...fieldProps("phone")} onChange={(v) => set("phone", v)} type="tel" inputMode="tel" autoComplete="tel" placeholder="064 123 4567" required />
                <div className="md:col-span-2">
                  <Field
                    label="Email (opciono, za potvrdu porudžbine)"
                    {...fieldProps("email")}
                    onChange={(v) => set("email", v)}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="ime@primer.com"
                  />
                </div>
              </div>
              {!user && (
                <p className="mt-4 text-[12px] text-muted-foreground">
                  Kupovina bez naloga. <Link to="/auth" className="link-underline">Prijavite se</Link> da sačuvate porudžbine.
                </p>
              )}
            </fieldset>

            <fieldset className="border border-border p-6 min-w-0">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Adresa za isporuku</legend>
              <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-4 mt-2">
                <div className="md:col-span-2">
                  <Field label="Ulica i broj" {...fieldProps("address")} onChange={(v) => set("address", v)} autoComplete="street-address" placeholder="Ulica i broj, sprat i stan" required />
                </div>
                <Field label="Grad" {...fieldProps("city")} onChange={onCity} autoComplete="address-level2" placeholder="npr. Novi Pazar" required />
                <Field label="Poštanski broj (popunjava se automatski)" {...fieldProps("postal")} onChange={(v) => set("postal", v)} inputMode="numeric" autoComplete="postal-code" />
                <div className="md:col-span-2">
                  <Field label="Država" {...fieldProps("country")} onChange={(v) => set("country", v)} autoComplete="country-name" required />
                </div>
              </div>
              <label className="mt-5 flex items-start gap-2.5 text-[12px] text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => {
                    setRemember(e.target.checked);
                    try {
                      if (e.target.checked) localStorage.removeItem(NO_SAVE_KEY);
                      else localStorage.setItem(NO_SAVE_KEY, "1");
                    } catch {}
                  }}
                  className="mt-0.5"
                />
                <span>Zapamti moje podatke na ovom uređaju za sledeću kupovinu</span>
              </label>
            </fieldset>

            <fieldset className="border border-border p-6 min-w-0">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Način plaćanja</legend>
              <label className="flex items-start gap-3 mt-2 p-4 border border-foreground bg-secondary/40 cursor-pointer">
                <input type="radio" checked readOnly className="mt-1" />
                <div>
                  <div className="font-medium">Plaćanje pouzećem (COD)</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Plaćate gotovinom kurir pri isporuci. Dostava 2–5 radnih dana{eta ? `, okvirno ${eta}` : "."}
                  </p>
                </div>
              </label>
            </fieldset>

            <div>
              <label htmlFor="note" className="block text-[11px] uppercase tracking-[0.22em] font-medium mb-2">Napomena (opciono)</label>
              <textarea
                id="note"
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
                placeholder="Instrukcije za kurira, sprat, interfon..."
              />
            </div>

            {serverError && <div role="alert" className="border border-destructive bg-destructive/10 text-destructive p-4 text-sm">{serverError}</div>}
            {orderFailed && (
              <div className="border border-border bg-secondary/40 p-4 text-sm">
                <p className="font-semibold">Pošaljite porudžbinu porukom</p>
                <p className="mt-1 text-muted-foreground">
                  Poruka je već popunjena artiklima i vašim podacima. Potvrdićemo je čim je vidimo.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    className="btn-primary"
                    href={whatsappHref(
                      orderMessage(
                        items.map((i) => ({ name: i.name, sku: i.sku, size: i.size, quantity: i.quantity, unitPrice: i.unitPrice })),
                        total,
                        { name: form.name, phone: form.phone, address: form.address, city: form.city, postal: form.postal, note: form.note },
                      ),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pošalji na WhatsApp
                  </a>
                  <a className="btn-outline" href={phoneHref}>
                    {BRAND.phoneLabel}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: summary */}
          <aside className="lg:col-span-4">
            <div className="border border-border p-6 lg:sticky lg:top-24 space-y-5">
              <div className="flex items-baseline justify-between gap-3">
                <div className="eyebrow">Vaša porudžbina</div>
                <Link to="/korpa" className="text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground">Izmeni korpu</Link>
              </div>
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {items.map((it) => {
                  const status = info.get(lineKey(it))?.status;
                  return (
                    <li key={lineKey(it)} className="flex gap-3 text-sm">
                      <div className="w-14 h-16 bg-secondary shrink-0 overflow-hidden">
                        {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{it.name}</div>
                        <div className="text-[11px] text-muted-foreground">Vel. {it.size} · {it.quantity}×</div>
                        {status === "soldOut" && <div className="text-[11px] font-semibold text-destructive">Veličina je rasprodata</div>}
                        {status === "unavailable" && <div className="text-[11px] font-semibold text-destructive">Model više nije u ponudi</div>}
                      </div>
                      <div className="tabular-nums text-sm">{(it.unitPrice * it.quantity).toLocaleString("sr-RS")}</div>
                    </li>
                  );
                })}
              </ul>
              {blocking && (
                <p role="alert" className="text-[12px] font-semibold text-destructive">
                  Promenite veličinu ili uklonite označene artikle u <Link to="/korpa" className="underline">korpi</Link>.
                </p>
              )}
              <div className="pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Međuzbir</span><span className="tabular-nums">{subtotal.toLocaleString("sr-RS")} din</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dostava</span><span className="tabular-nums">{shipping === 0 ? "Besplatna" : `${shipping.toLocaleString("sr-RS")} din`}</span></div>
                {promo && discount > 0 && (
                  <div className="flex justify-between text-accent font-medium">
                    <span>Točak sreće −{promo.pct}%</span>
                    <span className="tabular-nums">−{discount.toLocaleString("sr-RS")} din</span>
                  </div>
                )}
                {subtotal < CART_CONSTANTS.FREE_SHIPPING_OVER && (
                  <div className="text-[11px] text-muted-foreground">Do besplatne dostave: {(CART_CONSTANTS.FREE_SHIPPING_OVER - subtotal).toLocaleString("sr-RS")} din</div>
                )}
                <div className="flex justify-between pt-3 mt-2 border-t border-border font-semibold text-base"><span>Ukupno</span><span className="tabular-nums">{total.toLocaleString("sr-RS")} din</span></div>
              </div>
              <Button type="submit" disabled={submitting || blocking} className="w-full min-h-12 hidden lg:inline-flex">
                {submitting ? "Slanje..." : "Potvrdi porudžbinu"}
              </Button>
              <ul className="space-y-2 text-[12px] text-muted-foreground">
                {[
                  "Besplatna dostava na sve porudžbine",
                  "Plaćate tek kad preuzmete paket — bez kartice",
                  `Besplatna zamena veličine u roku od ${SIZE_EXCHANGE.days} dana`,
                  "Dostava kurirskom službom za 2–5 radnih dana",
                  "Potvrdu porudžbine dobijate na email, ako ga upišete",
                  "98% pamuk, 2% elastin — proizvedeno u Srbiji",
                  "Pomoć oko broja: 065 317 6716 (poziv, Viber, WhatsApp)",
                ].map((t) => (
                  <li key={t} className="flex gap-2"><span className="text-primary">✓</span>{t}</li>
                ))}
              </ul>
              <p className="text-[11px] text-center text-muted-foreground">
                Slanjem porudžbine prihvatate <Link to="/faq" className="underline underline-offset-2">uslove kupovine</Link>.
              </p>
            </div>
          </aside>

          {/* Mobile sticky confirm */}
          <div
            className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/97 backdrop-blur-xl px-4 pt-3 flex items-center gap-3"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <div className="shrink-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ukupno</div>
              <div className="text-[15px] font-semibold tabular-nums leading-tight">{total.toLocaleString("sr-RS")} din</div>
            </div>
            <Button
              type="submit"
              disabled={submitting || blocking}
              className="flex-1 min-h-12 text-sm"
            >
              {submitting ? "Slanje…" : "Potvrdi porudžbinu"}
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

function Field({
  label, name, value, onChange, onBlur, error, type = "text", required, autoComplete, inputMode, placeholder, inputRef,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  inputRef?: (el: HTMLInputElement | null) => void;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block text-[11px] uppercase tracking-[0.22em] font-medium mb-1.5">
        {label}{required && <span className="text-accent"> *</span>}
      </label>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        enterKeyHint="next"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-required={required || undefined}
        className={`w-full border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground placeholder:text-muted-foreground/60 ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p id={errorId} className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
