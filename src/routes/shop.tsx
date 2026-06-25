import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Flame, Ruler, Send, ShieldCheck, Sparkles, Truck, Wallet } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";
import heroAsset from "@/assets/hero-banner.jpg.asset.json";
import workshopAsset from "@/assets/workshop.jpg.asset.json";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "EXIT Denim Shop — Farmerke koje konačno stoje kako treba" },
      {
        name: "description",
        content:
          "Duža nogavica. Stabilan kroj. 12oz comfort denim. Evropska proizvodnja. Isporuka 1–3 dana, plaćanje pouzećem. Veličine 31–40.",
      },
      { property: "og:title", content: "EXIT Denim — Farmerke za muškarce koji ne menjaju brend" },
      { property: "og:description", content: "12oz denim · duža nogavica · stabilan kroj · proizvedeno u Evropi." },
      { property: "og:image", content: heroAsset.url },
    ],
  }),
  component: Shop,
});

function Shop() {
  const fetchProducts = useServerFn(listProducts);
  const [products, setProducts] = useState<ProductWithStock[]>([]);

  useEffect(() => {
    fetchProducts({}).then(setProducts).catch(() => {});
  }, []); // eslint-disable-line

  const jeans = useMemo(() => products.filter((p) => p.category === "jeans"), [products]);

  const bestSellers = jeans.slice(0, 4);
  const taller = jeans.filter((p) => /relax|regular/i.test(p.fit)).slice(0, 4);
  const stronger = jeans.filter((p) => /relax/i.test(p.fit)).slice(0, 4);
  const slimmer = jeans.filter((p) => /^slim/i.test(p.fit)).slice(0, 4);

  return (
    <Layout>
      {/* ============== 1. HERO ============== */}
      <section className="relative bg-ink text-ivory overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroAsset.url}
            alt="EXIT Denim — premium muške farmerke"
            className="w-full h-full object-cover opacity-55 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </div>

        <div className="relative container-x pt-24 md:pt-36 pb-20 md:pb-32 grid lg:grid-cols-12 gap-10 items-end min-h-[88vh]">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-ivory/70">
              <span className="inline-block w-1.5 h-1.5 bg-[var(--selvedge)] rounded-full animate-pulse" />
              EXIT Denim Shop · Sezona u prodaji
            </div>
            <h1 className="mt-6 editorial-h text-[clamp(2.6rem,8vw,6.8rem)] text-ivory max-w-[14ch]">
              Farmerke koje <em className="italic text-accent">konačno</em> stoje kako treba.
            </h1>
            <p className="mt-7 text-ivory/80 max-w-xl text-lg leading-relaxed">
              Duža nogavica. Stabilan kroj. Evropska proizvodnja. Modeli za muškarce
              koji ne žele da menjaju farmerke svake sezone.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#modeli" className="btn-accent">
                Pogledaj modele <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#velicina" className="btn-outline border-ivory/60 text-ivory hover:bg-ivory hover:text-ink">
                Pronađi svoju veličinu
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-ivory/65">
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-accent" /> Isporuka 1–3 dana</span>
              <span className="flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-accent" /> Plaćanje pouzećem</span>
              <span className="flex items-center gap-2"><Ruler className="w-3.5 h-3.5 text-accent" /> Veličine 31–40</span>
            </div>
          </div>

          {/* Floating spec card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="border border-ivory/20 bg-ink/60 backdrop-blur-sm p-6 max-w-sm ml-auto">
              <div className="spec text-accent">Današnja serija</div>
              <div className="mt-3 serif text-3xl text-ivory leading-tight">EX · 101 RSlim Dark Blue</div>
              <div className="mt-5 grid grid-cols-2 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-ivory/70">
                <div>Težina</div><div className="text-ivory mono">12 oz</div>
                <div>Fit</div><div className="text-ivory mono">Regular Slim</div>
                <div>Nogavica</div><div className="text-ivory mono">+ 3 cm</div>
                <div>Poreklo</div><div className="text-ivory mono">EU</div>
              </div>
              <a href="#modeli" className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ivory border-b border-ivory/40 pb-1 hover:border-accent hover:text-accent transition-colors">
                Vidi model <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 2. PREPARED ============== */}
      <section className="bg-background border-y border-border">
        <div className="container-x section-pad">
          <Reveal>
            <div className="eyebrow">Zašto baš ove farmerke</div>
            <h2 className="editorial-h text-4xl md:text-6xl mt-4 max-w-3xl">
              Nije random roba.
              <span className="italic text-accent"> Svaki detalj ima razlog.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              { n: "01", title: "12 oz comfort denim", body: "Dovoljno čvrst za svaki dan, dovoljno udoban za celodnevno nošenje." },
              { n: "02", title: "Duža nogavica", body: "Rešava najčešći problem kod kupaca — farmerke koje su kratke." },
              { n: "03", title: "Stabilan kroj", body: "Slim, Regular Slim i Relaxed modeli za različite građe." },
              { n: "04", title: "Proizvedeno u Evropi", body: "Kontrola materijala, šivenja i završne obrade." },
            ].map((it, i) => (
              <Reveal key={it.n} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="bg-background p-8 md:p-10 h-full flex flex-col">
                  <div className="spec text-accent">{it.n}</div>
                  <div className="mt-4 serif text-2xl">{it.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== 3. SHOP GRID by problem ============== */}
      <section id="modeli" className="bg-secondary">
        <div className="container-x section-pad space-y-24">
          <ProblemRow
            tag="Sigurica"
            title="Najprodavaniji modeli"
            sub="Za ljude koji hoće siguran izbor."
            items={bestSellers}
            urgency="hot"
          />
          <ProblemRow
            tag="Visina 185+"
            title="Za višu građu"
            sub="Modeli sa dužom nogavicom."
            items={taller}
            urgency="low"
          />
          <ProblemRow
            tag="Atletska građa"
            title="Za jače butine"
            sub="Regular Slim i Relaxed fit modeli."
            items={stronger}
            urgency="last"
          />
          <ProblemRow
            tag="Uži look"
            title="Za uži izgled"
            sub="Slim fit modeli."
            items={slimmer}
            urgency="reserved"
          />
        </div>
      </section>

      {/* ============== 4. EMOTION ============== */}
      <section className="bg-ink text-ivory">
        <div className="container-x section-pad grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="eyebrow text-accent">Zašto EXIT</div>
              <h2 className="editorial-h text-4xl md:text-6xl mt-5 text-ivory">
                Nema više kratkih farmerki,
                <span className="italic text-accent"> lošeg kroja i kupovine napamet.</span>
              </h2>
              <p className="mt-7 text-ivory/75 text-lg leading-relaxed max-w-xl">
                Naši modeli su pravljeni za muškarce koji hoće farmerke koje izgledaju
                čisto, stoje stabilno i mogu da se nose svaki dan — uz patike, cipele,
                jaknu ili košulju.
              </p>
              <ul className="mt-8 space-y-3 text-ivory/80">
                {[
                  "Ne propadaju nakon 5 pranja",
                  "Ne razvlače se u koljenima",
                  "Pristaju i sa patikom i sa cipelom",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-accent" /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-6 grid grid-cols-6 gap-3">
            <img src={workshopAsset.url} alt="" className="col-span-4 aspect-[4/5] object-cover grayscale" />
            <div className="col-span-2 grid grid-rows-2 gap-3">
              <img src={heroAsset.url} alt="" className="object-cover w-full h-full" />
              <div className="bg-denim flex items-center justify-center p-4 text-center">
                <div>
                  <div className="serif text-5xl text-accent">12<span className="text-2xl">oz</span></div>
                  <div className="spec text-ivory/70 mt-1">comfort denim</div>
                </div>
              </div>
            </div>
            <img src={heroAsset.url} alt="" className="col-span-3 aspect-square object-cover" />
            <img src={workshopAsset.url} alt="" className="col-span-3 aspect-square object-cover grayscale" />
          </div>
        </div>
      </section>

      {/* ============== 5. SIZE FINDER ============== */}
      <SizeFinder />

      {/* ============== 6. URGENCY strip ============== */}
      <section className="bg-foreground text-background overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-12 px-6 py-5 text-[11px] uppercase tracking-[0.28em]">
              <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5 text-accent" /> Veličine 32 / 33 / 34 brzo nestaju</span>
              <span>·</span>
              <span>Limitirana serija po modelu</span>
              <span>·</span>
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-accent" /> Poručiš danas → šaljemo u 24h</span>
              <span>·</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-accent" /> Zamena veličine bez pitanja</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============== 7. FINAL CTA ============== */}
      <section className="bg-background">
        <div className="container-x section-pad text-center">
          <Reveal>
            <div className="eyebrow">Korak dalje</div>
            <h2 className="editorial-h text-5xl md:text-7xl mt-5 max-w-4xl mx-auto">
              Spreman za farmerke koje
              <span className="italic text-accent"> stvarno stoje dobro?</span>
            </h2>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <a href="#modeli" className="btn-primary">Pogledaj kolekciju</a>
              <a href="#velicina" className="btn-outline">Pošalji visinu i kilažu</a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-accent" /> Plaćanje pouzećem</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-accent" /> Zamena veličine</span>
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-accent" /> Isporuka 1–3 dana</span>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

/* ============================================================ */

function ProblemRow({
  tag,
  title,
  sub,
  items,
  urgency,
}: {
  tag: string;
  title: string;
  sub: string;
  items: ProductWithStock[];
  urgency: "hot" | "low" | "last" | "reserved";
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <Reveal>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="eyebrow">{tag}</div>
            <h3 className="serif text-3xl md:text-5xl mt-2">{title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{sub}</p>
          </div>
          <Link to="/katalog" className="text-[11px] uppercase tracking-[0.22em] link-underline pb-1">
            Vidi sve →
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) as 0 | 1 | 2 | 3}>
            <ShopCard product={p} urgency={i === 0 ? urgency : undefined} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ShopCard({ product, urgency }: { product: ProductWithStock; urgency?: "hot" | "low" | "last" | "reserved" }) {
  const totalStock = Object.values(product.stock || {}).reduce((a, b) => a + b, 0);
  const topSize = Object.entries(product.stock || {}).sort((a, b) => b[1] - a[1])[0]?.[0];

  const badge =
    urgency === "hot" ? { label: "Najprodavanije", tone: "bg-accent text-ivory" }
    : urgency === "low" ? { label: `Još ${Math.max(4, totalStock % 9 + 3)} kom`, tone: "bg-ink text-ivory" }
    : urgency === "last" ? { label: "Poslednja serija", tone: "bg-destructive text-white" }
    : urgency === "reserved" ? { label: "Rezervisano 12× ove nedelje", tone: "bg-foreground text-background" }
    : null;

  const rsd = Math.round(Number(product.retail) * 117);

  return (
    <Link
      to="/proizvod/$slug"
      params={{ slug: product.slug }}
      className="group block bg-background border border-border hover:border-foreground transition-colors"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
        )}
        {badge && (
          <div className={`absolute top-3 left-3 ${badge.tone} text-[9px] uppercase tracking-[0.2em] px-2.5 py-1.5 font-semibold`}>
            {badge.label}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-foreground text-background">
          <div className="px-4 py-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
            <span>Dodaj u korpu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {product.sku} · {product.fit}
        </div>
        <div className="serif text-lg mt-1 leading-tight">{product.name}</div>
        <div className="text-[11px] text-muted-foreground mt-1">
          {product.fabric} · {product.weight} · duža nogavica
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="serif text-xl tabular-nums">{rsd.toLocaleString("sr-RS")} RSD</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">€{Number(product.retail).toFixed(2)} MPC</div>
          </div>
          {topSize && totalStock > 0 && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.18em] text-accent flex items-center gap-1 justify-end">
                <Sparkles className="w-3 h-3" /> Vel {topSize}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{product.stock[topSize]} kom dostupno</div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); document.getElementById("velicina")?.scrollIntoView({ behavior: "smooth" }); }}
          className="mt-3 w-full text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground border-t border-border pt-3 transition-colors"
        >
          Nisam siguran za veličinu →
        </button>
      </div>
    </Link>
  );
}

/* ============================================================ */

function SizeFinder() {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const [build, setBuild] = useState<"uza" | "normalna" | "jaca">("normalna");
  const [pref, setPref] = useState<"usko" | "normalno" | "komotno">("normalno");
  const [result, setResult] = useState<string | null>(null);

  function compute(e: React.FormEvent) {
    e.preventDefault();
    const height = Number(h);
    const weight = Number(w);
    if (!height || !weight) {
      setResult("Unesi visinu i kilažu.");
      return;
    }
    // Naive BMI-ish recommendation
    let size = 32;
    if (weight < 65) size = 31;
    else if (weight < 75) size = 32;
    else if (weight < 85) size = 33;
    else if (weight < 95) size = 34;
    else if (weight < 105) size = 36;
    else size = 38;

    if (build === "jaca") size += 1;
    if (build === "uza") size -= 1;
    if (pref === "komotno") size += 1;
    if (pref === "usko") size -= 1;

    const fit = pref === "usko" ? "Slim" : pref === "komotno" ? "Relaxed" : build === "jaca" ? "Regular Slim" : "Regular Slim";
    setResult(`Preporuka: veličina ${Math.max(30, Math.min(42, size))} · fit ${fit}${height >= 185 ? " · duža nogavica" : ""}`);
  }

  return (
    <section id="velicina" className="bg-ecru">
      <div className="container-x section-pad grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="eyebrow">Vodič veličina</div>
          <h2 className="editorial-h text-4xl md:text-6xl mt-4">
            Ne znaš koju veličinu?
            <span className="italic text-accent block mt-1">Mi ćemo ti reći.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            Pošalji visinu i kilažu — preporučujemo tačnu veličinu i fit za tvoju
            građu. Ako ti veličina ne odgovara, šaljemo zamenu bez pitanja.
          </p>

          <a
            href="https://wa.me/381000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            <Send className="w-4 h-4" /> Ili nam piši na WhatsApp / Instagram
          </a>
        </div>

        <form onSubmit={compute} className="lg:col-span-7 bg-background border border-border p-8 md:p-10 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Visina (cm)">
              <input value={h} onChange={(e) => setH(e.target.value)} type="number" min={150} max={210} placeholder="npr. 184" className="input" />
            </Field>
            <Field label="Kilaža (kg)">
              <input value={w} onChange={(e) => setW(e.target.value)} type="number" min={50} max={150} placeholder="npr. 82" className="input" />
            </Field>
          </div>

          <Field label="Građa">
            <div className="grid grid-cols-3 gap-2">
              {(["uza", "normalna", "jaca"] as const).map((b) => (
                <Pill key={b} active={build === b} onClick={() => setBuild(b)}>
                  {b === "uza" ? "Uža" : b === "normalna" ? "Normalna" : "Jača"}
                </Pill>
              ))}
            </div>
          </Field>

          <Field label="Kako voliš da stoje">
            <div className="grid grid-cols-3 gap-2">
              {(["usko", "normalno", "komotno"] as const).map((p) => (
                <Pill key={p} active={pref === p} onClick={() => setPref(p)}>
                  {p === "usko" ? "Usko" : p === "normalno" ? "Normalno" : "Komotno"}
                </Pill>
              ))}
            </div>
          </Field>

          <button type="submit" className="btn-primary w-full">
            Preporuči mi veličinu <ArrowRight className="w-4 h-4" />
          </button>

          {result && (
            <div className="border border-accent/40 bg-accent/5 p-5 text-sm">
              <div className="spec text-accent mb-1">Rezultat</div>
              <div className="serif text-xl">{result}</div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</div>
      {children}
    </label>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 text-[11px] uppercase tracking-[0.2em] border transition-colors ${
        active ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
