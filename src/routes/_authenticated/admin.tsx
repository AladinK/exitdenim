import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, ExternalLink, Plus, Trash2, Upload, Pencil } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import {
  listPartners, setPartnerStatus, listAllOrders, updateOrderStatus, adminStats,
  adminListProducts, upsertProduct, deleteProduct, upsertStock,
  listAllCustomerOrders, updateCustomerOrderStatus,
} from "@/lib/admin.functions";
import { adminListSiteAssets, upsertSiteAsset, deleteSiteAsset, HOME_ASSET_KEYS, type HomeAssetKey } from "@/lib/site-assets.functions";
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
  const fetchCustomerOrders = useServerFn(listAllCustomerOrders);
  const updateCustomerOrder = useServerFn(updateCustomerOrderStatus);

  const fetchSiteAssets = useServerFn(adminListSiteAssets);
  const saveSiteAsset = useServerFn(upsertSiteAsset);
  const removeSiteAsset = useServerFn(deleteSiteAsset);

  const [tab, setTab] = useState<"products" | "home" | "partners" | "orders" | "kupci" | "stats">("products");
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [siteAssets, setSiteAssets] = useState<Record<string, { url: string; alt: string | null; signed: string }>>({});

  useEffect(() => {
    fetchMe({}).then((r) => setAllowed(r.isAdmin));
  }, []); // eslint-disable-line

  const reload = async () => {
    if (tab === "partners") setPartners(await fetchPartners({}));
    if (tab === "orders") setOrders(await fetchOrders({}));
    if (tab === "kupci") setCustomerOrders(await fetchCustomerOrders({}));
    if (tab === "products") setProducts((await fetchProducts({})) as AdminProduct[]);
    if (tab === "stats") setStats(await fetchStats({}));
    if (tab === "home") setSiteAssets(await fetchSiteAssets({}));
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
            ["home", "Početna"],
            ["partners", "Partneri (B2B)"],
            ["orders", "B2B narudžbe"],
            ["kupci", "Kupci (retail)"],
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

          {tab === "home" && (
            <HomeAssetsTab
              assets={siteAssets}
              onSave={async (key: HomeAssetKey, url: string, alt: string | null) => {
                await saveSiteAsset({ data: { key, url, alt } });
                reload();
              }}
              onDelete={async (key: HomeAssetKey) => {
                if (!confirm("Vratiti default sliku za ovaj slot?")) return;
                await removeSiteAsset({ data: { key } });
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

          {tab === "kupci" && (
            <div className="space-y-3">
              {customerOrders.length === 0 && <div className="text-muted-foreground">Još nema retail porudžbina.</div>}
              {customerOrders.map((o) => (
                <details key={o.id} className="border border-border rounded-sm bg-card">
                  <summary className="px-5 py-4 cursor-pointer flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-semibold">{o.order_number} · {o.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.email} · {o.phone} · {o.city}, {o.postal_code} · {new Date(o.created_at).toLocaleString("sr-RS")}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm tabular-nums">
                        {(o.customer_order_items || []).reduce((s: number, i: any) => s + i.quantity, 0)} kom · {Number(o.total).toLocaleString("sr-RS")} дин
                      </span>
                      <CustomerOrderStatusPill status={o.status} />
                    </div>
                  </summary>
                  <div className="px-5 pb-5 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <div className="text-xs uppercase text-muted-foreground mb-1">Adresa isporuke</div>
                        <div>{o.customer_name}</div>
                        <div>{o.address}</div>
                        <div>{o.postal_code} {o.city}</div>
                        <div>{o.country || "Srbija"}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase text-muted-foreground mb-1">Plaćanje</div>
                        <div className="uppercase">{o.payment_method === "cod" ? "Pouzećem" : o.payment_method}</div>
                        <div className="text-xs text-muted-foreground mt-2">Dostava: {Number(o.shipping).toLocaleString("sr-RS")} дин</div>
                        <div className="text-xs text-muted-foreground">Ukupno: <b className="text-foreground">{Number(o.total).toLocaleString("sr-RS")} дин</b></div>
                      </div>
                    </div>
                    <table className="w-full text-sm mt-4">
                      <thead className="text-xs text-muted-foreground uppercase">
                        <tr><th className="text-left py-1">SKU</th><th className="text-left">Artikal</th><th>Vel.</th><th>Kom</th><th className="text-right">Cijena</th></tr>
                      </thead>
                      <tbody>
                        {(o.customer_order_items || []).map((i: any) => (
                          <tr key={i.id} className="border-t border-border">
                            <td className="py-1">{i.product_sku}</td>
                            <td>{i.product_name}</td>
                            <td className="text-center">{i.size}</td>
                            <td className="text-center tabular-nums">{i.quantity}</td>
                            <td className="text-right tabular-nums">{Number(i.unit_price).toLocaleString("sr-RS")} дин</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {o.note && <div className="mt-3 text-sm italic text-muted-foreground border-l-2 border-border pl-3">{o.note}</div>}
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {(["pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={async () => { await updateCustomerOrder({ data: { orderId: o.id, status: s } }); reload(); }}
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
function CustomerOrderStatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-secondary text-muted-foreground",
    confirmed: "bg-accent/20 text-accent",
    shipped: "bg-foreground text-background",
    delivered: "bg-accent text-accent-foreground",
    cancelled: "bg-destructive/20 text-destructive",
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

// =========================================================================
// PRODUCTS TAB
// =========================================================================

function stripStock(p: AdminProduct) {
  // Return only fields accepted by upsertProduct (omit stock + empty id).
  const { stock, ...rest } = p;
  const out: any = { ...rest };
  if (!out.id) delete out.id;
  out.wholesale = Number(out.wholesale) || 0;
  out.retail = Number(out.retail) || 0;
  out.moq = Number(out.moq) || 0;
  out.sort_order = Number(out.sort_order) || 0;
  out.sizes = (out.sizes || []).map((s: string) => s.trim()).filter(Boolean);
  return out;
}

function ProductsTab({
  products, editing, setEditing, onSave, onDelete,
}: {
  products: AdminProduct[];
  editing: AdminProduct | null;
  setEditing: (p: AdminProduct | null) => void;
  onSave: (p: AdminProduct, stock: { size: string; quantity: number }[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  if (editing) {
    return <ProductForm initial={editing} onCancel={() => setEditing(null)} onSave={onSave} />;
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Katalog</div>
          <div className="text-lg font-semibold">{products.length} artikala</div>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novi artikal
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border border-border rounded-sm bg-card overflow-hidden">
            <div className="aspect-[4/5] bg-secondary relative">
              {p.image_url
                ? <ProductThumb path={p.image_url} alt={p.name} />
                : <div className="w-full h-full grid place-items-center text-muted-foreground text-xs uppercase tracking-wider">bez slike</div>}
              {!p.active && <span className="absolute top-2 left-2 bg-foreground text-background text-[10px] px-2 py-0.5 uppercase tracking-wider">draft</span>}
            </div>
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.category} · {p.fit}</div>
              <div className="font-semibold mt-1">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{p.sku} · €{Number(p.wholesale).toFixed(2)} · MOQ {p.moq}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing(p)} className="btn-outline text-xs px-3 py-1.5 inline-flex items-center gap-1"><Pencil className="w-3 h-3" /> Uredi</button>
                <button onClick={() => onDelete(p.id)} className="btn-outline text-xs px-3 py-1.5 inline-flex items-center gap-1 text-destructive border-destructive/40"><Trash2 className="w-3 h-3" /> Obriši</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductThumb({ path, alt }: { path: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancel = false;
    (async () => {
      const resolved = await resolveImage(path);
      if (!cancel) setUrl(resolved);
    })();
    return () => { cancel = true; };
  }, [path]);
  if (!url) return <div className="w-full h-full bg-secondary animate-pulse" />;
  return <img src={url} alt={alt} className="w-full h-full object-cover" />;
}

async function resolveImage(path: string): Promise<string | null> {
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path;
  const { data } = await supabase.storage.from("product-images").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}

function ProductForm({
  initial, onCancel, onSave,
}: {
  initial: AdminProduct;
  onCancel: () => void;
  onSave: (p: AdminProduct, stock: { size: string; quantity: number }[]) => Promise<void>;
}) {
  const [p, setP] = useState<AdminProduct>({ ...initial, sizes: [...(initial.sizes || [])] });
  const [stockDraft, setStockDraft] = useState<Record<string, number>>({ ...(initial.stock || {}) });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setP((s) => ({ ...s, [k]: v }));

  const handleUpload = async (file: File) => {
    setErr(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `products/${p.slug || "untitled"}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600", upsert: true, contentType: file.type,
      });
      if (error) throw error;
      set("image_url", path);
    } catch (e: any) {
      setErr(e.message || "Upload nije uspio");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    setErr(null); setSaving(true);
    try {
      const entries = Object.entries(stockDraft).map(([size, quantity]) => ({ size, quantity: Number(quantity) || 0 }));
      await onSave(p, entries);
    } catch (e: any) {
      setErr(e.message || "Greška pri snimanju");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-border bg-card rounded-sm">
      <div className="border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.id ? "Uredi" : "Novi"} artikal</div>
          <div className="font-semibold text-lg">{p.name || "—"}</div>
        </div>
        <button onClick={onCancel} className="btn-outline text-xs px-3 py-1.5">Nazad</button>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-6 p-5">
        {/* Image */}
        <div>
          <Label>Slika proizvoda</Label>
          <div className="aspect-[4/5] bg-secondary border border-border mt-2 grid place-items-center relative overflow-hidden">
            {p.image_url
              ? <ProductThumb path={p.image_url} alt={p.name} />
              : <span className="text-xs text-muted-foreground uppercase tracking-wider">bez slike</span>}
          </div>
          <label className="btn-outline mt-3 w-full inline-flex items-center justify-center gap-2 text-xs px-3 py-2 cursor-pointer">
            <Upload className="w-3 h-3" /> {uploading ? "Šaljem…" : "Učitaj sliku"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
          </label>
          {p.image_url && (
            <button type="button" onClick={() => set("image_url", null)} className="text-xs text-muted-foreground underline mt-2">ukloni sliku</button>
          )}
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Naziv" v={p.name} onChange={(v) => set("name", v)} />
            <Field label="SKU" v={p.sku} onChange={(v) => set("sku", v)} />
            <Field label="Slug (URL)" v={p.slug} onChange={(v) => set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
            <Field label="Boja" v={p.color} onChange={(v) => set("color", v)} />
            <Select label="Kategorija" v={p.category} options={["jeans","chino","cargo"]} onChange={(v) => set("category", v as any)} />
            <Select label="Fit" v={p.fit} options={["Slim","Regular Slim","Relaxed","Cargo"]} onChange={(v) => set("fit", v as any)} />
            <Field label="Materijal" v={p.fabric} onChange={(v) => set("fabric", v)} />
            <Field label="Težina (oz)" v={p.weight} onChange={(v) => set("weight", v)} />
            <Field label="Rok isporuke" v={p.delivery} onChange={(v) => set("delivery", v)} />
            <Field label="Sort order" v={String(p.sort_order)} onChange={(v) => set("sort_order", Number(v) || 0)} />
            <Field label="Veleprodaja (€)" v={String(p.wholesale)} onChange={(v) => set("wholesale", Number(v) || 0)} />
            <Field label="MPC (€)" v={String(p.retail)} onChange={(v) => set("retail", Number(v) || 0)} />
            <Field label="MOQ (kom)" v={String(p.moq)} onChange={(v) => set("moq", Number(v) || 0)} />
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={p.active} onChange={(e) => set("active", e.target.checked)} />
                Vidljivo u katalogu
              </label>
            </div>
          </div>

          <div>
            <Label>Veličine (zarez razdvojeno)</Label>
            <input
              className="input mt-1 w-full"
              value={p.sizes.join(",")}
              onChange={(e) => set("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </div>

          <div>
            <Label>Opis</Label>
            <textarea
              className="input mt-1 w-full min-h-[100px]"
              value={p.description || ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div>
            <Label>Zalihe po veličini</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
              {p.sizes.map((s) => (
                <div key={s} className="border border-border p-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s}</div>
                  <input
                    type="number" min={0}
                    value={stockDraft[s] ?? 0}
                    onChange={(e) => setStockDraft({ ...stockDraft, [s]: Number(e.target.value) || 0 })}
                    className="w-full text-center bg-transparent tabular-nums font-semibold mt-1 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {err && <div className="text-sm text-destructive border-l-2 border-destructive pl-3">{err}</div>}

          <div className="flex gap-2 pt-2">
            <button onClick={submit} disabled={saving} className="btn-primary px-5 py-2 text-sm">
              {saving ? "Snimam…" : "Snimi artikal"}
            </button>
            <button onClick={onCancel} className="btn-outline px-5 py-2 text-sm">Odustani</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{children}</div>;
}
function Field({ label, v, onChange }: { label: string; v: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input className="input mt-1 w-full" value={v} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function Select({ label, v, options, onChange }: { label: string; v: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <select className="input mt-1 w-full" value={v} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// =========================================================================
// HOME ASSETS TAB
// =========================================================================

const HOME_SLOTS: { key: HomeAssetKey; title: string; desc: string; ratio: string }[] = [
  { key: "hero", title: "Hero (naslovna — bento)", desc: "Glavna slika u editorial bento sekciji početne strane.", ratio: "aspect-[4/5]" },
  { key: "hero_texture", title: "Hero pozadina (denim tekstura)", desc: "Denim tekstura iza velikog naslova na vrhu početne.", ratio: "aspect-[16/9]" },
  { key: "lookbook", title: "Lookbook tile", desc: "Slika u lookbook plocici na početnoj.", ratio: "aspect-[4/5]" },
  { key: "workshop", title: "Atelier / Radionica", desc: "Slika u 'Atelier u Novom Pazaru' sekciji.", ratio: "aspect-[4/5]" },
  { key: "category_jeans", title: "Kategorija — Farmerke", desc: "Tile za kategoriju farmerki.", ratio: "aspect-[4/5]" },
  { key: "category_chino", title: "Kategorija — Chino", desc: "Tile za kategoriju chino.", ratio: "aspect-[4/5]" },
  { key: "category_cargo", title: "Kategorija — Cargo", desc: "Tile za kategoriju cargo.", ratio: "aspect-[4/5]" },
  { key: "logo", title: "Logo (navbar / footer)", desc: "PNG logo — koristi se u navigaciji i footeru.", ratio: "aspect-[3/1]" },
  { key: "seal", title: "Brand pečat (chevron)", desc: "Watermark/pečat koji se koristi po sajtu.", ratio: "aspect-square" },
  { key: "page_proizvodnja", title: "Stranica — Proizvodnja", desc: "Velika slika radionice na /proizvodnja stranici.", ratio: "aspect-[4/3]" },
];

function HomeAssetsTab({
  assets, onSave, onDelete,
}: {
  assets: Record<string, { url: string; alt: string | null; signed: string }>;
  onSave: (key: HomeAssetKey, url: string, alt: string | null) => Promise<void>;
  onDelete: (key: HomeAssetKey) => Promise<void>;
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Vizuali početne strane</div>
        <div className="text-lg font-semibold">{HOME_SLOTS.length} slotova · uploaduj ili zalijepi URL</div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {HOME_SLOTS.map((slot) => (
          <HomeAssetCard
            key={slot.key}
            slot={slot}
            current={assets[slot.key]}
            onSave={(url, alt) => onSave(slot.key, url, alt)}
            onDelete={() => onDelete(slot.key)}
          />
        ))}
      </div>
    </div>
  );
}

function HomeAssetCard({
  slot, current, onSave, onDelete,
}: {
  slot: { key: HomeAssetKey; title: string; desc: string; ratio: string };
  current?: { url: string; alt: string | null; signed: string };
  onSave: (url: string, alt: string | null) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [altText, setAltText] = useState(current?.alt || "");

  useEffect(() => { setAltText(current?.alt || ""); }, [current?.alt]);

  const handleFile = async (file: File) => {
    setErr(null); setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `home/${slot.key}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("site-assets").upload(path, file, {
        cacheControl: "3600", upsert: true, contentType: file.type,
      });
      if (error) throw error;
      await onSave(path, altText || null);
    } catch (e: any) {
      setErr(e.message || "Upload nije uspio");
    } finally {
      setUploading(false);
    }
  };

  const saveAlt = async () => {
    if (!current) return;
    setSaving(true); setErr(null);
    try { await onSave(current.url, altText || null); }
    catch (e: any) { setErr(e.message || "Greška"); }
    finally { setSaving(false); }
  };

  return (
    <div className="border border-border rounded-sm bg-card overflow-hidden">
      <div className={`${slot.ratio} bg-secondary relative`}>
        {current?.signed
          ? <img src={current.signed} alt={current.alt || slot.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full grid place-items-center text-xs text-muted-foreground uppercase tracking-wider">default (bundled)</div>}
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mono">{slot.key}</div>
        <div className="font-semibold mt-0.5">{slot.title}</div>
        <div className="text-xs text-muted-foreground mt-1">{slot.desc}</div>

        <div className="mt-3">
          <Label>Alt tekst (SEO)</Label>
          <input
            className="input mt-1 w-full text-sm"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="kratak opis slike"
          />
        </div>

        {err && <div className="text-xs text-destructive mt-2">{err}</div>}

        <div className="flex flex-wrap gap-2 mt-3">
          <label className="btn-primary text-xs px-3 py-2 inline-flex items-center gap-2 cursor-pointer">
            <Upload className="w-3 h-3" /> {uploading ? "Šaljem…" : (current ? "Zamijeni" : "Uploaduj")}
            <input type="file" accept="image/*" className="hidden" disabled={uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </label>
          {current && (
            <>
              <button onClick={saveAlt} disabled={saving} className="btn-outline text-xs px-3 py-2">
                {saving ? "Snimam…" : "Snimi alt"}
              </button>
              <button onClick={onDelete} className="btn-outline text-xs px-3 py-2 text-destructive border-destructive/40 inline-flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Vrati default
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

