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
      {/* ============== HERO ============== */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroAsset.url}
            alt=""
            className="w-full h-full object-cover opacity-60 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-foreground/30" />
          {/* copper hairline accent */}
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        </div>

        <div className="container-x relative pt-28 pb-20 md:pt-40 md:pb-32 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.36em] text-accent">
                <span className="inline-block w-8 h-px bg-accent" />
                Maison · B2B Wholesale · Est. Novi Pazar
              </div>
            </Reveal>
            <Reveal delay={1} as="h1" className="mt-7 editorial-h text-[clamp(2.75rem,9vw,7.5rem)] text-background">
              <>EXIT Denim<br/>
              <span className="italic font-light text-background/90">B2B Showroom</span></>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 text-base md:text-lg text-background/80 max-w-xl leading-relaxed">
                Premium muški denim za butike koji traže kvalitet, stabilan fit i robu koja se brzo okreće.
                Krojen, sašiven i dorađen u <span className="text-accent">Novom Pazaru</span>.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/auth" className="btn-accent">
                  Zatraži B2B pristup <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/katalog" className="btn-outline border-background text-background hover:bg-background hover:text-foreground">
                  Pogledaj kolekciju
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <Reveal delay={2}>
              <div className="border-l border-accent/40 pl-8">
                <div className="text-[10px] uppercase tracking-[0.32em] text-accent">Wholesale Index</div>
                <dl className="mt-6 space-y-5">
                  {[
                    ["Aktivni artikli", String(products.length || 8)],
                    ["Veličine", "31 — 40"],
                    ["MOQ / artikl", "10 kom"],
                    ["Isporuka regija", "5–10 dana"],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-baseline justify-between gap-4 border-b border-background/15 pb-3">
                      <dt className="text-xs uppercase tracking-[0.18em] text-background/55">{l}</dt>
                      <dd className="serif text-2xl text-background tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 text-xs text-background/65">
                  Prosječna marža butika: <span className="text-accent serif text-lg">2.5–3.2×</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Marquee trust strip */}
        <div className="border-t border-background/15 relative bg-foreground/40 backdrop-blur-sm overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-5 text-[10px] uppercase tracking-[0.32em] text-background/70 font-medium">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-12 px-6">
                <span>Made in Serbia</span>
                <span className="text-accent">✦</span>
                <span>Wholesale Partner Program</span>
                <span className="text-accent">✦</span>
                <span>Sizes 31 – 40</span>
                <span className="text-accent">✦</span>
                <span>Fast Regional Delivery</span>
                <span className="text-accent">✦</span>
                <span>Repeat Order Friendly</span>
                <span className="text-accent">✦</span>
                <span>Own Atelier · Novi Pazar</span>
                <span className="text-accent">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== EDITORIAL INTRO ============== */}
      <section className="section-pad">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="eyebrow">House Statement · 001</div>
              <h2 className="mt-6 editorial-h text-[clamp(2.25rem,5vw,4.5rem)] max-w-3xl">
                Denim built for <span className="italic">retail rotation</span>. <br/>
                Designed for boutiques. Produced for repeat orders.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base text-foreground/75 leading-[1.75] max-w-md">
                EXIT Denim je privatni B2B showroom iz Novog Pazara. Radimo isključivo sa butik partnerima,
                online prodavcima i regionalnim distributerima koji žele stabilnu denim ponudu, jake marže i robu koja se vraća na police.
              </p>
              <div className="mt-7 flex gap-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>Tailored fits</span>
                <span>Honest fabrics</span>
                <span>Repeat stock</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FEATURED CATEGORIES ============== */}
      <section className="border-y border-border bg-secondary section-pad">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <div className="eyebrow">Three lines · One catalogue</div>
              <h2 className="mt-5 editorial-h text-[clamp(2rem,4vw,3.5rem)]">
                Premium fit. <span className="italic">Reliable stock.</span> Strong margins.
              </h2>
            </div>
            <Link to="/katalog" className="link-underline text-[11px] uppercase tracking-[0.22em] font-medium pb-1">
              View complete catalogue →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-1.5">
            {[
              { to: "/jeans" as const, label: "Jeans", desc: "Indigo · Black · Stone Wash", num: "01", bg: "linear-gradient(160deg, #1a2438 0%, #050505 100%)" },
              { to: "/chino" as const, label: "Chino", desc: "Beige · Navy · Olive", num: "02", bg: "linear-gradient(160deg, #4a5240 0%, #1a1d18 100%)" },
              { to: "/cargo" as const, label: "Cargo", desc: "Black · Sand · Seasonal", num: "03", bg: "linear-gradient(160deg, #2a2a2a 0%, #050505 100%)" },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative aspect-[4/5] overflow-hidden flex flex-col justify-between p-7 text-background"
                style={{ background: c.bg }}
              >
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-700" />
                <div className="relative text-[10px] uppercase tracking-[0.32em] text-background/60 tabular-nums">{c.num} / 03</div>
                <div className="relative">
                  <div className="editorial-h text-5xl md:text-6xl">{c.label}</div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-background/70 mt-3">{c.desc}</div>
                  <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-accent">
                    Explore line <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
