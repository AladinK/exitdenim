import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/hero/Hero";

import { getHomeAssets } from "@/lib/site-assets.functions";
import lookbookAsset from "@/assets/lookbook-ss26.png.asset.json";
import catDenim from "@/assets/cat-denim.jpg.asset.json";
import catChino from "@/assets/cat-chino.jpg.asset.json";
import catCargo from "@/assets/cat-cargo.jpg.asset.json";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXIT Denim — B2B деним, чино и карго за бутике" },
      { name: "description", content: "Затворена B2B платформа из Новог Пазара. Премијум мушке панталоне — деним, чино и карго. Стабилни кројеви, поуздана испорука и марже за бутике у региону." },
      { property: "og:title", content: "EXIT Denim — B2B деним, чино и карго за бутике" },
      { property: "og:description", content: "Затворена B2B платформа за бутике. Каталог, цене и поруџбине на једном месту." },
      { property: "og:url", content: "https://exitdenim.shop/" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/" }],
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

function TrustProof() {
  const groups = [
    {
      label: "За квалитет робе",
      items: [
        "Материјал делује озбиљно, види се да није класична јефтина роба.",
        "Ово је оно што бутицима треба — добар крој, стабилан модел и реална цена.",
        "Џинс изгледа јако квалитетно, поготово обрада и штеп.",
        "Код оваквих панталона најбитније је да купац проба и врати се опет. Ово делује као тај ниво.",
        "Модели су комерцијални, баш за радњу која хоће брзу ротацију.",
      ],
    },
    {
      label: "Велепродаја / B2B поверење",
      items: [
        "Одлично за бутике који траже робу са добром маржом и брзим обртом.",
        "Ово је добра понуда за радње које не желе да ризикују са непознатим моделима.",
        "Битно је што имате више линија — jeans, chino и cargo. Лакше је направити комплетну поруџбину.",
        "За велепродају је најважније да су величине стабилне и да може да се допуни роба.",
        "Ако је испорука брза и модели доступни по величинама, ово може лепо да ради у бутику.",
      ],
    },
    {
      label: "Хитност и продаја",
      items: [
        "Овакви модели обично брзо оду у величинама 32, 33 и 34.",
        "Ко ради мушку гардеробу, ово не треба много да чека.",
        "Добар тренутак за бутике да попуне лагер пре сезоне.",
        "Ако је цена велепродајна добра, ово је роба која може одмах у излог.",
        "Cargo и jeans тренутно најбоље иду, поготово овакви неутрални модели.",
      ],
    },
  ];

  const cards = groups.flatMap((g) => g.items.map((text) => ({ label: g.label, text })));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, cards.length - visibleCount);
  const next = useCallback(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);
  const prev = useCallback(() => setIndex((i) => (i <= 0 ? maxIndex : i - 1)), [maxIndex]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  const visible = cards.slice(index, index + visibleCount);
  const padded = visible.length < visibleCount
    ? [...visible, ...cards.slice(0, visibleCount - visible.length)]
    : visible;

  return (
    <section className="section-pad bg-[var(--surface)] overflow-hidden">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">Поверење са тржишта</div>
            <h2 className="mt-4 h2-editorial">Шта кажу бутици и купци</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Реакције са Instagram и Facebook објава — од квалитета материјала до брзине обрта у радњи.
            </p>
          </div>
        </Reveal>

        <div
          className="mt-12 md:mt-16 relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {padded.map((card, i) => (
              <Reveal key={`${index}-${i}`} delay={(i + 1) as 1 | 2 | 3}>
                <div className="relative h-full rounded-sm border border-border bg-background p-7 md:p-8 flex flex-col justify-between min-h-[260px] md:min-h-[280px] transition-all duration-500 hover:shadow-[0_18px_50px_-12px_color-mix(in_oklab,var(--ink)_8%,transparent)]">
                  <Quote className="w-8 h-8 text-accent/40" strokeWidth={1.5} />
                  <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-foreground/90 serif-accent">
                    „{card.text}”
                  </p>
                  <div className="mt-8 pt-5 border-t border-border/60">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-accent font-medium">
                      {card.label}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Прикажи коментар ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-accent" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Претходни коментар"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                aria-label="Следећи коментар"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
      {/* Premium editorial atmosphere: warm cream base + soft indigo halo + hairline grid + fine grain */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[var(--ivory)]" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(70% 55% at 18% 8%, color-mix(in oklab, var(--indigo) 14%, transparent) 0%, transparent 60%)," +
            "radial-gradient(55% 45% at 88% 12%, color-mix(in oklab, var(--brand-green) 16%, transparent) 0%, transparent 55%)," +
            "radial-gradient(50% 40% at 8% 88%, color-mix(in oklab, var(--brand-green-deep) 12%, transparent) 0%, transparent 60%)," +
            "radial-gradient(80% 60% at 50% 100%, color-mix(in oklab, var(--ecru-deep) 55%, transparent) 0%, transparent 65%)",

        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px)," +
            "linear-gradient(to bottom, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 30%, transparent 85%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.08  0 0 0 0 0.09  0 0 0 0 0.12  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />
      <div className="relative z-10">

      <Hero />

      {/* ───────── КАТЕГОРИЈЕ ───────── */}
      <section className="relative py-10 md:py-14">
        <div className="container-x">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { to: "/jeans", label: "ФАРМЕРКЕ", sub: "Стабилан крој. Брз обрт.", img: img("category_jeans") || catDenim.url, tone: "dark" as const },
              { to: "/chino", label: "ЧИНО", sub: "Чист изглед за сваки дан.", img: img("category_chino") || catChino.url, tone: "light" as const },
              { to: "/cargo", label: "КАРГО", sub: "Функционалан модел са јачим карактером.", img: img("category_cargo") || catCargo.url, tone: "dark" as const },
              { to: "/postani-partner", label: "B2B САРАДЊА", sub: "Веле­продаја за бутике.", img: null, tone: "green" as const, cta: "ПОСТАНИТЕ ДЕО EXIT DENIM ПРИЧЕ." },
            ].map((c) => (
              <Reveal key={c.label}>
                <Link
                  to={c.to}
                  className="group relative block overflow-hidden rounded-sm aspect-[3/4] w-full"
                >
                  {c.img ? (
                    <>
                      <img
                        src={c.img}
                        alt={c.label}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      />
                      <div className={`absolute inset-0 ${c.tone === "dark" ? "bg-gradient-to-t from-black/70 via-black/25 to-black/10" : "bg-gradient-to-t from-black/25 via-white/0 to-white/10"}`} />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-[color:var(--brand-green-deep,#4a5a2f)]" />
                  )}
                  <div className={`absolute inset-0 flex flex-col justify-between p-5 md:p-6 ${c.tone === "light" ? "text-[color:var(--ink)]" : "text-white"}`}>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight">{c.label}</h3>
                      <p className={`mt-2 text-[13px] md:text-sm leading-snug max-w-[220px] ${c.tone === "light" ? "text-[color:var(--ink)]/75" : "text-white/85"}`}>
                        {c.sub}
                      </p>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      {c.cta ? (
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] leading-relaxed opacity-90 max-w-[180px]">
                          {c.cta}
                        </p>
                      ) : <span />}
                      <span className="w-9 h-9 flex items-center justify-center text-[color:var(--brand-green,#8aa35a)] transition-transform duration-500 group-hover:translate-x-1">
                        <ArrowRight className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>










      {/* ───────── EDITORIAL BENTO ───────── */}
      <section className="relative">
        <div className="container-x pb-10 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-3 md:gap-4 md:h-[820px] lg:h-[880px]">

            {/* 1. LOOK 01 */}
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
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-3xl md:text-5xl serif-accent italic leading-[1.02]">
                    Нови стандард <br className="hidden md:block" />за бутике.
                  </h3>
                </div>
              </div>
            </Reveal>

            {/* 2. PRINCIP */}
            <Reveal delay={2} className="md:col-span-5 md:row-span-2 h-full min-h-[200px]">
              <div className="relative overflow-hidden rounded-sm border border-border bg-background p-8 md:p-10 flex items-center h-full w-full">
                <p className="serif-accent text-[22px] md:text-[28px] leading-[1.22] text-foreground">
                  Крој који не мора да се брани сваке сезоне.
                </p>
              </div>
            </Reveal>

            {/* 3. STAT */}
            <Reveal delay={2} className="md:col-span-2 md:row-span-2 h-full min-h-[200px]">
              <div className="relative overflow-hidden rounded-sm bg-accent text-accent-foreground p-6 md:p-7 flex flex-col justify-between h-full w-full">
                <div className="w-8 h-px bg-accent-foreground/40" />
                <div>
                  <div className="text-5xl md:text-6xl font-bold tracking-tight tabular-nums leading-none">
                    <CountUp to={10} />
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.22em] leading-relaxed opacity-85 mono">
                    MOQ
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 4. LOOKBOOK */}
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
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="bg-background/90 backdrop-blur-md border border-border px-4 py-2 text-[11px] uppercase tracking-[0.25em] font-semibold serif-accent italic">
                    Лукбук
                  </span>
                </div>
              </div>
            </Reveal>

            {/* 5. CATEGORIES */}
            <Reveal delay={3} className="md:col-span-8 md:row-span-2 h-full min-h-[200px]">
              <div className="relative overflow-hidden rounded-sm bg-[var(--surface)] border border-border p-8 md:p-10 flex items-center h-full w-full">
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
            </Reveal>

            {/* 6. CTA B2B */}
            <Reveal delay={4} className="md:col-span-4 md:row-span-2 h-full min-h-[200px]">
              <Link
                to="/postani-partner"
                className="relative overflow-hidden rounded-sm bg-[var(--ink)] text-white p-8 md:p-10 flex flex-col justify-between group h-full w-full"
              >
                <div className="absolute -top-6 -right-6 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700">
                  <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
                </div>
                <div className="relative z-10 flex items-start justify-end">
                  <div className="w-11 h-11 border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl md:text-[28px] serif-accent leading-[1.1]">
                    Отворите <span className="italic text-accent">B2B</span> налог
                  </h4>
                  <p className="mt-3 text-[13px] text-white/60 leading-relaxed max-w-[240px]">
                    Одговор у 24h.
                  </p>
                </div>
              </Link>
            </Reveal>

          </div>
        </div>
      </section>


      {/* ───────── TRUST PROOF ───────── */}
      <TrustProof />


      {/* ───────── KAKO RADI ───────── */}
      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Од пријаве до испоруке — четири корака.
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-4 gap-x-10 gap-y-12">
            {[
              { n: "01", t: "Пријава", d: "Кратка форма. Одговор у 24h." },
              { n: "02", t: "Одобрење", d: "Активирамо B2B налог и цене." },
              { n: "03", t: "Поруџбина", d: "Бирате моделе и величине." },
              { n: "04", t: "Испорука", d: "Достава 15–25 дана." },
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Атеље у Новом Пазару.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Породични погон. Мале серије, стални тим, директно из погона у бутик.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> MOQ 10</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> 15–25 дана</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" /> Made in Serbia</div>
              </div>
              <div className="mt-8">
                <Link to="/proizvodnja" className="btn-outline">
                  Производња <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>
    </Layout>

  );
}
