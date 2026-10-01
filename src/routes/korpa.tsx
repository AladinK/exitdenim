import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useCart, CART_CONSTANTS } from "@/hooks/useCart";
import { ecommerce } from "@/lib/analytics";

export const Route = createFileRoute("/korpa")({
  head: () => ({
    meta: [
      { title: "Korpa — EXIT Denim" },
      { name: "description", content: "Vaša korpa. Plaćanje pouzećem, dostava širom Srbije." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, shipping, total, update, remove } = useCart();

  useEffect(() => {
    if (items.length === 0) return;
    ecommerce.viewCart(
      items.map((i) => ({
        item_id: i.sku,
        item_name: i.name,
        item_variant: i.size,
        price: i.unitPrice,
        quantity: i.quantity,
      })),
      total,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <Layout>
      <section className="container-x py-12 md:py-16">
        <div className="eyebrow">Korpa</div>
        <h1 className="mt-4 text-4xl md:text-5xl">Vaša korpa</h1>

        {items.length === 0 ? (
          <div className="mt-16 border border-border p-16 text-center">
            <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground" strokeWidth={1.2} />
            <div className="mt-6 serif text-2xl">Korpa je prazna</div>
            <p className="mt-3 text-muted-foreground max-w-sm mx-auto">Pogledajte naš katalog i dodajte artikle.</p>
            <Link to="/katalog" className="btn-primary mt-8 inline-flex">Otvori katalog</Link>
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
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{it.sku} · vel. {it.size}</div>
                    <div className="serif text-xl mt-1">{it.name}</div>
                    <div className="text-sm text-muted-foreground mt-1 tabular-nums">{it.unitPrice.toLocaleString("sr-RS")} din / kom</div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border border-border">
                        <button onClick={() => update(it.productId, it.size, it.quantity - 1)} className="w-9 h-9 inline-flex items-center justify-center hover:bg-secondary" aria-label="Smanji">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums">{it.quantity}</span>
                        <button onClick={() => update(it.productId, it.size, it.quantity + 1)} className="w-9 h-9 inline-flex items-center justify-center hover:bg-secondary" aria-label="Povećaj">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="text-sm font-semibold tabular-nums">{(it.unitPrice * it.quantity).toLocaleString("sr-RS")} din</div>
                        <button onClick={() => remove(it.productId, it.size)} className="text-muted-foreground hover:text-foreground" aria-label="Ukloni">
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
                <div className="eyebrow">Rezime</div>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Međuzbir</span><span className="tabular-nums">{subtotal.toLocaleString("sr-RS")} din</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Dostava</span><span className="tabular-nums">{shipping === 0 ? "Besplatna" : `${shipping.toLocaleString("sr-RS")} din`}</span></div>
                  {subtotal < CART_CONSTANTS.FREE_SHIPPING_OVER && (
                    <div className="text-[11px] text-muted-foreground">Još {(CART_CONSTANTS.FREE_SHIPPING_OVER - subtotal).toLocaleString("sr-RS")} din do besplatne dostave.</div>
                  )}
                  <div className="flex justify-between pt-3 mt-3 border-t border-border text-base font-semibold"><span>Ukupno</span><span className="tabular-nums">{total.toLocaleString("sr-RS")} din</span></div>
                </div>
                <Link
                  to="/kasa"
                  onClick={() => ecommerce.beginCheckout(items.map((i) => ({ item_id: i.sku, item_name: i.name, item_variant: i.size, price: i.unitPrice, quantity: i.quantity })), total)}
                  className="btn-primary w-full justify-center mt-6"
                >
                  Nastavi na plaćanje
                </Link>
                <p className="text-[11px] text-center text-muted-foreground mt-3">Plaćanje pouzećem pri isporuci</p>
                <Link to="/katalog" className="btn-outline w-full justify-center mt-3">Nastavi kupovinu</Link>
              </div>
            </aside>
          </div>
        )}
      </section>

      {items.length > 0 && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/97 backdrop-blur-xl px-4 pt-3 pb-3 flex items-center gap-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <div className="shrink-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ukupno</div>
            <div className="text-[15px] font-semibold tabular-nums leading-tight">{total.toLocaleString("sr-RS")} din</div>
          </div>
          <Link
            to="/kasa"
            onClick={() => ecommerce.beginCheckout(items.map((i) => ({ item_id: i.sku, item_name: i.name, item_variant: i.size, price: i.unitPrice, quantity: i.quantity })), total)}
            className="flex-1 inline-flex items-center justify-center bg-foreground text-background py-3.5 text-[12.5px] uppercase tracking-[0.18em] font-semibold"
          >
            Nastavi na plaćanje
          </Link>
        </div>
      )}
    </Layout>
  );
}
