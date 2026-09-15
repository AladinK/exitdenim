import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingBag, Check, Truck, BadgeCheck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ecommerce, itemFromProduct } from "@/lib/analytics";
import type { ProductWithStock } from "@/lib/products.functions";

export function AddToCart({ product }: { product: ProductWithStock }) {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Sticky mobile bar appears once the inline block scrolls out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pickSize = (s: string) => {
    setSize(s);
    ecommerce.selectSize(itemFromProduct(product), s);
  };

  const onAdd = () => {
    if (!size) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    add(
      {
        productId: product.id!,
        sku: product.sku!,
        slug: product.slug!,
        name: product.name!,
        size,
        unitPrice: Number(product.retail),
        image: product.image_url,
      },
      1,
    );
    ecommerce.addToCart(itemFromProduct(product, { item_variant: size }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    setOpen(true);
  };

  const sizeButtons = (compact = false) =>
    product.sizes.map((s) => {
      const stock = product.stock?.[s] ?? 0;
      const disabled = stock <= 0;
      const active = size === s;
      return (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => pickSize(s)}
          className={`${compact ? "min-w-[44px] px-2.5 py-2 text-[13px]" : "min-w-[52px] px-3 py-3 text-sm"} font-medium border transition-all tabular-nums ${
            active
              ? "border-foreground bg-foreground text-background"
              : disabled
                ? "border-border text-muted-foreground line-through cursor-not-allowed opacity-50"
                : "border-border hover:border-foreground"
          }`}
          aria-pressed={active}
          aria-label={`Величина ${s}${disabled ? " (нема на стању)" : ""}`}
        >
          {s}
        </button>
      );
    });

  return (
    <div ref={rootRef} className="border border-foreground/20 p-5">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Изаберите величину</div>
        <div className="text-[11px] text-muted-foreground">Малопродаја</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">{sizeButtons()}</div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <div>
          <div className="eyebrow">Цена</div>
          <div className="serif text-3xl mt-1 tabular-nums">
            {Number(product.retail).toLocaleString("sr-RS")} <span className="text-base text-muted-foreground">дин</span>
          </div>
        </div>
      </div>

      <button
        onClick={onAdd}
        className={`mt-6 w-full inline-flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-all ${
          size ? "bg-foreground text-background hover:bg-foreground/90" : "bg-secondary text-muted-foreground"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" /> Додато у корпу
          </>
        ) : size ? (
          <>
            <ShoppingBag className="w-4 h-4" /> Додај у корпу
          </>
        ) : (
          "Изабери величину"
        )}
      </button>

      <ul className="mt-5 space-y-2 text-[12px] text-muted-foreground">
        <li className="flex items-center gap-2">
          <BadgeCheck className="w-3.5 h-3.5 shrink-0" /> Плаћање поузећем при испоруци
        </li>
        <li className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 shrink-0" /> Достава 500 дин · бесплатна преко 15.000 дин
        </li>
      </ul>

      {/* Mobile sticky add-to-cart */}
      {mounted &&
        createPortal(
          <div
            className={`lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/97 backdrop-blur-xl transition-transform duration-300 ${
              showSticky ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="px-4 pt-2.5 pb-3">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2">{sizeButtons(true)}</div>
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Цена</div>
                  <div className="text-[15px] font-semibold tabular-nums leading-tight">
                    {Number(product.retail).toLocaleString("sr-RS")} дин
                  </div>
                </div>
                <button
                  onClick={onAdd}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 text-[12.5px] uppercase tracking-[0.18em] font-semibold ${
                    size ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Додато
                    </>
                  ) : size ? (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Додај у корпу
                    </>
                  ) : (
                    "Изабери величину"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
