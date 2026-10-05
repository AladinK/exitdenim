import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Factory, ShieldCheck, Scissors, Truck } from "lucide-react";
import { useSiteAsset } from "@/hooks/useSiteAsset";

export const Route = createFileRoute("/proizvodnja")({
  head: () => ({
    meta: [
      { title: "Proizvodnja · Vlastiti atelje — EXIT Denim" },
      { name: "description", content: "Vlastita proizvodnja EXIT Denim. Tkanine, kroj i finiš pod kontrolom kvaliteta na svakoj seriji muških pantalona." },
      { property: "og:title", content: "Proizvodnja · Vlastiti atelje — EXIT Denim" },
      { property: "og:url", content: "https://exitdenim.shop/proizvodnja" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/proizvodnja" }],
  }),
  component: Proizvodnja,
});

function Proizvodnja() {
  const workshopSrc = useSiteAsset("page_proizvodnja") || useSiteAsset("workshop");
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
            EXIT Denim radi sve u vlastitom pogonu: krojenje, šivenje, pranje i kontrolu kvaliteta. Bez posrednika, bez iznenađenja.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 aspect-[4/3] overflow-hidden bg-secondary">
            <img src={workshopSrc} alt="EXIT Denim atelje" decoding="async" className="w-full h-full object-cover" />
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
