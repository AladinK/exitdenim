import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ProductWithStock } from "@/lib/products.functions";
import { addToOrder } from "@/lib/orders.functions";
import { getStockQuantities } from "@/lib/products.functions";
import { formatEur } from "@/lib/format";

export function SizeMatrix({ product, wholesale }: { product: ProductWithStock; wholesale?: number }) {
  const add = useServerFn(addToOrder);
  const fetchStock = useServerFn(getStockQuantities);
  const navigate = useNavigate();
  const [stock, setStock] = useState<Record<string, number>>(product.stock || {});
  const [qty, setQty] = useState<Record<string, number>>(Object.fromEntries(product.sizes.map((s) => [s, 0])));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStock({ data: { productId: product.id } })
      .then((m) => {
        if (!cancelled) setStock(m);
      })
      .catch(() => {
        /* ostaje javna dostupnost (ima / nema) */
      });
    return () => {
      cancelled = true;
    };
  }, [product.id, fetchStock]);

  const total = useMemo(() => Object.values(qty).reduce((a, b) => a + b, 0), [qty]);
  const hasPrice = wholesale !== undefined && Number.isFinite(wholesale);
  const meetsMoq = total >= product.moq;

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await add({ data: { productId: product.id, sizes: qty } });
      navigate({ to: "/narudzba" });
    } catch (e) {
      setError((e as Error).message || "Porudžbina nije sačuvana. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold">Količina po veličini</span>
        <span className="text-ink-3">Minimum {product.moq} kom</span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {product.sizes.map((s) => (
          <div key={s} className="grid gap-1 text-center">
            <label htmlFor={`qty-${product.id}-${s}`} className="text-[0.8125rem] font-medium">
              {s}
            </label>
            <input
              id={`qty-${product.id}-${s}`}
              type="number"
              inputMode="numeric"
              min={0}
              max={stock[s] ?? 0}
              value={qty[s]}
              onChange={(e) =>
                setQty((q) => ({ ...q, [s]: Math.max(0, Math.min(stock[s] ?? 0, Number(e.target.value) || 0)) }))
              }
              className="input px-1 text-center font-semibold"
            />
            <div className="text-xs text-ink-3">od {stock[s] ?? 0}</div>
          </div>
        ))}
      </div>

      <dl className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
        <div>
          <dt className="text-[0.8125rem] text-ink-3">Ukupno komada</dt>
          <dd className="text-2xl font-bold">{total}</dd>
        </div>
        <div className="text-right">
          <dt className="text-[0.8125rem] text-ink-3">Vrednost porudžbine</dt>
          <dd className="text-2xl font-bold">{hasPrice ? formatEur(total * (wholesale as number)) : "—"}</dd>
        </div>
      </dl>

      {!meetsMoq && total > 0 && <p className="error-text mt-3">Minimalna količina je {product.moq} komada.</p>}
      {error && (
        <p role="alert" className="error-text mt-3">
          {error}
        </p>
      )}

      <button type="button" onClick={submit} disabled={!meetsMoq || loading} className="btn-primary mt-5 w-full">
        {loading ? "Čuvam…" : (
          <>
            Dodaj u B2B porudžbinu <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
          </>
        )}
      </button>
    </div>
  );
}
