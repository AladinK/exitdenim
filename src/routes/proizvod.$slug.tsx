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
        <h1 className="text-4xl">Proizvod nije pronađen</h1>
        <Link to="/katalog" className="btn-outline mt-6 inline-flex">Nazad na katalog</Link>
      </div>
    </Layout>
  ),
  errorComponent: () => (
    <Layout><div className="container-x py-32 text-center">Greška pri učitavanju.</div></Layout>
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

  if (loading) return <Layout><div className="container-x py-32 text-center text-muted-foreground">Učitavanje...</div></Layout>;
  if (!product) throw notFound();

  return (
    <Layout>
      <div className="container-x pt-8">
        <Link to="/katalog" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Nazad na katalog
        </Link>
      </div>

      <section className="container-x py-10 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="aspect-[4/5] rounded-sm overflow-hidden bg-secondary">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" width={1024} height={1280} />
            )}
          </div>
        </div>

        <div>
          <div className="eyebrow">{product.category} · {product.fit}</div>
          <h1 className="mt-3 text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-y-4 gap-x-6 text-sm border-y border-border py-6">
            <Spec label="SKU" value={product.sku} />
            <Spec label="Fit" value={product.fit} />
            <Spec label="Tkanina" value={product.fabric} />
            <Spec label="Težina" value={product.weight} />
            <Spec label="Veličine" value={product.sizes.join(", ")} />
            <Spec label="Isporuka" value={product.delivery} />
            <Spec label="MOQ" value={`${product.moq} kom`} />
            <Spec label="Boja" value={product.color} />
          </dl>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow">Veleprodaja</div>
              {approved ? (
                <div className="text-4xl font-display font-bold mt-1">€{Number(product.wholesale).toFixed(2)}</div>
              ) : (
                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4" /> Cijena za B2B partnere
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="eyebrow">Preporučena maloprodaja</div>
              <div className="text-2xl font-display font-semibold mt-1">€{Number(product.retail).toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`/api/line-sheet/${product.sku}`} target="_blank" rel="noopener" className="btn-outline">
              <Download className="w-4 h-4" /> Line sheet PDF
            </a>
          </div>

          <div className="mt-8">
            {approved ? (
              <SizeMatrix product={product} />
            ) : (
              <div className="border border-dashed border-foreground rounded-sm p-6 text-center">
                <Lock className="w-5 h-5 mx-auto text-muted-foreground" />
                <div className="mt-3 font-semibold">Size matrix narudžba dostupna B2B partnerima</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Odobreni partneri vide stock po veličinama, cijene i mogu poslati upit za narudžbu.
                </p>
                <Link to="/auth" className="btn-primary mt-5 inline-flex">
                  {user ? "Status naloga" : "Zatraži B2B pristup"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-x">
          <div className="eyebrow">Više iz kategorije</div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
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
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
