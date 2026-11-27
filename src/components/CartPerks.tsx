import { X, Truck, BadgeCheck, RefreshCcw, Percent } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { BUNDLE, piecesToBundle } from "@/lib/discounts";
import { SIZE_EXCHANGE } from "@/lib/brand";

const din = (n: number) => `${n.toLocaleString("sr-RS")} din`;

/** Red popusta u rezimeu korpe i kase. */
export function DiscountRow({ removable = false, showCode = true }: { removable?: boolean; showCode?: boolean }) {
  const { discount, discountPct, discountSource, promo, clearPromo } = useCart();
  if (discount <= 0 || !discountSource) return null;
  const label =
    discountSource === "wheel"
      ? `Točak sreće −${discountPct}%${showCode && promo ? ` (${promo.code})` : ""}`
      : `Popust za ${BUNDLE.minQty}+ komada −${discountPct}%`;
  return (
    <div className="flex justify-between items-center text-accent font-medium">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <span className="tabular-nums">−{din(discount)}</span>
        {removable && discountSource === "wheel" && (
          <button onClick={clearPromo} className="text-muted-foreground hover:text-foreground" aria-label="Ukloni popust">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </span>
    </div>
  );
}

/** Podsticaj za još jedan komad: koliko fali do količinskog popusta, ili potvrda da je ostvaren. */
export function BundleNudge({ className = "" }: { className?: string }) {
  const { count, discountSource, promo } = useCart();
  if (count === 0) return null;
  const missing = piecesToBundle(count);
  // Točak sreće od 15% je već veći od količinskog popusta: tada podsticaj ništa ne dodaje.
  if (missing > 0 && promo && promo.pct >= BUNDLE.pct) return null;
  if (missing > 0) {
    return (
      <div className={`flex items-start gap-2 border border-accent/40 bg-accent/10 px-3 py-2.5 text-[12px] ${className}`}>
        <Percent className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
        <span>
          Dodajte još {missing} {missing === 1 ? "komad" : "komada"} i ostvarite <b>{BUNDLE.pct}% popusta</b> na celu porudžbinu.
        </span>
      </div>
    );
  }
  if (discountSource !== "bundle") return null;
  return (
    <div className={`flex items-start gap-2 border border-accent/40 bg-accent/10 px-3 py-2.5 text-[12px] ${className}`}>
      <Percent className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
      <span>Ostvarili ste <b>{BUNDLE.pct}% popusta</b> za {BUNDLE.minQty} ili više komada.</span>
    </div>
  );
}

/** Pogodnosti kupovine, kratko, uz dugme za plaćanje. */
export function CartBenefits({ className = "" }: { className?: string }) {
  const perks = [
    { icon: Truck, text: "Besplatna dostava" },
    { icon: BadgeCheck, text: "Plaćanje pouzećem" },
    { icon: RefreshCcw, text: `Zamena veličine ${SIZE_EXCHANGE.days} dana` },
    { icon: Percent, text: `−${BUNDLE.pct}% za ${BUNDLE.minQty}+ komada` },
  ];
  return (
    <ul className={`grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground ${className}`}>
      {perks.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-1.5 min-w-0">
          <Icon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{text}</span>
        </li>
      ))}
    </ul>
  );
}
