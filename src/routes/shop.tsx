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
      { title: "EXIT Denim Продавница — Фармерке које коначно стоје како треба" },
      {
        name: "description",
        content:
          "Дужа ногавица. Стабилан крој. 12oz comfort деним. Европска производња. Испорука 1–3 дана, плаћање поузећем. Величине 31–40.",
      },
      { property: "og:title", content: "EXIT Denim — Фармерке за мушкарце који не мењају бренд" },
      { property: "og:description", content: "12oz деним · дужа ногавица · стабилан крој · произведено у Европи." },
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
      {/* HERO */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroAsset.url} alt="EXIT Denim — премијум мушке фармерке" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent" />
        </div>

        <div className="relative container-x pt-24 md:pt-36 pb-20 md:pb-32 grid lg:grid-cols-12 gap-10 items-end min-h-[88vh]">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-background/70">
              <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              EXIT Denim Продавница · Сезона у продаји
            </div>
            <h1 className="mt-6 text-[clamp(2.6rem,8vw,6.8rem)] text-background max-w-[14ch]">
              Фармерке које <em className="italic text-accent">коначно</em> стоје како треба.
            </h1>
            <p className="mt-7 text-background/80 max-w-xl text-lg leading-relaxed">
              Дужа ногавица. Стабилан крој. Европска производња. Модели за мушкарце
              који не желе да мењају фармерке сваке сезоне.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#modeli" className="btn-accent">
                Погледајте моделе <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#velicina" className="btn-outline border-background/60 text-background hover:bg-background hover:text-foreground">
                Пронађите своју величину
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-background/65">
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-accent" /> Испорука 1–3 дана</span>
              <span className="flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-accent" /> Плаћање поузећем</span>
              <span className="flex items-center gap-2"><Ruler className="w-3.5 h-3.5 text-accent" /> Величине 31–40</span>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="border border-background/20 bg-foreground/60 backdrop-blur-sm p-6 max-w-sm ml-auto">
              <div className="text-[10px] uppercase tracking-[0.28em] text-accent">Данашња серија</div>
              <div className="mt-3 serif text-3xl text-background leading-tight">EX · 101 RSlim Dark Blue</div>
              <div className="mt-5 grid grid-cols-2 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-background/70">
                <div>Тежина</div><div className="text-background mono">12 oz</div>
                <div>Крој</div><div className="text-background mono">Regular Slim</div>
                <div>Ногавица</div><div className="text-background mono">+ 3 cm</div>
                <div>Порекло</div><div className="text-background mono">ЕУ</div>
              </div>
              <a href="#modeli" className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-background border-b border-background/40 pb-1 hover:border-accent hover:text-accent transition-colors">
                Погледајте модел <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PREPARED */}
      <section className="bg-background border-y border-border">
        <div className="container-x section-pad">
          <Reveal>
            <div className="eyebrow">Зашто баш ове фармерке</div>
            <h2 className="text-4xl md:text-6xl mt-4 max-w-3xl">
              Није случајна роба.
              <span className="italic text-accent"> Сваки детаљ има разлог.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              { n: "01", title: "12 oz comfort деним", body: "Довољно чврст за сваки дан, довољно удобан за целодневно ношење." },
              { n: "02", title: "Дужа ногавица", body: "Решава најчешћи проблем код купаца — фармерке које су кратке." },
              { n: "03", title: "Стабилан крој", body: "Slim, Regular Slim и Relaxed модели за различите грађе." },
              { n: "04", title: "Произведено у Европи", body: "Контрола материјала, шивења и завршне обраде." },
            ].map((it, i) => (
              <Reveal key={it.n} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="bg-background p-8 md:p-10 h-full flex flex-col">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-accent">{it.n}</div>
                  <div className="mt-4 serif text-2xl">{it.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP GRID */}
      <section id="modeli" className="bg-secondary">
        <div className="container-x section-pad space-y-24">
          <ProblemRow tag="Сигурица" title="Најпродаванији модели" sub="За оне који желе сигуран избор." items={bestSellers} urgency="hot" />
          <ProblemRow tag="Висина 185+" title="За вишу грађу" sub="Модели са дужом ногавицом." items={taller} urgency="low" />
          <ProblemRow tag="Атлетска грађа" title="За јаче бутине" sub="Regular Slim и Relaxed модели." items={stronger} urgency="last" />
          <ProblemRow tag="Ужи изглед" title="За ужи лук" sub="Slim модели." items={slimmer} urgency="reserved" />
        </div>
      </section>

      {/* EMOTION */}
      <section className="bg-foreground text-background">
        <div className="container-x section-pad grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="eyebrow text-accent">Зашто EXIT</div>
              <h2 className="text-4xl md:text-6xl mt-5 text-background">
                Нема више кратких фармерки,
                <span className="italic text-accent"> лошег кроја и куповине напамет.</span>
              </h2>
              <p className="mt-7 text-background/75 text-lg leading-relaxed max-w-xl">
                Наши модели прављени су за мушкарце који желе фармерке које изгледају
                чисто, стоје стабилно и могу да се носе сваки дан — уз патике, ципеле,
                јакну или кошуљу.
              </p>
              <ul className="mt-8 space-y-3 text-background/80">
                {[
                  "Не пропадају након 5 прања",
                  "Не развлаче се у коленима",
                  "Пристају и уз патику и уз ципелу",
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
              <div className="bg-accent flex items-center justify-center p-4 text-center">
                <div>
                  <div className="serif text-5xl text-background">12<span className="text-2xl">oz</span></div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-background/80 mt-1">comfort деним</div>
                </div>
              </div>
            </div>
            <img src={heroAsset.url} alt="" className="col-span-3 aspect-square object-cover" />
            <img src={workshopAsset.url} alt="" className="col-span-3 aspect-square object-cover grayscale" />
          </div>
        </div>
      </section>

      <SizeFinder />

      {/* URGENCY strip */}
      <section className="bg-foreground text-background overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-12 px-6 py-5 text-[11px] uppercase tracking-[0.28em]">
              <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5 text-accent" /> Величине 32 / 33 / 34 брзо нестају</span>
              <span>·</span>
              <span>Лимитирана серија по моделу</span>
              <span>·</span>
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-accent" /> Поручите данас → шаљемо у 24h</span>
              <span>·</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-accent" /> Замена величине без питања</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-background">
        <div className="container-x section-pad text-center">
          <Reveal>
            <div className="eyebrow">Корак даље</div>
            <h2 className="text-5xl md:text-7xl mt-5 max-w-4xl mx-auto">
              Спремни за фармерке које
              <span className="italic text-accent"> стварно стоје добро?</span>
            </h2>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <a href="#modeli" className="btn-primary">Погледајте колекцију</a>
              <a href="#velicina" className="btn-outline">Пошаљите висину и кило­гра­ме</a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-accent" /> Плаћање поузећем</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-accent" /> Замена величине</span>
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-accent" /> Испорука 1–3 дана</span>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

function ProblemRow({
  tag, title, sub, items, urgency,
}: {
  tag: string; title: string; sub: string;
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
            Погледајте све →
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
    urgency === "hot" ? { label: "Најпродаваније", tone: "bg-accent text-background" }
    : urgency === "low" ? { label: `Још ${Math.max(4, totalStock % 9 + 3)} ком`, tone: "bg-foreground text-background" }
    : urgency === "last" ? { label: "Последња серија", tone: "bg-destructive text-white" }
    : urgency === "reserved" ? { label: "Резервисано 12× ове недеље", tone: "bg-foreground text-background" }
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
            <span>Додај у корпу</span>
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
          {product.fabric} · {product.weight} · дужа ногавица
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="serif text-xl tabular-nums">{rsd.toLocaleString("sr-RS")} RSD</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">€{Number(product.retail).toFixed(2)} МПЦ</div>
          </div>
          {topSize && totalStock > 0 && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.18em] text-accent flex items-center gap-1 justify-end">
                <Sparkles className="w-3 h-3" /> Вел {topSize}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{product.stock[topSize]} ком доступно</div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); document.getElementById("velicina")?.scrollIntoView({ behavior: "smooth" }); }}
          className="mt-3 w-full text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground border-t border-border pt-3 transition-colors"
        >
          Нисам сигуран за величину →
        </button>
      </div>
    </Link>
  );
}

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
      setResult("Унесите висину и кило­граме.");
      return;
    }
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

    const fit = pref === "usko" ? "Slim" : pref === "komotno" ? "Relaxed" : "Regular Slim";
    setResult(`Препорука: величина ${Math.max(30, Math.min(42, size))} · крој ${fit}${height >= 185 ? " · дужа ногавица" : ""}`);
  }

  return (
    <section id="velicina" className="bg-secondary">
      <div className="container-x section-pad grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="eyebrow">Водич величина</div>
          <h2 className="text-4xl md:text-6xl mt-4">
            Не знате коју величину?
            <span className="italic text-accent block mt-1">Ми ћемо вам рећи.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            Пошаљите висину и кило­граме — препоручујемо тачну величину и крој за вашу
            грађу. Ако вам величина не одговара, шаљемо замену без питања.
          </p>

          <a
            href="https://wa.me/381000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            <Send className="w-4 h-4" /> Или нам пишите на WhatsApp / Instagram
          </a>
        </div>

        <form onSubmit={compute} className="lg:col-span-7 bg-background border border-border p-8 md:p-10 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Висина (cm)">
              <input value={h} onChange={(e) => setH(e.target.value)} type="number" min={150} max={210} placeholder="нпр. 184" className="input" />
            </Field>
            <Field label="Кило­грами (kg)">
              <input value={w} onChange={(e) => setW(e.target.value)} type="number" min={50} max={150} placeholder="нпр. 82" className="input" />
            </Field>
          </div>

          <Field label="Грађа">
            <div className="grid grid-cols-3 gap-2">
              {(["uza", "normalna", "jaca"] as const).map((b) => (
                <Pill key={b} active={build === b} onClick={() => setBuild(b)}>
                  {b === "uza" ? "Ужа" : b === "normalna" ? "Нормална" : "Јача"}
                </Pill>
              ))}
            </div>
          </Field>

          <Field label="Како волите да стоје">
            <div className="grid grid-cols-3 gap-2">
              {(["usko", "normalno", "komotno"] as const).map((p) => (
                <Pill key={p} active={pref === p} onClick={() => setPref(p)}>
                  {p === "usko" ? "Уско" : p === "normalno" ? "Нормално" : "Комотно"}
                </Pill>
              ))}
            </div>
          </Field>

          <button type="submit" className="btn-primary w-full">
            Препоручите ми величину <ArrowRight className="w-4 h-4" />
          </button>

          {result && (
            <div className="border border-accent/40 bg-accent/5 p-5 text-sm">
              <div className="text-[10px] uppercase tracking-[0.28em] text-accent mb-1">Резултат</div>
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
