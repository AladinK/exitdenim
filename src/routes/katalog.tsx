import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";
import { getMyProfile } from "@/lib/orders.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/katalog")({
  head: () => ({
    meta: [
      { title: "Shop · Muške farmerke, chino i cargo — EXIT Denim" },
      { name: "description", content: "Muške farmerke, chino i cargo pantalone EXIT Denim. Filtriraj po kroju i veličini. Plaćaš pouzećem." },
      { property: "og:title", content: "Shop · Muške farmerke, chino i cargo — EXIT Denim" },
      { property: "og:url", content: "https://exitdenim.shop/katalog" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/katalog" }],
  }),
  validateSearch: (s: Record<string, unknown>): { fit?: string; group?: "wide"; cat?: "jeans" | "chino" | "cargo" } => ({
    fit: typeof s.fit === "string" ? s.fit : undefined,
    group: s.group === "wide" ? ("wide" as const) : undefined,
    cat: s.cat === "jeans" || s.cat === "chino" || s.cat === "cargo" ? s.cat : undefined,
  }),
  component: Katalog,
});

const WIDE_FITS = ["Relaxed", "Bootcut", "Flare"];

type Cat = "all" | "jeans" | "chino" | "cargo";
type FitFilter = "all" | "Slim" | "Regular Slim" | "Relaxed" | "Bootcut" | "Flare" | "Cargo";
type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const CATS: { key: Cat; label: string }[] = [
  { key: "all", label: "Sve" },
  { key: "jeans", label: "Farmerke" },
  { key: "chino", label: "Chino" },
  { key: "cargo", label: "Cargo" },
];
const FITS: FitFilter[] = ["all", "Slim", "Regular Slim", "Relaxed", "Bootcut", "Flare", "Cargo"];
const SIZES = ["31", "32", "33", "34", "36", "38", "40"];

function Katalog() {
  const fetchProducts = useServerFn(listProducts);
  const fetchProfile = useServerFn(getMyProfile);
  const { user } = useAuth();

  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [approved, setApproved] = useState(false);

  const search = Route.useSearch();
  const catFromSearch = (): Cat => (search.cat ?? "all") as Cat;
  const fitFromSearch = (): FitFilter =>
    (FITS as string[]).includes(search.fit ?? "") ? (search.fit as FitFilter) : "all";
  const [cat, setCat] = useState<Cat>(catFromSearch);
  const [fit, setFit] = useState<FitFilter>(fitFromSearch);
  const [wide, setWide] = useState(search.group === "wide");
  // Keep filters in sync when the menu navigates within /katalog
  useEffect(() => {
    setCat(catFromSearch());
    setFit(fitFromSearch());
    setWide(search.group === "wide");
  }, [search.cat, search.fit, search.group]); // eslint-disable-line
  const [sizes, setSizes] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => { fetchProducts({}).then(setProducts); }, []); // eslint-disable-line
  useEffect(() => {
    if (user) fetchProfile({}).then((r) => setApproved(r.profile?.status === "approved"));
  }, [user]); // eslint-disable-line

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clearAll = () => {
    setCat("all"); setFit("all"); setWide(false); setSizes([]); setQuery(""); setInStock(false); setSort("featured");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (fit !== "all" && p.fit !== fit) return false;
      if (wide && !WIDE_FITS.includes(p.fit as string)) return false;
      if (q && !(`${p.name} ${p.sku} ${p.fabric ?? ""}`.toLowerCase().includes(q))) return false;
      if (sizes.length && !sizes.some((s) => (p.stock?.[s] ?? 0) > 0)) return false;
      if (inStock && !Object.values(p.stock || {}).some((n) => n > 0)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => Number(a.retail) - Number(b.retail));
    if (sort === "price-desc") list = [...list].sort((a, b) => Number(b.retail) - Number(a.retail));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "sr"));
    return list;
  }, [products, cat, fit, wide, sizes, query, inStock, sort]);

  const activeCount =
    (cat !== "all" ? 1 : 0) + (fit !== "all" ? 1 : 0) + (wide ? 1 : 0) + sizes.length + (query ? 1 : 0) + (inStock ? 1 : 0);

  const Sidebar = (
    <aside className="space-y-8">
      {/* Search */}
      <div>
        <div className="eyebrow mb-3">Pretraga</div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Model, fit, materijal…"
            className="w-full bg-background/60 border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
      </div>

      <FilterBlock title="Kategorija">
        <ul className="space-y-2">
          {CATS.map((c) => {
            const count = c.key === "all" ? products.length : products.filter((p) => p.category === c.key).length;
            const active = cat === c.key;
            return (
              <li key={c.key}>
                <button
                  onClick={() => setCat(c.key)}
                  className={`w-full flex items-center justify-between py-1.5 text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-1 h-1 rounded-full transition-all ${active ? "bg-accent scale-150" : "bg-transparent"}`} />
                    {c.label}
                  </span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterBlock>

      <FilterBlock title="Fit">
        <div className="flex flex-wrap gap-1.5">
          {FITS.map((f) => {
            const active = fit === f;
            return (
              <button
                key={f}
                onClick={() => setFit(f)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] border transition-colors ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Svi" : f}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      <FilterBlock title="Veličina">
        <div className="grid grid-cols-4 gap-1.5">
          {SIZES.map((s) => {
            const active = sizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`py-2 text-xs serif tabular-nums border transition-colors ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-foreground/80 hover:border-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      <FilterBlock title="Dostupnost">
        <label className="flex items-center gap-2.5 text-sm cursor-pointer group">
          <span className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="peer sr-only"
            />
            <span className="w-4 h-4 border border-border peer-checked:bg-foreground peer-checked:border-foreground transition-colors" />
            <span className="absolute left-1 top-1 w-2 h-2 bg-background scale-0 peer-checked:scale-100 transition-transform" />
          </span>
          <span className="text-foreground/80 group-hover:text-foreground transition-colors">Samo na stanju</span>
        </label>
      </FilterBlock>

      {activeCount > 0 && (
        <button onClick={clearAll} className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground link-underline">
          Obriši sve ({activeCount})
        </button>
      )}
    </aside>
  );

  return (
    <Layout>
      {/* Header — denim texture */}
      <section className="bg-[var(--ink)] text-[color:var(--ivory)] border-b-2 border-[color:var(--ink)]">
        <div className="container-x py-10 md:py-16">
          <span className="sticker -rotate-2">Shop all · 2027</span>
          <div className="mt-5 grid lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h1 className="mt-4 !text-[color:var(--ivory)] text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.9] max-w-[14ch]">
                Svi <span className="text-[color:var(--acid)]">modeli.</span>
                {approved && <span className="block text-accent mt-3 text-2xl md:text-3xl serif-accent italic">— B2B pristup odobren</span>}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-sm text-[color:var(--ivory)]/75 max-w-sm lg:ml-auto leading-relaxed">
                Farmerke, chino i cargo. Veličine 31–40. Plaćaš kad stigne, dostava po celoj Srbiji.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Toolbar — sticky */}
      <div className="sticky top-[64px] z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container-x flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 border border-border text-[11px] uppercase tracking-[0.2em] hover:border-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filteri{activeCount > 0 && ` · ${activeCount}`}
            </button>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
              {filtered.length} <span className="hidden sm:inline">modela</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hidden sm:inline">Sortiraj</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent border border-border py-2 pl-3 pr-8 text-xs uppercase tracking-[0.14em] focus:outline-none focus:border-foreground appearance-none cursor-pointer"
            >
              <option value="featured">Preporučeno</option>
              <option value="price-asc">Cena ↑</option>
              <option value="price-desc">Cena ↓</option>
              <option value="name">Naziv A–Ž</option>
            </select>
          </div>
        </div>

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="container-x pb-3 flex flex-wrap gap-1.5">
            {cat !== "all" && <Chip onRemove={() => setCat("all")}>{CATS.find((c) => c.key === cat)?.label}</Chip>}
            {fit !== "all" && <Chip onRemove={() => setFit("all")}>{fit}</Chip>}
            {wide && <Chip onRemove={() => setWide(false)}>Wide & Flare</Chip>}
            {sizes.map((s) => <Chip key={s} onRemove={() => toggleSize(s)}>Veličina {s}</Chip>)}
            {inStock && <Chip onRemove={() => setInStock(false)}>Na stanju</Chip>}
            {query && <Chip onRemove={() => setQuery("")}>„{query}"</Chip>}
          </div>
        )}
      </div>

      {/* Main grid */}
      <section className="py-8 md:py-12">
        <div className="container-x grid lg:grid-cols-[240px_1fr] gap-10 lg:gap-14">
          <div className="hidden lg:block">
            <div className="sticky top-[140px]">{Sidebar}</div>
          </div>

          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-border">
                <div className="serif text-2xl">Nema rezultata</div>
                <p className="text-sm text-muted-foreground mt-2">Probaj sa manje filtera.</p>
                <button onClick={clearAll} className="btn-outline mt-6">Obriši filtere</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-5 gap-y-8 md:gap-y-12">
                {filtered.map((p) => <ProductCard key={p.id} product={p} showB2B={approved} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-background border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background">
              <div className="eyebrow">Filteri</div>
              <button onClick={() => setDrawer(false)} className="p-1 hover:text-accent"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">{Sidebar}</div>
            <div className="p-5 border-t border-border sticky bottom-0 bg-background">
              <button onClick={() => setDrawer(false)} className="btn-primary w-full">Prikaži {filtered.length} modela</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-3 pb-3 border-b border-border">{title}</div>
      {children}
    </div>
  );
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border border-border bg-background hover:border-foreground transition-colors group"
    >
      {children}
      <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
    </button>
  );
}
