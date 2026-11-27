import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useCart, CART_CONSTANTS } from "@/hooks/useCart";
import { useCartCatalog } from "@/hooks/useCartCatalog";
import { PageCartLine, RemovedNotice } from "@/components/CartLine";
import { CartUpsell } from "@/components/CartUpsell";
import { BundleNudge, DiscountRow } from "@/components/CartPerks";
import { deliveryWindow, lineKey } from "@/lib/cart-helpers";
import { ecommerce } from "@/lib/analytics";
import { BRAND, SIZE_EXCHANGE } from "@/lib/brand";
import { BUNDLE } from "@/lib/discounts";

export const Route = createFileRoute("/korpa")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Korpa — EXIT Denim" },
      { property: "og:description", content: "Vaša korpa. Plaćanje pouzećem, dostava širom Srbije." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },

      { title: "Korpa — EXIT Denim" },
      { name: "description", content: "Vaša korpa. Plaćanje pouzećem, dostava širom Srbije." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, shipping, total } = useCart();
  const { info, blocking } = useCartCatalog(true);
  const [eta, setEta] = useState<string | null>(null);

  useEffect(() => setEta(deliveryWindow()), []);

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

  const checkoutButton = (className: string) =>
    blocking ? (
      <button type="button" disabled className={`${className} opacity-50 cursor-not-allowed`}>
        Nastavi na plaćanje
      </button>
    ) : (
      <Link to="/kasa" className={className}>
        Nastavi na plaćanje
      </Link>
    );

  return (
    <Layout>
      <section className={`exit-cart-page container-x py-12 md:py-16 ${items.length > 0 ? "pb-32 lg:pb-16" : ""}`}>
        <div className="eyebrow">Korpa</div>
        <h1 className="mt-4 text-4xl md:text-5xl">Vaša korpa</h1>

        {items.length === 0 ? (
          <>
            <RemovedNotice className="mt-8 max-w-md" />
            <div className="mt-16 border border-border p-16 text-center">
              <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground" strokeWidth={1.2} />
              <div className="mt-6 serif text-2xl">Korpa je prazna</div>
              <p className="mt-3 text-muted-foreground max-w-sm mx-auto">Pogledajte naš katalog i dodajte artikle.</p>
              <Link to="/katalog" className="btn-primary mt-8 inline-flex">Otvori katalog</Link>
            </div>
          </>
        ) : (
          <div className="mt-10 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 min-w-0">
              <RemovedNotice className="mb-4" />
              <ul className="divide-y divide-border border-y border-border">
                {items.map((it) => (
                  <PageCartLine key={lineKey(it)} item={it} info={info.get(lineKey(it)) ?? null} />
                ))}
              </ul>
              <BundleNudge className="mt-6" />
              <CartUpsell variant="page" />
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-border p-6 lg:sticky lg:top-24">
                <div className="eyebrow">Rezime</div>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Međuzbir</span><span className="tabular-nums">{subtotal.toLocaleString("sr-RS")} din</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Dostava</span><span className="tabular-nums">{shipping === 0 ? "Besplatna" : `${shipping.toLocaleString("sr-RS")} din`}</span></div>
                  <DiscountRow removable />
                  {subtotal < CART_CONSTANTS.FREE_SHIPPING_OVER && (
                    <div className="text-[11px] text-muted-foreground">Još {(CART_CONSTANTS.FREE_SHIPPING_OVER - subtotal).toLocaleString("sr-RS")} din do besplatne dostave.</div>
                  )}
                  <div className="flex justify-between pt-3 mt-3 border-t border-border text-base font-semibold"><span>Ukupno</span><span className="tabular-nums">{total.toLocaleString("sr-RS")} din</span></div>
                  {eta && <div className="text-[11px] text-muted-foreground">Okvirna isporuka: {eta}</div>}
                </div>
                {blocking && (
                  <p role="alert" className="mt-5 text-[12px] font-semibold text-destructive">
                    Promenite veličinu ili uklonite označene artikle da biste nastavili.
                  </p>
                )}
                {checkoutButton("btn-primary w-full justify-center mt-6")}
                <p className="text-[11px] text-center text-muted-foreground mt-3">Plaćanje pouzećem pri isporuci</p>
                <Link to="/katalog" className="btn-outline w-full justify-center mt-3">Nastavi kupovinu</Link>
                <ul className="mt-5 space-y-2 text-[12px] text-muted-foreground">
                  {[
                    "Plaćate tek kad preuzmete paket, bez kartice",
                    "Besplatna dostava na sve porudžbine",
                    `Besplatna zamena veličine u roku od ${SIZE_EXCHANGE.days} dana`,
                    `${BUNDLE.pct}% popusta kad uzmete ${BUNDLE.minQty} ili više komada`,
                    `Pomoć oko broja: ${BRAND.phoneLabel} (poziv, Viber, WhatsApp)`,
                  ].map((t) => (
                    <li key={t} className="flex gap-2"><span className="text-primary">✓</span>{t}</li>
                  ))}
                </ul>
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
          {checkoutButton("flex-1 inline-flex items-center justify-center bg-foreground text-background py-3.5 text-[12.5px] uppercase tracking-[0.18em] font-semibold")}
        </div>
      )}
    </Layout>
  );
}
