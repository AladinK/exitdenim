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
      { title: "Продавница — EXIT Denim" },
      { name: "description", content: "Комплетан каталог EXIT Denim — премијум мушки деним, чино и карго. Наручите онлајн, плаћање поузећем." },
    ],
  }),
  component: Katalog,
});

type Cat = "all" | "jeans" | "chino" | "cargo";
type FitFilter = "all" | "Slim" | "Regular Slim" | "Relaxed" | "Cargo";
type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const CATS: { key: Cat; label: string }[] = [
  { key: "all", label: "Све" },
  { key: "jeans", label: "Фармерке" },
  { key: "chino", label: "Чино" },
  { key: "cargo", label: "Карго" },
];
const FITS: FitFilter[] = ["all", "Slim", "Regular Slim", "Relaxed", "Cargo"];
const SIZES = ["31", "32", "33", "34", "36", "38", "40"];

function Katalog() {
  const fetchProducts = useServerFn(listProducts);
  const fetchProfile = useServerFn(getMyProfile);
  const { user } = useAuth();

  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [approved, setApproved] = useState(false);

  const [cat, setCat] = useState<Cat>("all");
  const [fit, setFit] = useState<FitFilter>("all");
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
    setCat("all"); setFit("all"); setSizes([]); setQuery(""); setInStock(false); setSort("featured");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (fit !== "all" && p.fit !== fit) return false;
      if (q && !(`${p.name} ${p.sku} ${p.fabric ?? ""}`.toLowerCase().includes(q))) return false;
      if (sizes.length && !sizes.some((s) => (p.stock?.[s] ?? 0) > 0)) return false;
      if (inStock && !Object.values(p.stock || {}).some((n) => n > 0)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => Number(a.retail) - Number(b.retail));
    if (sort === "price-desc") list = [...list].sort((a, b) => Number(b.retail) - Number(a.retail));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "sr"));
    return list;
  }, [products, cat, fit, sizes, query, inStock, sort]);

  const activeCount =
    (cat !== "all" ? 1 : 0) + (fit !== "all" ? 1 : 0) + sizes.length + (query ? 1 : 0) + (inStock ? 1 : 0);

  const Sidebar = (
    <aside className="space-y-8">
      {/* Search */}
      <div>
        <div className="eyebrow mb-3">Претрага</div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Име, SKU, материјал…"
            className="w-full bg-background/60 border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
      </div>

      <FilterBlock title="Категорија">
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

      <FilterBlock title="Крој">
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
                {f === "all" ? "Сви" : f}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      <FilterBlock title="Величина">
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

      <FilterBlock title="Доступност">
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
          <span className="text-foreground/80 group-hover:text-foreground transition-colors">Само на стању</span>
        </label>
      </FilterBlock>

      {activeCount > 0 && (
        <button onClick={clearAll} className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground link-underline">
          Обриши све ({activeCount})
        </button>
      )}
    </aside>
  );

  return (
    <Layout>
      {/* Header — denim texture */}
      <section className="denim-texture border-b border-border">
        <div className="container-x py-14 md:py-20">
          <div className="eyebrow">Продавница · SS / FW</div>
          <div className="mt-5 grid lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.02] max-w-[14ch]">
                Комплетан <span className="serif-accent italic text-accent">каталог</span>
                {approved && <span className="block text-accent mt-3 text-2xl md:text-3xl serif-accent italic">— B2B приступ одобрен</span>}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-sm text-muted-foreground max-w-sm lg:ml-auto leading-relaxed">
                Фармерке, чино и карго линије. Величине 31–40. Плаћање поузећем, достава широм Србије.
              </p>
            </div>
          </div>
        </div>
      </section>

      {!approved && (
        <section className="bg-secondary/60 border-b border-border">
          <div className="container-x py-3.5 flex items-center justify-between flex-wrap gap-3 text-xs">
            <span className="text-muted-foreground uppercase tracking-[0.2em]">Ви сте бутик? Затражите B2B приступ за велепродајне цене и матрицу величина.</span>
            <Link to="/postani-partner" className="link-underline uppercase tracking-[0.2em] font-medium">
              Постаните партнер →
            </Link>
          </div>
        </section>
      )}

      {/* Toolbar — sticky */}
      <div className="sticky top-[64px] z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container-x flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 border border-border text-[11px] uppercase tracking-[0.2em] hover:border-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Филтери{activeCount > 0 && ` · ${activeCount}`}
            </button>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
              {filtered.length} <span className="hidden sm:inline">артикала</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hidden sm:inline">Сортирај</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent border border-border py-2 pl-3 pr-8 text-xs uppercase tracking-[0.14em] focus:outline-none focus:border-foreground appearance-none cursor-pointer"
            >
              <option value="featured">Препоручено</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="name">Име A–Ш</option>
            </select>
          </div>
        </div>

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="container-x pb-3 flex flex-wrap gap-1.5">
            {cat !== "all" && <Chip onRemove={() => setCat("all")}>{CATS.find((c) => c.key === cat)?.label}</Chip>}
            {fit !== "all" && <Chip onRemove={() => setFit("all")}>{fit}</Chip>}
            {sizes.map((s) => <Chip key={s} onRemove={() => toggleSize(s)}>Величина {s}</Chip>)}
            {inStock && <Chip onRemove={() => setInStock(false)}>На стању</Chip>}
            {query && <Chip onRemove={() => setQuery("")}>„{query}"</Chip>}
          </div>
        )}
      </div>

      {/* Main grid */}
      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-[240px_1fr] gap-10 lg:gap-14">
          <div className="hidden lg:block">
            <div className="sticky top-[140px]">{Sidebar}</div>
          </div>

          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-border">
                <div className="serif text-2xl">Нема резултата</div>
                <p className="text-sm text-muted-foreground mt-2">Покушајте да смањите број филтера.</p>
                <button onClick={clearAll} className="btn-outline mt-6">Обриши филтере</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-14">
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
              <div className="eyebrow">Филтери</div>
              <button onClick={() => setDrawer(false)} className="p-1 hover:text-accent"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">{Sidebar}</div>
            <div className="p-5 border-t border-border sticky bottom-0 bg-background">
              <button onClick={() => setDrawer(false)} className="btn-primary w-full">Прикажи {filtered.length} артикала</button>
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
