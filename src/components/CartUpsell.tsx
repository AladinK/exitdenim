import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { catalogQuery } from "@/lib/product-queries";
import { pickUpsell, type UpsellPick } from "@/lib/cart-helpers";
import { BUNDLE, piecesToBundle } from "@/lib/discounts";
import { ecommerce, track } from "@/lib/analytics";

/**
 * "Dodajte uz porudžbinu": modeli koji nisu u korpi, sa veličinom koju kupac već nosi
 * (jedan dodir). Koristi isti keš kataloga kao prodavnica.
 */
export function CartUpsell({ variant, enabled = true, onNavigate }: { variant: "drawer" | "page"; enabled?: boolean; onNavigate?: () => void }) {
  const { items, count, promo } = useCart();
  const { data } = useQuery({ ...catalogQuery(), enabled: enabled && items.length > 0 });
  const products = data?.products;
  const picks = useMemo(
    () => (products ? pickUpsell(products, items, variant === "drawer" ? 6 : 4) : []),
    [products, items, variant],
  );
  if (!items.length || !picks.length) return null;

  const missing = piecesToBundle(count);
  const bundleHelps = missing > 0 && !(promo && promo.pct >= BUNDLE.pct);
  const title = bundleHelps ? `Uzmite još jedan model i uštedite ${BUNDLE.pct}%` : "Dodajte uz porudžbinu";

  return (
    <section aria-label={title} className={variant === "drawer" ? "px-5 py-5 border-t border-border" : "mt-10"}>
      <div className={variant === "drawer" ? "text-[11px] uppercase tracking-[0.18em] font-medium" : "eyebrow"}>{title}</div>
      <ul className={`mt-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 ${variant === "page" ? "lg:grid lg:grid-cols-4 lg:overflow-visible" : ""}`}>
        {picks.map((pick) => (
          <UpsellCard key={pick.product.id} pick={pick} variant={variant} onNavigate={onNavigate} />
        ))}
      </ul>
    </section>
  );
}

function UpsellCard({ pick, variant, onNavigate }: { pick: UpsellPick; variant: "drawer" | "page"; onNavigate?: () => void }) {
  const { add } = useCart();
  const p = pick.product;
  const available = pick.sizes.filter((s) => s.inStock !== false);
  const [size, setSize] = useState<string>(pick.size ?? (available.length === 1 ? available[0].size : ""));
  const [added, setAdded] = useState(false);
  const price = Number(p.retail);

  const onAdd = () => {
    if (!size || !p.id || !p.slug) return;
    add({
      productId: p.id,
      sku: p.sku ?? "",
      slug: p.slug,
      name: p.name ?? "",
      size,
      unitPrice: price,
      image: p.image_url ?? null,
    });
    ecommerce.addToCart({ item_id: p.sku || p.id, item_name: p.name ?? "", item_category: p.category ?? null, item_variant: size, price, quantity: 1 });
    track("upsell_add", { item_id: p.sku || p.id, size, location: variant === "drawer" ? "fioka" : "korpa" });
    setAdded(true);
  };

  return (
    <li className={`${variant === "drawer" ? "w-36" : "w-40 lg:w-auto"} shrink-0 snap-start flex flex-col`}>
      <Link to="/proizvod/$slug" params={{ slug: p.slug! }} onClick={onNavigate} className="block aspect-[3/4] bg-secondary overflow-hidden">
        {p.image_url ? <img src={p.image_url} alt={p.name ?? ""} loading="lazy" className="w-full h-full object-cover" /> : null}
      </Link>
      <Link to="/proizvod/$slug" params={{ slug: p.slug! }} onClick={onNavigate} className="mt-2 text-[12px] font-medium leading-tight line-clamp-2 min-h-[2.5em] hover:underline">
        {p.name}
      </Link>
      <div className="mt-0.5 text-[12px] tabular-nums">{price.toLocaleString("sr-RS")} din</div>
      <div className="mt-auto pt-2 flex items-center gap-1.5">
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          aria-label={`Veličina za ${p.name}`}
          className="min-w-0 flex-1 border border-border bg-background px-1.5 py-2 text-[12px] tabular-nums focus:outline-none focus:border-foreground"
        >
          {!size && <option value="">Vel.</option>}
          {pick.sizes.map((s) => (
            <option key={s.size} value={s.size} disabled={s.inStock === false}>
              {s.size}{s.inStock === false ? " ✕" : ""}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onAdd}
          disabled={!size || added}
          className="shrink-0 inline-flex items-center justify-center gap-1 border border-foreground bg-foreground text-background px-2.5 py-2 text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {added ? <><Check className="w-3.5 h-3.5" /> Dodato</> : "Dodaj"}
        </button>
      </div>
    </li>
  );
}
