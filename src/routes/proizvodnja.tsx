import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Factory, ShieldCheck, Scissors, Truck } from "lucide-react";
import { useSiteAssets } from "@/hooks/useSiteAsset";
import { EcoProduction } from "@/components/EcoProduction";
import { BRAND_HISTORY_TEXT, EXPORT_TEXT, MANUFACTURING, organizationSchema } from "@/lib/brand";
import { b2bLanguageLinks } from "@/lib/b2b-english";

export const Route = createFileRoute("/proizvodnja")({
  head: () => ({
    meta: [
      { title: "O brendu i proizvodnji u Novom Pazaru — EXIT Denim" },
      { name: "description", content: "EXIT Denim, osnovan 1991. u Novom Pazaru: 35 zaposlenih, oko 5.000 komada jeansa mesečno, izvoz u EU i region i Jeanologia laserska obrada." },
      { property: "og:title", content: "O brendu i proizvodnji u Novom Pazaru — EXIT Denim" },
      { property: "og:description", content: "Od 1991. u Novom Pazaru. Oko 5.000 komada jeansa mesečno, 35 zaposlenih i izvoz u zemlje EU i bivše Jugoslavije." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://www.exit.fashion/proizvodnja" },
    ],
    links: [{ rel: "canonical", href: "https://www.exit.fashion/proizvodnja" }, ...b2bLanguageLinks("/proizvodnja", "/en/manufacturing")],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(organizationSchema) }],
  }),
  component: Proizvodnja,
});

function Proizvodnja() {
  const assets = useSiteAssets();
  const workshopSrc = assets["page_proizvodnja"]?.url || assets["workshop"]?.url || "";
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-32">
          <Link to="/en/manufacturing" lang="en" hrefLang="en" className="inline-block mb-6 text-sm underline underline-offset-4">English · Manufacturing</Link>
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Novi Pazar · Od 1991.</div>
          <h1 className="mt-7 h1-editorial max-w-4xl text-background">
            EXIT Denim.<br/> <span className="italic">Proizvodnja u Novom Pazaru.</span>
          </h1>
          <p className="mt-8 text-lg text-background/75 max-w-2xl leading-relaxed">
            {BRAND_HISTORY_TEXT} Naš ekološki pristup uključuje lasersku tehnologiju španske kompanije Jeanologia.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 aspect-[4/3] overflow-hidden bg-secondary">
            {workshopSrc && <img src={workshopSrc} alt="EXIT Denim atelje" decoding="async" className="w-full h-full object-cover" />}
          </div>
          <div className="lg:col-span-5">
            <div className="eyebrow">Čime se kvalitet drži</div>
            <h2 className="mt-5 h2-editorial">Šta drži kvalitet.</h2>
            <div className="mt-10 space-y-7">
              {[
                { icon: Factory, t: "Proizvodnja u Novom Pazaru", d: "Save Kovačevića 31b, Novi Pazar, Srbija." },
                { icon: Scissors, t: "Proizvodnja jeansa", d: "U proseku oko 5.000 komada mesečno. Količine i rokovi za vašu kolekciju potvrđuju se dogovorom." },
                { icon: ShieldCheck, t: "Sertifikacija", d: "Za informacije o sertifikaciji relevantnoj za vašu kolekciju kontaktirajte EXIT." },
                { icon: Truck, t: "Izvoz u EU i region", d: EXPORT_TEXT },
              ].map((f) => (
                <div key={f.t} className="flex gap-5 pb-7 border-b border-border last:border-0 last:pb-0">
                  <f.icon className="w-5 h-5 mt-1 text-accent shrink-0" strokeWidth={1.25} />
                  <div>
                    <div className="serif text-xl">{f.t}</div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EcoProduction />

      <section className="container-x py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl tracking-normal">Jeanologia: tehnologija za savremeni denim</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg tracking-normal">Precizna laserska obrada</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">Laser omogućava kreiranje efekata i detalja na teksasu preciznom obradom površine. Jeanologia ovu tehnologiju razvija kao alternativu pojedinim tradicionalnim postupcima završne obrade.</p>
          </div>
          <div>
            <h3 className="text-lg tracking-normal">Odgovorniji pristup procesu</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">Izbor ove tehnologije deo je našeg pristupa odgovornijoj proizvodnji. Prema Jeanologia, laserska obrada može zameniti pojedine agresivne postupke i poboljšati uticaj procesa na životnu sredinu. Primena i efekti zavise od konkretne obrade.</p>
          </div>
        </div>
        <a href="https://www.jeanologia.com/garment/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm underline underline-offset-4">O tehnologiji na zvaničnom Jeanologia sajtu</a>
      </section>

      <section className="bg-foreground text-background border-t border-background/10">
        <div className="container-x py-24">
          <div className="grid md:grid-cols-3 gap-px bg-background/10">
            {[
              ["1991", "Godina osnivanja brenda"],
              [MANUFACTURING.averageMonthlyJeans.toLocaleString("sr-RS"), "Komada jeansa mesečno u proseku"],
              [String(MANUFACTURING.employees), "Zaposlenih"],
            ].map(([v, l]) => (
              <div key={l} className="bg-foreground p-10 text-center">
                <div className="serif text-6xl text-accent tabular-nums">{v}</div>
                <div className="mt-4 text-[11px] uppercase tracking-[0.28em] text-background/65">{l}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link to="/postani-partner" className="btn-accent">Postanite partner</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
