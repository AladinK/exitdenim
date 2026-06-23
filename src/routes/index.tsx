import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Package, Ruler, Truck, ShieldCheck, TrendingUp, Repeat } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";
import { getMyProfile } from "@/lib/orders.functions";
import { useAuth } from "@/hooks/useAuth";
import heroAsset from "@/assets/hero-banner.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXIT Denim — Postani B2B partner | Wholesale Denim" },
      { name: "description", content: "Premium denim iz Novog Pazara za butike koji žele robu koja se brzo okreće. Wholesale cijene, stabilan fit, brza isporuka u regiji." },
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
      {/* Hero */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroAsset.url} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />
        </div>
        <div className="container-x relative py-20 md:py-32 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="eyebrow text-accent">B2B Wholesale · Novi Pazar, Srbija</div>
            <h1 className="mt-5 text-5xl md:text-7xl leading-[0.95]">
              Postani <span className="text-accent">EXIT Denim</span> partner
            </h1>
            <p className="mt-6 text-lg md:text-xl text-background/85 max-w-xl leading-relaxed">
              Premium denim iz Novog Pazara za butike koji žele robu koja se brzo okreće.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/auth" className="btn-accent">
                Zatraži B2B pristup <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/katalog" className="btn-outline border-background text-background hover:bg-background hover:text-foreground">
                Pogledaj katalog
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="border border-background/20 rounded-sm p-6 backdrop-blur-sm bg-background/5">
              <div className="eyebrow text-background/60">Trenutna sezona</div>
              <div className="mt-3 grid grid-cols-2 gap-y-4 gap-x-6">
                <Stat label="Aktivnih artikala" value={String(products.length || 8)} />
                <Stat label="Veličine" value="31–40" />
                <Stat label="MOQ po artiklu" value="10 kom" />
                <Stat label="Isporuka regija" value="5–10 dana" />
              </div>
              <div className="mt-6 pt-5 border-t border-background/15 text-sm text-background/70">
                Prosječna marža butika: <span className="text-accent font-semibold">2.5–3.2×</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 relative">
          <div className="container-x py-5 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-widest text-background/60 font-medium">
            <span>Made in Serbia</span>
            <span className="hidden md:inline">·</span>
            <span>Wholesale Prices</span>
            <span className="hidden md:inline">·</span>
            <span>Veličine 31–40</span>
            <span className="hidden md:inline">·</span>
            <span>Regionalna isporuka</span>
            <span className="hidden md:inline">·</span>
            <span>Repeat Orders</span>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section-pad">
        <div className="container-x">
          <div className="max-w-2xl">
            <div className="eyebrow">Zašto butici biraju EXIT Denim</div>
            <h2 className="mt-3 text-4xl md:text-5xl">Roba koja se okreće. Marža koja drži butik.</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Stabilne marže", text: "Veleprodajna cijena drži maloprodaju na 2.5–3.2×. Bez sezonskih iznenađenja." },
              { icon: Ruler, title: "Stabilan fit", text: "Slim, Regular Slim, Relaxed i Cargo — testirano na hiljade kupaca, bez razvlačenja." },
              { icon: Package, title: "Pune veličine", text: "Veličine 31–40 stalno na stanju. Bez praznina u sredini grid-a." },
              { icon: Truck, title: "Brza regionalna isporuka", text: "5–10 dana do Beograda, Sarajeva, Podgorice, Zagreba, Skoplja, Ljubljane." },
              { icon: ShieldCheck, title: "Kvalitet u proizvodnji", text: "Vlastita proizvodnja u Novom Pazaru. Kontrola kvaliteta na svakoj seriji." },
              { icon: Repeat, title: "Repeat orders", text: "Best-selleri se rade kontinuirano. Tvoj butik ne ostaje bez najtraženijih modela." },
            ].map((f) => (
              <div key={f.title} className="border border-border rounded-sm p-6 bg-card">
                <f.icon className="w-6 h-6 text-accent" />
                <div className="mt-4 font-semibold text-lg">{f.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories + best sellers */}
      <section className="section-pad bg-secondary">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="eyebrow">Best-selling kategorije</div>
              <h2 className="mt-3 text-4xl md:text-5xl">Tri linije koje pokrivaju butik</h2>
            </div>
            <Link to="/katalog" className="btn-outline">Cijeli katalog</Link>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { to: "/jeans", label: "Jeans", desc: "Indigo, Black, Stone wash", color: "#1f2a44" },
              { to: "/chino", label: "Chino", desc: "Beige, Navy, Olive", color: "#6b7a3a" },
              { to: "/cargo", label: "Cargo", desc: "Black, Sand — sezonski hit", color: "#2a2a2a" },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative aspect-[4/5] rounded-sm overflow-hidden flex items-end p-6"
                style={{ background: `linear-gradient(180deg, ${c.color}cc, #0d0d0d)` }}
              >
                <div className="text-background relative z-10">
                  <div className="text-3xl md:text-4xl font-display font-semibold">{c.label}</div>
                  <div className="text-sm text-background/70 mt-1">{c.desc}</div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Pogledaj liniju <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-20">
            <div className="eyebrow">Top 4 best-sellera</div>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {bestSellers.map((p) => <ProductCard key={p.id} product={p} showPrice={approved} />)}
            </div>
          </div>
        </div>
      </section>

      {/* How partnership works */}
      <section className="section-pad">
        <div className="container-x">
          <div className="eyebrow">Kako partnerstvo funkcioniše</div>
          <h2 className="mt-3 text-4xl md:text-5xl max-w-2xl">Od prijave do prve pošiljke u 7 dana</h2>
          <div className="mt-12 grid md:grid-cols-4 gap-4">
            {[
              ["01", "Prijava butika", "Popuniš B2B formu — Instagram, lokacija, mjesečni volumen."],
              ["02", "Odobrenje računa", "Provjeravamo profil butika i odobravamo B2B pristup."],
              ["03", "B2B katalog", "Pristup veleprodajnim cijenama, stocku po veličinama i line sheets."],
              ["04", "Narudžba & isporuka", "Šalješ upit kroz size matrix, mi potvrđujemo i šaljemo za 5–10 dana."],
            ].map(([n, t, d]) => (
              <div key={n} className="border-t-2 border-foreground pt-5">
                <div className="text-3xl font-display font-semibold tabular-nums">{n}</div>
                <div className="mt-3 font-semibold">{t}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Starter packs */}
      <section className="section-pad bg-foreground text-background">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-10 items-end">
            <div>
              <div className="eyebrow text-accent">Starter paketi za butike</div>
              <h2 className="mt-3 text-4xl md:text-5xl">Tri paketa za prvu narudžbu</h2>
              <p className="mt-5 text-background/70 max-w-lg leading-relaxed">
                Optimizovan miks veličina i modela za butike koji startuju saradnju sa EXIT Denim.
              </p>
            </div>
            <Link to="/auth" className="btn-accent justify-self-start lg:justify-self-end">Zatraži paket</Link>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {[
              { name: "Starter", pieces: 60, price: 890, models: "3 modela jeans" },
              { name: "Boutique", pieces: 120, price: 1690, models: "4 jeans + 2 chino", featured: true },
              { name: "Premium", pieces: 240, price: 3180, models: "Full miks: jeans / chino / cargo" },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-sm p-7 border ${p.featured ? "bg-background text-foreground border-accent" : "bg-background/5 border-background/15"}`}
              >
                {p.featured && <div className="eyebrow text-accent mb-2">Najpopularniji</div>}
                <div className="text-2xl font-semibold">{p.name}</div>
                <div className={`mt-1 text-sm ${p.featured ? "text-muted-foreground" : "text-background/60"}`}>{p.models}</div>
                <div className="mt-6 flex items-baseline gap-2">
                  <div className="text-4xl font-display font-bold">€{p.price}</div>
                  <div className={`text-xs ${p.featured ? "text-muted-foreground" : "text-background/60"}`}>/{p.pieces} kom</div>
                </div>
                <ul className="mt-6 space-y-2 text-sm">
                  {[
                    "Optimizovan size run 31–40",
                    "Garantovan stock",
                    "Brending i tag-ovi uključeni",
                    p.featured ? "Personalizovani line sheet" : "Standardni line sheet",
                  ].map((i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <Check className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-pad">
        <div className="container-x">
          <div className="border border-foreground rounded-sm p-10 md:p-16 text-center">
            <div className="eyebrow">Spreman za saradnju?</div>
            <h2 className="mt-3 text-4xl md:text-5xl max-w-3xl mx-auto">Otvorimo B2B nalog za tvoj butik u 24h.</h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Pošalji prijavu — javljamo se sa veleprodajnim cijenama, line sheets i preporukom starter paketa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/auth" className="btn-primary">Zatraži B2B pristup</Link>
              <Link to="/kontakt" className="btn-outline">Kontakt</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-3xl font-display font-semibold">{value}</div>
      <div className="text-xs text-background/60 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
