import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { ProductWithStock } from "@/lib/products.functions";

/**
 * Premium minimalist quick-buy for listing cards.
 * Hairline size pills, ghost CTA that inverts once a size is chosen.
 */
export function QuickBuy({ product }: { product: ProductWithStock }) {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!size) return;
    add({
      productId: product.id!,
      sku: product.sku!,
      slug: product.slug!,
      name: product.name!,
      size,
      unitPrice: Number(product.retail),
      image: product.image_url,
    }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-3" onClick={(e) => e.preventDefault()}>
      {/* Size row — hairline, tabular, luxury feel */}
      <div className="flex items-center gap-px border-t border-b border-foreground/10">
        <span className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground pr-3 py-2 border-r border-foreground/10">
          Величина
        </span>
        <div className="flex-1 flex flex-wrap">
          {product.sizes.map((s) => {
            const stock = product.stock?.[s] ?? 0;
            const disabled = stock <= 0;
            const active = size === s;
            return (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSize(s); }}
                className={`relative flex-1 min-w-[34px] py-2 text-[11px] tabular-nums tracking-wider transition-colors ${
                  active
                    ? "text-background bg-foreground"
                    : disabled
                    ? "text-muted-foreground/40 line-through cursor-not-allowed"
                    : "text-foreground hover:text-accent"
                }`}
                aria-label={`Величина ${s}${disabled ? " — распродато" : ""}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA — ghost until a size is chosen */}
      <button
        type="button"
        onClick={onAdd}
        disabled={!size}
        className={`group/cta relative w-full inline-flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.28em] font-medium border transition-all duration-300 ${
          added
            ? "border-accent bg-accent text-accent-foreground"
            : size
            ? "border-foreground bg-foreground text-background hover:bg-accent hover:border-accent hover:text-accent-foreground"
            : "border-foreground/15 text-muted-foreground cursor-not-allowed"
        }`}
      >
        <span>
          {added ? "У корпи" : size ? "Додај у корпу" : "Изаберите величину"}
        </span>
        {added ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${size ? "group-hover/cta:translate-x-0.5" : "opacity-40"}`} />
        )}
      </button>
    </div>
  );
}
