import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { getMyProfile } from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/cekanje")({
  head: () => ({ meta: [{ title: "Nalog na čekanju — EXIT Denim" }] }),
  component: Cekanje,
});

function Cekanje() {
  const fetchProfile = useServerFn(getMyProfile);
  const [status, setStatus] = useState<string>("pending");
  const [boutique, setBoutique] = useState<string>("");

  useEffect(() => {
    fetchProfile({}).then((r) => {
      if (r.profile) {
        setStatus(r.profile.status);
        setBoutique(r.profile.boutique_name || "");
      }
    });
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (status === "approved") {
    return (
      <Layout>
        <section className="section-pad">
          <div className="container-x max-w-2xl text-center">
            <h1 className="text-4xl md:text-5xl">B2B nalog je odobren ✓</h1>
            <p className="mt-4 text-muted-foreground">
              Sada možeš vidjeti veleprodajne cijene i poslati narudžbu.
            </p>
            <Link to="/katalog" className="btn-primary mt-8 inline-flex">Otvori katalog</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-pad">
        <div className="container-x max-w-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-secondary inline-flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl">
            {status === "rejected" ? "Prijava nije odobrena" : "Nalog čeka odobrenje"}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {status === "rejected"
              ? "Trenutno ne možemo odobriti ovaj nalog. Za više informacija kontaktiraj nas direktno."
              : `${boutique ? boutique + " — " : ""}Naš tim provjerava B2B prijavu i javlja se na tvoj email u roku 24h.`}
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/kontakt" className="btn-outline">Kontakt</Link>
            <button onClick={signOut} className="btn-primary inline-flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Odjavi se
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
