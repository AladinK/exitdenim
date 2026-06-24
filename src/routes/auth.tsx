import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "B2B Login — EXIT Denim" },
      { name: "description", content: "Prijavi se na EXIT Denim B2B portal." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [boutique, setBoutique] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [storeType, setStoreType] = useState("Fizički butik");
  const [monthlyQty, setMonthlyQty] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirect || "/katalog" });
    });
  }, [navigate, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: redirect || "/katalog" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              boutique_name: boutique,
              country,
              city,
              contact_person: contact,
              phone,
              instagram,
              website,
              store_type: storeType,
              monthly_qty: monthlyQty,
              message,
            },
          },
        });
        if (error) throw error;
        navigate({ to: "/cekanje" });
      }
    } catch (err: any) {
      setError(err.message || "Greška");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[80vh] grid lg:grid-cols-2">
        <div className="hidden lg:flex bg-foreground text-background p-12 flex-col justify-between">
          <div className="bg-background inline-block p-2 rounded-sm w-fit">
            <Logo />
          </div>
          <div>
            <div className="eyebrow text-accent">B2B Wholesale Portal</div>
            <h1 className="mt-4 text-4xl md:text-5xl">
              {mode === "login" ? "Dobrodošao nazad." : "Otvori B2B nalog."}
            </h1>
            <p className="mt-5 text-background/70 max-w-md leading-relaxed">
              {mode === "login"
                ? "Prijavi se za pristup veleprodajnim cijenama i size matrix narudžbama."
                : "Prijava traje 2 minute. Naš tim provjerava nalog unutar 24h."}
            </p>
          </div>
          <div className="text-xs text-background/50">EXIT Denim · Novi Pazar, Srbija</div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-12 bg-background">
          <form onSubmit={submit} className="w-full max-w-md space-y-4">
            <div className="flex gap-2 border border-border rounded-sm p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                  mode === "login" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                Prijava
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                  mode === "signup" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                Registracija
              </button>
            </div>

            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Lozinka" type="password" value={password} onChange={setPassword} required />

            {mode === "signup" && (
              <>
                <div className="hairline pt-4" />
                <div className="eyebrow">Podaci o butiku</div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ime butika" value={boutique} onChange={setBoutique} required />
                  <Field label="Kontakt osoba" value={contact} onChange={setContact} required />
                  <Field label="Država" value={country} onChange={setCountry} required />
                  <Field label="Grad" value={city} onChange={setCity} required />
                  <Field label="Telefon / WhatsApp" value={phone} onChange={setPhone} required />
                  <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="@butik" />
                </div>
                <Field label="Website" value={website} onChange={setWebsite} placeholder="butik.com" />
                <div>
                  <Label>Tip prodaje</Label>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {["Fizički butik", "Online shop", "Oboje"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setStoreType(t)}
                        className={`px-3 py-1.5 text-sm border rounded-sm ${
                          storeType === t ? "bg-foreground text-background border-foreground" : "border-border"
                        }`}
                      >{t}</button>
                    ))}
                  </div>
                </div>
                <Field label="Procijenjena mjesečna količina" value={monthlyQty} onChange={setMonthlyQty} placeholder="npr. 50–100 kom" />
                <div>
                  <Label>Poruka (opciono)</Label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 w-full border border-input bg-background rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  />
                </div>
              </>
            )}

            {error && <div className="text-sm text-destructive">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "..." : mode === "login" ? "Prijavi se" : "Registruj butik"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">← Nazad na sajt</Link>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{children}</label>;
}
function Field({ label, value, onChange, type = "text", required, placeholder }: {
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
        className="mt-1.5 w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
      />
    </div>
  );
}
