import { Link } from "@tanstack/react-router";
import { Lock, ArrowUpRight } from "lucide-react";
import type { ProductWithStock } from "@/lib/products.functions";

export function ProductCard({ product, showPrice }: { product: ProductWithStock; showPrice: boolean }) {
  return (
    <Link
      to="/proizvod/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="aspect-[3/4] w-full overflow-hidden relative bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-foreground/10" />
        )}
        {/* Thin luxury border on hover */}
        <div className="absolute inset-0 ring-0 ring-foreground/0 group-hover:ring-1 group-hover:ring-foreground/30 transition-[box-shadow] duration-500 pointer-events-none" />
        {/* Quick action — appears on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="px-4 py-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em]">
            <span>Додај у поруџбину</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {product.sku} · {product.fit}
          </div>
          <div className="serif text-xl mt-1.5 leading-tight">
            {product.name}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {product.fabric} · {product.weight}
          </div>
        </div>
        <div className="text-right shrink-0">
          {showPrice ? (
            <>
              <div className="serif text-xl tabular-nums">€{Number(product.wholesale).toFixed(0)}</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5">Wholesale</div>
              <div className="text-[10px] text-muted-foreground mt-1.5 tabular-nums">
                МПЦ {Number(product.retail).toLocaleString("sr-RS")} дин
              </div>
            </>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground border border-border px-2 py-1">
              <Lock className="w-3 h-3" /> B2B
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
