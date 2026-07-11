import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Quote, ChevronRight, Flame } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/hero/Hero";
import { QuickBuy } from "@/components/QuickBuy";

import { getHomeAssets } from "@/lib/site-assets.functions";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXIT Denim — B2B деним, чино и карго за бутике" },
      { name: "description", content: "Затворена B2B платформа из Новог Пазара. Премијум мушке панталоне — деним, чино и карго. Стабилни кројеви, поуздана испорука и марже за бутике у региону." },
      { property: "og:title", content: "EXIT Denim — B2B деним, чино и карго за бутике" },
      { property: "og:description", content: "Затворена B2B платформа из Новог Пазара. Премијум мушке панталоне — деним, чино и карго. Стабилни кројеви, поуздана испорука и марже за бутике у региону." },
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

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeGroup, setActiveGroup] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % groups[0].items.length);
      if (isMobile) {
        setActiveGroup((g) => (g + 1) % groups.length);
      }
    }, 4500);
    return () => clearInterval(id);
  }, [paused, isMobile, groups.length]);

  const goTo = (g: number) => {
    setActiveGroup(g);
  };

  const visibleGroups = isMobile ? [groups[activeGroup]] : groups;

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
          className="mt-12 md:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {visibleGroups.map((g, i) => (
              <div
                key={g.label}
                className="relative h-full rounded-sm border border-border bg-background p-7 md:p-8 flex flex-col justify-between min-h-[260px] md:min-h-[300px] transition-all duration-500 hover:shadow-[0_18px_50px_-12px_color-mix(in_oklab,var(--ink)_8%,transparent)]"
              >
                <Quote className="w-8 h-8 text-accent/40" strokeWidth={1.5} />
                <p
                  key={quoteIndex}
                  className="mt-6 text-[17px] md:text-[19px] leading-relaxed text-foreground/90 serif-accent animate-fade-in"
                >
                  „{g.items[quoteIndex]}”
                </p>
                <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-accent font-medium">
                    {g.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground mono">
                    {String(quoteIndex + 1).padStart(2, "0")}/{String(g.items.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex md:hidden items-center gap-2">
              {groups.map((g, i) => (
                <button
                  key={g.label}
                  onClick={() => goTo(i)}
                  aria-label={`Прикажи групу ${g.label}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeGroup ? "w-8 bg-accent" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3 text-[12px] text-muted-foreground mono">
              <span className="w-24 h-1 rounded-full bg-foreground/10 overflow-hidden">
                <span
                  key={quoteIndex}
                  className="block h-full bg-accent origin-left animate-[scale-x_4.5s_linear_forwards]"
                  style={{ animationName: "scale-x" }}
                />
              </span>
              <span>Картице се мењају сваких 4.5s</span>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-muted-foreground mono">
              <span className="md:hidden">{String(quoteIndex + 1).padStart(2, "0")}/{String(groups[0].items.length).padStart(2, "0")}</span>
              <button
                onClick={() => setQuoteIndex((i) => (i + 1) % groups[0].items.length)}
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
  const fetchProducts = useServerFn(listProducts);
  const [assets, setAssets] = useState<Record<string, { url: string; alt: string | null }>>({});
  const [bestSellers, setBestSellers] = useState<ProductWithStock[]>([]);
  useEffect(() => {
    fetchAssets({}).then(setAssets).catch(() => {});
    fetchProducts({}).then((p) => setBestSellers(p.slice(0, 4))).catch(() => {});
  }, []); // eslint-disable-line
  const img = (k: string) => assets[k]?.url || "";
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
              { to: "/jeans", label: "ФАРМЕРКЕ", sub: "Стабилан крој. Брз обрт.", img: img("category_jeans"), tone: "dark" as const },
              { to: "/chino", label: "ЧИНО", sub: "Чист изглед за сваки дан.", img: img("category_chino"), tone: "light" as const },
              { to: "/cargo", label: "КАРГО", sub: "Функционалан модел са јачим карактером.", img: img("category_cargo"), tone: "dark" as const },
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

      {/* ───────── BEST SELLERS ───────── */}
      {bestSellers.length > 0 && (
        <section className="section-pad">
          <div className="container-x">
            <Reveal>
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div className="max-w-xl">
                  <div className="eyebrow flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-accent" /> Најпродаванији модели
                  </div>
                  <h2 className="mt-4 h2-editorial">Топ избор ове сезоне</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Модели који најбрже одлазе — изаберите величину и додајте у корпу у једном клику.
                  </p>
                </div>
                <Link to="/katalog" className="btn-outline">
                  Цео каталог <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(4, i + 1) as 1 | 2 | 3 | 4}>
                  <div className="group flex flex-col h-full">
                    <Link
                      to="/proizvod/$slug"
                      params={{ slug: p.slug! }}
                      className="relative block aspect-[3/4] overflow-hidden bg-secondary"
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name!}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-foreground/5" />
                      )}
                      {i === 0 && (
                        <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
                          №1
                        </span>
                      )}
                    </Link>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.sku} · {p.fit}</div>
                        <Link to="/proizvod/$slug" params={{ slug: p.slug! }} className="serif text-lg mt-1 leading-tight block hover:text-accent transition-colors">
                          {p.name}
                        </Link>
                      </div>
                      <div className="serif text-lg tabular-nums shrink-0">
                        {Number(p.retail).toLocaleString("sr-RS")} <span className="text-xs text-muted-foreground">дин</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <QuickBuy product={p} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}


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
