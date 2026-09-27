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
      { title: "EXIT Denim — мушке фармерке, чино и карго панталоне" },
      { name: "description", content: "Премијум мушке фармерке, чино и карго панталоне из Новог Пазара. Плаћање поузећем, достава широм Србије." },
      { property: "og:title", content: "EXIT Denim — мушке фармерке, чино и карго панталоне" },
      { property: "og:description", content: "Премијум мушке фармерке, чино и карго панталоне из Новог Пазара. Плаћање поузећем, достава широм Србије." },
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
    fetchProducts({}).then((p) => setBestSellers(p.slice(0, 8))).catch(() => {});
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
      <section className="relative pt-6 pb-2 md:py-14">
        <div className="container-x">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { to: "/jeans", label: "ФАРМЕРКЕ", sub: "Кројеви који стоје како треба.", img: img("category_jeans"), tone: "dark" as const },
              { to: "/chino", label: "ЧИНО", sub: "Чист изглед за сваки дан.", img: img("category_chino"), tone: "dark" as const },
              { to: "/cargo", label: "КАРГО", sub: "Функционалан модел са јачим карактером.", img: img("category_cargo"), tone: "dark" as const },
              { to: "/katalog", label: "СВИ МОДЕЛИ", sub: "Цела колекција на једном месту.", img: null, tone: "green" as const, cta: "ПЛАЋАЊЕ ПОУЗЕЋЕМ" },
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
                      <div className={`absolute inset-0 ${c.tone === "dark" ? "bg-gradient-to-b from-black/65 via-black/10 to-black/35" : "bg-gradient-to-t from-black/25 via-white/0 to-white/10"}`} />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-[color:var(--brand-green-deep,#4a5a2f)]" />
                  )}
                  <div className={`absolute inset-0 flex flex-col justify-between p-5 md:p-6 ${(c.tone as string) === "light" ? "text-[color:var(--ink)]" : "text-white"}`}>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight">{c.label}</h3>
                      <p className={`mt-2 text-[13px] md:text-sm leading-snug max-w-[220px] ${(c.tone as string) === "light" ? "text-[color:var(--ink)]/75" : "text-white/85"}`}>
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
        <section className="py-10 md:py-20">
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
                <Link to="/katalog" className="btn-outline hidden md:inline-flex">
                  Цео каталог <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 -mx-[1.125rem] px-[1.125rem] scroll-px-[1.125rem] flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible">
              {bestSellers.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(4, i + 1) as 1 | 2 | 3 | 4} className="snap-start shrink-0 w-[70%] sm:w-[45%] md:w-auto">
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


      {/* ───────── ИЗАБЕРИ КРОЈ ───────── */}
      <section className="py-12 md:py-20 border-t border-border">
        <div className="container-x">
          <div className="eyebrow">Пронађи свој крој</div>
          <h2 className="mt-3 h2-editorial">Прво крој. Онда модел.</h2>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { t: "Slim", d: "Уже кроз бутину и ногавицу." },
              { t: "Regular Slim", d: "Удобно горе, сужено доле." },
              { t: "Relaxed", d: "Више простора, опуштен пад." },
              { t: "Cargo", d: "Функционални џепови, јачи карактер." },
            ].map((f) => (
              <Link key={f.t} to="/katalog" className="group border border-border p-5 hover:border-foreground transition-colors">
                <div className="text-lg font-semibold">{f.t}</div>
                <p className="mt-2 text-[13px] text-muted-foreground leading-snug">{f.d}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-medium">
                  Погледај <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ЗАШТО EXIT ───────── */}
      <section className="py-12 md:py-20 bg-[var(--surface)]">
        <div className="container-x grid md:grid-cols-3 gap-8">
          {[
            { t: "Плаћање поузећем", d: "Плаћате куриру тек када примите пакет." },
            { t: "Достава широм Србије", d: "500 дин · бесплатна за поруџбине преко 15.000 дин." },
            { t: "Произведено у Србији", d: "Сопствени погон у Новом Пазару." },
          ].map((s) => (
            <div key={s.t} className="border-t border-foreground/20 pt-5">
              <Check className="w-4 h-4 text-accent" />
              <h3 className="mt-3 text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="container-x mt-10">
          <Link to="/katalog" className="btn-primary w-full sm:w-auto">
            Купи колекцију <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      </div>
    </Layout>

  );
}
