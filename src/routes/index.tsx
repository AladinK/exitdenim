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
      {/* ───────── BENTO HERO ───────── */}
      <section className="relative overflow-hidden gradient-mesh">
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <Seal tone="green" opacity={0.05} className="pointer-events-none absolute -right-32 -top-32 w-[560px] h-[560px] hidden md:block" />
        <div className="container-x relative py-10 md:py-16">
          <Reveal>
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <span className="chip">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Нова SS · Пријаве отворене
                </span>
                <h1 className="mt-4 text-[clamp(1.75rem,4.2vw,2.75rem)] leading-[1.05] tracking-tight font-bold max-w-2xl">
                  B2B платформа за <span className="serif-accent italic text-accent">премијум деним</span>.
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mono">
                <span>Нови Пазар</span><span className="h-3 w-px bg-border" /><span>RS</span>
              </div>
            </div>
          </Reveal>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(160px,auto)] gap-4">

            {/* 1. HERO CARD — 2×2 */}
            <Reveal delay={1}>
              <div className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-2xl border border-border bg-[var(--ink)] text-white group min-h-[420px] lg:min-h-full">
                <img src={img("hero", heroImg.url)} alt={alt("hero", "EXIT Denim SS кампања")}
                  fetchPriority="high" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/85">
                    <span>SS · LOOK 01</span>
                    <span className="mono">EX-101 · SLIM</span>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.02] max-w-[14ch]">
                      Деним створен за <span className="serif-accent italic text-accent">бутике</span>.
                    </h2>
                    <p className="mt-3 text-white/75 max-w-md text-sm md:text-base">
                      Каталог, велепродајне цене и матрица величина — за одобрене партнере.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <Link to="/postani-partner" className="btn-accent">
                        Затражите приступ <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link to="/katalog" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white">
                        Каталог
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 2. LOCKED CATALOG — 2×1 */}
            <Reveal delay={2}>
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-[var(--surface)] p-6 group hover:-translate-y-0.5 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl border border-foreground/15 flex items-center justify-center text-accent shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="mono text-[10px] tracking-[0.25em] text-muted-foreground">01 · ЗАТВОРЕН КАТАЛОГ</div>
                    <h3 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight">Цене видљиве само одобреним партнерима.</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground max-w-md">Јавно: прича бренда. B2B: цене, матрица, поруџбине.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 3. LOOKBOOK — 1×2 tall (new upload) */}
            <Reveal delay={3}>
              <div className="lg:row-span-2 relative overflow-hidden rounded-2xl border border-border bg-secondary group min-h-[420px]">
                <img src={lookbookImg.url} alt="EXIT Denim — карго крој, лукбук" loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/90">
                  <span>Лукбук</span>
                  <span className="mono">LOOK 04</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-sm font-semibold">Карго · Taupe</div>
                  <div className="text-[11px] text-white/80 mono">100% памук · стрејч</div>
                </div>
              </div>
            </Reveal>

            {/* 4. STATS — 1×1 */}
            <Reveal delay={2}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-5 hover:-translate-y-0.5 transition-transform">
                <div className="mono text-[10px] tracking-[0.25em] text-muted-foreground">Партнери</div>
                <div className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  <CountUp to={180} suffix="+" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">бутика у региону</div>
                <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-2 text-[11px] mono">
                  <div><span className="text-foreground font-bold text-base"><CountUp to={12} />+</span><div className="text-muted-foreground">година</div></div>
                  <div><span className="text-foreground font-bold text-base"><CountUp to={98} />%</span><div className="text-muted-foreground">тачност</div></div>
                </div>
              </div>
            </Reveal>

            {/* 5. FARMERKE — 1×1 */}
            <Reveal delay={3}>
              <Link to="/katalog" className="relative overflow-hidden rounded-2xl border border-border bg-secondary group block min-h-[220px]">
                <img src={img("category_jeans", productJeans.url)} alt={alt("category_jeans", "Фармерке")} loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/80 mono">Категорија</div>
                  <div className="mt-1 text-xl font-semibold">Фармерке →</div>
                  <div className="text-[11px] text-white/70">12oz · slim, regular</div>
                </div>
              </Link>
            </Reveal>

            {/* 6. CHINO — 1×1 */}
            <Reveal delay={4}>
              <Link to="/katalog" className="relative overflow-hidden rounded-2xl border border-border bg-secondary group block min-h-[220px]">
                <img src={img("category_chino", productChino.url)} alt={alt("category_chino", "Чино")} loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/80 mono">Категорија</div>
                  <div className="mt-1 text-xl font-semibold">Чино →</div>
                  <div className="text-[11px] text-white/70">Памук стрејч · класичан</div>
                </div>
              </Link>
            </Reveal>

            {/* 7. CTA GREEN — 2×1 */}
            <Reveal delay={2}>
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-accent text-[var(--ink)] p-6 group hover:-translate-y-0.5 transition-transform">
                <Seal tone="ink" opacity={0.08} className="pointer-events-none absolute -right-10 -bottom-10 w-56 h-56" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="mono text-[10px] tracking-[0.25em] opacity-70">Одговор у 24h</div>
                    <h3 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight leading-tight max-w-md">
                      Отворите B2B налог за <span className="serif-accent italic">свој бутик</span>.
                    </h3>
                    <p className="mt-2 text-sm opacity-80 max-w-sm">MOQ 10 ком · Испорука 15–25 дана · Марже 2.4–2.8×</p>
                  </div>
                  <Link to="/postani-partner" className="shrink-0 inline-flex items-center gap-2 bg-[var(--ink)] text-white px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-[var(--ink)]/90 transition-colors">
                    Пријава <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* 8. QUOTE — 1×1 */}
            <Reveal delay={3}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-5">
                <div className="mono text-[10px] tracking-[0.25em] text-muted-foreground">Партнер</div>
                <p className="mt-3 serif-accent italic text-[17px] leading-snug text-foreground">
                  „Кројеви који се не мењају из сезоне у сезону. Купци се враћају."
                </p>
                <div className="mt-4 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-foreground text-background text-[11px] font-semibold flex items-center justify-center">М·В</span>
                  <div className="text-xs">
                    <div className="font-semibold">Милан В.</div>
                    <div className="text-muted-foreground">Бутик · Београд</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 9. CARGO — 1×1 */}
            <Reveal delay={4}>
              <Link to="/katalog" className="relative overflow-hidden rounded-2xl border border-border bg-secondary group block min-h-[220px]">
                <img src={img("category_cargo", productCargo.url)} alt={alt("category_cargo", "Карго")} loading="lazy" decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/80 mono">Категорија</div>
                  <div className="mt-1 text-xl font-semibold">Карго →</div>
                  <div className="text-[11px] text-white/70">Утилитарно · функционално</div>
                </div>
              </Link>
            </Reveal>

            {/* 10. VALUES STRIP — 2×1 */}
            <Reveal delay={2}>
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-[var(--surface)] p-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Truck, t: "15–25 дана", d: "Испорука" },
                    { icon: ShieldCheck, t: "Гаранција", d: "14 дана замене" },
                    { icon: Sparkles, t: "Line-sheet", d: "PDF на клик" },
                  ].map((v) => (
                    <div key={v.t} className="flex items-start gap-2.5 min-w-0">
                      <v.icon className="w-4 h-4 text-accent shrink-0 mt-1" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{v.t}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{v.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

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
