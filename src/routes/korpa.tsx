import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart, CART_CONSTANTS } from "@/hooks/useCart";

export const Route = createFileRoute("/korpa")({
  head: () => ({
    meta: [
      { title: "Корпа — EXIT Denim" },
      { name: "description", content: "Ваша корпа. Плаћање поузећем, достава широм Србије." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, shipping, total, update, remove } = useCart();

  return (
    <Layout>
      <section className="container-x py-12 md:py-16">
        <div className="eyebrow">Корпа</div>
        <h1 className="mt-4 text-4xl md:text-5xl">Ваша корпа</h1>

        {items.length === 0 ? (
          <div className="mt-16 border border-border p-16 text-center">
            <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground" strokeWidth={1.2} />
            <div className="mt-6 serif text-2xl">Корпа је празна</div>
            <p className="mt-3 text-muted-foreground max-w-sm mx-auto">Погледајте наш каталог и додајте артикле.</p>
            <Link to="/katalog" className="btn-primary mt-8 inline-flex">Отвори каталог</Link>
          </div>
        ) : (
          <div className="mt-10 grid lg:grid-cols-12 gap-10">
            <ul className="lg:col-span-8 divide-y divide-border border-y border-border">
              {items.map((it) => (
                <li key={`${it.productId}-${it.size}`} className="py-6 flex gap-5">
                  <div className="w-24 h-32 shrink-0 bg-secondary overflow-hidden">
                    {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{it.sku} · вел. {it.size}</div>
                    <div className="serif text-xl mt-1">{it.name}</div>
                    <div className="text-sm text-muted-foreground mt-1 tabular-nums">{it.unitPrice.toLocaleString("sr-RS")} дин / ком</div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border border-border">
                        <button onClick={() => update(it.productId, it.size, it.quantity - 1)} className="w-9 h-9 inline-flex items-center justify-center hover:bg-secondary" aria-label="Смањи">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums">{it.quantity}</span>
                        <button onClick={() => update(it.productId, it.size, it.quantity + 1)} className="w-9 h-9 inline-flex items-center justify-center hover:bg-secondary" aria-label="Повећај">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="text-sm font-semibold tabular-nums">{(it.unitPrice * it.quantity).toLocaleString("sr-RS")} дин</div>
                        <button onClick={() => remove(it.productId, it.size)} className="text-muted-foreground hover:text-foreground" aria-label="Уклони">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:col-span-4">
              <div className="border border-border p-6 lg:sticky lg:top-24">
                <div className="eyebrow">Резиме</div>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Међузбир</span><span className="tabular-nums">{subtotal.toLocaleString("sr-RS")} дин</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Достава</span><span className="tabular-nums">{shipping === 0 ? "Бесплатна" : `${shipping.toLocaleString("sr-RS")} дин`}</span></div>
                  {subtotal < CART_CONSTANTS.FREE_SHIPPING_OVER && (
                    <div className="text-[11px] text-muted-foreground">Још {(CART_CONSTANTS.FREE_SHIPPING_OVER - subtotal).toLocaleString("sr-RS")} дин до бесплатне доставе.</div>
                  )}
                  <div className="flex justify-between pt-3 mt-3 border-t border-border text-base font-semibold"><span>Укупно</span><span className="tabular-nums">{total.toLocaleString("sr-RS")} дин</span></div>
                </div>
                <Link to="/kasa" className="btn-primary w-full justify-center mt-6">Настави на касу</Link>
                <p className="text-[11px] text-center text-muted-foreground mt-3">Плаћање поузећем при испоруци</p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}
