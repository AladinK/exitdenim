import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ProductWithStock } from "@/lib/products.functions";

export function ProductCard({ product, showPrice }: { product: ProductWithStock; showPrice: boolean }) {
  return (
    <Link
      to="/proizvod/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="aspect-[3/4] w-full rounded-sm overflow-hidden relative bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-foreground/10" />
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-background/95 rounded-sm eyebrow text-foreground">
          {product.fit}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold leading-tight group-hover:text-accent transition-colors">
            {product.name}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {product.fabric} · {product.weight}
          </div>
        </div>
        <div className="text-right">
          {showPrice ? (
            <>
              <div className="text-sm font-semibold tabular-nums">€{Number(product.wholesale).toFixed(2)}</div>
              <div className="text-[10px] text-muted-foreground">veleprodaja</div>
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" /> B2B
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
