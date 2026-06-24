import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
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
      { title: "EXIT Denim — Atelier of European Wholesale Denim" },
      { name: "description", content: "Tihi luksuz iz Novog Pazara. B2B atelje denim, chino i cargo programa za butike koji znaju razliku." },
      { property: "og:title", content: "EXIT Denim — Atelier of European Wholesale Denim" },
      { property: "og:description", content: "Tihi luksuz iz Novog Pazara. B2B atelje." },
      { property: "og:image", content: heroAsset.url },
    ],
  }),
  component: Home,
});

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
      {/* ============== HERO — Atelier Editorial ============== */}
      <section className="relative h-[92vh] min-h-[640px] bg-[var(--color-denim)] text-background overflow-hidden flex flex-col items-center justify-center px-8">
        <div className="absolute inset-0 opacity-40">
          <img src={heroAsset.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-denim)]/40 to-[var(--color-denim)]" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          <Reveal>
            <span className="mono text-[10px] tracking-[0.5em] uppercase text-[var(--color-selvedge)]">
              Bespoke B2B Manufacturing — Est. Novi Pazar
            </span>
          </Reveal>

          <Reveal delay={1} as="h1" className="mt-12 serif font-light leading-[0.86] tracking-tight text-[clamp(4rem,14vw,12rem)]">
            <>EXIT <span className="italic font-extralight opacity-85">Denim</span></>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-16 max-w-lg text-sm md:text-base font-light leading-relaxed opacity-70 tracking-wide">
              Defined by silence. Engineered by precision.<br/>
              A wholesale atelier for boutiques that recognise the difference.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-14 flex flex-col sm:flex-row items-center gap-10">
              <Link to="/katalog" className="group flex flex-col items-center gap-2">
                <span className="mono text-[10px] tracking-[0.4em] uppercase opacity-50 group-hover:opacity-100 transition-opacity">The Collection</span>
                <div className="w-20 h-px bg-background/20 group-hover:bg-[var(--color-selvedge)] transition-colors" />
              </Link>
              <Link to="/postani-partner" className="group flex flex-col items-center gap-2">
                <span className="mono text-[10px] tracking-[0.4em] uppercase opacity-50 group-hover:opacity-100 transition-opacity">Become a Partner</span>
                <div className="w-20 h-px bg-background/20 group-hover:bg-[var(--color-selvedge)] transition-colors" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Vertical Selvedge detail */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
          <span className="mono text-[9px] tracking-[0.3em] uppercase opacity-40" style={{ writingMode: "vertical-rl" }}>
            S.ID 2938-PX · SS·26
          </span>
          <div className="w-px h-32 bg-[var(--color-selvedge)]" />
        </div>
      </section>

      {/* ============== EDITORIAL CATEGORIES — asymmetric, breathing ============== */}
      <section className="py-32 md:py-48 px-8 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-32">

          {/* 01 — Jeans (large left) */}
          <Reveal className="md:col-span-7 flex flex-col">
            <Link to="/jeans" className="relative group block">
              <div className="w-full aspect-[4/5] overflow-hidden bg-secondary">
                <img src={jeansAsset.url} alt="EXIT Denim — The Selvedge" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
              </div>
              <div className="absolute -bottom-8 -right-8 hidden md:block">
                <div className="bg-[var(--color-denim)] text-background p-10 border border-background/5">
                  <span className="mono text-[9px] text-[var(--color-selvedge)] block mb-2">[ REF. 001 ]</span>
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

          {/* 02 — Chino (staggered right) */}
          <Reveal delay={1} className="md:col-span-5 md:pt-64">
            <Link to="/chino" className="block group">
              <div className="w-full aspect-[3/4] overflow-hidden bg-secondary">
                <img src={chinoAsset.url} alt="EXIT Denim — The Chino" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-10">
                <span className="mono text-[9px] text-[var(--color-selvedge)] block mb-2">[ REF. 002 ]</span>
                <h3 className="serif text-4xl italic">The Chino</h3>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-8 h-px bg-[var(--color-selvedge)]" />
                  <span className="mono text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">View Archive</span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* 03 — Cargo (offset, smaller) */}
          <Reveal delay={2} className="md:col-span-5 md:col-start-2">
            <Link to="/cargo" className="block group">
              <div className="w-full aspect-[3/4] overflow-hidden bg-secondary">
                <img src={cargoAsset.url} alt="EXIT Denim — Modern Utility" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-10">
                <span className="mono text-[9px] text-[var(--color-selvedge)] block mb-2">[ REF. 003 ]</span>
                <h3 className="serif text-4xl">Modern Utility</h3>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-8 h-px bg-[var(--color-selvedge)]" />
                  <span className="mono text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">View Archive</span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Manifesto pull-quote */}
          <div className="md:col-span-12 py-24 md:py-40 flex flex-col items-center">
            <div className="w-px h-24 bg-gradient-to-b from-[var(--color-selvedge)] to-transparent mb-12" />
            <Reveal as="h2" className="serif text-3xl md:text-5xl text-center max-w-4xl font-light leading-tight text-foreground">
              <>
                We do not manufacture garments —<br/>
                <span className="italic">we cultivate the integrity of the cloth.</span>
              </>
            </Reveal>
            <span className="mono mt-12 text-[10px] tracking-[0.5em] uppercase opacity-40">— The EXIT Manifesto</span>
          </div>
        </div>
      </section>

      {/* ============== BEST SELLERS — quiet grid ============== */}
      {bestSellers.length > 0 && (
        <section className="border-t border-border bg-[var(--color-ecru)] py-32 px-8">
          <div className="max-w-7xl mx-auto">
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

      {/* ============== ATELIER — image + minimal copy ============== */}
      <section className="py-32 md:py-48 px-8 bg-background">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 aspect-[4/5] overflow-hidden bg-secondary order-2 lg:order-1">
            <img src={workshopAsset.url} alt="EXIT Denim atelier" className="w-full h-full object-cover" />
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <span className="mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-selvedge)]">The Atelier</span>
            <h2 className="mt-6 serif font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]">
              Novi Pazar.<br/><span className="italic opacity-80">Three generations of cloth.</span>
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

      {/* ============== PARTNERSHIP — silent 4-step ============== */}
      <section className="bg-foreground text-background py-32 px-8 border-t border-background/10">
        <div className="max-w-7xl mx-auto">
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
            ].map(([n, t, d]) => (
              <div key={n} className="border-t border-background/20 pt-6">
                <div className="mono text-[10px] tracking-[0.4em] text-[var(--color-selvedge)]">{n}</div>
                <div className="mt-6 serif text-2xl text-background">{t}</div>
                <p className="mt-4 text-sm font-light text-background/60 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA — minimal ============== */}
      <section className="py-32 md:py-48 px-8 bg-background text-center">
        <div className="max-w-3xl mx-auto">
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
