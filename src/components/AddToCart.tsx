import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Check, Truck, BadgeCheck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ecommerce, itemFromProduct } from "@/lib/analytics";
import type { ProductWithStock } from "@/lib/products.functions";

const SIZE_GUIDE: [string, string, string][] = [
  ["31", "79–81", "46"],
  ["32", "81–84", "48"],
  ["33", "84–86", "48/50"],
  ["34", "86–89", "50"],
  ["36", "91–94", "52"],
  ["38", "97–99", "54"],
  ["40", "102–104", "56"],
];

export function AddToCart({ product }: { product: ProductWithStock }) {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const navigate = useNavigate();
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
    setNeedSize(false);
    ecommerce.selectSize(itemFromProduct(product), s);
  };

  const onAdd = (buyNow = false) => {
    if (!size) {
      setNeedSize(true);
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
    if (buyNow) navigate({ to: "/kasa" });
    else setOpen(true);
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
          aria-label={`Veličina ${s}${disabled ? " (nema na stanju)" : ""}`}
        >
          {s}
        </button>
      );
    });

  return (
    <div ref={rootRef} className="border border-foreground/20 p-5">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Izaberite veličinu</div>
        <div className="text-[11px] text-muted-foreground">Maloprodaja</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">{sizeButtons()}</div>
      {needSize && !size && (
        <p role="alert" className="mt-3 text-[12px] font-semibold text-primary">Izaberite broj da biste nastavili.</p>
      )}
      {size && (product.stock?.[size] ?? 0) > 0 && (product.stock?.[size] ?? 0) <= 5 && (
        <p className="mt-3 text-[12px] font-semibold text-accent">Samo još {product.stock?.[size]} kom u broju {size}</p>
      )}

      <details className="mt-4 group text-[12px]">
        <summary className="cursor-pointer list-none text-muted-foreground hover:text-foreground underline underline-offset-4">
          Vodič za veličine (obim struka u cm)
        </summary>
        <table className="mt-3 w-full text-left tabular-nums">
          <thead className="text-muted-foreground">
            <tr><th className="py-1 font-medium">Broj</th><th className="py-1 font-medium">Struk (cm)</th><th className="py-1 font-medium">Pantalone (EU)</th></tr>
          </thead>
          <tbody>
            {SIZE_GUIDE.map(([n, w, eu]) => (
              <tr key={n} className="border-t border-border"><td className="py-1.5">{n}</td><td>{w}</td><td>{eu}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-muted-foreground">
          Niste sigurni? Pozovite ili pišite na Viber/WhatsApp{" "}
          <a href="tel:+381653176716" className="text-foreground underline underline-offset-4">065 317 6716</a> — pomoći ćemo da izaberete broj.
        </p>
      </details>

      <button
        onClick={() => onAdd(true)}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-[0.2em] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
      >
        Naruči odmah — plaćaš pouzećem
      </button>
      <button
        onClick={() => onAdd()}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm uppercase tracking-[0.2em] font-medium border border-foreground hover:bg-foreground hover:text-background transition-all"
      >
        {added ? (
          <>
            <Check className="w-4 h-4" /> Dodato u korpu
          </>
        ) : size ? (
          <>
            <ShoppingBag className="w-4 h-4" /> Dodaj u korpu
          </>
        ) : (
          "Izaberi veličinu"
        )}
      </button>

      <ul className="mt-5 space-y-2 text-[12px] text-muted-foreground">
        <li className="flex items-center gap-2">
          <BadgeCheck className="w-3.5 h-3.5 shrink-0" /> Plaćanje pouzećem — plaćate tek kad preuzmete paket
        </li>
        <li className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 shrink-0" /> Besplatna dostava na sve porudžbine
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
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Cena</div>
                  <div className="text-[15px] font-semibold tabular-nums leading-tight">
                    {Number(product.retail).toLocaleString("sr-RS")} din
                  </div>
                </div>
                <button
                  onClick={() => onAdd()}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 text-[12.5px] uppercase tracking-[0.18em] font-semibold bg-primary text-primary-foreground"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Dodato
                    </>
                  ) : size ? (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Dodaj u korpu
                    </>
                  ) : (
                    "Izaberi veličinu"
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
