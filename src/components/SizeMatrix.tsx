import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { getOrder, saveOrder } from "@/lib/b2b";

export function SizeMatrix({ product }: { product: Product }) {
  const [qty, setQty] = useState<Record<string, number>>(
    Object.fromEntries(product.sizes.map((s) => [s, 0])),
  );
  const [added, setAdded] = useState(false);

  const total = useMemo(
    () => Object.values(qty).reduce((a, b) => a + b, 0),
    [qty],
  );
  const totalValue = total * product.wholesale;
  const meetsMoq = total >= product.moq;

  const addToOrder = () => {
    const lines = getOrder();
    const existing = lines.findIndex((l) => l.sku === product.sku);
    const entry = { sku: product.sku, name: product.name, sizes: qty };
    if (existing >= 0) lines[existing] = entry;
    else lines.push(entry);
    saveOrder(lines);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="border border-border rounded-sm p-5 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="eyebrow">Size matrix narudžba</div>
        <div className="text-xs text-muted-foreground">MOQ: {product.moq} kom</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {product.sizes.map((s) => (
          <div key={s} className="flex flex-col">
            <label className="text-[11px] text-center text-muted-foreground font-medium mb-1">
              {s}
            </label>
            <input
              type="number"
              min={0}
              max={product.stock[s] ?? 0}
              value={qty[s]}
              onChange={(e) =>
                setQty((q) => ({ ...q, [s]: Math.max(0, Number(e.target.value) || 0) }))
              }
              className="w-full text-center border border-input bg-background rounded-sm py-2 text-sm font-semibold focus:outline-none focus:border-foreground"
            />
            <div className="text-[10px] text-center text-muted-foreground mt-1">
              /{product.stock[s] ?? 0}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <div>
          <div className="text-xs text-muted-foreground">Ukupno komada</div>
          <div className="text-2xl font-semibold tabular-nums">{total}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Vrijednost</div>
          <div className="text-2xl font-semibold tabular-nums">€{totalValue.toFixed(2)}</div>
        </div>
      </div>
      {!meetsMoq && total > 0 && (
        <div className="mt-3 text-xs text-destructive">
          Minimalna količina je {product.moq} komada.
        </div>
      )}
      <button
        onClick={addToOrder}
        disabled={!meetsMoq}
        className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {added ? "Dodato u narudžbu ✓" : "Dodaj u B2B narudžbu"}
      </button>
    </div>
  );
}
