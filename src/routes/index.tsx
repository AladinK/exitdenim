import { createFileRoute, Link } from "@tanstack/react-router";
import { FitSilhouette } from "@/components/FitSilhouette";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Quote, ChevronRight, Flame } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/hero/Hero";
import { ProductCard } from "@/components/ProductCard";

import { getHomeAssets } from "@/lib/site-assets.functions";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXIT Denim — farmerke, bootcut, flare, chino i cargo" },
      { name: "description", content: "Muške farmerke — slim, relaxed, bootcut i flare, plus chino i cargo. Plaćanje pouzećem, dostava po celoj Srbiji." },
      { property: "og:title", content: "EXIT Denim — farmerke, bootcut, flare, chino i cargo" },
      { property: "og:description", content: "Muške farmerke — slim, relaxed, bootcut i flare, plus chino i cargo. Plaćanje pouzećem, dostava po celoj Srbiji." },
      { property: "og:url", content: "https://exitdenim.shop/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      label: "Za kvalitet robe",
      items: [
        "Materijal deluje ozbiljno, vidi se da nije klasična jeftina roba.",
        "Ovo je ono što buticima treba — dobar kroj, stabilan model i realna cena.",
        "Džins izgleda jako kvalitetno, pogotovo obrada i štep.",
        "Kod ovakvih pantalona najbitnije je da kupac proba i vrati se opet. Ovo deluje kao taj nivo.",
        "Modeli su komercijalni, baš za radnju koja hoće brzu rotaciju.",
      ],
    },
    {
      label: "Veleprodaja / B2B poverenje",
      items: [
        "Odlično za butike koji traže robu sa dobrom maržom i brzim obrtom.",
        "Ovo je dobra ponuda za radnje koje ne žele da rizikuju sa nepoznatim modelima.",
        "Bitno je što imate više linija — jeans, chino i cargo. Lakše je napraviti kompletnu porudžbinu.",
        "Za veleprodaju je najvažnije da su veličine stabilne i da može da se dopuni roba.",
        "Ako je isporuka brza i modeli dostupni po veličinama, ovo može lepo da radi u butiku.",
      ],
    },
    {
      label: "Hitnost i prodaja",
      items: [
        "Ovakvi modeli obično brzo odu u veličinama 32, 33 i 34.",
        "Ko radi mušku garderobu, ovo ne treba mnogo da čeka.",
        "Dobar trenutak za butike da popune lager pre sezone.",
        "Ako je cena veleprodajna dobra, ovo je roba koja može odmah u izlog.",
        "Cargo i jeans trenutno najbolje idu, pogotovo ovakvi neutralni modeli.",
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
            <div className="eyebrow">Poverenje sa tržišta</div>
            <h2 className="mt-4 h2-editorial">Šta kažu butici i kupci</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Reakcije sa Instagram i Facebook objava — od kvaliteta materijala do brzine obrta u radnji.
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
                  aria-label={`Prikaži grupu ${g.label}`}
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
              <span>Kartice se menjaju svakih 4.5s</span>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-muted-foreground mono">
              <span className="md:hidden">{String(quoteIndex + 1).padStart(2, "0")}/{String(groups[0].items.length).padStart(2, "0")}</span>
              <button
                onClick={() => setQuoteIndex((i) => (i + 1) % groups[0].items.length)}
                aria-label="Sledeći komentar"
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
      <div className="relative z-10">

      <Hero />

      {/* ───────── KATEGORIJE ───────── */}
      <section className="relative pt-6 pb-2 md:py-14">
        <div className="container-x">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { to: "/jeans", label: "FARMERKE", sub: "Od slim do flare.", img: img("category_jeans"), tone: "dark" as const },
              { to: "/chino", label: "CHINO", sub: "Clean fit za svaki dan.", img: img("category_chino"), tone: "dark" as const },
              { to: "/cargo", label: "CARGO", sub: "Džepovi. Stav. Gotovo.", img: img("category_cargo"), tone: "dark" as const },
              { to: "/wide-flare", label: "WIDE & FLARE", sub: "Bootcut, relaxed i flare.", img: null, tone: "dark" as const, cta: "Novi drop" },
            ].map((c) => (
              <Reveal key={c.label}>
                <Link
                  to={c.to}
                  className="group relative block overflow-hidden aspect-[3/4] w-full bg-[color:var(--ink)]"
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
                      <div className={`absolute inset-0 ${c.tone === "dark" ? "bg-gradient-to-t from-[var(--ink)]/90 via-[var(--ink)]/20 to-transparent" : "bg-gradient-to-t from-black/25 via-white/0 to-white/10"}`} />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-[color:var(--ink)] flex items-start justify-center gap-1 pt-6 md:pt-10 opacity-80">{["Relaxed","Bootcut","Flare"].map((f) => <FitSilhouette key={f} fit={f} className="h-16 md:h-24 w-auto text-[color:var(--ivory)] transition-transform duration-500 group-hover:scale-105" />)}</div>
                  )}
                  <div className={`absolute inset-0 flex flex-col justify-end gap-3 p-4 md:p-6 ${(c.tone as string) === "green" ? "text-[color:var(--ink)]" : "text-white"}`}>
                    <div>
                      <h3 style={{ color: "inherit" }} className="font-[family-name:var(--font-display)] text-lg md:text-2xl leading-none">{c.label}</h3>
                      <p className={`mt-2 text-[13px] md:text-sm leading-snug max-w-[220px] ${(c.tone as string) === "green" ? "text-[color:var(--ink)]/75" : "text-white/85"}`}>
                        {c.sub}
                      </p>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      {c.cta ? (
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] leading-relaxed opacity-90 max-w-[180px]">
                          {c.cta}
                        </p>
                      ) : <span />}
                      <span className="w-9 h-9 flex items-center justify-center text-current transition-transform duration-500 group-hover:translate-x-1">
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
                    <Flame className="w-3.5 h-3.5 text-accent" /> Najprodavanije
                  </div>
                  <h2 className="mt-4 h2-editorial">Svi ovo nose</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Top modeli ove sezone. Izaberi veličinu, ubaci u korpu, gotovo.
                  </p>
                </div>
                <Link to="/katalog" className="btn-outline hidden md:inline-flex">
                  Vidi sve <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-8 md:gap-y-12">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ───────── IZABERI KROJ ───────── */}
      <section className="py-12 md:py-20 border-t border-border">
        <div className="container-x">
          <div className="eyebrow">Nađi svoj fit</div>
          <h2 className="mt-3 h2-editorial">Koji si ti fit?</h2>
          <div className="mt-8 flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2">
            {[
              { t: "Slim", d: "Uzak kroz butinu i nogavicu.", tag: "" },
              { t: "Regular Slim", d: "Komotno gore, suženo dole.", tag: "" },
              { t: "Relaxed", d: "Više prostora, opušten pad.", tag: "NOVO" },
              { t: "Bootcut", d: "Pripijeno do kolena, širi se ka patikama.", tag: "NOVO" },
              { t: "Flare", d: "Y2K vibe — široka nogavica, jak stav.", tag: "NOVO" },
              { t: "Cargo", d: "Džepovi, jači karakter.", tag: "" },
            ].map((f) => (
              <Link key={f.t} to="/katalog" search={{ fit: f.t }} className="group relative shrink-0 w-[44%] sm:w-[30%] md:w-auto snap-start border border-border bg-background p-5 hover:border-foreground transition-colors">
                {f.tag && <span className="absolute top-3 right-3 text-[9px] tracking-[0.2em] font-semibold bg-[color:var(--ink)] text-[color:var(--ivory)] px-1.5 py-0.5">{f.tag}</span>}
                <FitSilhouette fit={f.t} className="mx-auto h-28 md:h-36 w-auto text-foreground transition-transform duration-300 group-hover:scale-105" />
                <div className="mt-4 text-[15px] font-semibold uppercase tracking-[0.08em]">{f.t}</div>
                <p className="mt-2 text-[13px] text-muted-foreground leading-snug">{f.d}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-medium">
                  Vidi <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ZAŠTO EXIT ───────── */}
      <section className="py-14 md:py-24 bg-[color:var(--ink)] text-[color:var(--ivory)]">
        <div className="container-x">
          <div className="eyebrow !text-[color:var(--ivory)]/60">Zašto EXIT</div>
          <h2 className="mt-3 h2-editorial !text-[color:var(--ivory)] max-w-xl">Kupuješ bez rizika.</h2>
          <div className="mt-10 grid md:grid-cols-4 gap-8">
            {[
              { n: "01", t: "Plaćaš kad stigne", d: "Pouzećem — pare daješ kuriru tek kad dobiješ paket." },
              { n: "02", t: "Šaljemo za 1–2 dana", d: "Porudžbinu odmah pakujemo i predajemo kuriru." },
              { n: "03", t: "Besplatna dostava", d: "Za porudžbine od 9.450 din — dva para i dostava je naša." },
              { n: "04", t: "Made in Srbija", d: "Šijemo u našoj radionici, pod našom kontrolom." },
            ].map((s) => (
              <div key={s.t} className="border-t border-[color:var(--ivory)]/20 pt-5">
                <div className="text-[11px] tracking-[0.2em] text-[color:var(--ivory)]/50 tabular-nums">{s.n}</div>
                <h3 className="mt-3 text-lg !text-[color:var(--ivory)]">{s.t}</h3>
                <p className="mt-1 text-sm text-[color:var(--ivory)]/65 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/katalog" className="btn-street w-full sm:w-auto">
              Uzmi svoj par <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </div>
    </Layout>

  );
}
