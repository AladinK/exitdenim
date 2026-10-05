import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ProductWithStock } from "@/lib/products.functions";

export function ProductCard({ product, showB2B }: { product: ProductWithStock; showB2B?: boolean }) {
  const stock = (product.stock || {}) as Record<string, number>;
  const sizes = Object.keys(stock).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  const soldOut = sizes.length > 0 && !sizes.some((s) => stock[s] > 0);

  return (
    <Link
      to="/proizvod/$slug"
      params={{ slug: product.slug }}
      className="group block focus-visible:outline-none"
      aria-label={`${product.name}, ${Number(product.retail).toLocaleString("sr-RS")} RSD`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary ring-0 ring-foreground/0 transition-[box-shadow] duration-500 group-focus-visible:ring-2 group-focus-visible:ring-foreground">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={`${product.name} — ${product.fit} fit`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.05] ${soldOut ? "opacity-60 grayscale" : ""}`}
          />
        ) : (
          <div className="absolute inset-0 bg-foreground/5" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-4">
          <span className="bg-background/85 backdrop-blur-sm px-2 py-1 text-[9.5px] md:text-[10px] font-medium uppercase tracking-[0.22em] text-foreground">
            {product.fit}
          </span>
          {soldOut && (
            <span className="bg-foreground px-2 py-1 text-[9.5px] md:text-[10px] font-medium uppercase tracking-[0.22em] text-background">
              Rasprodato
            </span>
          )}
        </div>

        {!soldOut && sizes.length > 0 && (
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:block">
            <div className="bg-background/95 backdrop-blur-md px-4 py-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>Dostupne veličine</span>
                <ArrowRight className="h-3.5 w-3.5 text-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] tabular-nums">
                {sizes.map((s) => (
                  <span key={s} className={stock[s] > 0 ? "text-foreground" : "text-muted-foreground/50 line-through"}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 md:pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-[13px] md:text-[14px] font-medium uppercase leading-snug tracking-[0.08em] line-clamp-2" style={{ color: "inherit" }}>
            {product.name}
          </h3>
          <div className="shrink-0 text-[13px] md:text-[14px] font-medium tabular-nums">
            {Number(product.retail).toLocaleString("sr-RS")}
            <span className="ml-1 text-[10px] text-muted-foreground">RSD</span>
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span className="truncate">{product.color}</span>
          {showB2B && (
            <span className="shrink-0 uppercase tracking-[0.16em] text-accent tabular-nums">B2B €{Number(product.wholesale).toFixed(0)}</span>
          )}
        </div>
        <span className="mt-3 block h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
      </div>
    </Link>
  );
}
