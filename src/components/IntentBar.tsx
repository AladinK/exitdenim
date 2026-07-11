import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import type { ProductWithStock } from "@/lib/products.functions";

export type Intent = {
  q: string;
  size?: string;
  category?: string;
  b2b?: boolean;
  bestseller?: boolean;
};

const CHIPS: { label: string; patch: Partial<Intent> }[] = [
  { label: "Најпродаваније", patch: { bestseller: true } },
  { label: "Карго", patch: { category: "cargo" } },
  { label: "Фармерке", patch: { category: "jeans" } },
  { label: "Чино", patch: { category: "chino" } },
  { label: "Величина 32", patch: { size: "32" } },
  { label: "Величина 33", patch: { size: "33" } },
  { label: "Величина 34", patch: { size: "34" } },
  { label: "B2B цене", patch: { b2b: true } },
];

/**
 * Floating intent bar — the pageless entry point.
 * Free-text + chips patch a single Intent object that drives the live results.
 */
export function IntentBar({
  intent,
  onChange,
  onClear,
  count,
  products,
  onPick,
}: {
  intent: Intent;
  onChange: (patch: Partial<Intent>) => void;
  onClear: () => void;
  count: number;
  products: ProductWithStock[];
  onPick: (p: ProductWithStock) => void;
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        (document.activeElement as HTMLElement | null)?.blur();
        setFocused(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const active =
    intent.q.length > 0 || !!intent.size || !!intent.category || intent.b2b || intent.bestseller;

  const suggestions = useMemo(() => {
    if (!focused || !intent.q) return [] as ProductWithStock[];
    const q = intent.q.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.fit?.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [focused, intent.q, products]);

  return (
    <div className="sticky top-16 z-30 px-3 md:px-6 pt-4">
      <div
        ref={wrapRef}
        className="mx-auto max-w-4xl rounded-full border border-border bg-background/85 backdrop-blur-xl shadow-[0_10px_40px_-14px_rgba(27,26,23,0.35)] transition-all"
      >
        <div className="flex items-center gap-2 pl-5 pr-2 py-2">
          <Sparkles className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={intent.q}
            onChange={(e) => onChange({ q: e.target.value })}
            onFocus={() => setFocused(true)}
            placeholder="Реци шта тражиш — нпр. „карго 32“, „најпродаваније“, „B2B цене“…"
            className="flex-1 min-w-0 bg-transparent outline-none text-[14px] md:text-[15px] placeholder:text-muted-foreground/70 py-2"
            aria-label="Интент претрага"
          />
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground border border-border rounded px-1.5 py-0.5 mono">
            ⌘K
          </kbd>
          {active && (
            <button
              onClick={onClear}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-secondary hover:bg-foreground hover:text-background text-[11px] px-3 py-2 transition-colors"
              aria-label="Очисти"
            >
              <X className="w-3.5 h-3.5" /> Очисти
            </button>
          )}
        </div>

        {/* Chips row — inline, quiet */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 pb-2.5">
          {CHIPS.map((c) => {
            const isActive =
              (c.patch.size && intent.size === c.patch.size) ||
              (c.patch.category && intent.category === c.patch.category) ||
              (c.patch.b2b && intent.b2b) ||
              (c.patch.bestseller && intent.bestseller);
            return (
              <button
                key={c.label}
                onClick={() => onChange(c.patch)}
                className={`shrink-0 text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border transition-all ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground/70 border-border hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Live typeahead */}
        {suggestions.length > 0 && (
          <div className="border-t border-border px-2 py-2 max-h-72 overflow-auto">
            {suggestions.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onPick(p);
                  setFocused(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary text-left transition-colors"
              >
                <div className="w-10 h-12 bg-secondary overflow-hidden shrink-0">
                  {p.image_url && (
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {p.sku} · {p.category}
                  </div>
                  <div className="serif text-[15px] truncate">{p.name}</div>
                </div>
                <div className="serif text-sm tabular-nums shrink-0 text-muted-foreground">
                  {Number(p.retail).toLocaleString("sr-RS")} дин
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="mx-auto max-w-4xl mt-2 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {count} {count === 1 ? "резултат" : "резултата"}
        </div>
      )}
    </div>
  );
}

/** Applies an Intent to the product list. */
export function applyIntent(products: ProductWithStock[], intent: Intent): ProductWithStock[] {
  let list = products;
  if (intent.category) {
    list = list.filter((p) => (p.category || "").toLowerCase() === intent.category);
  }
  if (intent.size) {
    list = list.filter((p) => (p.sizes || []).includes(intent.size!));
  }
  if (intent.q) {
    const q = intent.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.fit?.toLowerCase().includes(q) ||
        p.fabric?.toLowerCase().includes(q),
    );
  }
  if (intent.bestseller) list = list.slice(0, 6);
  return list;
}
