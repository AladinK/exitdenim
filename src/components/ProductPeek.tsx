import { useEffect } from "react";
import { X, ArrowUpRight, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ProductWithStock } from "@/lib/products.functions";
import { QuickBuy } from "./QuickBuy";

/**
 * Inline product "peek" — a slide-in panel that reveals product detail
 * without a full navigation. Preserves the pageless feel.
 */
export function ProductPeek({
  product,
  onClose,
  showB2B,
}: {
  product: ProductWithStock | null;
  onClose: () => void;
  showB2B?: boolean;
}) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const open = !!product;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={product?.name || "Артикал"}
        className={`fixed z-50 right-0 top-0 h-full w-full sm:w-[560px] lg:w-[640px] bg-background shadow-2xl transition-transform duration-500 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {product && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {product.sku} · {product.category}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                aria-label="Затвори"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="aspect-[4/5] bg-secondary relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name!}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {product.sku}
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <h2 className="serif text-3xl md:text-4xl leading-tight">{product.name}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-6 flex items-end justify-between gap-6 border-t border-border pt-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Малопродаја</div>
                    <div className="serif text-3xl mt-1 tabular-nums">
                      {Number(product.retail).toLocaleString("sr-RS")}{" "}
                      <span className="text-base text-muted-foreground">дин</span>
                    </div>
                  </div>
                  {showB2B && (
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">B2B</div>
                      <div className="serif text-2xl mt-1 tabular-nums text-accent">
                        €{Number(product.wholesale).toFixed(0)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <QuickBuy product={product} />
                </div>

                <dl className="mt-8 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <Spec label="Крој" value={product.fit} />
                  <Spec label="Тканина" value={product.fabric} />
                  <Spec label="Тежина" value={product.weight} />
                  <Spec label="Боја" value={product.color} />
                  <Spec label="MOQ" value={`${product.moq} ком`} />
                  <Spec label="Испорука" value={product.delivery} />
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/proizvod/$slug"
                    params={{ slug: product.slug! }}
                    className="btn-outline"
                  >
                    Цео артикал <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`/api/line-sheet/${product.sku}`}
                    target="_blank"
                    rel="noopener"
                    className="btn-outline"
                  >
                    <Download className="w-3.5 h-3.5" /> Line Sheet
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
