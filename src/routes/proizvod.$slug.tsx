import { createFileRoute, useParams, Link, notFound } from "@tanstack/react-router";
import { Download, ChevronLeft, Truck, Wallet, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SizeMatrix } from "@/components/SizeMatrix";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { getMyProfile } from "@/lib/orders.functions";
import { generateLineSheet } from "@/lib/line-sheet.functions";
import { productQuery, productsQuery } from "@/lib/product-queries";
import { ecommerce, itemFromProduct } from "@/lib/analytics";
import { useAuth } from "@/hooks/useAuth";
import { B2BSpecs } from "@/components/B2BSpecs";

export const Route = createFileRoute("/proizvod/$slug")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    // Related products load in the background; never block first paint.
    context.queryClient.prefetchQuery(productsQuery());
    return { product };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    const name = p?.name ?? params.slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    const title = `${name} — EXIT Denim`.slice(0, 60);
    const desc = p
      ? `${p.name}, ${p.fit} fit, ${p.color}. ${Number(p.retail).toLocaleString("sr-RS")} RSD. Plaćanje pouzećem, dostava po celoj Srbiji.`.slice(0, 160)
      : `${name} — muške pantalone EXIT Denim iz Novog Pazara.`;
    const url = `https://exitdenim.shop/proizvod/${params.slug}`;
    const img = p?.image_url && /^https:\/\//.test(p.image_url) ? p.image_url : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
      links: [
        { rel: "canonical", href: url },
        ...(img ? [{ rel: "preload", as: "image", href: img, fetchPriority: "high" } as const] : []),
      ],
      scripts: p
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: p.name,
              sku: p.sku,
              description: p.description,
              color: p.color,
              brand: { "@type": "Brand", name: "EXIT Denim" },
              ...(img ? { image: img } : {}),
              offers: {
                "@type": "Offer",
                url,
                priceCurrency: "RSD",
                price: Number(p.retail),
                availability: Object.values(p.stock || {}).some((n) => n > 0) || !Object.keys(p.stock || {}).length
                  ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              },
            }),
          }]
        : [],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="container-x py-32 text-center">
        <div className="eyebrow">404</div>
        <h1 className="text-5xl mt-4">Artikal nije pronađen</h1>
        <Link to="/katalog" className="btn-outline mt-8 inline-flex">Nazad na katalog</Link>
      </div>
    </Layout>
  ),
  errorComponent: () => (
    <Layout><div className="container-x py-32 text-center">Greška pri učitavanju artikla.</div></Layout>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = useParams({ from: "/proizvod/$slug" });
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: all = [] } = useQuery(productsQuery());
  const fetchProfile = useServerFn(getMyProfile);
  const { user } = useAuth();
  const [approved, setApproved] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    const same = all.filter((x) => x.id !== product.id && x.category === product.category);
    const rest = all.filter((x) => x.id !== product.id && x.category !== product.category && x.fit === product.fit);
    return [...same, ...rest].slice(0, 4);
  }, [all, product]);

  useEffect(() => {
    if (product) ecommerce.viewItem(itemFromProduct(product));
  }, [product?.id]); // eslint-disable-line
  useEffect(() => {
    if (user) fetchProfile({}).then((r) => setApproved(r.profile?.status === "approved"));
  }, [user]); // eslint-disable-line

  if (!product) throw notFound();

  return (
    <Layout>
      <div className="container-x pt-10">
        <Link to="/katalog" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Nazad na katalog
        </Link>

      </div>

      <section className="container-x py-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="aspect-[4/5] overflow-hidden bg-secondary relative">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                fetchPriority="high"
                decoding="async"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                className="w-full h-full object-cover"
                width={1024}
                height={1280}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {product.sku}
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <div className="border border-border p-3">
              <div className="eyebrow">Tkanina</div>
              <div className="mt-1.5 font-medium">{product.fabric}</div>
            </div>
            <div className="border border-border p-3">
              <div className="eyebrow">Težina</div>
              <div className="mt-1.5 font-medium">{product.weight}</div>
            </div>
            <div className="border border-border p-3">
              <div className="eyebrow">Kroj</div>
              <div className="mt-1.5 font-medium">{product.fit}</div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            {product.category} · Artikal {product.sku}
          </div>
          <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)]">{product.name}</h1>
          <p className="mt-5 text-foreground/75 leading-[1.75]">{product.description}</p>

          <div className="mt-10 flex items-end justify-between gap-8 border-t border-foreground/20 pt-6">
            <div>
              <div className="eyebrow">Maloprodaja</div>
              <div className="serif text-5xl mt-2 tabular-nums">{Number(product.retail).toLocaleString("sr-RS")} <span className="text-2xl text-muted-foreground">din</span></div>
            </div>
            {approved && (
              <div className="text-right">
                <div className="eyebrow">B2B</div>
                <div className="serif text-3xl mt-2 tabular-nums text-accent">€{Number(product.wholesale).toFixed(0)}</div>
              </div>
            )}
          </div>

          {/* Retail purchase — anyone */}
          <div className="mt-6">
            <AddToCart product={product} />
          </div>


          <dl className="mt-10 grid grid-cols-2 gap-y-5 gap-x-8 text-sm">
            <Spec label="Kroj" value={product.fit} />
            <Spec label="Sastav" value={product.fabric} />
            <Spec label="Težina" value={product.weight} />
            <Spec label="Boja" value={product.color} />
            <Spec label="Veličine" value={product.sizes.join(" · ")} />
            <Spec label="MOQ" value={`${product.moq} kom`} />
            <Spec label="Isporuka" value={product.delivery} />
            <Spec label="SKU" value={product.sku} />
          </dl>

          {approved && (
            <div className="mt-8 flex flex-wrap gap-3">
              <LineSheetButton sku={product.sku} />
            </div>
          )}


          {approved && (
            <div className="mt-8">
              <B2BSpecs productId={product.id} sizes={product.sizes} />
            </div>
          )}

          {approved && (
            <div className="mt-10 border-t border-border pt-8">
              <div className="eyebrow mb-4">B2B veleprodaja — po veličinama</div>
              <SizeMatrix product={product} />
            </div>
          )}

        </div>
      </section>

      <section className="border-t border-border section-pad bg-secondary/50">
        <div className="container-x">
          <div className="eyebrow">Još iz linije {product.category}</div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12">
            {related.map((p) => <ProductCard key={p.id} product={p} showB2B={approved} />)}
          </div>
        </div>
      </section>

    </Layout>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function LineSheetButton({ sku }: { sku: string }) {
  const generate = useServerFn(generateLineSheet);
  const [busy, setBusy] = useState(false);
  const download = async () => {
    setBusy(true);
    try {
      const { pdfBase64 } = await generate({ data: { sku } });
      const bin = atob(pdfBase64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sku}-line-sheet.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      alert((e as Error).message || "Greška pri generisanju line sheet-a.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <button type="button" onClick={download} disabled={busy} className="btn-outline">
      <Download className="w-3.5 h-3.5" /> {busy ? "Generisanje…" : "Preuzmi Line Sheet"}
    </button>
  );
}

