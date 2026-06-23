import { createFileRoute, useParams, Link, notFound } from "@tanstack/react-router";
import { Download, ChevronLeft, Lock } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SizeMatrix } from "@/components/SizeMatrix";
import { ProductCard } from "@/components/ProductCard";
import { findProduct, PRODUCTS } from "@/lib/products";
import { useB2BAccess } from "@/lib/b2b";

export const Route = createFileRoute("/proizvod/$slug")({
  loader: ({ params }) => {
    const p = findProduct(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Proizvod"} — EXIT Denim B2B` },
      { name: "description", content: loaderData?.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <Layout>
      <div className="container-x py-32 text-center">
        <h1 className="text-4xl">Proizvod nije pronađen</h1>
        <Link to="/katalog" className="btn-outline mt-6 inline-flex">Nazad na katalog</Link>
      </div>
    </Layout>
  ),
  errorComponent: () => (
    <Layout>
      <div className="container-x py-32 text-center">Greška pri učitavanju proizvoda.</div>
    </Layout>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = useParams({ from: "/proizvod/$slug" });
  const product = findProduct(slug)!;
  const { approved } = useB2BAccess();
  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const swatchMap: Record<string, string> = {
    Indigo: "#1f2a44", Black: "#111", "Stone Blue": "#7891ad",
    Beige: "#c8b48f", Navy: "#1b2236", Olive: "#6b7a3a", Sand: "#c2a878",
  };
  const bg = swatchMap[product.color] || "#333";

  return (
    <Layout>
      <div className="container-x pt-8">
        <Link to="/katalog" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Nazad na katalog
        </Link>
      </div>

      <section className="container-x py-10 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="col-span-2 aspect-[4/5] rounded-sm flex items-end p-8"
            style={{ background: `linear-gradient(180deg, ${bg} 0%, oklch(0.15 0.02 250) 100%)` }}
          >
            <div className="text-background">
              <div className="eyebrow text-background/70">{product.sku}</div>
              <div className="text-4xl font-display font-semibold">{product.color}</div>
            </div>
          </div>
          {[0.85, 0.7].map((o, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm"
              style={{ background: `linear-gradient(135deg, ${bg}${Math.round(o * 255).toString(16)}, #0d0d0d)` }}
            />
          ))}
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
                <div className="text-4xl font-display font-bold mt-1">€{product.wholesale.toFixed(2)}</div>
              ) : (
                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4" /> Cijena za B2B partnere
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="eyebrow">Preporučena maloprodaja</div>
              <div className="text-2xl font-display font-semibold mt-1">€{product.retail.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="btn-outline">
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
                <Link to="/postani-partner" className="btn-primary mt-5 inline-flex">
                  Zatraži B2B pristup
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
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
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
