import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ProductWithStock } from "@/lib/products.functions";
import { addToOrder } from "@/lib/orders.functions";
import { getStockQuantities } from "@/lib/products.functions";

export function SizeMatrix({ product }: { product: ProductWithStock }) {
  const add = useServerFn(addToOrder);
  const fetchStock = useServerFn(getStockQuantities);
  const navigate = useNavigate();
  const [stock, setStock] = useState<Record<string, number>>(product.stock || {});
  const [qty, setQty] = useState<Record<string, number>>(
    Object.fromEntries(product.sizes.map((s) => [s, 0])),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStock({ data: { productId: product.id } })
      .then((m) => { if (!cancelled) setStock(m); })
      .catch(() => { /* keep booleans from public fetch */ });
    return () => { cancelled = true; };
  }, [product.id, fetchStock]);

  const total = useMemo(() => Object.values(qty).reduce((a, b) => a + b, 0), [qty]);
  const totalValue = total * Number(product.wholesale);
  const meetsMoq = total >= product.moq;

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await add({ data: { productId: product.id, sizes: qty } });
      navigate({ to: "/narudzba" });
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="eyebrow">Size Matrix Order</div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">MOQ {product.moq}</div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {product.sizes.map((s) => (
            <div key={s} className="flex flex-col">
              <label className="text-[10px] text-center text-muted-foreground tracking-[0.18em] uppercase mb-1.5">{s}</label>
              <input
                type="number"
                min={0}
                max={product.stock[s] ?? 0}
                value={qty[s]}
                onChange={(e) =>
                  setQty((q) => ({ ...q, [s]: Math.max(0, Math.min(product.stock[s] ?? 0, Number(e.target.value) || 0)) }))
                }
                className="w-full text-center border border-input bg-background py-2.5 text-base serif font-medium focus:outline-none focus:border-foreground tabular-nums transition-colors"
              />
              <div className="text-[10px] text-center text-muted-foreground mt-1 tabular-nums">/{product.stock[s] ?? 0}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <div>
            <div className="eyebrow">Total Pieces</div>
            <div className="serif text-3xl mt-1 tabular-nums">{total}</div>
          </div>
          <div className="text-right">
            <div className="eyebrow">Order Value</div>
            <div className="serif text-3xl mt-1 tabular-nums">€{totalValue.toFixed(0)}</div>
          </div>
        </div>

        {!meetsMoq && total > 0 && (
          <div className="mt-3 text-xs text-destructive">Minimum order quantity is {product.moq} pieces.</div>
        )}
        {error && <div className="mt-3 text-xs text-destructive">{error}</div>}

        <button
          onClick={submit}
          disabled={!meetsMoq || loading}
          className="btn-primary w-full mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "..." : <>Add to B2B Order <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </div>
    </div>
  );
}
