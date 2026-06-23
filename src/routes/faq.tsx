import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — EXIT Denim B2B" },
      { name: "description", content: "Najčešća pitanja za B2B partnere: MOQ, isporuka, plaćanje, povrat, repeat orders." },
    ],
  }),
  component: Faq,
});

const QA = [
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
      <section className="bg-secondary border-b border-border">
        <div className="container-x py-16 md:py-20">
          <div className="eyebrow">FAQ</div>
          <h1 className="mt-3 text-5xl md:text-6xl">Najčešća pitanja</h1>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <div className="border-t border-border">
            {QA.map(([q, a], i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left gap-4"
                >
                  <span className="font-semibold text-base md:text-lg">{q}</span>
                  {open === i ? <Minus className="w-5 h-5 shrink-0" /> : <Plus className="w-5 h-5 shrink-0" />}
                </button>
                {open === i && <p className="pb-6 text-muted-foreground leading-relaxed">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
