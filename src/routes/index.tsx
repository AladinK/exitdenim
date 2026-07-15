import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Quote, ChevronRight } from "lucide-react";
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
      {/* Quiet ivory canvas — no colored halos, no grid, no noise. COS/Tom Ford calm. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[var(--ivory)]" />
      <div className="relative z-10">

      <Hero />

      {/* ───────── КАТЕГОРИЈЕ — editorial lookbook, labels under image ───────── */}
      <section className="relative pt-20 md:pt-32 pb-8 md:pb-12">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10 md:mb-16">
            <div className="eyebrow">Колекција</div>
            <Link to="/katalog" className="text-[11px] uppercase tracking-[0.22em] link-underline text-foreground/70 hover:text-foreground">
              Погледајте све
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {[
              { to: "/jeans", label: "Фармерке", num: "01", img: img("category_jeans") },
              { to: "/chino", label: "Чино", num: "02", img: img("category_chino") },
              { to: "/cargo", label: "Карго", num: "03", img: img("category_cargo") },
              { to: "/postani-partner", label: "B2B", num: "04", img: null },
            ].map((c) => (
              <Reveal key={c.label}>
                <Link to={c.to} className="group block">
                  <div className="relative overflow-hidden aspect-[3/4] w-full bg-[var(--ecru)]">
                    {c.img ? (
                      <img
                        src={c.img}
                        alt={c.label}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="serif-accent italic text-6xl text-foreground/15">B2B</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="mono text-[10px] tracking-[0.22em] text-muted-foreground">{c.num}</div>
                      <div className="mt-1 text-[13px] uppercase tracking-[0.18em] font-medium">{c.label}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-foreground/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-foreground" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ───────── BEST SELLERS — quiet editorial grid ───────── */}
      {bestSellers.length > 0 && (
        <section className="pt-24 md:pt-40 pb-12 md:pb-20">
          <div className="container-x">
            <Reveal>
              <div className="flex items-end justify-between gap-6 flex-wrap mb-14 md:mb-20">
                <div className="max-w-xl">
                  <div className="eyebrow">Издвојено</div>
                  <h2 className="mt-5 h2-editorial">Најпродаванији модели</h2>
                </div>
                <Link to="/katalog" className="text-[11px] uppercase tracking-[0.22em] link-underline text-foreground/70 hover:text-foreground">
                  Цео каталог
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-10 md:gap-y-24">
              {bestSellers.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(4, i + 1) as 1 | 2 | 3 | 4}>
                  <div className="group flex flex-col h-full">
                    <Link
                      to="/proizvod/$slug"
                      params={{ slug: p.slug! }}
                      className="relative block aspect-[3/4] overflow-hidden bg-[var(--ecru)]"
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name!}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-foreground/5" />
                      )}
                    </Link>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">{p.sku}</div>
                        <Link to="/proizvod/$slug" params={{ slug: p.slug! }} className="serif-accent text-[17px] mt-1.5 leading-tight block hover:opacity-70 transition-opacity">
                          {p.name}
                        </Link>
                      </div>
                      <div className="text-[13px] tabular-nums shrink-0 text-foreground/80">
                        {Number(p.retail).toLocaleString("sr-RS")} <span className="text-muted-foreground">дин</span>
                      </div>
                    </div>
                    <div className="mt-5">
                      <QuickBuy product={p} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ───────── EDITORIAL SPREAD — full-bleed image + quiet text ───────── */}
      <section className="relative pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-10 items-end">
            <Reveal delay={1} className="md:col-span-8">
              <div className="relative overflow-hidden aspect-[4/5] md:aspect-[16/11] bg-[var(--ecru)] group">
                {img("hero") && (
                  <img
                    src={img("hero")}
                    alt={alt("hero", "EXIT Denim SS кампања")}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.02]"
                  />
                )}
              </div>
            </Reveal>
            <Reveal delay={2} className="md:col-span-4">
              <div className="mono text-[10px] tracking-[0.28em] text-muted-foreground uppercase">Look 01 — SS26</div>
              <p className="mt-6 serif-accent italic text-[26px] md:text-[32px] leading-[1.15] text-foreground">
                Крој који не мора да се брани сваке сезоне.
              </p>
              <p className="mt-6 text-[14px] text-muted-foreground leading-relaxed">
                Ткања бирана за држање облика. Штепови и рубови изведени за поновни повратак у радњу.
              </p>
              <Link to="/katalog" className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] link-underline">
                Погледајте колекцију <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Reveal>
          </div>

          {/* Second spread — reversed, quiet lookbook */}
          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-10 items-center">
            <Reveal delay={1} className="md:col-span-4 md:order-1 order-2">
              <div className="mono text-[10px] tracking-[0.28em] text-muted-foreground uppercase">Look 02 — Лукбук</div>
              <p className="mt-6 serif-accent italic text-[26px] md:text-[32px] leading-[1.15]">
                Тихо луксуз. Без метафора.
              </p>
              <Link to="/postani-partner" className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] link-underline">
                Отворите B2B налог <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Reveal>
            <Reveal delay={2} className="md:col-span-8 md:order-2 order-1">
              <div className="relative overflow-hidden aspect-[4/5] md:aspect-[16/11] bg-[var(--ecru)] group">
                {img("lookbook") && (
                  <img
                    src={img("lookbook")}
                    alt={alt("lookbook", "Карго крој — лукбук")}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.02]"
                  />
                )}
              </div>
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
