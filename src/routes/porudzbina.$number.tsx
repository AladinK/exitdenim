import { createFileRoute, Link, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Package, MapPin } from "lucide-react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { lookupCustomerOrder } from "@/lib/customer-orders.functions";

const search = z.object({ email: z.string().email().optional() });

export const Route = createFileRoute("/porudzbina/$number")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Ваша поруџбина — EXIT Denim" },
      { name: "description", content: "Статус ваше поруџбине." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "На чекању",
  confirmed: "Потврђена",
  shipped: "Послата",
  delivered: "Испоручена",
  cancelled: "Отказана",
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
      if (!r) setError("Поруџбина није пронађена. Проверите број и email.");
      setOrder(r);
      setTried(true);
    } catch (err: any) {
      setError(err?.message || "Грешка при учитавању.");
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
              <div className="w-12 h-12 rounded-full bg-accent/15 text-accent inline-flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="eyebrow">Хвала на поверењу</div>
                <h1 className="mt-3 text-3xl md:text-4xl">Поруџбина је примљена</h1>
                <p className="mt-3 text-muted-foreground">
                  Број поруџбине: <span className="mono font-semibold text-foreground">{order.order_number}</span> · Статус:{" "}
                  <span className="font-semibold text-foreground">{STATUS_LABEL[order.status] || order.status}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Позваћемо вас на телефон да потврдимо испоруку.</p>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <div className="border border-border p-5">
                <div className="flex items-center gap-2 eyebrow"><MapPin className="w-3.5 h-3.5" /> Испорука</div>
                <div className="mt-4 text-sm space-y-0.5">
                  <div className="font-medium">{order.customer_name}</div>
                  <div>{order.shipping_address}</div>
                  <div>{order.shipping_postal} {order.shipping_city}</div>
                  <div className="text-muted-foreground">{order.shipping_country}</div>
                </div>
              </div>
              <div className="border border-border p-5">
                <div className="flex items-center gap-2 eyebrow"><Package className="w-3.5 h-3.5" /> Резиме</div>
                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Међузбир</span><span className="tabular-nums">{Number(order.subtotal).toLocaleString("sr-RS")} дин</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Достава</span><span className="tabular-nums">{Number(order.shipping_cost) === 0 ? "Бесплатна" : `${Number(order.shipping_cost).toLocaleString("sr-RS")} дин`}</span></div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-border font-semibold"><span>Укупно</span><span className="tabular-nums">{Number(order.total).toLocaleString("sr-RS")} дин</span></div>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-border">
              <div className="px-5 py-3 border-b border-border eyebrow">Артикли</div>
              <ul className="divide-y divide-border">
                {order.customer_order_items?.map((it: any) => (
                  <li key={it.id} className="px-5 py-3 flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{it.product_name}</div>
                      <div className="text-[11px] text-muted-foreground">{it.product_sku} · Вел. {it.size} · {it.quantity}×</div>
                    </div>
                    <div className="tabular-nums">{(Number(it.unit_price) * it.quantity).toLocaleString("sr-RS")} дин</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex gap-3">
              <Link to="/katalog" className="btn-outline">Настави са куповином</Link>
            </div>
          </>
        ) : (
          <>
            <div className="eyebrow">Праћење поруџбине</div>
            <h1 className="mt-4 text-3xl md:text-4xl">Поруџбина {number}</h1>
            <p className="mt-3 text-muted-foreground">Унесите email којим сте поручили да видите статус.</p>
            <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "..." : "Прикажи"}
              </button>
            </form>
            {tried && error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          </>
        )}
      </section>
    </Layout>
  );
}
