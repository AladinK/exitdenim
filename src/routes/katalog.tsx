import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CatalogUnavailable } from "@/components/CatalogUnavailable";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { catalogQuery } from "@/lib/product-queries";
import { loadCatalog } from "@/lib/catalog-loader";
import { usePartner } from "@/hooks/usePartner";

const TITLE = "Muške farmerke, jeans i teksas pantalone — EXIT Denim shop";

export const Route = createFileRoute("/katalog")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: TITLE },
      { name: "description", content: "Kupi muške farmerke, muški jeans, teksas, chino i cargo pantalone online. Domaća proizvodnja, 5.990 din, besplatna dostava, plaćanje pouzećem, dostava po Srbiji." },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Kupi muške farmerke, muški jeans, teksas, chino i cargo pantalone online. Domaća proizvodnja, 5.990 din, besplatna dostava po Srbiji." },
      { property: "og:url", content: "https://exitdenim.shop/katalog" },
    ],
    links: [{ rel: "canonical", href: "https://exitdenim.shop/katalog" }],
  }),
  loader: ({ context }) => loadCatalog(context.queryClient),
  validateSearch: (s: Record<string, unknown>): { q?: string; fit?: string; group?: "wide"; cat?: "jeans" | "chino" | "cargo" } => ({
    q: typeof s.q === "string" ? s.q : undefined,
    fit: typeof s.fit === "string" ? s.fit : undefined,
    group: s.group === "wide" ? ("wide" as const) : undefined,
    cat: s.cat === "jeans" || s.cat === "chino" || s.cat === "cargo" ? s.cat : undefined,
  }),
  component: Katalog,
});

const WIDE_FITS = ["Relaxed", "Bootcut", "Flare"];

type Cat = "all" | "jeans" | "chino" | "cargo";
type FitFilter = "all" | "Slim" | "Regular Slim" | "Relaxed" | "Bootcut" | "Flare" | "Cargo" | "Cropped";
type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const CATS: { key: Cat; label: string }[] = [
  { key: "all", label: "Sve" },
  { key: "jeans", label: "Farmerke" },
  { key: "chino", label: "Chino" },
  { key: "cargo", label: "Džeparke" },
];
const FITS: FitFilter[] = ["all", "Slim", "Regular Slim", "Relaxed", "Bootcut", "Flare", "Cargo", "Cropped"];
const SIZES = ["31", "32", "33", "34", "36", "38", "40"];

