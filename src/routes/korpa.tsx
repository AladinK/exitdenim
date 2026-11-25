import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CartLine, CartTotals, gaItems } from "@/components/CartParts";
import { useCart } from "@/hooks/useCart";
import { ecommerce } from "@/lib/analytics";
import { formatRsd } from "@/lib/format";

export const Route = createFileRoute("/korpa")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Korpa — EXIT Denim" },
      { property: "og:description", content: "Vaša korpa. Plaćanje pouzećem, dostava širom Srbije." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
      { title: "Korpa — EXIT Denim" },
      { name: "description", content: "Vaša korpa. Plaćanje pouzećem, dostava širom Srbije." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total } = useCart();

  useEffect(() => {
    if (items.length === 0) return;
    ecommerce.viewCart(gaItems(items), total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const checkout = () => ecommerce.beginCheckout(gaItems(items), total);

  return (
    <Layout>
      <section className="container-x pt-8 pb-32 md:pt-12 lg:pb-16">
        <h1>Vaša korpa</h1>

        {items.length === 0 ? (
          <div className="notice mt-8 justify-items-center py-16 text-center">
            <ShoppingBag aria-hidden="true" className="h-8 w-8 text-ink-3" strokeWidth={1.4} />
            <div>
              <h2>Korpa je prazna</h2>
              <p className="mx-auto mt-2">Izaberite model i veličinu, a platićete tek kada paket stigne.</p>
            </div>
            <Link to="/katalog" className="btn-primary">Pogledajte modele</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
            <ul className="divide-y divide-line border-y border-line [&>li]:px-0">
              {items.map((it) => (
                <CartLine key={`${it.productId}-${it.size}`} item={it} />
              ))}
            </ul>

            <aside>
              <div className="panel lg:sticky lg:top-[calc(var(--header-h)+24px)]">
                <h2 className="panel__title">Pregled</h2>
                <div className="mt-4">
                  <CartTotals allowPromoRemoval />
                </div>
                <Link to="/kasa" onClick={checkout} className="btn-primary mt-6 hidden w-full lg:inline-flex">
                  Nastavi na porudžbinu
                </Link>
                <Link to="/katalog" className="btn-outline mt-2 w-full">Nastavi kupovinu</Link>
                <p className="mt-4 text-center text-[0.8125rem] text-ink-3">Plaćate pouzećem, pri preuzimanju paketa</p>
              </div>
            </aside>
          </div>
        )}
      </section>

      {items.length > 0 && (
        <div className="sticky-bar" data-visible="true">
          <div className="flex items-center gap-3">
            <div className="shrink-0 leading-tight">
              <div className="text-[0.8125rem] text-ink-3">Ukupno</div>
              <div className="text-base font-bold">{formatRsd(total)}</div>
            </div>
            <Link to="/kasa" onClick={checkout} className="btn-primary flex-1">
              Nastavi na porudžbinu
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}
