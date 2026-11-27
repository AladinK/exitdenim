import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "@/hooks/useCart";
import { MAX_QTY_PER_LINE, type LineInfo } from "@/lib/cart-helpers";

const din = (n: number) => `${Number(n).toLocaleString("sr-RS")} din`;

/** Veličina u stavki korpe: padajuća lista kad je katalog poznat, inače samo broj. */
function SizeChoice({ item, info, className }: { item: CartItem; info: LineInfo | null; className: string }) {
  const { changeSize } = useCart();
  const sizes = info?.sizes ?? [];
  if (sizes.length < 2) return <span>vel. {item.size}</span>;
  return (
    <label className="inline-flex items-center gap-1">
      <span>vel.</span>
      <select
        value={item.size}
        onChange={(e) => changeSize(item.productId, item.size, e.target.value)}
        aria-label={`Veličina za ${item.name}`}
        className={className}
      >
        {sizes.map((s) => (
          <option key={s.size} value={s.size} disabled={s.inStock === false && s.size !== item.size}>
            {s.size}{s.inStock === false ? " (rasprodato)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function LineProblem({ info }: { info: LineInfo | null }) {
  if (info?.status === "soldOut") {
    return (
      <p role="alert" className="mt-1.5 text-[11px] font-semibold text-destructive">
        Ova veličina je u međuvremenu rasprodata. Izaberite drugu ili uklonite artikal.
      </p>
    );
  }
  if (info?.status === "unavailable") {
    return (
      <p role="alert" className="mt-1.5 text-[11px] font-semibold text-destructive">
        Ovaj model više nije u ponudi. Uklonite ga iz korpe.
      </p>
    );
  }
  return null;
}

function Stepper({ item, size }: { item: CartItem; size: "sm" | "md" }) {
  const { update } = useCart();
  const box = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const atMax = item.quantity >= MAX_QTY_PER_LINE;
  return (
    <div className="inline-flex items-center border border-border">
      <button onClick={() => update(item.productId, item.size, item.quantity - 1)} className={`${box} inline-flex items-center justify-center hover:bg-secondary`} aria-label="Smanji">
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className={`${size === "sm" ? "w-8" : "w-10"} text-center text-sm tabular-nums`} aria-live="polite">{item.quantity}</span>
      <button
        onClick={() => update(item.productId, item.size, item.quantity + 1)}
        disabled={atMax}
        title={atMax ? `Najviše ${MAX_QTY_PER_LINE} komada po veličini` : undefined}
        className={`${box} inline-flex items-center justify-center hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Povećaj"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/** Stavka u fioci korpe. */
export function DrawerCartLine({ item, info, onNavigate }: { item: CartItem; info: LineInfo | null; onNavigate: () => void }) {
  const { remove } = useCart();
  return (
    <li className="p-5 flex gap-4">
      <Link to="/proizvod/$slug" params={{ slug: item.slug }} onClick={onNavigate} className="w-20 h-24 shrink-0 bg-secondary overflow-hidden" aria-label={item.name}>
        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {item.sku} · <SizeChoice item={item} info={info} className="bg-transparent uppercase tracking-[0.2em] text-[10px] text-foreground border-b border-border focus:outline-none focus:border-foreground cursor-pointer" />
        </div>
        <Link to="/proizvod/$slug" params={{ slug: item.slug }} onClick={onNavigate} className="mt-1 block text-sm font-medium truncate hover:underline">
          {item.name}
        </Link>
        <div className="mt-1 text-sm tabular-nums">
          {din(item.unitPrice)}
          {item.quantity > 1 && <span className="text-muted-foreground"> · ukupno {din(item.unitPrice * item.quantity)}</span>}
        </div>
        <LineProblem info={info} />
        <div className="mt-3 flex items-center justify-between">
          <Stepper item={item} size="sm" />
          <button onClick={() => remove(item.productId, item.size)} className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
            Ukloni
          </button>
        </div>
      </div>
    </li>
  );
}

/** Stavka na stranici korpe. */
export function PageCartLine({ item, info }: { item: CartItem; info: LineInfo | null }) {
  const { remove } = useCart();
  return (
    <li className="py-6 flex gap-5">
      <Link to="/proizvod/$slug" params={{ slug: item.slug }} className="w-24 h-32 shrink-0 bg-secondary overflow-hidden" aria-label={item.name}>
        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
      </Link>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {item.sku} · <SizeChoice item={item} info={info} className="bg-transparent uppercase tracking-[0.22em] text-[10px] text-foreground border-b border-border focus:outline-none focus:border-foreground cursor-pointer" />
        </div>
        <Link to="/proizvod/$slug" params={{ slug: item.slug }} className="serif text-xl mt-1 hover:underline">
          {item.name}
        </Link>
        <div className="text-sm text-muted-foreground mt-1 tabular-nums">{din(item.unitPrice)} / kom</div>
        <LineProblem info={info} />
        <div className="mt-auto flex items-center justify-between pt-3">
          <Stepper item={item} size="md" />
          <div className="flex items-center gap-5">
            <div className="text-sm font-semibold tabular-nums">{din(item.unitPrice * item.quantity)}</div>
            <button onClick={() => remove(item.productId, item.size)} className="text-muted-foreground hover:text-foreground" aria-label="Ukloni">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Kratka poruka posle uklanjanja, sa dugmetom za vraćanje stavke. */
export function RemovedNotice({ className = "" }: { className?: string }) {
  const { lastRemoved, undoRemove } = useCart();
  if (!lastRemoved) return null;
  return (
    <div role="status" className={`flex items-center justify-between gap-3 border border-border bg-secondary/40 px-4 py-2.5 text-[12px] ${className}`}>
      <span className="min-w-0 truncate">
        Uklonjeno: {lastRemoved.item.name}, vel. {lastRemoved.item.size}
      </span>
      <button onClick={undoRemove} className="shrink-0 font-semibold underline underline-offset-4 hover:no-underline">
        Vrati
      </button>
    </div>
  );
}