function Katalog() {
  const { data: catalog } = useSuspenseQuery(catalogQuery());
  const products = catalog.products;
  const { approved, wholesale } = usePartner();

  const search = Route.useSearch();
  const catFromSearch = (): Cat => (search.cat ?? "all") as Cat;
  const fitFromSearch = (): FitFilter =>
    (FITS as string[]).includes(search.fit ?? "") ? (search.fit as FitFilter) : "all";
  const [cat, setCat] = useState<Cat>(catFromSearch);
  const [fit, setFit] = useState<FitFilter>(fitFromSearch);
  const [wide, setWide] = useState(search.group === "wide");
  // Filteri prate adresu kada meni vodi unutar kataloga
  useEffect(() => {
    setCat(catFromSearch());
    setFit(fitFromSearch());
    setWide(search.group === "wide");
  }, [search.cat, search.fit, search.group]); // eslint-disable-line react-hooks/exhaustive-deps
  const [sizes, setSizes] = useState<string[]>([]);
  const [query, setQuery] = useState(search.q ?? "");
  useEffect(() => setQuery(search.q ?? ""), [search.q]);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [panel, setPanel] = useState(false);

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clearAll = () => {
    setCat("all");
    setFit("all");
    setWide(false);
    setSizes([]);
    setQuery("");
    setInStock(false);
    setSort("featured");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (fit !== "all" && p.fit !== fit) return false;
      if (wide && !WIDE_FITS.includes(p.fit as string)) return false;
      if (q && !`${p.name} ${p.sku} ${p.fabric ?? ""} ${p.color ?? ""}`.toLowerCase().includes(q)) return false;
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
    (fit !== "all" ? 1 : 0) + (wide ? 1 : 0) + sizes.length + (query ? 1 : 0) + (inStock ? 1 : 0);
  const countLabel = `${filtered.length} ${filtered.length === 1 ? "model" : "modela"}`;

  return (
    <Layout>
      <section className="container-x pt-8 md:pt-12">
        <h1>Svi modeli</h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Farmerke, chino i džeparke u veličinama <span className="whitespace-nowrap">31–40</span>. Plaćanje pouzećem, besplatna dostava po celoj Srbiji.
        </p>
        {approved && <p className="mt-3 text-sm font-medium text-action-text">Prikazane su i vaše B2B cene</p>}
      </section>

      {catalog.state === "down" ? (
        <section className="container-x section-pad max-w-3xl">
          <CatalogUnavailable />
        </section>
      ) : (
        <>
          <div className="sticky top-[var(--header-h)] z-30 mt-6 border-y border-line bg-background/95 backdrop-blur-md">
            <div className="container-x flex items-center gap-2 py-2">
              <div role="group" aria-label="Kategorija" className="choice-row choice-row--scroll min-w-0 flex-1 !mx-0 !px-0">
                {CATS.map((c) => (
                  <button key={c.key} type="button" className="choice" aria-pressed={cat === c.key} onClick={() => setCat(c.key)}>
                    {c.label}
                  </button>
                ))}
              </div>
              <button type="button" className="choice shrink-0" onClick={() => setPanel(true)} aria-haspopup="dialog">
                <SlidersHorizontal aria-hidden="true" className="mr-2 h-4 w-4" />
                Filteri{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
            </div>
          </div>

          <section className="container-x pt-6 pb-16" aria-label="Modeli">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="text-sm text-ink-3" aria-live="polite">{countLabel}</p>
              <label className="flex items-center gap-2 text-sm text-ink-2">
                Poređaj
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-10 rounded-md border border-line-strong bg-card px-3 text-sm font-medium text-foreground">
                  <option value="featured">Preporučeno</option>
                  <option value="price-asc">Cena, od najniže</option>
                  <option value="price-desc">Cena, od najviše</option>
                  <option value="name">Naziv, A–Ž</option>
                </select>
              </label>
            </div>

            {activeCount > 0 && (
              <div className="choice-row mt-4">
                {fit !== "all" && <Chip onRemove={() => setFit("all")}>{fit}</Chip>}
                {wide && <Chip onRemove={() => setWide(false)}>Šire nogavice</Chip>}
                {sizes.map((s) => <Chip key={s} onRemove={() => toggleSize(s)}>Veličina {s}</Chip>)}
                {inStock && <Chip onRemove={() => setInStock(false)}>Na stanju</Chip>}
                {query && <Chip onRemove={() => setQuery("")}>„{query}“</Chip>}
                <button type="button" onClick={clearAll} className="min-h-10 px-2 text-sm font-medium underline decoration-1 underline-offset-4">
                  Obriši sve
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="notice mt-8">
                <div>
                  <h2>Nema modela za ovaj izbor</h2>
                  <p className="mt-2">Probajte sa manje filtera ili drugom veličinom.</p>
                </div>
                <div><button type="button" onClick={clearAll} className="btn-outline">Obriši filtere</button></div>
              </div>
            ) : (
              <div className="product-grid mt-6">
                {filtered.map((p, index) => (
                  <ProductCard key={p.id} product={p} eager={index < 4} wholesale={approved ? wholesale[p.id] : undefined} />
                ))}
              </div>
            )}
          </section>

          <Sheet open={panel} onOpenChange={setPanel}>
            <SheetContent side="right" className="menu-panel w-full max-w-[440px] border-l border-r-0 border-line sm:max-w-[440px]">
              <div className="menu-panel__head">
                <SheetTitle className="text-lg font-bold tracking-normal">Filteri</SheetTitle>
                <SheetDescription className="sr-only">Suzite izbor po kroju, veličini i dostupnosti.</SheetDescription>
              </div>
              <div className="menu-panel__scroll grid content-start gap-8">
                <div className="field">
                  <label htmlFor="catalog-search">Pretraga</label>
                  <div className="relative">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                    <input id="catalog-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Model, šifra ili materijal" className="input pl-10" />
                  </div>
                </div>
                <FilterGroup title="Kroj">
                  {FITS.map((f) => (
                    <button key={f} type="button" className="choice" aria-pressed={fit === f} onClick={() => setFit(f)}>
                      {f === "all" ? "Svi krojevi" : f}
                    </button>
                  ))}
                </FilterGroup>
                <FilterGroup title="Veličina na stanju">
                  {SIZES.map((s) => (
                    <button key={s} type="button" className="size-button" aria-pressed={sizes.includes(s)} onClick={() => toggleSize(s)}>
                      {s}
                    </button>
                  ))}
                </FilterGroup>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem] font-medium">
                  <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-5 w-5 accent-[var(--ink)]" />
                  Samo modeli na stanju
                </label>
              </div>
              <div className="menu-panel__foot grid grid-cols-[auto_1fr] gap-2">
                <button type="button" onClick={clearAll} className="btn-outline">Obriši</button>
                <button type="button" onClick={() => setPanel(false)} className="btn-primary">Prikaži {countLabel}</button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </Layout>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="field-label mb-3">{title}</legend>
      <div className="choice-row">{children}</div>
    </fieldset>
  );
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} className="choice" aria-label={`Ukloni filter: ${typeof children === "string" ? children : ""}`}>
      {children}
      <X aria-hidden="true" className="ml-2 h-3.5 w-3.5 text-ink-3" />
    </button>
  );
}
