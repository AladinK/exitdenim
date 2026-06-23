import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { Product } from "@/lib/products";
import { useB2BAccess } from "@/lib/b2b";

const swatch = (color: string) => {
  const map: Record<string, string> = {
    Indigo: "#1f2a44",
    Black: "#111111",
    "Stone Blue": "#7891ad",
    Beige: "#c8b48f",
    Navy: "#1b2236",
    Olive: "#6b7a3a",
    Sand: "#c2a878",
  };
  return map[color] || "#888";
};

export function ProductCard({ product }: { product: Product }) {
  const { approved } = useB2BAccess();
  return (
    <Link
      to="/proizvod/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div
        className="aspect-[3/4] w-full rounded-sm overflow-hidden relative"
        style={{
          background: `linear-gradient(160deg, ${swatch(product.color)} 0%, oklch(0.2 0.02 250) 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-end p-4">
          <div className="text-background/90">
            <div className="eyebrow text-background/70">{product.sku}</div>
            <div className="font-display text-lg leading-tight">{product.color}</div>
          </div>
        </div>
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
          {approved ? (
            <>
              <div className="text-sm font-semibold">€{product.wholesale.toFixed(2)}</div>
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
