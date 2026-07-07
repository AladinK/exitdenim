import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Често постављана питања — EXIT Denim B2B" },
      { name: "description", content: "Одговори на најчешћа питања B2B партнера: MOQ, испорука, начини плаћања, повраћај робе и поновне сезонске поруџбине." },
      { property: "og:title", content: "Често постављана питања — EXIT Denim B2B" },
      { property: "og:url", content: "https://exitdenim.shop/faq" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/faq" }],
  }),
  component: Faq,
});

const QA: Array<[string, string]> = [
  ["Који је минимални износ прве поруџбине?", "Минимална прва поруџбина је 60 комада (Стартер пакет). MOQ по артиклу је 10–12 комада, зависно од модела."],
  ["Како функционишу цене?", "Велепродајне цене видљиве су тек након одобрења B2B налога. Цене су фиксне по сезони — без скривених трошкова."],
  ["Колико траје испорука?", "5–10 дана до Србије, БиХ, Црне Горе, Северне Македоније, Хрватске и Словеније. Грчка и остатак ЕУ 7–14 дана."],
  ["Могу ли поручити само једну боју у свим величинама?", "Да. Матрица величина омогућава да поручите тачно колико комада по свакој величини желите, до расположивог стања."],
  ["Радите ли custom брендинг?", "За партнере са волуменом 500+ ком месечно радимо custom етикете и амбалажу. Детаље договарамо директно."],
  ["Како функционише плаћање?", "Прва поруџбина: 50% аванс, 50% пре слања. Након 3 успешне сарадње прелазимо на флексибилније услове."],
  ["Да ли је могућ повраћај робе?", "Повраћај само у случају производног недостатка, пријава у року 7 дана од пријема. Stock повраћаји нису могући."],
  ["Имате ли представника у мојој земљи?", "Тренутно радимо директно из Новог Пазара. Сва комуникација иде преко wholesale тима на српском, босанском, хрватском и енглеском."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-28">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Често постављана питања</div>
          <h1 className="mt-7 h1-editorial text-background">
            Wholesale <span className="italic">питања</span>.
          </h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="eyebrow">Треба вам више детаља?</div>
              <p className="mt-5 serif text-2xl leading-tight">
                Wholesale тим одговара на сва питања у <span className="italic">24h</span>.
              </p>
              <Link to="/kontakt" className="btn-outline mt-7">Контактирајте нас</Link>
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
