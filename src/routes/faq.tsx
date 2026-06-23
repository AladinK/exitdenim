import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — EXIT Denim B2B Wholesale" },
      { name: "description", content: "Najčešća pitanja za B2B partnere: MOQ, isporuka, plaćanje, povrat, repeat orders." },
    ],
  }),
  component: Faq,
});

const QA: Array<[string, string]> = [
  ["Koji je minimalni iznos prve narudžbe?", "Minimalna prva narudžba je 60 komada (Starter paket). MOQ po artiklu je 10–12 komada zavisno od modela."],
  ["Kako funkcionišu cijene?", "Veleprodajne cijene vidljive su tek nakon odobrenja B2B naloga. Cijene su fiksne po sezoni — bez skrivenih troškova."],
  ["Koliko traje isporuka?", "5–10 dana do Srbije, BiH, Crne Gore, Sjeverne Makedonije, Hrvatske i Slovenije. Grčka i ostatak EU 7–14 dana."],
  ["Mogu li poručiti samo jednu boju u svim veličinama?", "Da. Size matrix omogućava da poručiš tačno koliko komada po svakoj veličini želiš, do raspoloživog stocka."],
  ["Da li radite custom branding?", "Za partnere sa volumenom 500+ kom mjesečno radimo custom tagove i ambalažu. Detalje dogovaramo direktno."],
  ["Kako funkcioniše plaćanje?", "Prva narudžba: 50% avans, 50% prije slanja. Nakon 3 uspješne saradnje prelazimo na fleksibilnije uslove."],
  ["Da li je moguć povrat robe?", "Povrat samo u slučaju proizvodnog defekta, prijava unutar 7 dana od prijema. Stock povrati nisu mogući."],
  ["Da li imate predstavnika u mojoj zemlji?", "Trenutno radimo direktno iz Novog Pazara. Sve komunikacije ide preko wholesale tima na BHS, srpskom i engleskom."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-28">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Frequently Asked</div>
          <h1 className="mt-7 editorial-h text-[clamp(2.5rem,7vw,6rem)] text-background">
            Wholesale <span className="italic">questions</span>.
          </h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="eyebrow">Need more details?</div>
              <p className="mt-5 serif text-2xl leading-tight">
                Wholesale tim odgovara na sva pitanja u <span className="italic">24h</span>.
              </p>
              <Link to="/kontakt" className="btn-outline mt-7">Contact Desk</Link>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="border-t border-foreground">
              {QA.map(([q, a], i) => (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between py-7 text-left gap-4 group"
                  >
                    <span className="serif text-xl md:text-2xl pr-4 group-hover:text-accent transition-colors">{q}</span>
                    {open === i
                      ? <Minus className="w-5 h-5 shrink-0 text-accent" strokeWidth={1.25} />
                      : <Plus className="w-5 h-5 shrink-0" strokeWidth={1.25} />}
                  </button>
                  {open === i && (
                    <p className="pb-7 -mt-2 text-foreground/75 leading-[1.8] max-w-2xl">{a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
