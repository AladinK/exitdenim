import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Factory, ShieldCheck, Scissors, Truck } from "lucide-react";

export const Route = createFileRoute("/proizvodnja")({
  head: () => ({
    meta: [
      { title: "Proizvodnja & Kvalitet — EXIT Denim" },
      { name: "description", content: "Vlastita proizvodnja u Novom Pazaru. Kontrola kvaliteta na svakoj seriji. Tkanine, fit, finiš." },
    ],
  }),
  component: Proizvodnja,
});

function Proizvodnja() {
  return (
    <Layout>
      <section className="bg-secondary border-b border-border">
        <div className="container-x py-16 md:py-24">
          <div className="eyebrow">Proizvodnja & Kvalitet</div>
          <h1 className="mt-3 text-5xl md:text-7xl max-w-3xl">Vlastita proizvodnja u Novom Pazaru</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            EXIT Denim radi sve in-house: krojenje, šivenje, pranje i kontrolu kvaliteta. Bez posrednika, bez iznenađenja.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid md:grid-cols-2 gap-10 items-start">
          <div className="aspect-[4/3] rounded-sm" style={{ background: "linear-gradient(135deg, #1f2a44, #0d0d0d)" }} />
          <div>
            <h2 className="text-3xl md:text-4xl">Zašto kvalitet drži</h2>
            <div className="mt-8 space-y-6">
              {[
                { icon: Factory, t: "In-house proizvodnja", d: "Vlastita radionica u Novom Pazaru. Kontrola svakog koraka." },
                { icon: Scissors, t: "Fit testing", d: "Svaki novi model prolazi kroz tri runde fit testinga prije proizvodnje serije." },
                { icon: ShieldCheck, t: "QC na svakoj seriji", d: "Šavovi, vesh, dimenzije i finiš provjeravaju se prije pakovanja." },
                { icon: Truck, t: "Logistika u regiji", d: "Direktni partner za isporuku — 5–10 dana do svih balkanskih zemalja." },
              ].map((f) => (
                <div key={f.t} className="flex gap-4">
                  <f.icon className="w-6 h-6 mt-1 text-accent shrink-0" />
                  <div>
                    <div className="font-semibold">{f.t}</div>
                    <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-foreground text-background">
        <div className="container-x grid md:grid-cols-3 gap-6 text-center">
          {[
            ["12.5 oz", "Standardna težina denima"],
            ["98/2", "Cotton / Elastane miks"],
            ["3×", "QC kontrole po seriji"],
          ].map(([v, l]) => (
            <div key={l} className="border border-background/20 rounded-sm p-8">
              <div className="text-5xl font-display font-bold text-accent">{v}</div>
              <div className="mt-2 text-sm text-background/70 uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
