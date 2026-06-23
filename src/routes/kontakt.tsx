import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — EXIT Denim Wholesale" },
      { name: "description", content: "Kontakt EXIT Denim wholesale tima. Novi Pazar, Srbija. Email, WhatsApp, Viber." },
    ],
  }),
  component: Kontakt,
});

function Kontakt() {
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-16 md:py-24">
          <div className="eyebrow text-accent">Kontakt</div>
          <h1 className="mt-3 text-5xl md:text-7xl">Pričajmo o saradnji</h1>
          <p className="mt-5 text-background/75 max-w-xl">
            Najbrži način: pošalji <Link to="/postani-partner" className="text-accent underline">B2B prijavu</Link>.
            Za sve ostalo — javi se direktno.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid md:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              { icon: Mail, label: "Email", value: "wholesale@exitdenim.rs" },
              { icon: MessageCircle, label: "WhatsApp / Viber", value: "+381 6X XXX XXXX" },
              { icon: Phone, label: "Telefon", value: "+381 6X XXX XXXX" },
              { icon: MapPin, label: "Adresa", value: "Novi Pazar, Srbija" },
            ].map((c) => (
              <div key={c.label} className="flex gap-4 border border-border rounded-sm p-5 bg-card">
                <c.icon className="w-5 h-5 mt-0.5 text-accent shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="font-semibold mt-1">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-foreground rounded-sm p-8 flex flex-col justify-between">
            <div>
              <div className="eyebrow">Radno vrijeme</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span>Pon — Pet</span><span className="font-semibold">09:00 — 18:00</span></div>
                <div className="flex justify-between"><span>Subota</span><span className="font-semibold">10:00 — 14:00</span></div>
                <div className="flex justify-between"><span>Nedjelja</span><span className="text-muted-foreground">Zatvoreno</span></div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/postani-partner" className="btn-primary w-full">Zatraži B2B pristup</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
