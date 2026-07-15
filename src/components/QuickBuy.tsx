import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { ProductWithStock } from "@/lib/products.functions";

/**
 * Compact quick-buy widget for homepage / listing cards.
 * Pick size → single click adds to cart and opens the drawer.
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
    setTimeout(() => setAdded(false), 1200);
    setOpen(true);
  };

  return (
    <div
      className="flex flex-col gap-2"
      onClick={(e) => e.preventDefault()}
    >
      <div className="flex flex-wrap gap-1.5">
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
              className={`min-w-[38px] px-2 py-1.5 text-[11px] font-medium border tabular-nums transition-all ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : disabled
                  ? "border-border text-muted-foreground/50 line-through cursor-not-allowed"
                  : "border-border hover:border-foreground bg-background"
              }`}
              aria-label={`Величина ${s}`}
            >
              {s}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={!size}
        className={`inline-flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-all ${
          size
            ? "bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        }`}
      >
        {added ? (<><Check className="w-3.5 h-3.5" /> Додато</>) : (<><ShoppingBag className="w-3.5 h-3.5" /> Брза куповина</>)}
      </button>
    </div>
  );
}
