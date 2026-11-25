import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Check, MessageCircle, RefreshCw, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ecommerce, itemFromProduct } from "@/lib/analytics";
import { formatRsd } from "@/lib/format";
import { productQuestion, whatsappHref } from "@/lib/contact";
import { SIZE_EXCHANGE } from "@/lib/brand";
import type { ProductWithStock } from "@/lib/products.functions";
import { SizeAdvisor } from "@/components/SizeAdvisor";

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
  // Drugi model: izbor veličine kreće ispočetka.
  useEffect(() => {
    setSize(null);
    setNeedSize(false);
  }, [product.id]);

  // Donja traka na telefonu se pojavi kada izbor veličine izađe iz kadra.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const inStock = product.sizes.filter((s) => (product.stock?.[s] ?? 0) > 0);
  const soldOut = inStock.length === 0;

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
        productId: product.id,
        sku: product.sku,
        slug: product.slug,
        name: product.name,
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
      const disabled = (product.stock?.[s] ?? 0) <= 0;
      return (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => pickSize(s)}
          className={`size-button${compact ? " size-button--sm" : ""}`}
          aria-pressed={size === s}
          aria-label={`Veličina ${s}${disabled ? ", nema na stanju" : ""}`}
        >
          {s}
        </button>
      );
    });

  const addLabel = added ? (
    <>
      <Check aria-hidden="true" className="h-[18px] w-[18px]" /> Dodato u korpu
    </>
  ) : (
    <>
      <ShoppingBag aria-hidden="true" className="h-[18px] w-[18px]" /> Dodaj u korpu
    </>
  );

  return (
    <div ref={rootRef}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold tracking-normal">
          {size ? `Veličina ${size}` : "Izaberite veličinu"}
        </h2>
        {!soldOut && inStock.length <= 2 && product.sizes.length >= 3 && (
          <p className="text-sm font-medium text-action-text">
            {inStock.length === 1 ? "Ostala je još 1 veličina" : `Ostale su još ${inStock.length} veličine`}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">{sizeButtons()}</div>
      {needSize && !size && (
        <p role="alert" className="error-text mt-3">
          Izaberite broj da biste nastavili
        </p>
      )}

      <div className="mt-4 grid gap-1 text-sm">
        <SizeAdvisor sizes={inStock} onPick={pickSize} />
        <details>
          <summary className="inline-flex min-h-11 items-center text-ink-2 underline decoration-1 underline-offset-4 hover:text-foreground">
            Tabela veličina (obim struka u cm)
          </summary>
          <table className="mt-2 w-full text-left">
            <thead className="text-ink-3">
              <tr>
                <th className="py-2 font-medium">Broj</th>
                <th className="py-2 font-medium">Struk (cm)</th>
                <th className="py-2 font-medium">Pantalone (EU)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map(([n, w, eu]) => (
                <tr key={n} className="border-t border-line">
                  <td className="py-2 font-semibold">{n}</td>
                  <td>{w}</td>
                  <td>{eu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>

      {soldOut ? (
        <div className="notice mt-5">
          <p>Ovaj model je trenutno rasprodat u svim veličinama. Javite nam se i reći ćemo vam kada stiže nova serija.</p>
          <div className="notice__actions">
            <a className="btn-dark" href={whatsappHref(productQuestion(product.name, product.sku))} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" /> Pitajte na WhatsApp-u
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-2">
          <button type="button" onClick={() => onAdd(true)} className="btn-primary w-full">
            Naruči odmah · {formatRsd(product.retail)}
          </button>
          <button type="button" onClick={() => onAdd()} className="btn-outline w-full">
            {addLabel}
          </button>
        </div>
      )}

      <ul className="assurances mt-6">
        <li>
          <BadgeCheck aria-hidden="true" /> Plaćate pouzećem, tek kada preuzmete paket
        </li>
        <li>
          <Truck aria-hidden="true" /> Besplatna dostava, 2–5 radnih dana
        </li>
        <li>
          <RefreshCw aria-hidden="true" /> Zamena veličine u roku od {SIZE_EXCHANGE.days} dana o našem trošku
        </li>
      </ul>
      {!soldOut && (
        <a
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-1 underline-offset-4 hover:text-action-text"
          href={whatsappHref(productQuestion(product.name, product.sku, size))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" /> Niste sigurni? Pitajte nas na WhatsApp-u
        </a>
      )}

      {/* Donja traka na telefonu */}
      {mounted &&
        !soldOut &&
        createPortal(
          <div className="sticky-bar" data-visible={showSticky} aria-hidden={!showSticky} inert={!showSticky}>
            {!size && <div className="flex gap-2 overflow-x-auto scrollbar-none pb-3">{sizeButtons(true)}</div>}
            <div className="flex items-center gap-3">
              <div className="shrink-0 leading-tight">
                <div className="text-[0.8125rem] text-ink-3">{size ? `Veličina ${size}` : "Cena"}</div>
                <div className="text-base font-bold">{formatRsd(product.retail)}</div>
              </div>
              <button type="button" onClick={() => onAdd()} className="btn-primary flex-1">
                {size ? addLabel : "Izaberite veličinu"}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
