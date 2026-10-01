import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Nova lozinka — EXIT Denim" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from URL hash automatically and
    // fires PASSWORD_RECOVERY. We just wait for a session to exist.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Minimum 8 karaktera."); return; }
    if (password !== confirm) { setError("Lozinke se ne poklapaju."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setDone(true);
      setTimeout(() => navigate({ to: "/auth" }), 1500);
    }
  };

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <div className="eyebrow text-accent">B2B Portal</div>
          <h1 className="text-3xl">Postavite novu lozinku</h1>
          {!ready && <p className="text-sm text-muted-foreground">Otvaram sesiju za reset...</p>}
          {done && <p className="text-sm text-accent">Lozinka ažurirana. Preusmeravam...</p>}
          {ready && !done && (
            <>
              <input
                type="password" required minLength={8}
                placeholder="Nova lozinka"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              />
              <input
                type="password" required minLength={8}
                placeholder="Potvrdite lozinku"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-input bg-background rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              />
              {error && <div className="text-sm text-destructive">{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "..." : "Sačuvaj"}
              </button>
            </>
          )}
        </form>
      </section>
    </Layout>
  );
}
