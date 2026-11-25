import { createFileRoute, Link, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Package, MapPin } from "lucide-react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { lookupCustomerOrder } from "@/lib/customer-orders.functions";
import { formatRsd } from "@/lib/format";
import { whatsappHref } from "@/lib/contact";

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

const STATUS: Record<string, { label: string; title: string; note: string }> = {
  pending: { label: "U pripremi", title: "Porudžbina je primljena", note: "Pakujemo je i šaljemo u roku od 1–2 radna dana. Plaćate kuriru kada paket stigne." },
  confirmed: { label: "Potvrđena", title: "Porudžbina je potvrđena", note: "Pakujemo je i šaljemo u roku od 1–2 radna dana. Plaćate kuriru kada paket stigne." },
  shipped: { label: "Poslata", title: "Paket je na putu", note: "Predat je kurirskoj službi. Pripremite iznos za plaćanje pouzećem." },
  delivered: { label: "Isporučena", title: "Porudžbina je isporučena", note: "Hvala što nosite EXIT. Ako veličina ne odgovara, javite nam se radi zamene." },
  cancelled: { label: "Otkazana", title: "Porudžbina je otkazana", note: "Ako mislite da je u pitanju greška, javite nam se." },
};

function OrderPage() {
  const { number } = useParams({ from: "/porudzbina/$number" });
  const { email: searchEmail } = useSearch({ from: "/porudzbina/$number" });
  const lookup = useServerFn(lookupCustomerOrder);

  const [email, setEmail] = useState(searchEmail ?? "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  const fetchOrder = async (e: string) => {
    setLoading(true); setError(null);
    try {
      const r = await lookup({ data: { orderNumber: number, email: e } });
      if (!r) setError("Porudžbina nije pronađena. Proverite broj i e-mail adresu.");
      setOrder(r);
      setTried(true);
    } catch (err: any) {
      setError("Status trenutno ne možemo da prikažemo. Pokušajte ponovo za koji minut.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchEmail) fetchOrder(searchEmail);
  }, []); // eslint-disable-line

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) fetchOrder(email);
  };

  return (
    <Layout>
      <section className="container-x py-12 md:py-16 max-w-3xl">
        {order ? (
          <>
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-action-soft text-action-text">
                <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
              </div>
              <div>
                <p className="eyebrow">Hvala na poverenju</p>
                <h1 className="mt-1 text-[clamp(1.75rem,2.4vw+1rem,2.5rem)]">{(STATUS[order.status] ?? STATUS.pending).title}</h1>
                <p className="mt-3 text-ink-2">
                  Broj porudžbine <strong className="text-foreground">{order.order_number}</strong> · {(STATUS[order.status] ?? STATUS.pending).label}
                </p>
                <p className="mt-1 text-sm text-ink-2">{(STATUS[order.status] ?? STATUS.pending).note}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="panel">
                <h2 className="panel__title flex items-center gap-2"><MapPin aria-hidden="true" className="h-[18px] w-[18px] text-ink-3" /> Isporuka</h2>
                <div className="mt-3 text-[0.9375rem]">
                  <div className="font-medium">{order.customer_name}</div>
                  <div>{order.shipping_address}</div>
                  <div>{order.shipping_postal} {order.shipping_city}</div>
                  <div className="text-ink-3">{order.shipping_country}</div>
                </div>
              </div>
              <div className="panel">
                <h2 className="panel__title flex items-center gap-2"><Package aria-hidden="true" className="h-[18px] w-[18px] text-ink-3" /> Iznos</h2>
                <dl className="totals mt-3">
                  <div><dt>Međuzbir</dt><dd>{formatRsd(order.subtotal)}</dd></div>
                  <div><dt>Dostava</dt><dd>{Number(order.shipping_cost) === 0 ? "Besplatna" : formatRsd(order.shipping_cost)}</dd></div>
                  {Number(order.discount) > 0 && (
                    <div><dt>Popust{order.promo_code ? ` (${order.promo_code})` : ""}</dt><dd>−{formatRsd(order.discount)}</dd></div>
                  )}
                  <div className="totals__sum"><dt>Ukupno, pouzećem</dt><dd>{formatRsd(order.total)}</dd></div>
                </dl>
              </div>
            </div>

            <div className="panel mt-4">
              <h2 className="panel__title">Artikli</h2>
              <ul className="mt-2 divide-y divide-line">
                {order.customer_order_items?.map((it: any) => (
                  <li key={it.id} className="flex justify-between gap-4 py-3 text-[0.9375rem]">
                    <div>
                      <div className="font-medium">{it.product_name}</div>
                      <div className="text-[0.8125rem] text-ink-3">{it.product_sku} · veličina {it.size} · {it.quantity} kom</div>
                    </div>
                    <div className="shrink-0 font-semibold">{formatRsd(Number(it.unit_price) * it.quantity)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/katalog" className="btn-primary">Nastavite kupovinu</Link>
              <a href={whatsappHref(`Zdravo, imam pitanje u vezi sa porudžbinom ${order.order_number}.`)} target="_blank" rel="noopener noreferrer" className="btn-outline">Pitanje o porudžbini</a>
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">Praćenje porudžbine</p>
            <h1 className="mt-1 text-[clamp(1.75rem,2.4vw+1rem,2.5rem)]">Porudžbina {number}</h1>
            <p className="mt-3 text-ink-2">Unesite e-mail kojim ste poručili da biste videli status.</p>
            <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.com"
                autoComplete="email"
                aria-label="E-mail adresa"
                className="flex-1 input"
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Tražim…" : "Prikaži status"}
              </button>
            </form>
            {error && <p role="alert" className="error-text mt-4">{error}</p>}
          </>
        )}
      </section>
    </Layout>
  );
}
