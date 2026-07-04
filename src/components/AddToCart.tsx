import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { ProductWithStock } from "@/lib/products.functions";

export function AddToCart({ product }: { product: ProductWithStock }) {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const canAdd = !!size;

  const onAdd = () => {
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
    <div className="border border-foreground/20 p-5">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Изаберите величину</div>
        <div className="text-[11px] text-muted-foreground">Малопродаја</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {product.sizes.map((s) => {
          const stock = product.stock?.[s] ?? 0;
          const disabled = stock <= 0;
          const active = size === s;
          return (
            <button
              key={s}
              type="button"
              disabled={disabled}
              onClick={() => setSize(s)}
              className={`min-w-[52px] px-3 py-2.5 text-sm font-medium border transition-all tabular-nums ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : disabled
                  ? "border-border text-muted-foreground line-through cursor-not-allowed opacity-50"
                  : "border-border hover:border-foreground"
              }`}
              aria-label={`Величина ${s}${disabled ? " (нема на стању)" : ""}`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <div>
          <div className="eyebrow">Цена</div>
          <div className="serif text-3xl mt-1 tabular-nums">{Number(product.retail).toLocaleString("sr-RS")} <span className="text-base text-muted-foreground">дин</span></div>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          Плаћање поузећем<br />Достава 500 дин · бесплатна преко 15.000
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={!canAdd}
        className={`mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm uppercase tracking-[0.2em] font-medium transition-all ${
          canAdd ? "bg-foreground text-background hover:bg-foreground/90" : "bg-secondary text-muted-foreground cursor-not-allowed"
        }`}
      >
        {added ? (<><Check className="w-4 h-4" /> Додато у корпу</>) : (<><ShoppingBag className="w-4 h-4" /> Додај у корпу</>)}
      </button>

      {!canAdd && <p className="mt-3 text-[11px] text-center text-muted-foreground">Изаберите величину да наставите</p>}
    </div>
  );
}
