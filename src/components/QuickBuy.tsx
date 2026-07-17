import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, ArrowRight, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ProductWithStock } from "@/lib/products.functions";

/**
 * Premium minimalist quick-buy for listing cards.
 *
 * - Desktop: inline hairline size row + ghost CTA that inverts on selection.
 * - Mobile: single CTA opens a bottom-sheet (Tom Ford style) with size grid
 *   and a "Купи одмах" action that adds to cart and jumps straight to /kasa.
 */
export function QuickBuy({ product }: { product: ProductWithStock }) {
  const { add, setOpen } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSize, setSheetSize] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen]);

  const stop = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); };

  const addToCart = (chosenSize: string, openDrawer = true) => {
    add({
      productId: product.id!,
      sku: product.sku!,
      slug: product.slug!,
      name: product.name!,
      size: chosenSize,
      unitPrice: Number(product.retail),
      image: product.image_url,
    }, 1);
    if (openDrawer) setOpen(true);
  };

  // ── Desktop inline flow ──────────────────────────────────────────
  const onDesktopAdd = (e: React.MouseEvent) => {
    stop(e);
    if (!size) return;
    addToCart(size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  // ── Mobile sheet actions ─────────────────────────────────────────
  const openSheet = (e: React.MouseEvent) => { stop(e); setSheetSize(null); setSheetOpen(true); };
  const closeSheet = () => setSheetOpen(false);
  const buyNow = () => {
    if (!sheetSize) return;
    addToCart(sheetSize, false);
    setSheetOpen(false);
    navigate({ to: "/kasa" });
  };
  const addOnly = () => {
    if (!sheetSize) return;
    addToCart(sheetSize, true);
    setSheetOpen(false);
  };

  // ── MOBILE render ────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={openSheet}
          className="group/cta relative w-full inline-flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.28em] font-medium border border-foreground bg-foreground text-background transition-all duration-300 active:bg-accent active:border-accent"
        >
          <span>Брза куповина</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-active/cta:translate-x-0.5" />
        </button>

        {sheetOpen && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" onClick={closeSheet}>
            {/* Scrim */}
            <div className="absolute inset-0 bg-foreground/60 backdrop-blur-[2px] animate-in fade-in duration-300" />

            {/* Sheet */}
            <div
              className="absolute inset-x-0 bottom-0 bg-background border-t border-foreground/10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.35)] animate-in slide-in-from-bottom duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Grip */}
              <div className="flex justify-center pt-2.5 pb-1">
                <span className="h-1 w-10 bg-foreground/20 rounded-full" />
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={closeSheet}
                className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground"
                aria-label="Затвори"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
                {/* Product header */}
                <div className="flex items-start gap-4">
                  {product.image_url && (
                    <div className="w-20 h-24 overflow-hidden bg-secondary shrink-0">
                      <img src={product.image_url} alt={product.name!} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                      {product.sku} · {product.fit}
                    </div>
                    <div className="serif text-lg leading-tight mt-1 truncate">{product.name}</div>
                    <div className="serif text-lg tabular-nums mt-1">
                      {Number(product.retail).toLocaleString("sr-RS")}
                      <span className="text-xs text-muted-foreground ml-1">дин</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Величина</span>
                    <Link
                      to="/proizvod/$slug"
                      params={{ slug: product.slug! }}
                      className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                      onClick={closeSheet}
                    >
                      Водич за величине
                    </Link>
                  </div>
                  <div className="mt-3 grid grid-cols-6 gap-1.5">
                    {product.sizes.map((s) => {
                      const stock = product.stock?.[s] ?? 0;
                      const disabled = stock <= 0;
                      const active = sheetSize === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={disabled}
                          onClick={() => setSheetSize(s)}
                          className={`py-3 text-[12px] tabular-nums border transition-colors ${
                            active
                              ? "border-foreground bg-foreground text-background"
                              : disabled
                              ? "border-foreground/10 text-muted-foreground/40 line-through"
                              : "border-foreground/20 text-foreground hover:border-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={buyNow}
                    disabled={!sheetSize}
                    className={`w-full inline-flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-[0.28em] font-medium transition-all ${
                      sheetSize
                        ? "bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <span>Купи одмах</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={addOnly}
                    disabled={!sheetSize}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.28em] font-medium border transition-all ${
                      sheetSize
                        ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                        : "border-foreground/15 text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Додај у корпу
                  </button>
                </div>

                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Плаћање поузећем · Достава 500 дин
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
      </>
    );
  }

  // ── DESKTOP render (inline hairline) ─────────────────────────────
  return (
    <div className="flex flex-col gap-3" onClick={(e) => e.preventDefault()}>
      <div className="flex items-center gap-px border-t border-b border-foreground/10">
        <span className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground pr-3 py-2 border-r border-foreground/10">
          Величина
        </span>
        <div className="flex-1 flex flex-wrap">
          {product.sizes.map((s) => {
            const stock = product.stock?.[s] ?? 0;
            const disabled = stock <= 0;
            const active = size === s;
            return (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={(e) => { stop(e); setSize(s); }}
                className={`relative flex-1 min-w-[34px] py-2 text-[11px] tabular-nums tracking-wider transition-colors ${
                  active
                    ? "text-background bg-foreground"
                    : disabled
                    ? "text-muted-foreground/40 line-through cursor-not-allowed"
                    : "text-foreground hover:text-accent"
                }`}
                aria-label={`Величина ${s}${disabled ? " — распродато" : ""}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onDesktopAdd}
        disabled={!size}
        className={`group/cta relative w-full inline-flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.28em] font-medium border transition-all duration-300 ${
          added
            ? "border-accent bg-accent text-accent-foreground"
            : size
            ? "border-foreground bg-foreground text-background hover:bg-accent hover:border-accent hover:text-accent-foreground"
            : "border-foreground/15 text-muted-foreground cursor-not-allowed"
        }`}
      >
        <span>{added ? "У корпи" : size ? "Додај у корпу" : "Изаберите величину"}</span>
        {added ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${size ? "group-hover/cta:translate-x-0.5" : "opacity-40"}`} />
        )}
      </button>
    </div>
  );
}
