import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Package } from "lucide-react";
import { Layout } from "@/components/Layout";
import { listMyCustomerOrders } from "@/lib/customer-orders.functions";

export const Route = createFileRoute("/_authenticated/moje-porudzbine")({
  head: () => ({
    meta: [
      { title: "Моје поруџбине — EXIT Denim" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyOrders,
});

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "На чекању", cls: "text-muted-foreground bg-secondary" },
  confirmed: { label: "Потврђена", cls: "text-accent bg-accent/10" },
  shipped: { label: "Послата", cls: "text-blue-700 bg-blue-100" },
  delivered: { label: "Испоручена", cls: "text-green-700 bg-green-100" },
  cancelled: { label: "Отказана", cls: "text-destructive bg-destructive/10" },
};

function MyOrders() {
  const load = useServerFn(listMyCustomerOrders);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load({}).then((r) => { setOrders(r); setLoading(false); }).catch(() => setLoading(false)); }, []); // eslint-disable-line

  return (
    <Layout>
      <section className="container-x py-12 md:py-16">
        <div className="eyebrow">Кориснички налог</div>
        <h1 className="mt-4 text-3xl md:text-4xl">Моје поруџбине</h1>

        {loading ? (
          <div className="mt-10 text-muted-foreground">Учитавање...</div>
        ) : orders.length === 0 ? (
          <div className="mt-12 border border-border p-16 text-center">
            <Package className="w-8 h-8 mx-auto text-muted-foreground" strokeWidth={1.2} />
            <div className="mt-6 serif text-2xl">Још нема поруџбина</div>
            <p className="mt-3 text-muted-foreground">Када поручите, статус ће се појавити овде.</p>
            <Link to="/katalog" className="btn-primary mt-8 inline-flex">Отвори каталог</Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {orders.map((o) => {
              const s = STATUS[o.status] || { label: o.status, cls: "" };
              return (
                <div key={o.id} className="border border-border p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mono text-[11px] tracking-[0.18em] text-muted-foreground">{o.order_number}</div>
                      <div className="text-sm mt-1">{new Date(o.created_at).toLocaleDateString("sr-RS", { day: "numeric", month: "long", year: "numeric" })}</div>
                    </div>
                    <span className={`text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 ${s.cls}`}>{s.label}</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Укупно</div>
                      <div className="text-lg font-semibold tabular-nums">{Number(o.total).toLocaleString("sr-RS")} дин</div>
                    </div>
                  </div>
                  <ul className="mt-4 divide-y divide-border border-t border-border">
                    {(o.customer_order_items || []).map((it: any) => (
                      <li key={it.id} className="py-2.5 flex justify-between text-sm">
                        <div>
                          <div>{it.product_name}</div>
                          <div className="text-[11px] text-muted-foreground">{it.product_sku} · Вел. {it.size} · {it.quantity}×</div>
                        </div>
                        <div className="tabular-nums">{(Number(it.unit_price) * it.quantity).toLocaleString("sr-RS")} дин</div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}
