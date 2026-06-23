import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/postani-partner")({
  head: () => ({
    meta: [
      { title: "Postani B2B partner — EXIT Denim" },
      { name: "description", content: "Prijavi butik za EXIT Denim B2B saradnju. Wholesale cijene, brza isporuka u regiji, repeat orders." },
    ],
  }),
  component: Partner,
});

function Partner() {
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-16 md:py-24">
          <div className="eyebrow text-accent">Postani partner</div>
          <h1 className="mt-3 text-5xl md:text-6xl max-w-3xl">Pristup B2B portalu u 24h.</h1>
          <p className="mt-5 text-background/75 max-w-xl leading-relaxed">
            Otvori nalog, popuni podatke o butiku — naš tim provjerava prijavu i šalje veleprodajne cijene, line sheets i preporuku starter paketa.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link to="/auth" className="btn-accent">Otvori nalog <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/katalog" className="btn-outline border-background text-background hover:bg-background hover:text-foreground">Pogledaj katalog</Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid md:grid-cols-2 gap-10">
          <div>
            <div className="eyebrow">Šta dobijaš</div>
            <h2 className="mt-3 text-3xl md:text-4xl">Pun B2B paket</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Pristup veleprodajnim cijenama i stock-u po veličinama",
                "Size matrix narudžbe direktno iz kataloga",
                "Line sheet i kompletan katalog u PDF-u",
                "Media kit: foto, Instagram caption-i, story templates",
                "Personalni wholesale tim — BHS, srpski, engleski",
                "Repeat narudžbe na best-sellere",
              ].map((i) => (
                <li key={i} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 mt-0.5 text-accent shrink-0" /><span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border rounded-sm p-8 bg-card">
            <div className="eyebrow">Uslovi saradnje</div>
            <dl className="mt-4 space-y-4 text-sm">
              {[
                ["Minimalna prva narudžba", "60 komada (Starter paket)"],
                ["MOQ po artiklu", "10–12 kom zavisno od modela"],
                ["Plaćanje", "50% avans, 50% prije slanja"],
                ["Isporuka regija", "5–10 dana"],
                ["Sezone", "2 godišnje + repeat tokom cijele godine"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-muted-foreground">{l}</dt>
                  <dd className="font-semibold text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <Link to="/auth" className="btn-primary w-full mt-6">Otvori B2B nalog</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
