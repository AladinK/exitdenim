import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone, Instagram } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Контакт — EXIT Denim Wholesale" },
      { name: "description", content: "Контакт EXIT Denim wholesale тима. Нови Пазар, Србија. E-mail, WhatsApp, Viber." },
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
          <h1 className="mt-7 h1-editorial text-background">
            Разговор о <span className="italic">сарадњи</span>.
          </h1>
          <p className="mt-7 text-background/75 max-w-xl leading-relaxed">
            Најбржи пут: <Link to="/postani-partner" className="text-accent border-b border-accent/60 hover:border-accent transition-colors">B2B пријава</Link>.
            За све остало — јавите се директно wholesale тиму.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-px">
            {[
              { icon: Phone, label: "Беким Куртановић · Wholesale", value: "+381 65 370 1701", href: "tel:+381653701701" },
              { icon: MessageCircle, label: "WhatsApp · Viber", value: "+381 65 370 1701", href: "https://wa.me/381653701701" },
              { icon: Instagram, label: "Instagram", value: "@exit.denim", href: "https://instagram.com/exit.denim" },
              { icon: MapPin, label: "Шоурум · TRI-B DOO", value: "Нови Пазар, Србија", href: "#" },
            ].map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-6 border border-border bg-card p-7 hover:bg-secondary transition-colors group">
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
              <div className="eyebrow">Wholesale Department</div>
              <p className="serif text-2xl mt-4 leading-snug">
                EXIT Denim — TRI-B DOO
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Direct manufacturer of denim, chino and cargo trousers. Нови Пазар, Србија.
              </p>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="eyebrow">Радно време</div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Пон — Пет</dt><dd className="serif text-lg">09:00 — 18:00</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Субота</dt><dd className="serif text-lg">10:00 — 14:00</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Недеља</dt><dd className="serif text-lg text-muted-foreground">Затворено</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="eyebrow">Језици</div>
                <div className="mt-3 text-sm text-foreground/80">Српски · Босански · Хрватски · English</div>
              </div>
              <Link to="/postani-partner" className="btn-primary w-full mt-10">Пријава за партнерство</Link>
            </div>
          </aside>
        </div>
      </section>

    </Layout>
  );
}
