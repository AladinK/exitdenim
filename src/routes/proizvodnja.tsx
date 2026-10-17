import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Factory, ShieldCheck, Scissors, Truck } from "lucide-react";
import { useSiteAssets } from "@/hooks/useSiteAsset";
import { EcoProduction } from "@/components/EcoProduction";

export const Route = createFileRoute("/proizvodnja")({
  head: () => ({
    meta: [
      { title: "Proizvodnja · Vlastiti atelje — EXIT Denim" },
      { name: "description", content: "EXIT Denim proizvodnja u Srbiji: ekološki pristup obradi denima uz inovativnu lasersku tehnologiju španske kompanije Jeanologia." },
      { property: "og:title", content: "Proizvodnja · Vlastiti atelje — EXIT Denim" },
      { property: "og:description", content: "Proizvodnja u Srbiji i ekološki pristup završnoj obradi denima uz Jeanologia lasersku tehnologiju." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://exitdenim.shop/proizvodnja" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/proizvodnja" }],
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
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Atelje · Made in Serbia</div>
          <h1 className="mt-7 h1-editorial max-w-4xl text-background">
            Proizvodnja. <span className="italic">Poštene tkanine</span>.<br/>
            Skrojeni krojevi.
          </h1>
          <p className="mt-8 text-lg text-background/75 max-w-2xl leading-relaxed">
            EXIT Denim radi sve u vlastitom pogonu: krojenje, šivenje, pranje i kontrolu kvaliteta. Naš ekološki pristup uključuje inovativnu lasersku tehnologiju španske kompanije Jeanologia.
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
                { icon: Factory, t: "In-house proizvodnja", d: "Vlastita radionica. Kontrola svakog koraka." },
                { icon: Scissors, t: "Test kroja", d: "Svaki novi model prolazi kroz tri runde testiranja kroja pre proizvodnje serije." },
                { icon: ShieldCheck, t: "QC na svakoj seriji", d: "Šavovi, pranje, dimenzije i finiš proveravaju se pre pakovanja." },
                { icon: Truck, t: "Logistika u regionu", d: "Direktni partner za isporuku — 5–10 dana do svih balkanskih zemalja." },
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
              ["12.5 oz", "Standardna težina denima"],
              ["98 / 2", "Pamuk · Elastan"],
              ["3 ×", "QC po seriji"],
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
