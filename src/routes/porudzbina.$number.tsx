import { createFileRoute, Link, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Package, MapPin } from "lucide-react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { lookupCustomerOrder } from "@/lib/customer-orders.functions";
import { BRAND, SIZE_EXCHANGE } from "@/lib/brand";
import { phoneHref, whatsappHref } from "@/lib/contact";
import { discountLabel } from "@/lib/discounts";

// Stari linkovi su nosili email u adresi; i dalje rade, ali kasa ga više tu ne stavlja.
const search = z.object({ email: z.string().email().optional() });

export const Route = createFileRoute("/porudzbina/$number")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { property: "og:title", content: "Vaša porudžbina — EXIT Denim" },
      { property: "og:description", content: "Status vaše porudžbine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },

      { title: "Vaša porudžbina — EXIT Denim" },
      { name: "description", content: "Status vaše porudžbine." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "U pripremi",
  confirmed: "Potvrđena",
  shipped: "Poslata",
  delivered: "Isporučena",
  cancelled: "Otkazana",
};

type Who = { email?: string; phone?: string };

/** Podaci koje je kasa ostavila u ovoj kartici odmah posle porudžbine. */
function readHandoff(number: string): Who | null {
  try {
    const raw = sessionStorage.getItem("exit_last_order");
    if (!raw) return null;
    const h = JSON.parse(raw);
    if (h?.number !== number) return null;
    if (h.email) return { email: h.email };
    if (h.phone) return { phone: h.phone };
    return null;
  } catch {
    return null;
  }
}

function OrderPage() {
  const { number } = useParams({ from: "/porudzbina/$number" });
  const { email: searchEmail } = useSearch({ from: "/porudzbina/$number" });
  const lookup = useServerFn(lookupCustomerOrder);

  const [contact, setContact] = useState(searchEmail ?? "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  const fetchOrder = async (who: Who) => {
    setLoading(true); setError(null);
    try {
      const r = await lookup({ data: { orderNumber: number, ...who } });
      if (!r) setError("Porudžbina nije pronađena. Proverite broj porudžbine i email ili telefon.");
      setOrder(r);
      setTried(true);
    } catch {
      setError("Porudžbina trenutno ne može da se prikaže. Pokušajte ponovo za minut.");
      setTried(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const who = searchEmail ? { email: searchEmail } : readHandoff(number);
    if (who) fetchOrder(who);
  }, []); // eslint-disable-line

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = contact.trim();
    if (!v) return;
    fetchOrder(v.includes("@") ? { email: v } : { phone: v });
  };

  const discount = Number(order?.discount ?? 0);

  return (
    <Layout>
      <section className="container-x py-12 md:py-16 max-w-3xl">
        {order ? (
          <>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/15 text-accent inline-flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="eyebrow">Hvala na poverenju</div>
                <h1 className="mt-3 text-3xl md:text-4xl">Porudžbina je primljena</h1>
                <p className="mt-3 text-muted-foreground">
                  Broj porudžbine: <span className="mono font-semibold text-foreground">{order.order_number}</span> · Status:{" "}
                  <span className="font-semibold text-foreground">{STATUS_LABEL[order.status] || order.status}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Porudžbina je odmah spremna za pakovanje i šalje se u roku od 1–2 radna dana. Plaćaš kuriru kad stigne.</p>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <div className="border border-border p-5">
                <div className="flex items-center gap-2 eyebrow"><MapPin className="w-3.5 h-3.5" /> Isporuka</div>
                <div className="mt-4 text-sm space-y-0.5">
                  <div className="font-medium">{order.customer_name}</div>
                  <div>{order.shipping_address}</div>
                  <div>{order.shipping_postal} {order.shipping_city}</div>
                  <div className="text-muted-foreground">{order.shipping_country}</div>
                </div>
              </div>
              <div className="border border-border p-5">
                <div className="flex items-center gap-2 eyebrow"><Package className="w-3.5 h-3.5" /> Rezime</div>
                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Međuzbir</span><span className="tabular-nums">{Number(order.subtotal).toLocaleString("sr-RS")} din</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Dostava</span><span className="tabular-nums">{Number(order.shipping_cost) === 0 ? "Besplatna" : `${Number(order.shipping_cost).toLocaleString("sr-RS")} din`}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent font-medium">
                      <span>{discountLabel(order.promo_code)}</span>
                      <span className="tabular-nums">−{discount.toLocaleString("sr-RS")} din</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 mt-2 border-t border-border font-semibold"><span>Ukupno pouzećem</span><span className="tabular-nums">{Number(order.total).toLocaleString("sr-RS")} din</span></div>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-border">
              <div className="px-5 py-3 border-b border-border eyebrow">Artikli</div>
              <ul className="divide-y divide-border">
                {order.customer_order_items?.map((it: any) => (
                  <li key={it.id} className="px-5 py-3 flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{it.product_name}</div>
                      <div className="text-[11px] text-muted-foreground">{it.product_sku} · Vel. {it.size} · {it.quantity}×</div>
                    </div>
                    <div className="tabular-nums">{(Number(it.unit_price) * it.quantity).toLocaleString("sr-RS")} din</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border border-border bg-secondary/40 p-5 text-sm">
              <div className="font-semibold">Treba da promenite veličinu ili adresu?</div>
              <p className="mt-1 text-muted-foreground">
                Javite se što pre, dok paket nije poslat. Zamena veličine je moguća u roku od {SIZE_EXCHANGE.days} dana, a troškove zamene snosi EXIT.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a className="btn-outline" href={phoneHref}>{BRAND.phoneLabel}</a>
                <a
                  className="btn-outline"
                  href={whatsappHref(`Zdravo, imam pitanje u vezi porudžbine ${order.order_number}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Link to="/katalog" className="btn-outline">Nastavi sa kupovinom</Link>
            </div>
          </>
        ) : (
          <>
            <div className="eyebrow">Praćenje porudžbine</div>
            <h1 className="mt-4 text-3xl md:text-4xl">Porudžbina {number}</h1>
            <p className="mt-3 text-muted-foreground">Unesite email ili broj telefona kojim ste poručili da vidite status.</p>
            <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email ili 064 123 4567"
                autoComplete="email"
                aria-label="Email ili telefon"
                className="flex-1 border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "..." : "Prikaži"}
              </button>
            </form>
            {loading && !tried && <p className="mt-4 text-sm text-muted-foreground">Učitavam porudžbinu…</p>}
            {tried && error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          </>
        )}
      </section>
    </Layout>
  );
}
