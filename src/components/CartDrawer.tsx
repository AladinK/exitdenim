import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useCart, CART_CONSTANTS } from "@/hooks/useCart";

export function CartDrawer() {
  const { items, subtotal, shipping, total, open, setOpen, update, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Корпа"
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium">
            <ShoppingBag className="w-4 h-4" /> Корпа ({items.length})
          </div>
          <button onClick={() => setOpen(false)} aria-label="Затвори корпу" className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" strokeWidth={1.2} />
              <div className="serif text-2xl">Корпа је празна</div>
              <p className="text-sm text-muted-foreground max-w-xs">Додајте артикле из каталога да наставите ка каси.</p>
              <Link to="/katalog" onClick={() => setOpen(false)} className="btn-primary mt-2">Отвори каталог</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((it) => (
                <li key={`${it.productId}-${it.size}`} className="p-5 flex gap-4">
                  <div className="w-20 h-24 shrink-0 bg-secondary overflow-hidden">
                    {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{it.sku} · вел. {it.size}</div>
                    <div className="mt-1 text-sm font-medium truncate">{it.name}</div>
                    <div className="mt-1 text-sm tabular-nums">{Number(it.unitPrice).toLocaleString("sr-RS")} дин</div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border">
                        <button onClick={() => update(it.productId, it.size, it.quantity - 1)} className="w-8 h-8 inline-flex items-center justify-center hover:bg-secondary" aria-label="Смањи">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{it.quantity}</span>
                        <button onClick={() => update(it.productId, it.size, it.quantity + 1)} className="w-8 h-8 inline-flex items-center justify-center hover:bg-secondary" aria-label="Повећај">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button onClick={() => remove(it.productId, it.size)} className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
                        Уклони
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Међузбир</span><span className="tabular-nums">{subtotal.toLocaleString("sr-RS")} дин</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Достава</span><span className="tabular-nums">{shipping === 0 ? "Бесплатна" : `${shipping.toLocaleString("sr-RS")} дин`}</span></div>
              {subtotal < CART_CONSTANTS.FREE_SHIPPING_OVER && (
                <div className="text-[11px] text-muted-foreground">
                  Још {(CART_CONSTANTS.FREE_SHIPPING_OVER - subtotal).toLocaleString("sr-RS")} дин до бесплатне доставе.
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border text-base font-semibold"><span>Укупно</span><span className="tabular-nums">{total.toLocaleString("sr-RS")} дин</span></div>
            </div>
            <Link to="/kasa" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
              Настави на касу
            </Link>
            <p className="text-[11px] text-center text-muted-foreground">Плаћање поузећем при испоруци</p>
          </div>
        )}
      </aside>
    </>
  );
}
