import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useB2BAccess } from "@/lib/b2b";

export const Route = createFileRoute("/postani-partner")({
  head: () => ({
    meta: [
      { title: "Postani B2B partner — EXIT Denim" },
      { name: "description", content: "Prijavi butik za EXIT Denim B2B saradnju. Wholesale cijene, brza isporuka u regiji, repeat orders." },
    ],
  }),
  component: Partner,
});

function Partner() {
  const { approved, grant } = useB2BAccess();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    boutique: "", country: "", city: "", instagram: "", website: "",
    storeType: "Fizički butik", monthlyQty: "", categories: [] as string[],
    contact: "", phone: "", email: "", message: "",
  });

  const toggleCat = (c: string) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c],
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Demo: simulate approval after 1.2s for preview purposes
    setTimeout(() => grant(), 1200);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="section-pad">
          <div className="container-x max-w-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground inline-flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl">Prijava je poslata</h1>
            <p className="mt-4 text-muted-foreground">
              Hvala. Naš tim će provjeriti profil butika i javiti se na <strong>{form.email || "tvoj email"}</strong> u roku 24h sa
              veleprodajnim cijenama, line sheets i preporukom starter paketa.
            </p>
            {approved && (
              <div className="mt-8 border border-accent rounded-sm p-5 text-sm bg-accent/10">
                Demo: B2B pristup je automatski odobren u ovoj sesiji. Sada možeš vidjeti veleprodajne cijene i size matrix u katalogu.
              </div>
            )}
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-16 md:py-24 grid lg:grid-cols-2 gap-10">
          <div>
            <div className="eyebrow text-accent">B2B Aplikacija</div>
            <h1 className="mt-3 text-5xl md:text-6xl">Otvori B2B nalog</h1>
            <p className="mt-5 text-background/75 max-w-md leading-relaxed">
              Prijava traje 2 minute. Odgovaramo unutar 24h sa veleprodajnim cijenama, line sheets i preporukom miksa za tvoj butik.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Pristup veleprodajnim cijenama i stocku",
                "Size matrix narudžbe po artiklu",
                "Line sheets i media kit za marketing",
                "Personalna komunikacija sa wholesale timom",
              ].map((i) => (
                <li key={i} className="flex gap-2 items-start">
                  <Check className="w-4 h-4 mt-1 text-accent shrink-0" /> {i}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="bg-background text-foreground rounded-sm p-6 md:p-8 space-y-5">
            <Row>
              <Field label="Ime butika" required value={form.boutique} onChange={(v) => setForm({ ...form, boutique: v })} />
              <Field label="Kontakt osoba" required value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} />
            </Row>
            <Row>
              <Field label="Država" required value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
              <Field label="Grad" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            </Row>
            <Row>
              <Field label="Instagram profil" placeholder="@butik" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
              <Field label="Website" placeholder="butik.com" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
            </Row>
            <Row>
              <Field label="WhatsApp / Viber" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            </Row>
            <div>
              <Label>Tip prodaje</Label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {["Fizički butik", "Online shop", "Oboje"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, storeType: t })}
                    className={`px-4 py-2 text-sm border rounded-sm ${
                      form.storeType === t ? "bg-foreground text-background border-foreground" : "border-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Field
              label="Procijenjena mjesečna količina"
              placeholder="npr. 50–100 kom"
              value={form.monthlyQty}
              onChange={(v) => setForm({ ...form, monthlyQty: v })}
            />
            <div>
              <Label>Kategorije od interesa</Label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {["Jeans", "Chino", "Cargo"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCat(c)}
                    className={`px-4 py-2 text-sm border rounded-sm ${
                      form.categories.includes(c) ? "bg-foreground text-background border-foreground" : "border-border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Poruka</Label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="mt-2 w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
                placeholder="Kratko o butiku, koje brendove već prodaješ…"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Pošalji prijavu</button>
            <p className="text-xs text-muted-foreground text-center">
              Slanjem prijave saglasan si da te kontaktiramo sa B2B ponudom.
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{children}</label>;
}
function Field({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}{required && " *"}</Label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
      />
    </div>
  );
}
