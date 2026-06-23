import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/postani-partner")({
  head: () => ({
    meta: [
      { title: "Apply for EXIT Denim B2B Partnership" },
      { name: "description", content: "Pristup veleprodajnom katalogu odobravamo butik partnerima, online prodavcima i distributerima koji žele stabilnu denim ponudu." },
    ],
  }),
  component: Partner,
});

function Partner() {
  return (
    <Layout>
      {/* HERO */}
      <section className="bg-foreground text-background relative overflow-hidden">
        <div className="container-x py-20 md:py-32 relative">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">By application · Private B2B Showroom</div>
          <h1 className="mt-7 editorial-h text-[clamp(2.5rem,7vw,6.5rem)] max-w-4xl text-background">
            Apply for EXIT Denim<br/>
            <span className="italic font-light text-background/85">B2B Partnership</span>
          </h1>
          <p className="mt-8 text-background/75 max-w-xl leading-relaxed">
            Pristup veleprodajnom katalogu odobravamo butik partnerima, online prodavcima i distributerima koji žele stabilnu denim ponudu.
          </p>
        </div>
      </section>

      {/* TWO COLUMN */}
      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          {/* Left — what you get */}
          <div className="lg:col-span-5">
            <div className="eyebrow">What you receive</div>
            <h2 className="mt-5 editorial-h text-4xl">
              The complete <span className="italic">partner package</span>.
            </h2>
            <ul className="mt-8 space-y-4 text-[15px]">
              {[
                "Pristup veleprodajnim cijenama i stock-u po veličinama",
                "Size matrix narudžbe direktno iz kataloga",
                "Line sheet i kompletan katalog u PDF-u",
                "Media kit: foto, Instagram caption-i, story templates",
                "Personalni wholesale tim — BHS, srpski, engleski",
                "Repeat narudžbe na best-sellere",
              ].map((i) => (
                <li key={i} className="flex gap-3 items-start border-b border-border pb-4">
                  <Check className="w-4 h-4 mt-1.5 text-accent shrink-0" strokeWidth={1.5} />
                  <span className="text-foreground/85 leading-relaxed">{i}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — application terms + CTA */}
          <div className="lg:col-span-7">
            <div className="border border-foreground p-10">
              <div className="eyebrow">Cooperation terms</div>
              <h3 className="mt-4 serif text-3xl">House conditions</h3>
              <dl className="mt-8 divide-y divide-border">
                {[
                  ["First order minimum", "60 pcs (Starter pack)"],
                  ["MOQ per article", "10–12 pcs"],
                  ["Payment", "50% advance · 50% before shipping"],
                  ["Regional delivery", "5 – 10 days"],
                  ["Seasons", "2/year + continuous repeat"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between gap-4 py-4">
                    <dt className="text-sm text-muted-foreground">{l}</dt>
                    <dd className="serif text-lg text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/auth" className="btn-primary w-full mt-8">
                Open B2B Account <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground text-center">
                Account approval within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
