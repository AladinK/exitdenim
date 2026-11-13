import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone, Instagram } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },

      { title: "Kontakt — EXIT Denim" },
      { name: "description", content: "Pitanja o veličini, porudžbini ili dostavi? Javite nam se telefonom, preko WhatsApp-a ili Vibera." },
      { property: "og:title", content: "Kontakt — EXIT Denim" },
      { property: "og:description", content: "Pitanja o veličini, porudžbini ili dostavi? Javite nam se telefonom, preko WhatsApp-a ili Vibera." },
      { property: "og:url", content: "https://exitdenim.shop/kontakt" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/kontakt" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "ClothingStore", name: "EXIT Denim", url: "https://exitdenim.shop/kontakt", telephone: "+381653176716", address: { "@type": "PostalAddress", addressCountry: "RS" } }) }],
  }),
  component: Kontakt,
});

function Kontakt() {
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-32">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Kontakt</div>
          <h1 className="mt-7 h1-editorial text-background">
            Tu smo za <span className="italic">sva pitanja</span>.
          </h1>
          <p className="mt-7 text-background/75 max-w-xl leading-relaxed">
            Niste sigurni za veličinu ili kroj? Pišite nam na WhatsApp ili Viber pre porudžbine. Za veleprodaju (butici i prodavnice) pogledajte <Link to="/postani-partner" className="text-accent border-b border-accent/60 hover:border-accent transition-colors">saradnju sa prodavnicama</Link>.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-px">
            {[
              { icon: Phone, label: "Ahmed Kurtanović · Telefon", value: "+381 65 317 6716", href: "tel:+381653176716" },
              { icon: MessageCircle, label: "WhatsApp · Viber", value: "+381 65 317 6716", href: "https://wa.me/381653176716" },
              { icon: Instagram, label: "Instagram", value: "@exit.denim", href: "https://instagram.com/exit.denim" },
              { icon: MapPin, label: "Sedište · TRI-B DOO", value: "Srbija", href: "#" },
            ].map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-6 border border-border bg-card p-6 md:p-7 hover:bg-secondary hover:border-foreground/40 transition-colors group">
                <c.icon className="w-5 h-5 text-accent shrink-0" strokeWidth={1.25} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{c.label}</div>
                  <div className="serif text-xl md:text-2xl mt-1.5 tabular-nums truncate group-hover:text-accent transition-colors">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-foreground p-10">
              <div className="eyebrow">O nama</div>
              <p className="serif text-2xl mt-4 leading-snug">
                EXIT Denim — TRI-B DOO
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Domaći proizvođač farmerki, chino i cargo pantalona. Srbija.
              </p>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="eyebrow">Radno vreme</div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Pon — Pet</dt><dd className="serif text-lg">09:00 — 18:00</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Subota</dt><dd className="serif text-lg">10:00 — 14:00</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Nedelja</dt><dd className="serif text-lg text-muted-foreground">Zatvoreno</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="eyebrow">Jezici</div>
                <div className="mt-3 text-sm text-foreground/80">Srpski · Bosanski · Hrvatski · Engleski</div>
              </div>
              <Link to="/postani-partner" className="btn-primary w-full mt-10">Veleprodaja — prijava prodavnice</Link>
            </div>
          </aside>
        </div>
      </section>

    </Layout>
  );
}
