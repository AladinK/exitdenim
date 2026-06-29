import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";
import { getMyProfile } from "@/lib/orders.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/jeans")({
  head: () => ({
    meta: [
      { title: "Фармерке — EXIT Denim Wholesale" },
      { name: "description", content: "Мушки модели фармерки: Slim, Regular Slim, Relaxed. Индиго, црна, stone wash. Велепродаја за бутике." },
    ],
  }),
  component: () => (
    <CategoryPage
      title="Фармерке"
      eyebrow="Линија · 01 / 03"
      tagline="Индиго · Црна · Stone Wash"
      desc="Стабилни кројеви који се не развлаче. Slim, Regular Slim и Relaxed силуете — оквир целе колекције."
      slug="jeans"
    />
  ),
});

export function CategoryPage({
  title,
  eyebrow,
  tagline,
  desc,
  slug,
}: {
  title: string;
  eyebrow: string;
  tagline: string;
  desc: string;
  slug: "jeans" | "chino" | "cargo";
}) {
  const fetchProducts = useServerFn(listProducts);
  const fetchProfile = useServerFn(getMyProfile);
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => { fetchProducts({}).then(setProducts); }, []); // eslint-disable-line
  useEffect(() => {
    if (user) fetchProfile({}).then((r) => setApproved(r.profile?.status === "approved"));
  }, [user]); // eslint-disable-line

  const items = products.filter((p) => p.category === slug);

  return (
    <Layout>
      <section className="bg-foreground text-background border-b border-background/15">
        <div className="container-x py-20 md:py-32 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <div className="text-[10px] uppercase tracking-[0.36em] text-accent">{eyebrow}</div>
            <h1 className="mt-7 text-[clamp(3rem,10vw,8rem)] text-background">{title}</h1>
            <div className="mt-6 text-[11px] uppercase tracking-[0.32em] text-background/65">{tagline}</div>
          </div>
          <div className="lg:col-span-4">
            <p className="text-background/75 leading-[1.8] max-w-md">{desc}</p>
            <div className="mt-7 flex items-baseline gap-8 text-background/65 text-[11px] uppercase tracking-[0.22em]">
              <div><span className="serif text-3xl text-background tabular-nums">{items.length}</span><br/>Артикала</div>
              <div><span className="serif text-3xl text-background tabular-nums">31–40</span><br/>Величине</div>
              <div><span className="serif text-3xl text-background tabular-nums">10</span><br/>MOQ</div>
            </div>
          </div>
        </div>
      </section>

      {!approved && (
        <section className="bg-secondary border-b border-border">
          <div className="container-x py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Lock className="w-3.5 h-3.5" /> Велепродајне цене само за одобрене B2B партнере
            </div>
            <Link to="/auth" className="text-[10px] uppercase tracking-[0.22em] link-underline pb-1">Затражите B2B приступ →</Link>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14">
            {items.map((p) => <ProductCard key={p.id} product={p} showPrice={approved} />)}
          </div>
          {items.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">У овој линији још нема артикала.</div>
          )}
        </div>
      </section>
    </Layout>
  );
}
