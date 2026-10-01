import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/postani-partner")({
  head: () => ({
    meta: [
      { title: "Partnerski program — EXIT Denim B2B" },
      { name: "description", content: "Prijavite butik za EXIT Denim B2B partnerstvo. Odobravamo veleprodaju buticima, onlajn prodavcima i distributerima u regionu." },
      { property: "og:title", content: "Partnerski program — EXIT Denim B2B" },
      { property: "og:url", content: "https://exitdenim.shop/postani-partner" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/postani-partner" }],
  }),
  component: Partner,
});

function Partner() {
  return (
    <Layout>
      <section className="bg-foreground text-background relative overflow-hidden">
        <div className="container-x py-20 md:py-32 relative">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Po prijavi · Privatni B2B šourum</div>
          <h1 className="mt-7 h1-editorial max-w-4xl text-background">
            Partnerski program<br/>
            <span className="italic font-light text-background/85">EXIT Denim</span>
          </h1>
          <p className="mt-8 text-background/75 max-w-xl leading-relaxed">
            Pristup veleprodajnom katalogu odobravamo buticima, onlajn prodavcima i distributerima koji žele stabilnu denim ponudu — bez skakanja cena i bez skrivenih troškova.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="eyebrow">Šta dobijate</div>
            <h2 className="mt-5 h2-editorial">
              Kompletan <span className="italic">partnerski paket</span>.
            </h2>
            <ul className="mt-8 space-y-4 text-[15px]">
              {[
                "Pristup veleprodajnim cenama i stanju po veličinama",
                "Matrica veličina — porudžbina direktno iz kataloga",
                "Lajn-šit i kompletan katalog u PDF-u",
                "Medija kit: foto, Instagram caption-i, story šabloni",
                "Lični wholesale tim — srpski, bosanski, hrvatski, engleski",
                "Ponovne porudžbine best-sellera",
              ].map((i) => (
                <li key={i} className="flex gap-3 items-start border-b border-border pb-4">
                  <Check className="w-4 h-4 mt-1.5 text-accent shrink-0" strokeWidth={1.5} />
                  <span className="text-foreground/85 leading-relaxed">{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-foreground p-10">
              <div className="eyebrow">Uslovi saradnje</div>
              <h3 className="mt-4 serif text-3xl">Uslovi kuće</h3>
              <dl className="mt-8 divide-y divide-border">
                {[
                  ["Minimum prve porudžbine", "60 kom (Starter paket)"],
                  ["MOQ po artiklu", "10–12 kom"],
                  ["Plaćanje", "50% avans · 50% pre otpreme"],
                  ["Regionalna isporuka", "5 – 10 dana"],
                  ["Sezone", "2 godišnje + ponovne porudžbine"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between gap-4 py-4">
                    <dt className="text-sm text-muted-foreground">{l}</dt>
                    <dd className="serif text-lg text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/auth" className="btn-primary w-full mt-8">
                Otvori B2B nalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground text-center">
                Odobrenje naloga u roku 24 sata
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
