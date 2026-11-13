import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },

      { title: "Česta pitanja o kupovini — EXIT Denim" },
      { name: "description", content: "Cene, plaćanje pouzećem, besplatna dostava, veličine i popust — sve što treba da znate pre kupovine." },
      { property: "og:title", content: "Česta pitanja o kupovini — EXIT Denim" },
      { property: "og:description", content: "Cene, plaćanje pouzećem, besplatna dostava, veličine i popust — sve što treba da znate pre kupovine." },
      { property: "og:url", content: "https://exitdenim.shop/faq" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/faq" }],
  }),
  component: Faq,
});

const QA: Array<[string, string]> = [
  ["Koliko koštaju farmerke?", "Farmerke i chino pantalone koštaju 5.990 din, a cargo džeparke 7.500 din."],
  ["Kako se plaća?", "Plaćate pouzećem, kuriru kada paket stigne. Bez kartice i bez plaćanja unapred."],
  ["Koliko košta dostava?", "Dostava je besplatna za sve porudžbine po celoj Srbiji."],
  ["Kada stiže paket?", "Porudžbinu šaljemo u roku od 1–2 radna dana, a kurir obično isporučuje dan ili dva posle slanja."],
  ["Koje veličine imate?", "31, 32, 33, 34, 36, 38 i 40. Tabela veličina je na strani svakog proizvoda."],
  ["Da li moram da napravim nalog?", "Ne. Poručujete bez registracije, samo upišete ime, adresu, telefon i e-mail."],
  ["Šta ako nisam siguran za veličinu?", "Pišite nam na WhatsApp ili Viber +381 65 317 6716 pre porudžbine i preporučićemo vam broj i kroj."],
  ["Šta ako mi veličina ne odgovara?", "Javite nam se na WhatsApp ili Viber i dogovorićemo rešenje."],
  ["Kako da iskoristim popust?", "Za prijavljene kupce u meniju je dostupna opcija „Osvojite popust“. Točak se otvara samo kada je sami izaberete, a osvojeni popust se primenjuje u korpi."],
  ["Da li prodajete i na veliko?", "Da. Butici i prodavnice mogu da se prijave na strani „Postani partner“. Uslovi veleprodaje razlikuju se od kupovine na sajtu."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-28">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Često postavljana pitanja</div>
          <h1 className="mt-7 h1-editorial text-background">
            Pitanja o <span className="italic">kupovini</span>.
          </h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="eyebrow">Treba vam više detalja?</div>
              <p className="mt-5 serif text-2xl leading-tight">
                Pitajte nas, odgovaramo u roku od <span className="italic">24h</span>. Više o krojevima i održavanju pročitajte u <Link to="/vodic-za-farmerke" className="underline">vodiču za farmerke</Link>.
              </p>
              <Link to="/kontakt" className="btn-outline mt-7">Kontaktirajte nas</Link>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="border-t border-foreground">
              {QA.map(([q, a], i) => (
                <div key={i} className="border-b border-border">
                  <Button variant="ghost"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i} aria-controls={`faq-answer-${i}`}
                    className="exit-faq-question w-full h-auto flex items-center justify-between py-5 text-left gap-4 group whitespace-normal"
                  >
                    <span className="serif text-xl md:text-2xl pr-4 group-hover:text-accent transition-colors">{q}</span>
                    {open === i
                      ? <Minus className="w-5 h-5 shrink-0 text-accent" strokeWidth={1.25} />
                      : <Plus className="w-5 h-5 shrink-0" strokeWidth={1.25} />}
                  </Button>
                  {open === i && (
                    <p id={`faq-answer-${i}`} className="pb-7 text-foreground/75 leading-[1.8] max-w-2xl">{a}</p>
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
