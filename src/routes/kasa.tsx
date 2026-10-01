import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { useCart, CART_CONSTANTS } from "@/hooks/useCart";
import { createCustomerOrder } from "@/lib/customer-orders.functions";
import { useAuth } from "@/hooks/useAuth";
import { ecommerce } from "@/lib/analytics";

export const Route = createFileRoute("/kasa")({
  head: () => ({
    meta: [
      { title: "Kasa — EXIT Denim" },
      { name: "description", content: "Završite narudžbinu. Plaćanje pouzećem, brza dostava." },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Ime je obavezno").max(120),
  email: z.string().trim().email("Neispravan email").max(255),
  phone: z.string().trim().min(6, "Telefon je obavezan").max(40),
  address: z.string().trim().min(3, "Adresa je obavezna").max(200),
  city: z.string().trim().min(2, "Grad je obavezan").max(80),
  postal: z.string().trim().min(3, "Poštanski broj").max(12),
  country: z.string().trim().min(2).max(80),
  note: z.string().trim().max(500).optional(),
});
type Form = z.infer<typeof schema>;

function CheckoutPage() {
  const { items, subtotal, shipping, total, clear } = useCart();
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
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (items.length === 0 && !submitting) {
      navigate({ to: "/korpa" });
    }
  }, [items.length, submitting]); // eslint-disable-line

  const gaItems = () =>
    items.map((i) => ({ item_id: i.sku, item_name: i.name, item_variant: i.size, price: i.unitPrice, quantity: i.quantity }));

  useEffect(() => {
    if (items.length > 0) ecommerce.beginCheckout(gaItems(), total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: any = {};
      parsed.error.issues.forEach((iss) => { if (iss.path[0]) fe[iss.path[0] as string] = iss.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    ecommerce.addShippingInfo(gaItems(), total);
    ecommerce.addPaymentInfo(gaItems(), total);
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
          contact: { email: form.email, name: form.name, phone: form.phone },
          shipping: { address: form.address, city: form.city, postal: form.postal, country: form.country },
          note: form.note || null,
        },
      });
      ecommerce.purchase(
        res.orderNumber,
        items.map((i) => ({ item_id: i.sku, item_name: i.name, item_variant: i.size, price: i.unitPrice, quantity: i.quantity })),
        total,
        shipping,
      );
      clear();
      navigate({ to: "/porudzbina/$number", params: { number: res.orderNumber }, search: { email: form.email } });
    } catch (err: any) {
      setServerError(err?.message || "Došlo je do greške. Pokušajte ponovo.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <Layout>
      <section className="container-x py-12 md:py-16">
        <div className="eyebrow">Kasa</div>
        <h1 className="mt-4 text-4xl md:text-5xl">Završite porudžbinu</h1>

        <form onSubmit={onSubmit} className="mt-10 grid lg:grid-cols-12 gap-10">
          {/* LEFT: form */}
          <div className="lg:col-span-8 space-y-8">
            <fieldset className="border border-border p-6">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Kontakt</legend>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <Field label="Ime i prezime" name="name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} required />
                <Field label="Email" name="email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} required />
                <Field label="Telefon" name="phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} required />
              </div>
              {!user && (
                <p className="mt-4 text-[12px] text-muted-foreground">
                  Kupovina bez naloga. <Link to="/auth" className="link-underline">Prijavite se</Link> da sačuvate porudžbine.
                </p>
              )}
            </fieldset>

            <fieldset className="border border-border p-6">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Adresa za isporuku</legend>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="md:col-span-2">
                  <Field label="Ulica i broj" name="address" value={form.address} onChange={(v) => set("address", v)} error={errors.address} required />
                </div>
                <Field label="Grad" name="city" value={form.city} onChange={(v) => set("city", v)} error={errors.city} required />
                <Field label="Poštanski broj" name="postal" value={form.postal} onChange={(v) => set("postal", v)} error={errors.postal} required />
                <div className="md:col-span-2">
                  <Field label="Država" name="country" value={form.country} onChange={(v) => set("country", v)} error={errors.country} required />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-border p-6">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Način plaćanja</legend>
              <label className="flex items-start gap-3 mt-2 p-4 border border-foreground bg-secondary/40 cursor-pointer">
                <input type="radio" checked readOnly className="mt-1" />
                <div>
                  <div className="font-medium">Plaćanje pouzećem (COD)</div>
                  <p className="text-sm text-muted-foreground mt-1">Plaćate gotovinom kurir pri isporuci. Dostava 2–5 radnih dana.</p>
                </div>
              </label>
            </fieldset>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.22em] font-medium mb-2">Napomena (opciono)</label>
              <textarea
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
                placeholder="Instrukcije za kurira, sprat, interfon..."
              />
            </div>

            {serverError && <div className="border border-destructive bg-destructive/10 text-destructive p-4 text-sm">{serverError}</div>}
          </div>

          {/* RIGHT: summary */}
          <aside className="lg:col-span-4">
            <div className="border border-border p-6 lg:sticky lg:top-24 space-y-5">
              <div className="eyebrow">Vaša porudžbina</div>
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {items.map((it) => (
                  <li key={`${it.productId}-${it.size}`} className="flex gap-3 text-sm">
                    <div className="w-14 h-16 bg-secondary shrink-0 overflow-hidden">
                      {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{it.name}</div>
                      <div className="text-[11px] text-muted-foreground">Vel. {it.size} · {it.quantity}×</div>
                    </div>
                    <div className="tabular-nums text-sm">{(it.unitPrice * it.quantity).toLocaleString("sr-RS")}</div>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Međuzbir</span><span className="tabular-nums">{subtotal.toLocaleString("sr-RS")} din</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dostava</span><span className="tabular-nums">{shipping === 0 ? "Besplatna" : `${shipping.toLocaleString("sr-RS")} din`}</span></div>
                {subtotal < CART_CONSTANTS.FREE_SHIPPING_OVER && (
                  <div className="text-[11px] text-muted-foreground">Do besplatne dostave: {(CART_CONSTANTS.FREE_SHIPPING_OVER - subtotal).toLocaleString("sr-RS")} din</div>
                )}
                <div className="flex justify-between pt-3 mt-2 border-t border-border font-semibold text-base"><span>Ukupno</span><span className="tabular-nums">{total.toLocaleString("sr-RS")} din</span></div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center hidden lg:inline-flex">
                {submitting ? "Slanje..." : "Potvrdi porudžbinu"}
              </button>
              <p className="text-[11px] text-center text-muted-foreground">Plaćanje pouzećem · Slanjem prihvatate Uslove korišćenja.</p>
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
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center bg-foreground text-background py-3.5 text-[12.5px] uppercase tracking-[0.18em] font-semibold disabled:opacity-60"
            >
              {submitting ? "Slanje…" : "Potvrdi porudžbinu"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

function Field({
  label, name, value, onChange, error, type = "text", required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void; error?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[11px] uppercase tracking-[0.22em] font-medium mb-1.5">
        {label}{required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
