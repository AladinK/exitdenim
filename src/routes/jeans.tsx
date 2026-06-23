import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { byCategory } from "@/lib/products";

export const Route = createFileRoute("/jeans")({
  head: () => ({
    meta: [
      { title: "Jeans — EXIT Denim Wholesale" },
      { name: "description", content: "Muški jeans modeli: Slim, Regular Slim, Relaxed. Indigo, Black, Stone wash. Wholesale za butike." },
    ],
  }),
  component: () => <CategoryPage title="Jeans" desc="Indigo · Black · Stone wash — stabilni fitovi koji se ne razvlače." slug="jeans" />,
});

export function CategoryPage({ title, desc, slug }: { title: string; desc: string; slug: "jeans" | "chino" | "cargo" }) {
  const items = byCategory(slug);
  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container-x py-14 md:py-20">
          <div className="eyebrow">Kategorija</div>
          <h1 className="mt-3 text-5xl md:text-7xl">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{desc}</p>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
