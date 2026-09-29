import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ProductWithStock } from "@/lib/products.functions";

export function ProductCard({ product, showB2B }: { product: ProductWithStock; showB2B?: boolean }) {
  const soldOut = product.stock && Object.keys(product.stock).length > 0 && !Object.values(product.stock).some((n) => n > 0);
  return (
    <Link to="/proizvod/$slug" params={{ slug: product.slug }} className="group block">
      <div className="aspect-[4/5] w-full overflow-hidden relative bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={`${product.name} — ${product.fit} fit`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-foreground/10" />
        )}
        <span className="absolute left-2 top-2 bg-background text-foreground border border-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
          {product.fit}
        </span>
        {soldOut && (
          <span className="absolute right-2 top-2 bg-foreground text-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
            Rasprodato
          </span>
        )}
        <div className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-background border-t-2 border-foreground">
          <div className="px-4 py-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em]">
            <span>Pogledaj detalje</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[14px] md:text-base font-semibold leading-snug line-clamp-2">{product.name}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{product.color}</div>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <div className="font-[family-name:var(--font-display)] text-base md:text-lg tabular-nums">
            {Number(product.retail).toLocaleString("sr-RS")} <span className="text-[11px] font-sans text-muted-foreground">RSD</span>
          </div>
          {showB2B && (
            <div className="text-[10px] uppercase tracking-[0.16em] text-accent tabular-nums">B2B €{Number(product.wholesale).toFixed(0)}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
