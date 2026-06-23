import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Download } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, type Category, type Fit } from "@/lib/products";
import { useB2BAccess } from "@/lib/b2b";

export const Route = createFileRoute("/katalog")({
  head: () => ({
    meta: [
      { title: "B2B Katalog — EXIT Denim Wholesale" },
      { name: "description", content: "Kompletan veleprodajni katalog EXIT Denim — jeans, chino, cargo. Cijene dostupne odobrenim B2B partnerima." },
    ],
  }),
  component: Katalog,
});

function Katalog() {
  const { approved } = useB2BAccess();
  const [cat, setCat] = useState<Category | "all">("all");
  const [fit, setFit] = useState<Fit | "all">("all");

  const filtered = PRODUCTS.filter(
    (p) => (cat === "all" || p.category === cat) && (fit === "all" || p.fit === fit),
  );

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container-x py-14 md:py-20">
          <div className="eyebrow">B2B Wholesale Katalog</div>
          <div className="mt-3 flex items-end justify-between gap-6 flex-wrap">
            <h1 className="text-4xl md:text-6xl max-w-2xl">
              Kompletna kolekcija {approved && <span className="text-accent">— pristup aktivan</span>}
            </h1>
            <a href="#" className="btn-outline">
              <Download className="w-4 h-4" /> Cijeli katalog PDF
            </a>
          </div>
        </div>
      </section>

      {!approved && (
        <section className="bg-foreground text-background">
          <div className="container-x py-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Lock className="w-4 h-4 text-accent" />
              Veleprodajne cijene i stock vidljivi samo odobrenim B2B partnerima.
            </div>
            <Link to="/postani-partner" className="btn-accent text-sm">
              Zatraži B2B pristup
            </Link>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 mb-10">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>Sve</Chip>
            <Chip active={cat === "jeans"} onClick={() => setCat("jeans")}>Jeans</Chip>
            <Chip active={cat === "chino"} onClick={() => setCat("chino")}>Chino</Chip>
            <Chip active={cat === "cargo"} onClick={() => setCat("cargo")}>Cargo</Chip>
            <span className="w-px bg-border mx-2" />
            <Chip active={fit === "all"} onClick={() => setFit("all")}>Svi fitovi</Chip>
            <Chip active={fit === "Slim"} onClick={() => setFit("Slim")}>Slim</Chip>
            <Chip active={fit === "Regular Slim"} onClick={() => setFit("Regular Slim")}>Regular Slim</Chip>
            <Chip active={fit === "Relaxed"} onClick={() => setFit("Relaxed")}>Relaxed</Chip>
            <Chip active={fit === "Cargo"} onClick={() => setFit("Cargo")}>Cargo</Chip>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border text-foreground/70 hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}
