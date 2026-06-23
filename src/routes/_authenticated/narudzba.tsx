import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Send } from "lucide-react";
import { Layout } from "@/components/Layout";
import { getMyDraftOrder, removeOrderItem, submitOrder, getMyProfile } from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/narudzba")({
  head: () => ({ meta: [{ title: "Moja B2B narudžba — EXIT Denim" }] }),
  component: Narudzba,
});

function Narudzba() {
  const fetchOrder = useServerFn(getMyDraftOrder);
  const fetchProfile = useServerFn(getMyProfile);
  const removeItem = useServerFn(removeOrderItem);
  const submit = useServerFn(submitOrder);
  const [order, setOrder] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    const [o, p] = await Promise.all([fetchOrder({}), fetchProfile({})]);
    setOrder(o);
    setProfile(p);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []); // eslint-disable-line

  if (loading) {
    return <Layout><div className="container-x py-32 text-center text-muted-foreground">Učitavanje...</div></Layout>;
  }

  if (profile?.profile?.status !== "approved") {
    return (
      <Layout>
        <div className="container-x py-32 text-center">
          <h1 className="text-3xl">Nalog još nije odobren</h1>
          <Link to="/cekanje" className="btn-primary mt-6 inline-flex">Pogledaj status</Link>
        </div>
      </Layout>
    );
  }

  const items = order?.order_items || [];
  const totalPieces = items.reduce((a: number, i: any) => a + i.quantity, 0);
  const totalValue = items.reduce((a: number, i: any) => a + i.quantity * Number(i.unit_price), 0);

  if (submitted) {
    return (
      <Layout>
        <section className="section-pad">
          <div className="container-x max-w-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-accent inline-flex items-center justify-center text-accent-foreground text-2xl">✓</div>
            <h1 className="mt-6 text-4xl md:text-5xl">Upit poslat</h1>
            <p className="mt-4 text-muted-foreground">
              Tvoja narudžba je registrovana. Naš tim potvrđuje stock i šalje pro forma fakturu na email u roku 24h.
            </p>
            <Link to="/katalog" className="btn-primary mt-8 inline-flex">Nastavi pregled kataloga</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const send = async () => {
    setError(null);
    try {
      await submit({ data: { orderId: order.id, note } });
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || "Greška");
    }
  };

  // Group items by product
  const byProduct = items.reduce((acc: any, it: any) => {
    const key = it.product_id;
    if (!acc[key]) acc[key] = { product: it.products, items: [] };
    acc[key].items.push(it);
    return acc;
  }, {});

  return (
    <Layout>
      <section className="bg-secondary border-b border-border">
        <div className="container-x py-12">
          <div className="eyebrow">B2B narudžba</div>
          <h1 className="mt-2 text-4xl md:text-5xl">Pregled narudžbe</h1>
          {order?.order_number && (
            <div className="mt-2 text-sm text-muted-foreground">#{order.order_number}</div>
          )}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.length === 0 && (
              <div className="border border-dashed border-border rounded-sm p-10 text-center">
                <div className="text-muted-foreground">Narudžba je prazna.</div>
                <Link to="/katalog" className="btn-primary mt-4 inline-flex">Otvori katalog</Link>
              </div>
            )}
            {Object.values(byProduct).map((grp: any) => (
              <div key={grp.product?.sku} className="border border-border rounded-sm p-5 bg-card">
                <div className="flex items-center gap-4">
                  {grp.product?.image_url && (
                    <img src={grp.product.image_url} alt={grp.product.name} className="w-16 h-16 object-cover rounded-sm" />
                  )}
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">{grp.product?.sku}</div>
                    <div className="font-semibold">{grp.product?.name}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {grp.items.map((it: any) => (
                    <div key={it.id} className="border border-border rounded-sm p-2 text-center relative group">
                      <div className="text-[10px] text-muted-foreground">{it.size}</div>
                      <div className="text-lg font-semibold tabular-nums">{it.quantity}</div>
                      <button
                        onClick={async () => { await removeItem({ data: { itemId: it.id } }); refresh(); }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background opacity-0 group-hover:opacity-100 text-[10px] flex items-center justify-center"
                        aria-label="Ukloni"
                      >×</button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-right text-sm text-muted-foreground">
                  {grp.items.reduce((a: number, i: any) => a + i.quantity, 0)} kom × €{Number(grp.items[0].unit_price).toFixed(2)} = €{(grp.items.reduce((a: number, i: any) => a + i.quantity * Number(i.unit_price), 0)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="border border-foreground rounded-sm p-6">
              <div className="eyebrow">Ukupno</div>
              <div className="mt-4 flex justify-between text-sm">
                <span>Komada</span>
                <span className="font-semibold tabular-nums">{totalPieces}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>Vrijednost (veleprodaja)</span>
                <span className="font-semibold tabular-nums">€{totalValue.toFixed(2)}</span>
              </div>
              <textarea
                placeholder="Napomena (opciono)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="mt-5 w-full border border-input bg-background rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
              {error && <div className="mt-3 text-xs text-destructive">{error}</div>}
              <button
                onClick={send}
                disabled={items.length === 0}
                className="btn-primary w-full mt-4 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Pošalji upit
              </button>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                Narudžba se šalje kao upit. Potvrđujemo stock i šaljemo pro forma fakturu prije proizvodnje / isporuke.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
