import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { listProducts, type ProductWithStock } from "@/lib/products.functions";
import { getMyProfile } from "@/lib/orders.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/katalog")({
  head: () => ({
    meta: [
      { title: "B2B Каталог — EXIT Denim Wholesale" },
      { name: "description", content: "Комплетан велепродајни каталог EXIT Denim — фармерке, чино, карго. Цене доступне одобреним B2B партнерима." },
    ],
  }),
  component: Katalog,
});

type Cat = "all" | "jeans" | "chino" | "cargo";
type FitFilter = "all" | "Slim" | "Regular Slim" | "Relaxed" | "Cargo";

function Katalog() {
  const fetchProducts = useServerFn(listProducts);
  const fetchProfile = useServerFn(getMyProfile);
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [approved, setApproved] = useState(false);
  const [cat, setCat] = useState<Cat>("all");
  const [fit, setFit] = useState<FitFilter>("all");

  useEffect(() => { fetchProducts({}).then(setProducts); }, []); // eslint-disable-line
  useEffect(() => {
    if (user) fetchProfile({}).then((r) => setApproved(r.profile?.status === "approved"));
  }, [user]); // eslint-disable-line

  const filtered = products.filter(
    (p) => (cat === "all" || p.category === cat) && (fit === "all" || p.fit === fit),
  );

  return (
    <Layout>
      <section className="border-b border-border">
        <div className="container-x py-20 md:py-28">
          <div className="eyebrow">B2B Велепродајни каталог · SS / FW</div>
          <div className="mt-7 grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-[clamp(2.5rem,7vw,6rem)]">
                Комплетан <span className="italic">каталог</span>
                {approved && <span className="block text-accent mt-2 text-3xl md:text-4xl serif italic">— приступ одобрен</span>}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-sm text-muted-foreground max-w-sm lg:ml-auto leading-relaxed">
                Фармерке, чино и карго линије. {products.length} активних артикала · величине 31–40 · MOQ од 10 комада.
              </p>
            </div>
          </div>
        </div>
      </section>

      {!approved && (
        <section className="bg-foreground text-background">
          <div className="container-x py-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em]">
              <Lock className="w-3.5 h-3.5 text-accent" />
              Велепродајне цене видљиве су само одобреним B2B партнерима
            </div>
            <Link to="/auth" className="btn-accent text-[10px] px-4 py-2.5">
              {user ? "Статус налога" : "Затражите B2B приступ"}
            </Link>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container-x">
          <div className="border-b border-border pb-6 mb-12 flex flex-wrap gap-x-1 gap-y-3 items-center">
            <span className="eyebrow mr-4">Категорија</span>
            <Chip active={cat === "all"} onClick={() => setCat("all")}>Све</Chip>
            <Chip active={cat === "jeans"} onClick={() => setCat("jeans")}>Фармерке</Chip>
            <Chip active={cat === "chino"} onClick={() => setCat("chino")}>Чино</Chip>
            <Chip active={cat === "cargo"} onClick={() => setCat("cargo")}>Карго</Chip>
            <span className="w-px bg-border h-6 mx-4" />
            <span className="eyebrow mr-4">Крој</span>
            <Chip active={fit === "all"} onClick={() => setFit("all")}>Сви кројеви</Chip>
            <Chip active={fit === "Slim"} onClick={() => setFit("Slim")}>Slim</Chip>
            <Chip active={fit === "Regular Slim"} onClick={() => setFit("Regular Slim")}>Regular Slim</Chip>
            <Chip active={fit === "Relaxed"} onClick={() => setFit("Relaxed")}>Relaxed</Chip>
            <Chip active={fit === "Cargo"} onClick={() => setFit("Cargo")}>Cargo</Chip>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14">
            {filtered.map((p) => <ProductCard key={p.id} product={p} showPrice={approved} />)}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              Нема артикала за изабране филтере.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-all ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className={active ? "border-b border-foreground pb-1" : ""}>{children}</span>
    </button>
  );
}
