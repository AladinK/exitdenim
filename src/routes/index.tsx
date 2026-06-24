import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";
import { getMyProfile } from "@/lib/orders.functions";
import { useAuth } from "@/hooks/useAuth";
import heroAsset from "@/assets/hero-banner.jpg.asset.json";
import workshopAsset from "@/assets/workshop.jpg.asset.json";
import jeansAsset from "@/assets/product-ex-101.jpg.asset.json";
import chinoAsset from "@/assets/product-ex-201.jpg.asset.json";
import cargoAsset from "@/assets/product-ex-301.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXIT Denim — European Wholesale Denim Atelier" },
      { name: "description", content: "Premium Serbian selvedge for global retail. B2B showroom — apply for wholesale access." },
      { property: "og:title", content: "EXIT Denim — Wholesale Atelier" },
      { property: "og:description", content: "Premium Serbian selvedge for global retail." },
      { property: "og:image", content: heroAsset.url },
    ],
  }),
  component: Home,
});

const TICKER = [
  "AW · 27 OPEN",
  "MOQ 10 PCS",
  "LEAD TIME 15–25 DAYS",
  "NOVI PAZAR · RS",
  "SELVEDGE 13.5oz",
  "OLIVE THREAD",
  "B2B SHOWROOM",
  "APPLICATION ONLY",
];

