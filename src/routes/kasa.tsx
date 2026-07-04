import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { useCart, CART_CONSTANTS } from "@/hooks/useCart";
import { createCustomerOrder } from "@/lib/customer-orders.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/kasa")({
  head: () => ({
    meta: [
      { title: "Каса — EXIT Denim" },
      { name: "description", content: "Завршите наруџбину. Плаћање поузећем, брза достава." },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Име је обавезно").max(120),
  email: z.string().trim().email("Неисправан email").max(255),
  phone: z.string().trim().min(6, "Телефон је обавезан").max(40),
  address: z.string().trim().min(3, "Адреса је обавезна").max(200),
  city: z.string().trim().min(2, "Град је обавезан").max(80),
  postal: z.string().trim().min(3, "Поштански број").max(12),
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
    country: "Србија",
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
      clear();
      navigate({ to: "/porudzbina/$number", params: { number: res.orderNumber }, search: { email: form.email } });
    } catch (err: any) {
      setServerError(err?.message || "Дошло је до грешке. Покушајте поново.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <Layout>
      <section className="container-x py-12 md:py-16">
        <div className="eyebrow">Каса</div>
        <h1 className="mt-4 text-4xl md:text-5xl">Завршите поруџбину</h1>

        <form onSubmit={onSubmit} className="mt-10 grid lg:grid-cols-12 gap-10">
          {/* LEFT: form */}
          <div className="lg:col-span-8 space-y-8">
            <fieldset className="border border-border p-6">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Контакт</legend>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <Field label="Име и презиме" name="name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} required />
                <Field label="Email" name="email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} required />
                <Field label="Телефон" name="phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} required />
              </div>
              {!user && (
                <p className="mt-4 text-[12px] text-muted-foreground">
                  Куповина без налога. <Link to="/auth" className="link-underline">Пријавите се</Link> да сачувате поруџбине.
                </p>
              )}
            </fieldset>

            <fieldset className="border border-border p-6">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Адреса за испоруку</legend>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="md:col-span-2">
                  <Field label="Улица и број" name="address" value={form.address} onChange={(v) => set("address", v)} error={errors.address} required />
                </div>
                <Field label="Град" name="city" value={form.city} onChange={(v) => set("city", v)} error={errors.city} required />
                <Field label="Поштански број" name="postal" value={form.postal} onChange={(v) => set("postal", v)} error={errors.postal} required />
                <div className="md:col-span-2">
                  <Field label="Држава" name="country" value={form.country} onChange={(v) => set("country", v)} error={errors.country} required />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-border p-6">
              <legend className="px-2 text-[11px] uppercase tracking-[0.22em] font-medium">Начин плаћања</legend>
              <label className="flex items-start gap-3 mt-2 p-4 border border-foreground bg-secondary/40 cursor-pointer">
                <input type="radio" checked readOnly className="mt-1" />
                <div>
                  <div className="font-medium">Плаћање поузећем (COD)</div>
                  <p className="text-sm text-muted-foreground mt-1">Плаћате готовином курир при испоруци. Достава 2–5 радних дана.</p>
                </div>
              </label>
            </fieldset>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.22em] font-medium mb-2">Напомена (опционо)</label>
              <textarea
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
                placeholder="Инструкције за курира, спрат, интерфон..."
              />
            </div>

            {serverError && <div className="border border-destructive bg-destructive/10 text-destructive p-4 text-sm">{serverError}</div>}
          </div>

          {/* RIGHT: summary */}
          <aside className="lg:col-span-4">
            <div className="border border-border p-6 lg:sticky lg:top-24 space-y-5">
              <div className="eyebrow">Ваша поруџбина</div>
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {items.map((it) => (
                  <li key={`${it.productId}-${it.size}`} className="flex gap-3 text-sm">
                    <div className="w-14 h-16 bg-secondary shrink-0 overflow-hidden">
                      {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{it.name}</div>
                      <div className="text-[11px] text-muted-foreground">Вел. {it.size} · {it.quantity}×</div>
                    </div>
                    <div className="tabular-nums text-sm">{(it.unitPrice * it.quantity).toLocaleString("sr-RS")}</div>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Међузбир</span><span className="tabular-nums">{subtotal.toLocaleString("sr-RS")} дин</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Достава</span><span className="tabular-nums">{shipping === 0 ? "Бесплатна" : `${shipping.toLocaleString("sr-RS")} дин`}</span></div>
                {subtotal < CART_CONSTANTS.FREE_SHIPPING_OVER && (
                  <div className="text-[11px] text-muted-foreground">До бесплатне доставе: {(CART_CONSTANTS.FREE_SHIPPING_OVER - subtotal).toLocaleString("sr-RS")} дин</div>
                )}
                <div className="flex justify-between pt-3 mt-2 border-t border-border font-semibold text-base"><span>Укупно</span><span className="tabular-nums">{total.toLocaleString("sr-RS")} дин</span></div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                {submitting ? "Слање..." : "Пошаљи поруџбину"}
              </button>
              <p className="text-[11px] text-center text-muted-foreground">Слањем прихватате Услове коришћења.</p>
            </div>
          </aside>
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
