import { createFileRoute, useParams, Link, notFound } from "@tanstack/react-router";
import { Download, ChevronLeft, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Layout } from "@/components/Layout";
import { SizeMatrix } from "@/components/SizeMatrix";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, listProducts, type ProductWithStock } from "@/lib/products.functions";
import { getMyProfile } from "@/lib/orders.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/proizvod/$slug")({
  notFoundComponent: () => (
    <Layout>
      <div className="container-x py-32 text-center">
        <div className="eyebrow">404</div>
        <h1 className="text-5xl mt-4">Артикал није пронађен</h1>
        <Link to="/katalog" className="btn-outline mt-8 inline-flex">Назад на каталог</Link>
      </div>
    </Layout>
  ),
  errorComponent: () => (
    <Layout><div className="container-x py-32 text-center">Грешка при учитавању артикла.</div></Layout>
  ),

  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = useParams({ from: "/proizvod/$slug" });
  const fetchProduct = useServerFn(getProductBySlug);
  const fetchProducts = useServerFn(listProducts);
  const fetchProfile = useServerFn(getMyProfile);
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductWithStock | null>(null);
  const [related, setRelated] = useState<ProductWithStock[]>([]);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProduct({ data: { slug } }), fetchProducts({})]).then(([p, all]) => {
      setProduct(p);
      if (p) setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4));
      setLoading(false);
    });
  }, [slug]); // eslint-disable-line
  useEffect(() => {
    if (user) fetchProfile({}).then((r) => setApproved(r.profile?.status === "approved"));
  }, [user]); // eslint-disable-line

  if (loading) return <Layout><div className="container-x py-32 text-center text-muted-foreground">Учитавање…</div></Layout>;
  if (!product) throw notFound();

  return (
    <Layout>
      <div className="container-x pt-10">
        <Link to="/katalog" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Назад на каталог
        </Link>

      </div>

      <section className="container-x py-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="aspect-[4/5] overflow-hidden bg-secondary">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" width={1024} height={1280} />
            )}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/5] bg-secondary overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                {product.image_url && (
                  <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            {product.category} · Артикал {product.sku}
          </div>
          <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)]">{product.name}</h1>
          <p className="mt-5 text-foreground/75 leading-[1.75]">{product.description}</p>

          <div className="mt-10 flex items-end justify-between gap-8 border-t border-foreground/20 pt-6">
            <div>
              <div className="eyebrow">Велепродаја</div>
              {approved ? (
                <div className="serif text-5xl mt-2 tabular-nums">€{Number(product.wholesale).toFixed(0)}</div>
              ) : (
                <div className="mt-2 inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" /> Само за B2B партнере
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="eyebrow">Препоручена МПЦ</div>
              <div className="serif text-3xl mt-2 tabular-nums text-foreground/70">{Number(product.retail).toLocaleString("sr-RS")} дин</div>
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-y-5 gap-x-8 text-sm">
            <Spec label="Крој" value={product.fit} />
            <Spec label="Састав" value={product.fabric} />
            <Spec label="Тежина" value={product.weight} />
            <Spec label="Боја" value={product.color} />
            <Spec label="Величине" value={product.sizes.join(" · ")} />
            <Spec label="MOQ" value={`${product.moq} ком`} />
            <Spec label="Испорука" value={product.delivery} />
            <Spec label="SKU" value={product.sku} />
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`/api/line-sheet/${product.sku}`} target="_blank" rel="noopener" className="btn-outline">
              <Download className="w-3.5 h-3.5" /> Преузми Line Sheet
            </a>
          </div>

          <div className="mt-10">
            {approved ? (
              <SizeMatrix product={product} />
            ) : (
              <div className="border border-foreground p-8 text-center">
                <Lock className="w-5 h-5 mx-auto text-foreground" strokeWidth={1.25} />
                <div className="mt-5 serif text-2xl">Резервисано за B2B партнере</div>
                <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
                  Одобрени партнери виде стање по величинама, цене и могу послати упит за поруџбину кроз матрицу величина.
                </p>
                <Link to="/auth" className="btn-primary mt-7 inline-flex">
                  {user ? "Статус налога" : "Затражите B2B приступ"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border section-pad bg-secondary/50">
        <div className="container-x">
          <div className="eyebrow">Још из линије {product.category}</div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12">
            {related.map((p) => <ProductCard key={p.id} product={p} showPrice={approved} />)}
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