function Home() {
  const fetchProducts = useServerFn(listProducts);
  const fetchProfile = useServerFn(getMyProfile);
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => { fetchProducts({}).then(setProducts); }, []); // eslint-disable-line
  useEffect(() => {
    if (user) fetchProfile({}).then((r) => setApproved(r.profile?.status === "approved"));
  }, [user]); // eslint-disable-line

  const bestSellers = products.slice(0, 4);

  return (
    <Layout>
      {/* ============== HERO — Archival Studio ============== */}
      <section className="relative bg-[var(--color-ivory)] overflow-hidden">
        <div className="container-x pt-10 md:pt-16 pb-24 md:pb-32">
          <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center min-h-[78vh]">

            {/* IMAGE — left */}
            <div className="col-span-12 lg:col-span-7 relative group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-secondary)] shadow-[0_40px_80px_-40px_rgba(15,26,46,0.35)]">
                <img
                  src={heroAsset.url}
                  alt="EXIT Denim — AW27"
                  className="w-full h-full object-cover animate-kenburns will-change-transform"
                />
                <div className="absolute inset-0 mix-blend-multiply opacity-[0.18]"
                     style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/felt.png')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/35 via-transparent to-transparent" />

                {/* corner crosshairs */}
                <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-background/70" />
                <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-background/70" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-background/70" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-background/70" />

                {/* top-left film slate */}
                <div className="absolute top-6 left-10 text-background mono text-[10px] tracking-[0.3em] uppercase opacity-80">
                  REEL 03 · IDX 027 / SLV
                </div>
              </div>

              {/* Floating dark spec card */}
              <Reveal delay={2} className="absolute -bottom-10 left-4 md:left-10 z-20 hidden sm:block">
                <div className="bg-[var(--color-ink)] text-background p-7 md:p-8 space-y-3 shadow-[30px_30px_60px_rgba(15,26,46,0.25)] w-[18rem] md:w-[20rem]">
                  <div className="mono text-[10px] tracking-[0.2em] uppercase opacity-50">Ref. EX-0027 / SLV</div>
                  <div className="serif text-2xl md:text-3xl font-light tracking-tight leading-[0.95]">
                    Indigo Selvedge<br />
                    <span className="italic text-[var(--color-copper)]">Olive Stitch</span>
                  </div>
                  <div className="h-px w-full bg-background/10" />
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-selvedge)] opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-selvedge)]" />
                    </span>
                    <span className="mono text-[9px] uppercase tracking-[0.25em] opacity-60">
                      Wholesale Tier 01 · Open
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* CONTENT — right */}
            <div className="col-span-12 lg:col-span-5 lg:-ml-12 relative z-10">
              <Reveal>
                <div className="mono text-[11px] tracking-[0.4em] uppercase text-[var(--color-ink)]/55 flex items-center gap-4">
                  <span className="w-10 h-px bg-[var(--color-ink)]/30" />
                  Autumn / Winter 27
                </div>
              </Reveal>

              <Reveal delay={1}>
                <h1 className="mt-10 serif font-light text-[var(--color-ink)] leading-[0.78] tracking-[-0.03em] text-[clamp(5rem,12vw,11rem)]">
                  EXIT
                  <br />
                  <span className="italic font-light ml-8 md:ml-16 text-[var(--color-selvedge)]">
                    Studio.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p className="mt-12 max-w-sm text-[var(--color-ink)] text-base md:text-lg leading-relaxed font-light">
                  A wholesale atelier from Novi Pazar. Selvedge denim &amp; tailored chino for retailers who curate the difference.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="mt-12 flex flex-col gap-6 max-w-sm">
                  <Link
                    to="/postani-partner"
                    className="group relative inline-flex items-center justify-between border border-[var(--color-ink)] px-7 py-5 overflow-hidden transition-all duration-500 hover:pr-6"
                  >
                    <span className="absolute inset-0 w-0 bg-[var(--color-ink)] transition-all duration-500 ease-in-out group-hover:w-full" />
                    <span className="relative z-10 mono text-xs font-medium tracking-[0.22em] uppercase text-[var(--color-ink)] group-hover:text-[var(--color-ivory)] transition-colors">
                      Request Partnership
                    </span>
                    <ArrowUpRight className="relative z-10 w-5 h-5 text-[var(--color-ink)] group-hover:text-[var(--color-ivory)] transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <div className="flex items-center gap-5">
                    <Link
                      to="/auth"
                      className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink)] font-semibold border-b border-[var(--color-ink)] pb-1"
                    >
                      Showroom Login
                    </Link>
                    <span className="text-[var(--color-ink)]/20">/</span>
                    <Link
                      to="/katalog"
                      className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink)]/55 hover:text-[var(--color-ink)] transition-colors"
                    >
                      View Catalogue
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Vertical right rail */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-20">
          <div className="mono text-[9px] tracking-[0.7em] uppercase text-[var(--color-ink)]/30 whitespace-nowrap"
               style={{ writingMode: "vertical-rl" }}>
            Bespoke Denim · Novi Pazar / RS
          </div>
          <div className="w-px h-20 bg-[var(--color-selvedge)]/60" />
        </div>
      </section>

      {/* ============== TICKER ============== */}
      <section className="bg-[var(--color-ink)] text-[var(--color-ivory)] overflow-hidden border-y border-[var(--color-ink)]">
        <div className="flex whitespace-nowrap animate-marquee py-4">
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mono text-[11px] tracking-[0.35em] uppercase mx-8 flex items-center gap-8">
              {t}
              <span className="inline-block w-1 h-1 bg-[var(--color-selvedge)] rounded-full" />
            </span>
          ))}
        </div>
      </section>

      {/* ============== EDITORIAL CATEGORIES ============== */}
      <section className="py-28 md:py-40 bg-background">
        <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">

          {/* 01 — Jeans */}
          <Reveal className="md:col-span-7 flex flex-col">
            <Link to="/jeans" className="relative group block">
              <div className="w-full aspect-[4/5] overflow-hidden bg-secondary">
                <img src={jeansAsset.url} alt="EXIT Denim — The Selvedge"
                     className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="absolute -bottom-8 -right-4 md:-right-8 hidden md:block">
                <div className="bg-[var(--color-denim)] text-background p-8 md:p-10 border border-background/5 shadow-2xl">
                  <span className="mono text-[9px] tracking-[0.3em] text-[var(--color-selvedge)] block mb-2">[ REF. 001 ]</span>
                  <h3 className="serif text-4xl">The Selvedge</h3>
                </div>
              </div>
            </Link>
            <div className="mt-16 max-w-sm">
              <p className="mono text-[10px] uppercase tracking-[0.25em] opacity-50 mb-4">Construction</p>
              <p className="text-sm font-light leading-relaxed opacity-80">
                13.5oz shuttle-loomed denim, tailored in Novi Pazar with heritage precision.
              </p>
            </div>
          </Reveal>

          {/* 02 — Chino */}
          <Reveal delay={1} className="md:col-span-5 md:pt-56">
            <Link to="/chino" className="block group">
              <div className="w-full aspect-[3/4] overflow-hidden bg-secondary">
                <img src={chinoAsset.url} alt="EXIT Denim — The Chino"
                     className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="mt-10">
                <span className="mono text-[9px] tracking-[0.3em] text-[var(--color-selvedge)] block mb-2">[ REF. 002 ]</span>
                <h3 className="serif text-4xl italic">The Chino</h3>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-8 h-px bg-[var(--color-selvedge)]" />
                  <span className="mono text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                    View Archive
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* 03 — Cargo */}
          <Reveal delay={2} className="md:col-span-5 md:col-start-2">
            <Link to="/cargo" className="block group">
              <div className="w-full aspect-[3/4] overflow-hidden bg-secondary">
                <img src={cargoAsset.url} alt="EXIT Denim — Modern Utility"
                     className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="mt-10">
                <span className="mono text-[9px] tracking-[0.3em] text-[var(--color-selvedge)] block mb-2">[ REF. 003 ]</span>
                <h3 className="serif text-4xl">Modern Utility</h3>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-8 h-px bg-[var(--color-selvedge)]" />
                  <span className="mono text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                    View Archive
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Manifesto */}
          <div className="md:col-span-12 py-24 md:py-32 flex flex-col items-center">
            <div className="w-px h-24 bg-gradient-to-b from-[var(--color-selvedge)] to-transparent mb-12" />
            <Reveal as="h2" className="serif text-3xl md:text-5xl text-center max-w-4xl font-light leading-tight text-foreground">
              <>
                We do not manufacture garments —<br />
                <span className="italic">we cultivate the integrity of the cloth.</span>
              </>
            </Reveal>
            <span className="mono mt-12 text-[10px] tracking-[0.5em] uppercase opacity-40">— The EXIT Manifesto</span>
          </div>
        </div>
      </section>

      {/* ============== BEST SELLERS ============== */}
      {bestSellers.length > 0 && (
        <section className="border-t border-border bg-[var(--color-ecru)] py-32">
          <div className="container-x">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
              <div>
                <span className="mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-selvedge)]">Archive · Essentials</span>
                <h2 className="mt-6 serif font-light text-[clamp(2rem,4vw,3.5rem)] leading-tight">
                  Boutique <span className="italic">essentials</span>.
                </h2>
              </div>
              <Link to="/katalog" className="mono text-[10px] tracking-[0.3em] uppercase border-b border-foreground/40 hover:border-[var(--color-selvedge)] pb-1 transition-colors">
                Full Archive →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
              {bestSellers.map((p) => <ProductCard key={p.id} product={p} showPrice={approved} />)}
            </div>
          </div>
        </section>
      )}

      {/* ============== ATELIER ============== */}
      <section className="py-32 md:py-48 bg-background">
        <div className="container-x grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 relative aspect-[4/5] overflow-hidden bg-secondary order-2 lg:order-1">
            <img src={workshopAsset.url} alt="EXIT Denim atelier" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 mono text-[10px] tracking-[0.3em] uppercase text-background/80">
              ATELIER · NP / RS
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <span className="mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-selvedge)]">The Atelier</span>
            <h2 className="mt-6 serif font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]">
              Novi Pazar.<br />
              <span className="italic opacity-80">Three generations of cloth.</span>
            </h2>
            <p className="mt-10 text-sm md:text-base font-light leading-relaxed opacity-75 max-w-md">
              Cut, sewn and finished in our own atelier. No outsourcing. No white-label tricks.
            </p>
            <Link to="/proizvodnja" className="mt-12 inline-block mono text-[10px] tracking-[0.3em] uppercase border-b border-foreground/40 hover:border-[var(--color-selvedge)] pb-1 transition-colors">
              The Production Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ============== PARTNERSHIP ============== */}
      <section className="bg-foreground text-background py-32 border-t border-background/10">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-10 mb-20">
            <div className="lg:col-span-7">
              <span className="mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-selvedge)]">Partner Onboarding</span>
              <h2 className="mt-6 serif font-light text-[clamp(2rem,4vw,3.5rem)] text-background leading-[1.1]">
                Application <span className="italic">to first shipment</span>.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-12 md:gap-8">
            {[
              ["01", "Apply", "Boutique profile, Instagram, location."],
              ["02", "Approval", "Reviewed within 24h."],
              ["03", "Access", "Wholesale catalogue, line sheets, live stock."],
              ["04", "Delivery", "Confirmed within 5–10 days."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={(i % 4) as 0|1|2|3}>
                <div className="border-t border-background/20 pt-6">
                  <div className="mono text-[10px] tracking-[0.4em] text-[var(--color-selvedge)]">{n}</div>
                  <div className="mt-6 serif text-2xl text-background">{t}</div>
                  <p className="mt-4 text-sm font-light text-background/60 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="py-32 md:py-48 bg-background text-center">
        <div className="container-x max-w-3xl">
          <div className="w-px h-16 bg-[var(--color-selvedge)] mx-auto mb-12" />
          <h2 className="serif font-light text-[clamp(2.5rem,6vw,5rem)] leading-[1.05]">
            Open the <span className="italic">archive</span>.
          </h2>
          <p className="mt-8 text-sm md:text-base font-light opacity-70 max-w-md mx-auto leading-relaxed">
            Wholesale by application only.
          </p>
          <div className="mt-14 flex flex-wrap gap-10 justify-center">
            <Link to="/postani-partner" className="group flex flex-col items-center gap-2">
              <span className="mono text-[10px] tracking-[0.4em] uppercase">Request Access</span>
              <div className="w-20 h-px bg-foreground/20 group-hover:bg-[var(--color-selvedge)] transition-colors" />
            </Link>
            <Link to="/kontakt" className="group flex flex-col items-center gap-2">
              <span className="mono text-[10px] tracking-[0.4em] uppercase opacity-60">Contact</span>
              <div className="w-20 h-px bg-foreground/20 group-hover:bg-[var(--color-selvedge)] transition-colors" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
