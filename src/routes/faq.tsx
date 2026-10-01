import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Često postavljana pitanja — EXIT Denim B2B" },
      { name: "description", content: "Odgovori na najčešća pitanja B2B partnera: MOQ, isporuka, načini plaćanja, povraćaj robe i ponovne sezonske porudžbine." },
      { property: "og:title", content: "Često postavljana pitanja — EXIT Denim B2B" },
      { property: "og:url", content: "https://exitdenim.shop/faq" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/faq" }],
  }),
  component: Faq,
});

const QA: Array<[string, string]> = [
  ["Koji je minimalni iznos prve porudžbine?", "Minimalna prva porudžbina je 60 komada (Starter paket). MOQ po artiklu je 10–12 komada, zavisno od modela."],
  ["Kako funkcionišu cene?", "Veleprodajne cene vidljive su tek nakon odobrenja B2B naloga. Cene su fiksne po sezoni — bez skrivenih troškova."],
  ["Koliko traje isporuka?", "5–10 dana do Srbije, BiH, Crne Gore, Severne Makedonije, Hrvatske i Slovenije. Grčka i ostatak EU 7–14 dana."],
  ["Mogu li poručiti samo jednu boju u svim veličinama?", "Da. Matrica veličina omogućava da poručite tačno koliko komada po svakoj veličini želite, do raspoloživog stanja."],
  ["Radite li custom brending?", "Za partnere sa volumenom 500+ kom mesečno radimo custom etikete i ambalažu. Detalje dogovaramo direktno."],
  ["Kako funkcioniše plaćanje?", "Prva porudžbina: 50% avans, 50% pre slanja. Nakon 3 uspešne saradnje prelazimo na fleksibilnije uslove."],
  ["Da li je moguć povraćaj robe?", "Povraćaj samo u slučaju proizvodnog nedostatka, prijava u roku 7 dana od prijema. Stock povraćaji nisu mogući."],
  ["Imate li predstavnika u mojoj zemlji?", "Trenutno radimo direktno iz Novog Pazara. Sva komunikacija ide preko wholesale tima na srpskom, bosanskom, hrvatskom i engleskom."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-28">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Često postavljana pitanja</div>
          <h1 className="mt-7 h1-editorial text-background">
            Wholesale <span className="italic">pitanja</span>.
          </h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="eyebrow">Treba vam više detalja?</div>
              <p className="mt-5 serif text-2xl leading-tight">
                Wholesale tim odgovara na sva pitanja u <span className="italic">24h</span>.
              </p>
              <Link to="/kontakt" className="btn-outline mt-7">Kontaktirajte nas</Link>
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
