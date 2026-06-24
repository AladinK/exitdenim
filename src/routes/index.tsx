import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, ArrowUpRight, Check, Ruler, Truck, ShieldCheck, TrendingUp, Repeat, Scissors } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";
import { getMyProfile } from "@/lib/orders.functions";
import { useAuth } from "@/hooks/useAuth";
import heroAsset from "@/assets/hero-banner.jpg.asset.json";
import workshopAsset from "@/assets/workshop.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXIT Denim — B2B Wholesale Showroom" },
      { name: "description", content: "Premium muški denim za butike koji traže kvalitet, stabilan fit i robu koja se brzo okreće. Privatni B2B showroom iz Novog Pazara." },
      { property: "og:title", content: "EXIT Denim — B2B Wholesale Showroom" },
      { property: "og:description", content: "Premium muški denim za butike. Privatni B2B showroom." },
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
      {/* ============== HERO — DENIM SPEC SHEET ============== */}
      <section className="relative denim-weave text-background overflow-hidden">
        {/* blueprint grid + selvedge edge */}
        <div className="absolute inset-0 blueprint text-background/40 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[var(--color-selvedge)] z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-[3px] bg-[var(--color-selvedge)] z-10" />

        <div className="container-x relative z-10 pt-16 md:pt-24 pb-16">
          {/* top spec strip */}
          <div className="flex flex-wrap justify-between gap-4 spec text-background/70 border-b border-background/20 pb-4">
            <span>N°. 0028 / SS·26</span>
            <span>43°08′N · 20°31′E — Novi Pazar, SRB</span>
            <span>Atelier — Cut · Sew · Finish</span>
          </div>

          <div className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-10">
            {/* Left — big type, no fluff */}
            <div className="lg:col-span-8 relative">
              <Reveal>
                <div className="spec text-[var(--color-selvedge)]">— Wholesale Programme · By application</div>
              </Reveal>

              <Reveal delay={1} as="h1" className="mt-6 editorial-h text-background">
                <>
                <span className="block text-[clamp(3.5rem,12vw,11rem)] leading-[0.86]">EXIT</span>
                <span className="block text-[clamp(3.5rem,12vw,11rem)] leading-[0.86] -mt-2">DENIM<span className="text-[var(--color-selvedge)]">.</span></span>
                </>
              </Reveal>

              <Reveal delay={2}>
                <p className="mt-10 max-w-xl text-background/85 text-[15px] leading-[1.85]">
                  Pravimo muški denim za butike koji znaju razliku između robe i <em className="not-italic text-[var(--color-copper)]">stvari koja se vraća na police</em>.
                  Bez sezonskih iznenađenja, bez praznina u veličinama, bez razvlačenja posle treće noše.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link to="/auth" className="btn-accent">
                    Otvori B2B nalog <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link to="/katalog" className="spec text-background/75 hover:text-background border-b border-background/30 hover:border-background pb-1 transition-colors">
                    Pogledaj line sheet →
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right — Tech Pack card */}
            <div className="lg:col-span-4">
              <Reveal delay={2}>
                <div className="relative crosshair p-7 bg-[var(--color-ink)]/40 backdrop-blur-[2px]">
                  <div className="flex justify-between spec text-background/55">
                    <span>TECH · PACK</span>
                    <span>REV·07</span>
                  </div>
                  <div className="mt-8 serif text-3xl text-background leading-tight">
                    Style EX–101<br/>
                    <span className="italic text-background/80">«Slim Indigo»</span>
                  </div>
                  <dl className="mt-8 space-y-3 spec text-background/80">
                    {[
                      ["FABRIC", "100% COTTON"],
                      ["WEIGHT", "13.5 OZ"],
                      ["WASH", "RAW INDIGO"],
                      ["SIZES", "31 — 40"],
                      ["MOQ", "10 PCS"],
                      ["LEAD", "5–10 DAYS"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-background/15 pb-2">
                        <dt>{k}</dt>
                        <dd className="text-background">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-7 spec text-[var(--color-selvedge)]">— Wholesale 2.5–3.2× margin</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Marquee — mono, gritty, no luxury sparkles */}
        <div className="relative z-10 border-t border-background/20 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-4 spec text-background/65">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-10 px-5">
                <span>MADE IN NOVI PAZAR</span>
                <span className="text-[var(--color-selvedge)]">—</span>
                <span>OWN ATELIER</span>
                <span className="text-[var(--color-selvedge)]">—</span>
                <span>13.5 — 14.5 OZ</span>
                <span className="text-[var(--color-selvedge)]">—</span>
                <span>SIZES 31 / 32 / 33 / 34 / 36 / 38 / 40</span>
                <span className="text-[var(--color-selvedge)]">—</span>
                <span>WHOLESALE ONLY</span>
                <span className="text-[var(--color-selvedge)]">—</span>
                <span>REPEAT STOCK ON BEST-SELLERS</span>
                <span className="text-[var(--color-selvedge)]">—</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MANIFESTO — asymmetric, plain-spoken ============== */}
      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-x-8 gap-y-12">
          <div className="lg:col-span-2 spec text-muted-foreground">
            <div>§ 001</div>
            <div className="mt-2 text-[var(--color-selvedge)]">— Manifesto</div>
          </div>

          <Reveal delay={1} className="lg:col-span-7">
            <p className="serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.25] text-foreground">
              Ne pravimo modu. Pravimo <span className="text-[var(--color-selvedge)]">radne pantalone</span> za muškarce
              koji ih nose svaki dan — i butike koji žele robu što se prodaje i drugi put.
              Krojimo u Novom Pazaru, šijemo u Novom Pazaru, garantujemo fit u Novom Pazaru.
              Bez outsourceanja. Bez white-label trikova. Bez «kolekcije» koja nestane kad ti zatreba repeat.
            </p>
          </Reveal>

          <div className="lg:col-span-3 lg:border-l lg:border-border lg:pl-6">
            <Reveal delay={2}>
              <div className="spec text-muted-foreground">Founders</div>
              <div className="mt-2 serif text-2xl">Familija Dazdarević</div>
              <div className="mono text-xs text-muted-foreground mt-2">EST. 2014 · ATELIER NP</div>
              <div className="mt-6 spec text-[var(--color-selvedge)]">— Treća generacija u tekstilu</div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============== THREE LINES — full-bleed editorial strips ============== */}
      <section className="border-t border-border">
        {[
          {
            n: "01",
            to: "/jeans" as const,
            label: "JEANS",
            ital: "Indigo Programme",
            spec: "13.5 OZ · 5-POCKET · RAW / STONE / BLACK",
            text: "Slim, Regular Slim, Relaxed. Tri kalupa koji su prošli kroz hiljade kupaca bez razvlačenja.",
            bg: "bg-[var(--color-denim)]",
          },
          {
            n: "02",
            to: "/chino" as const,
            label: "CHINO",
            ital: "Twill Programme",
            spec: "10 OZ · COMBED TWILL · BEIGE / NAVY / OLIVE",
            text: "Glatka tkanina koja stoji. Kalup koji ne smara — ni petkom, ni ponedjeljkom.",
            bg: "bg-[var(--color-ink)]",
          },
          {
            n: "03",
            to: "/cargo" as const,
            label: "CARGO",
            ital: "Utility Programme",
            spec: "11 OZ · 6-POCKET · BLACK / SAND / SEASONAL",
            text: "Workwear DNA. Džepovi koji nešto znače, fit koji nije šator.",
            bg: "bg-[var(--color-indigo-mid)]",
          },
        ].map((c) => (
          <Link
            key={c.n}
            to={c.to}
            className={`group relative block ${c.bg} text-background overflow-hidden border-b border-background/10`}
          >
            <div className="container-x grid lg:grid-cols-12 gap-8 items-center py-16 md:py-24 relative">
              <div className="lg:col-span-1 spec text-[var(--color-selvedge)]">N° {c.n}</div>
              <div className="lg:col-span-6">
                <div className="editorial-h text-[clamp(3rem,9vw,8rem)] leading-none">
                  {c.label}
                  <span className="text-[var(--color-selvedge)]">.</span>
                </div>
                <div className="mt-3 serif italic text-2xl text-background/80">{c.ital}</div>
              </div>
              <div className="lg:col-span-4 lg:border-l lg:border-background/20 lg:pl-8">
                <div className="spec text-background/65">{c.spec}</div>
                <p className="mt-4 text-background/85 text-[15px] leading-relaxed">{c.text}</p>
                <div className="mt-6 spec inline-flex items-center gap-2 text-[var(--color-copper)]">
                  Pogledaj liniju
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
              <div className="lg:col-span-1 hidden lg:block text-right spec text-background/40">/ 03</div>
            </div>
            {/* hover sweep */}
            <div className="absolute inset-y-0 left-0 w-0 bg-[var(--color-selvedge)]/15 group-hover:w-full transition-[width] duration-700 ease-out pointer-events-none" />
          </Link>
        ))}
      </section>

      {/* ============== WHY BOUTIQUES CHOOSE EXIT ============== */}
      <section className="section-pad">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-10 mb-16">
            <div className="lg:col-span-5">
              <div className="eyebrow">Why boutiques choose EXIT</div>
              <h2 className="mt-5 editorial-h text-[clamp(2rem,4vw,3.5rem)]">
                Roba koja se okreće.<br/>
                <span className="italic">Marža</span> koja drži butik.
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <p className="text-base text-foreground/70 leading-relaxed max-w-xl">
                Šest razloga zbog kojih butici od Beograda do Ljubljane drže EXIT Denim na svojim policama tokom cijele godine.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 -mt-px -ml-px">
            {[
              { icon: TrendingUp, n: "01", title: "Stabilne marže", text: "Veleprodajna cijena drži maloprodaju na 2.5–3.2×. Bez sezonskih iznenađenja." },
              { icon: Ruler, n: "02", title: "Stabilan fit", text: "Slim, Regular Slim, Relaxed i Cargo — testirano na hiljade kupaca, bez razvlačenja." },
              { icon: Scissors, n: "03", title: "Pune veličine", text: "Veličine 31–40 stalno na stanju. Bez praznina u sredini grid-a." },
              { icon: Truck, n: "04", title: "Brza regionalna isporuka", text: "5–10 dana do Beograda, Sarajeva, Podgorice, Zagreba, Skoplja, Ljubljane." },
              { icon: ShieldCheck, n: "05", title: "Kvalitet u proizvodnji", text: "Vlastita proizvodnja u Novom Pazaru. Kontrola kvaliteta na svakoj seriji." },
              { icon: Repeat, n: "06", title: "Repeat orders", text: "Best-selleri se rade kontinuirano. Tvoj butik ne ostaje bez najtraženijih modela." },
            ].map((f) => (
              <div key={f.title} className="border-t border-l border-border p-8 group hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <f.icon className="w-5 h-5 text-foreground" strokeWidth={1.25} />
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground tabular-nums">{f.n}</span>
                </div>
                <div className="serif text-2xl mt-7">{f.title}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-[1.7]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== BEST SELLERS ============== */}
      <section className="border-t border-border bg-background section-pad">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <div className="eyebrow">Catalogue · Best Sellers</div>
              <h2 className="mt-5 editorial-h text-[clamp(2rem,4vw,3.5rem)]">
                The boutique <span className="italic">essentials</span>.
              </h2>
            </div>
            <Link to="/katalog" className="btn-outline">Full Catalogue</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} showPrice={approved} />)}
          </div>
        </div>
      </section>

      {/* ============== HOW PARTNERSHIP WORKS ============== */}
      <section className="bg-foreground text-background section-pad">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-6">
              <div className="text-[10px] uppercase tracking-[0.32em] text-accent">Partner Onboarding</div>
              <h2 className="mt-5 editorial-h text-[clamp(2rem,4vw,3.5rem)] text-background">
                Od prijave do prve pošiljke <span className="italic">u 7 dana</span>.
              </h2>
            </div>
            <div className="lg:col-span-6 flex items-end">
              <p className="text-base text-background/70 leading-relaxed max-w-md">
                Pristup veleprodajnom katalogu odobravamo butik partnerima, online prodavcima i distributerima koji žele stabilnu denim ponudu.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-px bg-background/10">
            {[
              ["01", "Prijava butika", "Popuniš B2B formu — Instagram, lokacija, mjesečni volumen."],
              ["02", "Odobrenje računa", "Provjeravamo profil butika i odobravamo B2B pristup."],
              ["03", "B2B katalog", "Pristup veleprodajnim cijenama, stocku po veličinama i line sheets."],
              ["04", "Narudžba & isporuka", "Šalješ upit kroz size matrix, mi potvrđujemo i šaljemo za 5–10 dana."],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-foreground p-7">
                <div className="serif text-5xl text-accent tabular-nums">{n}</div>
                <div className="mt-6 serif text-2xl text-background">{t}</div>
                <p className="mt-3 text-sm text-background/65 leading-[1.7]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PRODUCTION ============== */}
      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-secondary order-2 lg:order-1">
            <img src={workshopAsset.url} alt="EXIT Denim workshop in Novi Pazar" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <div className="eyebrow">Production · Novi Pazar</div>
            <h2 className="mt-6 editorial-h text-[clamp(2rem,4vw,3.5rem)]">
              From Novi Pazar to <span className="italic">regional retail shelves</span>.
            </h2>
            <p className="mt-7 text-base text-foreground/75 leading-relaxed max-w-lg">
              Vlastiti proizvodni kapacitet, decenije iskustva u tekstilu. Krajamo, šijemo i finalno doradjujemo svaki par u Novom Pazaru — bez outsourceanja, bez kompromisa po pitanju fit-a.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Vlastita krojnica i šivnica",
                "Kontrola kvaliteta na svakoj seriji",
                "Repeat production na best-sellere",
                "Custom brending i tag-ovi za partnere",
              ].map((i) => (
                <li key={i} className="flex gap-3 items-start">
                  <Check className="w-4 h-4 mt-1 text-accent shrink-0" strokeWidth={1.5} />
                  <span className="text-foreground/85">{i}</span>
                </li>
              ))}
            </ul>
            <Link to="/proizvodnja" className="btn-outline mt-10">Production Story</Link>
          </div>
        </div>
      </section>

      {/* ============== STARTER PACKS ============== */}
      <section className="section-pad bg-foreground text-background border-t border-background/10">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
            <div className="lg:col-span-7">
              <div className="text-[10px] uppercase tracking-[0.32em] text-accent">Starter Packs · Boutique edit</div>
              <h2 className="mt-5 editorial-h text-[clamp(2rem,4vw,3.5rem)] text-background">
                Tri paketa za <span className="italic">prvu narudžbu</span>.
              </h2>
              <p className="mt-6 text-background/70 max-w-lg leading-relaxed">
                Optimizovan miks veličina i modela za butike koji startuju saradnju sa EXIT Denim.
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link to="/auth" className="btn-accent">Request a Pack</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-background/10">
            {[
              { name: "Starter", pieces: 60, price: 890, models: "3 modela jeans" },
              { name: "Boutique", pieces: 120, price: 1690, models: "4 jeans + 2 chino", featured: true },
              { name: "Premium", pieces: 240, price: 3180, models: "Full miks: jeans / chino / cargo" },
            ].map((p) => (
              <div
                key={p.name}
                className={`p-8 md:p-10 ${p.featured ? "bg-background text-foreground" : "bg-foreground text-background"}`}
              >
                {p.featured && <div className="text-[10px] uppercase tracking-[0.32em] text-accent mb-3">Most chosen</div>}
                <div className="serif text-3xl">{p.name}</div>
                <div className={`mt-1 text-[11px] uppercase tracking-[0.22em] ${p.featured ? "text-muted-foreground" : "text-background/55"}`}>
                  {p.models}
                </div>
                <div className="mt-8 flex items-baseline gap-3">
                  <div className="serif text-6xl tabular-nums">€{p.price}</div>
                  <div className={`text-[11px] uppercase tracking-[0.22em] ${p.featured ? "text-muted-foreground" : "text-background/55"}`}>
                    / {p.pieces} kom
                  </div>
                </div>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Optimizovan size run 31–40",
                    "Garantovan stock",
                    "Brending i tag-ovi uključeni",
                    p.featured ? "Personalizovani line sheet" : "Standardni line sheet",
                  ].map((i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" strokeWidth={1.5} />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="section-pad bg-background">
        <div className="container-x">
          <div className="border-y border-foreground py-16 md:py-24 text-center">
            <div className="eyebrow">Spreman za saradnju?</div>
            <h2 className="mt-6 editorial-h text-[clamp(2.5rem,6vw,5.5rem)] max-w-4xl mx-auto">
              Otvorimo B2B nalog za tvoj butik <span className="italic">u 24h.</span>
            </h2>
            <p className="mt-7 text-foreground/70 max-w-xl mx-auto leading-relaxed">
              Pošalji prijavu — javljamo se sa veleprodajnim cijenama, line sheets i preporukom starter paketa.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link to="/auth" className="btn-primary">Zatraži B2B pristup</Link>
              <Link to="/kontakt" className="btn-outline">Kontakt</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
