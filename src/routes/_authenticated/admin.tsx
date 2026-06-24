import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, ExternalLink, Plus, Trash2, Upload, Pencil } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import {
  listPartners, setPartnerStatus, listAllOrders, updateOrderStatus, adminStats,
  adminListProducts, upsertProduct, deleteProduct, upsertStock,
} from "@/lib/admin.functions";
import { getMyProfile } from "@/lib/orders.functions";

type AdminProduct = {
  id: string;
  slug: string; sku: string; name: string;
  category: "jeans" | "chino" | "cargo";
  fit: "Slim" | "Regular Slim" | "Relaxed" | "Cargo";
  fabric: string; weight: string; color: string;
  sizes: string[];
  wholesale: number; retail: number; moq: number;
  delivery: string;
  description: string | null;
  image_url: string | null;
  active: boolean; sort_order: number;
  stock: Record<string, number>;
};

const EMPTY: AdminProduct = {
  id: "",
  slug: "", sku: "", name: "",
  category: "jeans", fit: "Slim",
  fabric: "100% pamuk, 13.5 oz selvedge denim",
  weight: "13.5 oz", color: "Indigo",
  sizes: ["28","30","32","34","36","38"],
  wholesale: 0, retail: 0, moq: 10,
  delivery: "5-7 dana",
  description: "",
  image_url: null,
  active: true, sort_order: 0,
  stock: {},
};

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — EXIT Denim B2B" }] }),
  component: Admin,
});

