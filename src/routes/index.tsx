import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Lock, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { Seal } from "@/components/Seal";
import { getHomeAssets } from "@/lib/site-assets.functions";
import heroImg from "@/assets/exit-hero-poster.png.asset.json";
import workshopImg from "@/assets/exit-atelier.png.asset.json";
import productJeans from "@/assets/exit-lifestyle-jeans.png.asset.json";
import productChino from "@/assets/exit-chino-navy.png.asset.json";
import productCargo from "@/assets/exit-chino-taupe.png.asset.json";
import lookbookImg from "@/assets/exit-lookbook-cargo.png.asset.json";

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
  const img = (k: string, fb: string) => assets[k]?.url || fb;
  const alt = (k: string, fb: string) => assets[k]?.alt || fb;

  return (
    <Layout>
      {/* ───────── EDITORIAL HERO ───────── */}
      <section className="relative">
        <div className="container-x pt-10 md:pt-16 pb-8 md:pb-12">
          <Reveal>
            <div className="flex items-center justify-between gap-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mono">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> SS · 2026
              </span>
              <span>Нови Пазар — RS</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-10 md:mt-14 h1-editorial max-w-[16ch]">
              Деним створен за <span className="serif-accent italic text-accent">бутике</span>.
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/postani-partner" className="btn-accent">
                Затражите приступ <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/katalog" className="text-sm uppercase tracking-[0.2em] font-medium link-underline">
                Каталог
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── MINIMAL BENTO ───────── */}
      <section className="relative">
        <div className="container-x pb-10 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-3 md:gap-4">

            {/* 1. HERO IMAGE — 2×2, silent */}
            <Reveal delay={1}>
              <div className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-sm bg-secondary group min-h-[420px] lg:min-h-full">
                <img src={img("hero", heroImg.url)} alt={alt("hero", "EXIT Denim SS кампања")}
                  fetchPriority="high" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/90 mix-blend-difference">
                  <span>Look 01</span>
                  <span className="mono">EX-101</span>
                </div>
              </div>
            </Reveal>

            {/* 2. LOOKBOOK — 1×2 tall */}
            <Reveal delay={2}>
              <div className="lg:row-span-2 relative overflow-hidden rounded-sm bg-secondary group min-h-[420px]">
                <img src={lookbookImg.url} alt="Карго крој — лукбук" loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/90 mix-blend-difference">
                  <span>Лукбук</span>
                  <span className="mono">04</span>
                </div>
              </div>
            </Reveal>

            {/* 3. STATS — 1×1 */}
            <Reveal delay={2}>
              <div className="relative overflow-hidden rounded-sm border border-border bg-background p-5 flex flex-col justify-between min-h-[220px]">
                <div className="mono text-[10px] tracking-[0.25em] text-muted-foreground">Партнери</div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold tracking-tight tabular-nums">
                    <CountUp to={180} suffix="+" />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">бутика у региону</div>
                </div>
              </div>
            </Reveal>

            {/* 4. QUOTE — 1×1 */}
            <Reveal delay={3}>
              <div className="relative overflow-hidden rounded-sm border border-border bg-background p-5 flex flex-col justify-between min-h-[220px]">
                <p className="serif-accent italic text-[18px] leading-snug text-foreground">
                  „Кројеви који се не мењају из сезоне у сезону."
                </p>
                <div className="text-[11px] mono uppercase tracking-[0.22em] text-muted-foreground">Милан В. · Београд</div>
              </div>
            </Reveal>

            {/* 5. FARMERKE */}
            <Reveal delay={3}>
              <Link to="/katalog" className="group block">
                <div className="relative overflow-hidden rounded-sm bg-secondary aspect-[4/5]">
                  <img src={img("category_jeans", productJeans.url)} alt={alt("category_jeans", "Фармерке")} loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div className="text-sm font-medium tracking-tight">Фармерке</div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>

            {/* 6. CHINO */}
            <Reveal delay={4}>
              <Link to="/katalog" className="group block">
                <div className="relative overflow-hidden rounded-sm bg-secondary aspect-[4/5]">
                  <img src={img("category_chino", productChino.url)} alt={alt("category_chino", "Чино")} loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div className="text-sm font-medium tracking-tight">Чино</div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>

            {/* 7. CARGO */}
            <Reveal delay={4}>
              <Link to="/katalog" className="group block">
                <div className="relative overflow-hidden rounded-sm bg-secondary aspect-[4/5]">
                  <img src={img("category_cargo", productCargo.url)} alt={alt("category_cargo", "Карго")} loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div className="text-sm font-medium tracking-tight">Карго</div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>

            {/* 8. CTA — silent card */}
            <Reveal delay={4}>
              <Link to="/postani-partner" className="relative overflow-hidden rounded-sm bg-[var(--ink)] text-white p-6 flex flex-col justify-between group aspect-[4/5] md:aspect-auto md:min-h-[220px]">
                <div className="mono text-[10px] tracking-[0.25em] text-white/60">Одговор у 24h</div>
                <div>
                  <div className="text-xl font-semibold tracking-tight leading-tight">
                    Отворите <span className="serif-accent italic text-accent">B2B</span> налог
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/90">
                    Пријава <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
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


          {/* logo strip */}
          <div className="mt-10 border-t border-b border-border">
            <div className="py-4 flex flex-nowrap overflow-x-auto md:flex-wrap items-center justify-start md:justify-between gap-y-3 gap-x-8 text-[10.5px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium scrollbar-none">
              <span className="shrink-0">Поверење партнера</span>
              <span className="shrink-0">Београд</span>
              <span className="shrink-0">Сарајево</span>
              <span className="shrink-0">Подгорица</span>
              <span className="shrink-0">Скопље</span>
              <span className="shrink-0">Загреб</span>
              <span className="shrink-0">Љубљана</span>
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
              <img src={img("workshop", workshopImg.url)} alt={alt("workshop", "EXIT Denim атеље у Новом Пазару")} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
