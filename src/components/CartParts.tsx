import { Minus, Plus, X } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/useCart";
import { formatRsd } from "@/lib/format";

/** Jedna stavka korpe; ista u fioci, na stranici korpe i na kasi. */
export function CartLine({ item, editable = true }: { item: CartItem; editable?: boolean }) {
  const { update, remove } = useCart();
  return (
    <li className="cart-line">
      <div className="cart-line__thumb">
        {item.image ? <img src={item.image} alt="" loading="lazy" decoding="async" width={160} height={200} /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[0.9375rem] font-medium leading-snug">{item.name}</div>
            <div className="mt-0.5 text-[0.8125rem] text-ink-3">
              Veličina {item.size}
              {!editable && ` · ${item.quantity} kom`}
            </div>
          </div>
          <div className="shrink-0 text-[0.9375rem] font-semibold">{formatRsd(item.unitPrice * item.quantity)}</div>
        </div>
        {editable && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="stepper">
              <button type="button" onClick={() => update(item.productId, item.size, item.quantity - 1)} aria-label={`Smanji količinu: ${item.name}`}>
                <Minus aria-hidden="true" />
              </button>
              <span aria-live="polite">{item.quantity}</span>
              <button type="button" onClick={() => update(item.productId, item.size, item.quantity + 1)} aria-label={`Povećaj količinu: ${item.name}`}>
                <Plus aria-hidden="true" />
              </button>
            </div>
            <button type="button" onClick={() => remove(item.productId, item.size)} className="min-h-10 px-1 text-sm text-ink-2 underline decoration-1 underline-offset-4 hover:text-foreground">
              Ukloni
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

/** Zbir porudžbine sa dostavom i popustom. */
export function CartTotals({ allowPromoRemoval = false }: { allowPromoRemoval?: boolean }) {
  const { subtotal, shipping, promo, discount, total, clearPromo } = useCart();
  return (
    <dl className="totals">
      <div>
        <dt>Međuzbir</dt>
        <dd>{formatRsd(subtotal)}</dd>
      </div>
      <div>
        <dt>Dostava</dt>
        <dd>{shipping === 0 ? "Besplatna" : formatRsd(shipping)}</dd>
      </div>
      {promo && discount > 0 && (
        <div className="font-medium text-action-text">
          <dt className="!text-action-text">
            Točak sreće −{promo.pct}%
            {allowPromoRemoval && (
              <button type="button" onClick={clearPromo} className="ml-2 inline-grid h-6 w-6 place-items-center align-middle text-ink-3 hover:text-foreground" aria-label="Ukloni popust">
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </dt>
          <dd>−{formatRsd(discount)}</dd>
        </div>
      )}
      <div className="totals__sum">
        <dt>Ukupno</dt>
        <dd>{formatRsd(total)}</dd>
      </div>
    </dl>
  );
}

export const gaItems = (items: CartItem[]) =>
  items.map((i) => ({ item_id: i.sku, item_name: i.name, item_variant: i.size, price: i.unitPrice, quantity: i.quantity }));
