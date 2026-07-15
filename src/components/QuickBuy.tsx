import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { ProductWithStock } from "@/lib/products.functions";

/**
 * QuickBuy — minimalist, premium size picker + single CTA.
 * Design: generous whitespace, hairline borders, one restrained accent,
 * quiet micro-interactions. No gradients, no heavy shadows.
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
    <div
      className="flex flex-col gap-4"
      onClick={(e) => e.preventDefault()}
    >
      {/* Eyebrow */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        <span>Величина</span>
        <span className="tabular-nums text-foreground/60">
          {size ?? "—"}
        </span>
      </div>

      {/* Size row — hairline squares, quiet accent on active */}
      <div className="grid grid-cols-6 gap-1.5">
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
              className={[
                "relative h-10 text-[11px] tabular-nums font-medium",
                "border transition-[color,background,border-color] duration-300 ease-out",
                active
                  ? "border-foreground bg-foreground text-background"
                  : disabled
                  ? "border-border/60 text-muted-foreground/40 line-through cursor-not-allowed"
                  : "border-border text-foreground hover:border-foreground",
              ].join(" ")}
              aria-label={`Величина ${s}${disabled ? " — распродато" : ""}`}
              aria-pressed={active}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* CTA — full-width, hairline, refined hover */}
      <button
        type="button"
        onClick={onAdd}
        disabled={!size}
        className={[
          "group relative inline-flex items-center justify-between",
          "w-full px-4 h-11",
          "text-[11px] uppercase tracking-[0.22em] font-medium",
          "border transition-all duration-500 ease-out",
          size
            ? "border-foreground bg-foreground text-background hover:bg-background hover:text-foreground"
            : "border-border bg-transparent text-muted-foreground cursor-not-allowed",
        ].join(" ")}
        aria-disabled={!size}
      >
        <span className="flex items-center gap-2">
          {added ? <Check className="w-3.5 h-3.5" /> : null}
          {added ? "Додато у корпу" : "Додај у корпу"}
        </span>
        <ArrowRight
          className={[
            "w-3.5 h-3.5 transition-transform duration-500 ease-out",
            size ? "group-hover:translate-x-1" : "opacity-40",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
