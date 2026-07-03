import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "B2B Пријава — EXIT Denim" },
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
      setError(err.message || "Грешка");
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
            <div className="eyebrow text-accent">B2B Велепродајни портал</div>
            <h1 className="mt-4 text-4xl md:text-5xl">
              {mode === "login" ? "Добродошли назад." : "Отворите B2B налог."}
            </h1>
            <p className="mt-5 text-background/70 max-w-md leading-relaxed">
              {mode === "login"
                ? "Пријавите се за приступ велепродајним ценама и матрици величина."
                : "Пријава траје 2 минута. Наш тим проверава налог у року 24h."}
            </p>
          </div>
          <div className="text-xs text-background/50">EXIT Denim · Нови Пазар, Србија</div>

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
                Пријава
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                  mode === "signup" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                Регистрација
              </button>
            </div>

            {mode === "login" && (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    const res = await lovable.auth.signInWithOAuth("google", {
                      redirect_uri: window.location.origin + "/auth",
                    });
                    if (res.error) {
                      setError(res.error.message || "Грешка при пријави са Google-ом.");
                      setLoading(false);
                      return;
                    }
                    if (res.redirected) return;
                    navigate({ to: redirect || "/katalog" });
                  }}
                  className="w-full flex items-center justify-center gap-3 border border-input bg-background hover:bg-secondary transition-colors rounded-sm px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.9 6.1 29.2 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.2-5.1c-2 1.5-4.5 2.4-7.1 2.4-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.7 16.2 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.1C41.4 35.5 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z"/>
                  </svg>
                  Настави са Google
                </button>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="flex-1 h-px bg-border" /> или e-mail <span className="flex-1 h-px bg-border" />
                </div>
              </>
            )}

            <Field label="E-mail" type="email" value={email} onChange={setEmail} required />
            <Field label="Лозинка" type="password" value={password} onChange={setPassword} required />

            {mode === "signup" && (
              <>
                <div className="hairline pt-4" />
                <div className="eyebrow">Подаци о бутику</div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Назив бутика" value={boutique} onChange={setBoutique} required />
                  <Field label="Контакт особа" value={contact} onChange={setContact} required />
                  <Field label="Држава" value={country} onChange={setCountry} required />
                  <Field label="Град" value={city} onChange={setCity} required />
                  <Field label="Телефон / WhatsApp" value={phone} onChange={setPhone} required />
                  <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="@бутик" />
                </div>
                <Field label="Веб-сајт" value={website} onChange={setWebsite} placeholder="бутик.com" />
                <div>
                  <Label>Тип продаје</Label>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {["Физички бутик", "Онлајн продавница", "Обоје"].map((t) => (
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
                <Field label="Процењена месечна количина" value={monthlyQty} onChange={setMonthlyQty} placeholder="нпр. 50–100 ком" />
                <div>
                  <Label>Порука (опционо)</Label>
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
              {loading ? "..." : mode === "login" ? "Пријавите се" : "Региструјте бутик"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                onClick={async () => {
                  if (!email) { setError("Унесите e-mail па кликните заборавили лозинку."); return; }
                  setError(null);
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  if (error) setError(error.message);
                  else setError("Линк за ресет лозинке је послат на e-mail.");
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Заборавили сте лозинку?
              </button>
            )}

            <p className="text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">← Назад на сајт</Link>
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
