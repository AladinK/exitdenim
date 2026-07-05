import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/hero/Hero";
import { FadeUp, RevealLines } from "@/components/RevealText";

import { getHomeAssets } from "@/lib/site-assets.functions";
import lookbookAsset from "@/assets/lookbook-ss26.png.asset.json";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXIT Denim — Премијум B2B платформа за бутике" },
      { name: "description", content: "Затворена B2B платформа за деним, чино и карго панталоне. Стабилни кројеви, поуздана испорука и марже за бутике у региону." },
      { property: "og:title", content: "EXIT Denim — Премијум B2B платформа" },
      { property: "og:description", content: "Затворена B2B платформа за бутике. Каталог, цене и поруџбине на једном месту." },
    ],
  }),
  component: HomePage,
});

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}{suffix}</>;
}

function HomePage() {
  const fetchAssets = useServerFn(getHomeAssets);
  const [assets, setAssets] = useState<Record<string, { url: string; alt: string | null }>>({});
  useEffect(() => { fetchAssets({}).then(setAssets).catch(() => {}); }, []); // eslint-disable-line
  const fallbacks: Record<string, string> = { lookbook: lookbookAsset.url };
  const img = (k: string) => assets[k]?.url || fallbacks[k] || "";
  const alt = (k: string, fb: string) => assets[k]?.alt || fb;


  return (
    <Layout>
      {/* ───────── SIGNATURE WEBGL HERO ───────── */}
      <Hero />



      {/* ───────── EDITORIAL BENTO — 12-col ───────── */}
      <section className="relative">
        <div className="container-x pb-10 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-3 md:gap-4 md:h-[820px] lg:h-[880px]">

            {/* 1. LOOK 01 — dominant editorial 7×4 */}
            <Reveal delay={1} className="md:col-span-7 md:row-span-4 h-full min-h-[420px]">
              <div className="relative overflow-hidden rounded-sm bg-secondary group h-full w-full">
                {img("hero") && (
                  <img
                    src={img("hero")}
                    alt={alt("hero", "EXIT Denim SS кампања")}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/90 mono">
                  <span>Look 01</span>
                  <span>EX-101</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="mono text-[10px] tracking-[0.3em] opacity-80">SS · 2026</div>
                  <h3 className="mt-2 text-3xl md:text-5xl serif-accent italic leading-[1.02]">
                    Нови стандард <br className="hidden md:block" />за бутике.
                  </h3>
                </div>
              </div>
            </Reveal>

            {/* 2. PRINCIP ATELJEA — не лажни цитат, него принцип производње */}
            <Reveal delay={2} className="md:col-span-5 md:row-span-2 h-full min-h-[200px]">
              <div className="relative overflow-hidden rounded-sm border border-border bg-background p-8 md:p-10 flex flex-col justify-center h-full w-full">
                <div className="mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Принцип атељеа
                </div>
                <p className="mt-5 serif-accent text-[22px] md:text-[26px] leading-[1.22] text-foreground">
                  Крој који не мора да се брани сваке сезоне.
                </p>
                <p className="mt-4 text-[13px] leading-[1.55] text-muted-foreground max-w-[42ch]">
                  Радимо у малим серијама, са сталним тимом. Модел који је ушао у каталог
                  остаје — усавршава се, не мења без разлога.
                </p>
              </div>
            </Reveal>

            {/* 3. STAT — реалан број, не vanity metric */}
            <Reveal delay={2} className="md:col-span-2 md:row-span-2 h-full min-h-[200px]">
              <div className="relative overflow-hidden rounded-sm bg-accent text-accent-foreground p-6 md:p-7 flex flex-col justify-between h-full w-full">
                <div className="w-8 h-px bg-accent-foreground/40" />
                <div>
                  <div className="text-5xl md:text-6xl font-bold tracking-tight tabular-nums leading-none">
                    <CountUp to={10} />
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.22em] leading-relaxed opacity-85 mono">
                    MOQ<br />по моделу
                  </p>
                </div>
              </div>
            </Reveal>


            {/* 4. LOOKBOOK 04 — 3×2 */}
            <Reveal delay={3} className="md:col-span-3 md:row-span-2 h-full min-h-[200px]">
              <div className="relative overflow-hidden rounded-sm bg-secondary group h-full w-full">
                {img("lookbook") && (
                  <img
                    src={img("lookbook")}
                    alt={alt("lookbook", "Карго крој — лукбук")}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                )}

                <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-white/90 mono mix-blend-difference">
                  Лукбук 04
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="bg-background/90 backdrop-blur-md border border-border px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-semibold serif-accent italic">
                    Погледајте
                  </span>
                </div>
              </div>
            </Reveal>

            {/* 5. CATEGORIES — 8×2 editorial row */}
            <Reveal delay={3} className="md:col-span-8 md:row-span-2 h-full min-h-[200px]">
              <div className="relative overflow-hidden rounded-sm bg-[var(--surface)] border border-border p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 h-full w-full">
                <div className="space-y-5 min-w-0">
                  <div className="mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground font-semibold">
                    Колекције
                  </div>
                  <div className="flex flex-wrap gap-x-8 md:gap-x-12 gap-y-2">
                    <Link to="/katalog" className="group relative text-3xl md:text-4xl serif-accent transition-all hover:italic">
                      Фармерке
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
                    </Link>
                    <Link to="/katalog" className="group relative text-3xl md:text-4xl serif-accent transition-all hover:italic">
                      Чино
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
                    </Link>
                    <Link to="/katalog" className="group relative text-3xl md:text-4xl serif-accent italic text-accent">
                      Карго
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block w-px h-16 bg-border shrink-0" />
                <div className="hidden md:block text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mono leading-relaxed">
                    Одабрано<br />за сезону
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 6. CTA B2B — 4×2 ink */}
            <Reveal delay={4} className="md:col-span-4 md:row-span-2 h-full min-h-[200px]">
              <Link
                to="/postani-partner"
                className="relative overflow-hidden rounded-sm bg-[var(--ink)] text-white p-8 md:p-10 flex flex-col justify-between group h-full w-full"
              >
                <div className="absolute -top-6 -right-6 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700">
                  <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
                </div>
                <div className="relative z-10 flex items-start justify-between">
                  <div className="mono text-[10px] tracking-[0.3em] text-white/60 uppercase">Одговор у 24h</div>
                  <div className="w-11 h-11 border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl md:text-[28px] serif-accent leading-[1.1]">
                    Отворите <span className="italic text-accent">B2B</span> налог
                  </h4>
                  <p className="mt-3 text-[12px] text-white/55 leading-relaxed max-w-[240px]">
                    Приступ каталогу, B2B ценама и line-sheet PDF-у.
                    Пријава без обавезе куповине.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] pb-1 border-b border-white/20 group-hover:border-accent transition-colors">
                      Пријава
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>



          </div>

          {/* meta strip */}
          <div className="mt-10 md:mt-14 border-t border-border">
            <div className="py-5 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-[10px] md:text-[11px] mono uppercase tracking-[0.22em] text-muted-foreground">
              <div>MOQ · 10 ком</div>
              <div>Испорука · 15–25 дана</div>
              <div>Марже · 2.4–2.8×</div>
              <div className="md:text-right">Line-sheet · PDF</div>
            </div>
          </div>

          {/* delivery area — службено подручје испоруке, не листа референци */}
          <div className="mt-10 border-t border-b border-border">
            <div className="py-4 flex flex-nowrap overflow-x-auto md:flex-wrap items-center justify-start md:justify-between gap-y-3 gap-x-8 text-[10.5px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium scrollbar-none">
              <span className="shrink-0">Испорука · регион</span>
              <span className="shrink-0">Србија</span>
              <span className="shrink-0">БиХ</span>
              <span className="shrink-0">Црна Гора</span>
              <span className="shrink-0">С. Македонија</span>
              <span className="shrink-0">Хрватска</span>
              <span className="shrink-0">Словенија</span>
            </div>
          </div>

        </div>
      </section>


      {/* ───────── KAKO RADI ───────── */}
      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <div className="max-w-2xl">
              <span className="eyebrow">Како функционише</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                Од пријаве до прве испоруке — четири корака.
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-4 gap-x-10 gap-y-12">
            {[
              { n: "01", t: "Пријава", d: "Кратка форма. Одговор у 24h." },
              { n: "02", t: "Одобрење", d: "Активирамо B2B налог и цене." },
              { n: "03", t: "Поруџбина", d: "Бирате моделе и величине." },
              { n: "04", t: "Испорука", d: "Контрола и достава 15–25 дана." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={Math.min(4, i + 1) as 1 | 2 | 3 | 4}>
                <div className="border-t border-foreground/15 pt-5">
                  <div className="mono text-[11px] tracking-[0.2em] text-muted-foreground">{s.n}</div>
                  <h3 className="mt-6 text-xl font-medium tracking-tight">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ATELIER ───────── */}
      <section className="section-pad bg-[var(--surface)]">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-border aspect-[4/5]">
              {img("workshop") ? (
                <img src={img("workshop")} alt={alt("workshop", "EXIT Denim атеље у Новом Пазару")} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary" />
              )}

            </div>
          </Reveal>
          <Reveal delay={1}>
            <div>
              <span className="eyebrow">Атеље · Нови Пазар</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                Породични погон. Прецизан крој. Одговорност на сваком пару.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Радимо у малим серијама, са сталним тимом кројача и контролором квалитета.
                Без агената, без посредника — директно из погона у ваш бутик.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> MOQ 10 комада</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Испорука 15–25 дана</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Произведено у Србији</div>
              </div>
              <div className="mt-8">
                <Link to="/proizvodnja" className="btn-outline">
                  Више о производњи <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
