import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Lock, Package, Truck, ShieldCheck, BarChart3, Sparkles, Globe2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { Seal } from "@/components/Seal";
import { getHomeAssets } from "@/lib/site-assets.functions";
import heroImg from "@/assets/hero-banner.jpg.asset.json";
import workshopImg from "@/assets/workshop.jpg.asset.json";
import productJeans from "@/assets/product-ex-101.jpg.asset.json";
import productChino from "@/assets/product-ex-201.jpg.asset.json";
import productCargo from "@/assets/product-ex-301.jpg.asset.json";

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

function HomePage() {
  return (
    <Layout>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden gradient-mesh">
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <Seal tone="green" opacity={0.06} className="pointer-events-none absolute -right-24 -top-24 w-[520px] h-[520px] hidden md:block" />
        <div className="container-x relative pt-10 pb-16 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <Reveal>
                <span className="chip">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Нова SS · Пријаве отворене
                </span>
              </Reveal>
              <Reveal delay={1}>
                <h1 className="mt-5 text-[clamp(2.4rem,8.5vw,4.75rem)] leading-[1.02]">
                  B2B платформа за{" "}
                  <span className="serif-accent text-accent">премијум деним</span>,
                  створена за бутике.
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="mt-5 max-w-xl text-[15px] md:text-lg text-muted-foreground leading-relaxed">
                  Каталог, велепродајне цене, матрица величина и поруџбине — све на једном месту.
                  Стабилни кројеви, испорука 15–25 дана.
                </p>
              </Reveal>
              <Reveal delay={3}>
                <div className="mt-7 grid grid-cols-1 sm:flex sm:flex-wrap gap-2.5">
                  <Link to="/postani-partner" className="btn-primary justify-center">
                    Затражите B2B приступ <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/katalog" className="btn-outline justify-center">
                    Погледајте каталог
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={4}>
                <div className="mt-8 grid grid-cols-1 sm:flex sm:flex-wrap items-start sm:items-center gap-x-8 gap-y-2 text-[13px] md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent shrink-0" /> MOQ 10 комада</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent shrink-0" /> Испорука 15–25 дана</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent shrink-0" /> Произведено у Србији</div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <Reveal delay={2}>
                <div className="relative aspect-[4/5] overflow-hidden border border-border shadow-2xl shadow-navy/10 bg-secondary">
                  <img src={heroImg.url} alt="EXIT Denim премијум деним" className="w-full h-full object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
                  {/* Brand corner mark on the image itself */}
                  <div className="absolute top-4 left-4 text-white/85">
                    <div className="text-[10px] uppercase tracking-[0.3em] font-medium">EXIT Denim</div>
                    <div className="mono text-[10px] opacity-70 mt-1">SS · LOOK 01</div>
                  </div>
                  {/* Inline spec card pinned inside the frame so it never clips on mobile */}
                  <div className="absolute left-3 right-3 bottom-3 md:left-4 md:right-auto md:w-[260px] card-soft p-3.5 md:p-4 backdrop-blur-md bg-background/95">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="mono">EX-101 · SLIM</span>
                      <span className="flex items-center gap-1 text-accent font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> На стању
                      </span>
                    </div>
                    <div className="mt-1.5 text-[13px] md:text-base font-semibold">12oz деним · тамно индиго</div>
                    <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
                      {["30", "32", "34"].map((s) => (
                        <div key={s} className="bg-secondary py-1.5 text-[11px] font-medium mono">{s}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* logo strip */}
        <div className="border-y border-border bg-background/60">
          <div className="container-x py-4 md:py-5 flex flex-nowrap overflow-x-auto md:flex-wrap items-center justify-start md:justify-between gap-y-3 gap-x-6 md:gap-x-8 text-[10.5px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium scrollbar-none">
            <span className="shrink-0">Поверење партнера</span>
            <span className="shrink-0">Београд</span>
            <span className="shrink-0">Сарајево</span>
            <span className="shrink-0">Подгорица</span>
            <span className="shrink-0">Скопље</span>
            <span className="shrink-0">Загреб</span>
            <span className="shrink-0">Љубљана</span>
          </div>
        </div>
      </section>


      {/* ───────── ВРЕДНОСТИ ───────── */}
      <section className="section-pad relative">
        <Seal tone="green" opacity={0.05} className="pointer-events-none absolute right-6 top-10 w-40 h-40" />
        <div className="container-x relative">
          <Reveal>
            <div className="max-w-2xl">
              <span className="eyebrow">Зашто EXIT</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                Алат за озбиљне купце.
                <br />
                <span className="text-muted-foreground">Не још један онлајн шоп.</span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Lock, title: "Затворен каталог", text: "Цене и матрица величина видљиве су само одобреним партнерима." },
              { icon: Package, title: "Стабилни кројеви", text: "Тачни лекала из сезоне у сезону — нема скакања величина." },
              { icon: Truck, title: "Испорука 15–25 дана", text: "Производња у Новом Пазару. Контрола квалитета прије сваке отпреме." },
              { icon: BarChart3, title: "Здраве марже", text: "ВПЦ позициониране за маркап 2.4–2.8× у бутицима." },
              { icon: ShieldCheck, title: "Гаранција квалитета", text: "Замјена при дефекту тканине или конца у року 14 дана." },
              { icon: Sparkles, title: "Подршка партнерима", text: "Лине-шит, фотке и материјали за ваше канале — на захтев." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={Math.min(4, i + 1) as 1 | 2 | 3 | 4}>
                <div className="card-soft p-7 h-full">
                  <div className="w-11 h-11 rounded-xl bg-secondary text-accent flex items-center justify-center">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── КАТЕГОРИЈЕ ───────── */}
      <section className="section-pad bg-[var(--surface)]">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow">Колекција</span>
                <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Три линије. Један стандард.</h2>
              </div>
              <Link to="/katalog" className="text-sm font-semibold text-foreground link-underline">
                Цео каталог →
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { to: "/katalog" as const, label: "Фармерке", desc: "12oz · slim, regular, relaxed", img: productJeans.url },
              { to: "/katalog" as const, label: "Чино", desc: "Памук стрейч · класичан крој", img: productChino.url },
              { to: "/katalog" as const, label: "Карго", desc: "Утилитарни кројеви · funkcionalnost", img: productCargo.url },
            ].map((c, i) => (
              <Reveal key={c.label} delay={Math.min(3, i + 1) as 1 | 2 | 3}>
                <Link to={c.to} className="group block card-soft overflow-hidden">
                  <div className="aspect-[4/5] overflow-hidden bg-secondary">
                    <img src={c.img} alt={c.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold">{c.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </Reveal>
            ))}
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

      {/* ───────── O NAMA ───────── */}
      <section className="section-pad bg-[var(--surface)]">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-border aspect-[4/5] lg:aspect-[4/5]">
              <img src={workshopImg.url} alt="EXIT Denim атеље у Новом Пазару" className="w-full h-full object-cover" />
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
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { n: "12+", l: "Година искуства" },
                  { n: "180", l: "Бутика партнера" },
                  { n: "98%", l: "Тачност испоруке" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{s.n}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                  </div>
                ))}
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

      {/* ───────── FINALNI CTA ───────── */}
      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-[var(--ink)] text-white p-10 md:p-16">
              <div className="absolute inset-0 opacity-30 gradient-mesh" aria-hidden />
              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="chip bg-white/10 border-white/15 text-white/80">
                    <Globe2 className="w-3.5 h-3.5" /> Доступно у региону
                  </span>
                  <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
                    Спремни да понудите купцима бољи деним?
                  </h2>
                  <p className="mt-4 text-white/75 text-lg max-w-lg">
                    Подносите захтев за B2B приступ. Одговарамо у року 24 сата радним даном.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link to="/postani-partner" className="btn-accent">
                    Затражите приступ <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/kontakt" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white">
                    Контактирајте нас
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
