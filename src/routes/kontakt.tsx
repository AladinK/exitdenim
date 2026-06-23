import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Contact — EXIT Denim Wholesale Desk" },
      { name: "description", content: "Kontakt EXIT Denim wholesale tima. Novi Pazar, Srbija. Email, WhatsApp, Viber." },
    ],
  }),
  component: Kontakt,
});

function Kontakt() {
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-32">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Wholesale Desk</div>
          <h1 className="mt-7 editorial-h text-[clamp(2.75rem,8vw,7rem)] text-background">
            Let's talk <span className="italic">partnership</span>.
          </h1>
          <p className="mt-7 text-background/75 max-w-xl leading-relaxed">
            Najbrži put: <Link to="/postani-partner" className="text-accent border-b border-accent/60 hover:border-accent transition-colors">B2B prijava</Link>.
            Za sve ostalo — javi se direktno wholesale timu.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-px">
            {[
              { icon: Mail, label: "Wholesale Email", value: "wholesale@exitdenim.rs", href: "mailto:wholesale@exitdenim.rs" },
              { icon: MessageCircle, label: "WhatsApp · Viber", value: "+381 6X XXX XXXX", href: "https://wa.me/3816xxxxxxxx" },
              { icon: Phone, label: "Office", value: "+381 6X XXX XXXX", href: "tel:+3816xxxxxxxx" },
              { icon: MapPin, label: "Showroom", value: "Novi Pazar, Srbija", href: "#" },
            ].map((c) => (
              <a key={c.label} href={c.href} className="flex items-center gap-6 border border-border bg-card p-7 hover:bg-secondary transition-colors group">
                <c.icon className="w-5 h-5 text-accent shrink-0" strokeWidth={1.25} />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{c.label}</div>
                  <div className="serif text-2xl mt-1 group-hover:text-accent transition-colors">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-foreground p-10">
              <div className="eyebrow">Office hours</div>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Pon — Pet</dt><dd className="serif text-lg">09:00 — 18:00</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Subota</dt><dd className="serif text-lg">10:00 — 14:00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Nedjelja</dt><dd className="serif text-lg text-muted-foreground">Zatvoreno</dd>
                </div>
              </dl>
              <div className="mt-10 pt-6 border-t border-border">
                <div className="eyebrow">Languages</div>
                <div className="mt-3 text-sm text-foreground/80">BHS · Srpski · English</div>
              </div>
              <Link to="/postani-partner" className="btn-primary w-full mt-10">Apply for Partnership</Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