function Admin() {
  const fetchMe = useServerFn(getMyProfile);
  const fetchPartners = useServerFn(listPartners);
  const fetchOrders = useServerFn(listAllOrders);
  const fetchStats = useServerFn(adminStats);
  const setStatus = useServerFn(setPartnerStatus);
  const updateOrder = useServerFn(updateOrderStatus);
  const fetchProducts = useServerFn(adminListProducts);
  const saveProduct = useServerFn(upsertProduct);
  const removeProduct = useServerFn(deleteProduct);
  const saveStock = useServerFn(upsertStock);

  const [tab, setTab] = useState<"products" | "partners" | "orders" | "stats">("products");
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);

  useEffect(() => {
    fetchMe({}).then((r) => setAllowed(r.isAdmin));
  }, []); // eslint-disable-line

  const reload = async () => {
    if (tab === "partners") setPartners(await fetchPartners({}));
    if (tab === "orders") setOrders(await fetchOrders({}));
    if (tab === "products") setProducts((await fetchProducts({})) as AdminProduct[]);
    if (tab === "stats") setStats(await fetchStats({}));
  };
  useEffect(() => { if (allowed) reload(); }, [tab, allowed]); // eslint-disable-line

  if (allowed === null) return <Layout><div className="container-x py-32 text-center text-muted-foreground">...</div></Layout>;
  if (!allowed) return <Layout><div className="container-x py-32 text-center"><h1 className="text-3xl">Pristup zabranjen</h1></div></Layout>;

  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-10">
          <div className="eyebrow text-accent">Admin panel</div>
          <h1 className="mt-2 text-3xl md:text-4xl">EXIT Denim B2B uprava</h1>
        </div>
      </section>

      <div className="border-b border-border bg-background sticky top-16 z-20">
        <div className="container-x flex gap-1 overflow-x-auto">
          {[
            ["products", "Proizvodi"],
            ["partners", "Partneri"],
            ["orders", "Narudžbe"],
            ["stats", "Statistika"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k as any)}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                tab === k ? "border-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >{l}</button>
          ))}
        </div>
      </div>

      <section className="py-10">
        <div className="container-x">
          {tab === "products" && (
            <ProductsTab
              products={products}
              editing={editing}
              setEditing={setEditing}
              onSave={async (p, stockEntries) => {
                const saved = await saveProduct({ data: stripStock(p) });
                if (stockEntries.length) {
                  await saveStock({ data: { productId: saved.id, entries: stockEntries } });
                }
                setEditing(null);
                reload();
              }}
              onDelete={async (id) => {
                if (!confirm("Obrisati ovaj artikal i sve zalihe?")) return;
                await removeProduct({ data: { id } });
                reload();
              }}
            />
          )}

          {tab === "partners" && (
            <div className="space-y-3">
              {partners.length === 0 && <div className="text-muted-foreground">Nema prijava.</div>}
              {partners.map((p) => (
                <div key={p.id} className="border border-border rounded-sm p-5 bg-card grid md:grid-cols-[1fr_auto] gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-lg">{p.boutique_name || "—"}</span>
                      <StatusPill status={p.status} />
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {p.country || "—"} · {p.city || "—"} · {p.email}
                    </div>
                    <div className="text-sm mt-2 flex gap-4 flex-wrap text-muted-foreground">
                      {p.contact_person && <span>{p.contact_person}</span>}
                      {p.phone && <span>{p.phone}</span>}
                      {p.instagram && <a href={`https://instagram.com/${p.instagram.replace("@","")}`} target="_blank" rel="noopener" className="text-accent inline-flex items-center gap-1">{p.instagram} <ExternalLink className="w-3 h-3" /></a>}
                      {p.website && <a href={p.website.startsWith("http") ? p.website : `https://${p.website}`} target="_blank" rel="noopener" className="text-accent inline-flex items-center gap-1">{p.website} <ExternalLink className="w-3 h-3" /></a>}
                    </div>
                    {p.store_type && <div className="text-xs mt-2 text-muted-foreground">{p.store_type} · {p.monthly_qty || "?"} mjesečno</div>}
                    {p.message && <div className="mt-3 text-sm border-l-2 border-border pl-3 italic text-muted-foreground">{p.message}</div>}
                  </div>
                  <div className="flex md:flex-col gap-2 self-start">
                    {p.status !== "approved" && (
                      <button onClick={async () => { await setStatus({ data: { partnerId: p.id, status: "approved" } }); reload(); }} className="btn-primary text-xs px-3 py-2">
                        <Check className="w-3 h-3" /> Odobri
                      </button>
                    )}
                    {p.status !== "rejected" && (
                      <button onClick={async () => { await setStatus({ data: { partnerId: p.id, status: "rejected" } }); reload(); }} className="btn-outline text-xs px-3 py-2">
                        <X className="w-3 h-3" /> Odbij
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 && <div className="text-muted-foreground">Nema poslatih narudžbi.</div>}
              {orders.map((o) => (
                <details key={o.id} className="border border-border rounded-sm bg-card">
                  <summary className="px-5 py-4 cursor-pointer flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-semibold">{o.order_number} · {o.profiles?.boutique_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{o.profiles?.country} · {o.profiles?.city} · {new Date(o.submitted_at || o.created_at).toLocaleDateString("sr-RS")}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm tabular-nums">{o.total_pieces} kom · €{Number(o.total_value).toFixed(2)}</span>
                      <OrderStatusPill status={o.status} />
                    </div>
                  </summary>
                  <div className="px-5 pb-5 border-t border-border">
                    <table className="w-full text-sm mt-3">
                      <thead className="text-xs text-muted-foreground uppercase">
                        <tr><th className="text-left py-1">SKU</th><th className="text-left">Artikal</th><th>Veličina</th><th>Kom</th><th>Cijena</th></tr>
                      </thead>
                      <tbody>
                        {(o.order_items || []).map((i: any) => (
                          <tr key={i.id} className="border-t border-border">
                            <td className="py-1">{i.products?.sku}</td>
                            <td>{i.products?.name}</td>
                            <td className="text-center">{i.size}</td>
                            <td className="text-center tabular-nums">{i.quantity}</td>
                            <td className="text-right tabular-nums">€{Number(i.unit_price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {o.note && <div className="mt-3 text-sm italic text-muted-foreground border-l-2 border-border pl-3">{o.note}</div>}
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {(["submitted", "confirmed", "shipped", "cancelled"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={async () => { await updateOrder({ data: { orderId: o.id, status: s } }); reload(); }}
                          disabled={o.status === s}
                          className={`px-3 py-1.5 text-xs border rounded-sm ${o.status === s ? "bg-foreground text-background border-foreground" : "border-border"}`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}

          {tab === "stats" && stats && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ["Ukupno partnera", stats.partners],
                ["Na čekanju", stats.pending],
                ["Aktivni upiti", stats.submitted],
                ["Potvrđene narudžbe", stats.confirmed],
              ].map(([l, v]) => (
                <div key={l as string} className="border border-border rounded-sm p-6 bg-card">
                  <div className="text-4xl font-display font-bold tabular-nums">{v as number}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-secondary text-muted-foreground",
    approved: "bg-accent text-accent-foreground",
    rejected: "bg-destructive text-destructive-foreground",
  };
  return <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm font-semibold ${map[status] || "bg-secondary"}`}>{status}</span>;
}
function OrderStatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "bg-accent/20 text-accent",
    confirmed: "bg-accent text-accent-foreground",
    shipped: "bg-foreground text-background",
    cancelled: "bg-destructive/20 text-destructive",
  };
  return <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm font-semibold ${map[status] || "bg-secondary"}`}>{status}</span>;
}
