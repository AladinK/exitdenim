import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { readPromo, clearStoredPromo, type Promo } from "@/lib/promo";
import { bestDiscount, type DiscountSource } from "@/lib/discounts";
import { clampQty, type CatalogProduct } from "@/lib/cart-helpers";
import { track } from "@/lib/analytics";

export type CartItem = {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  size: string;
  unitPrice: number; // retail RSD
  image?: string | null;
  quantity: number;
};

export type RemovedLine = { item: CartItem; index: number };

type CartCtx = {
  items: CartItem[];
  /** true tek kada je korpa pročitana iz pregledača (pre toga je "prazna" samo prividno). */
  ready: boolean;
  count: number;
  subtotal: number;
  shipping: number;
  promo: Promo | null;
  /** Iznos popusta: veći od količinskog (2+ komada) i točka sreće; ne sabiraju se. */
  discount: number;
  discountPct: number;
  discountSource: DiscountSource | null;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  update: (productId: string, size: string, qty: number) => void;
  /** Menja veličinu stavke; ako ta veličina već postoji u korpi, količine se sabiraju. */
  changeSize: (productId: string, size: string, newSize: string) => void;
  remove: (productId: string, size: string) => void;
  /** Poslednja uklonjena stavka, dok se još može vratiti. */
  lastRemoved: RemovedLine | null;
  undoRemove: () => void;
  /** Usklađuje cene, slike i nazive sa katalogom (server naplaćuje cenu iz kataloga). */
  syncWithCatalog: (products: CatalogProduct[]) => void;
  clear: () => void;
  applyPromo: (p: Promo) => void;
  clearPromo: () => void;
};

const STORAGE_KEY = "exit_cart_v1";
const FREE_SHIPPING_OVER = 0; // free shipping on all orders
const SHIPPING_FLAT = 0;
const UNDO_MS = 6000;

const Ctx = createContext<CartCtx | null>(null);

function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.productId === "string" && typeof x.size === "string")
      .map((x) => ({ ...x, quantity: clampQty(Number(x.quantity) || 0), unitPrice: Number(x.unitPrice) || 0 }))
      .filter((x) => x.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [promo, setPromo] = useState<Promo | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<RemovedLine | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(readStoredItems());
    setPromo(readPromo());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  // Korpa otvorena u dve kartice ostaje ista u obe.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStoredItems());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current); }, []);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    const d = bestDiscount(subtotal, count, promo?.pct ?? 0);
    const same = (x: CartItem, productId: string, size: string) => x.productId === productId && x.size === size;
    return {
      items,
      ready: hydrated,
      count,
      subtotal,
      shipping,
      promo,
      discount: d.amount,
      discountPct: d.pct,
      discountSource: d.source,
      total: subtotal - d.amount + shipping,
      open,
      setOpen,
      add: (item, qty = 1) => {
        setItems((cur) => {
          const idx = cur.findIndex((x) => same(x, item.productId, item.size));
          if (idx >= 0) {
            const next = [...cur];
            next[idx] = { ...next[idx], quantity: clampQty(next[idx].quantity + qty) };
            return next;
          }
          return [...cur, { ...item, quantity: Math.max(1, clampQty(qty)) }];
        });
      },
      update: (productId, size, qty) => {
        setItems((cur) =>
          cur
            .map((x) => (same(x, productId, size) ? { ...x, quantity: clampQty(qty) } : x))
            .filter((x) => x.quantity > 0),
        );
      },
      changeSize: (productId, size, newSize) => {
        if (size === newSize) return;
        setItems((cur) => {
          const from = cur.findIndex((x) => same(x, productId, size));
          if (from < 0) return cur;
          const moving = cur[from];
          const to = cur.findIndex((x) => same(x, productId, newSize));
          if (to >= 0) {
            const next = cur.filter((_, i) => i !== from);
            const target = next.findIndex((x) => same(x, productId, newSize));
            next[target] = { ...next[target], quantity: clampQty(next[target].quantity + moving.quantity) };
            return next;
          }
          const next = [...cur];
          next[from] = { ...moving, size: newSize };
          return next;
        });
        track("change_size_in_cart", { item_id: productId, from_size: size, to_size: newSize });
      },
      remove: (productId, size) => {
        const index = items.findIndex((x) => same(x, productId, size));
        if (index < 0) return;
        const item = items[index];
        setItems((cur) => cur.filter((x) => !same(x, productId, size)));
        setLastRemoved({ item, index });
        if (undoTimer.current) clearTimeout(undoTimer.current);
        undoTimer.current = setTimeout(() => setLastRemoved(null), UNDO_MS);
        track("remove_from_cart", {
          ecommerce: {
            currency: "RSD",
            value: item.unitPrice * item.quantity,
            items: [{ item_id: item.sku, item_name: item.name, item_variant: item.size, price: item.unitPrice, quantity: item.quantity }],
          },
        });
      },
      lastRemoved,
      undoRemove: () => {
        if (!lastRemoved) return;
        const { item, index } = lastRemoved;
        setItems((cur) => {
          if (cur.some((x) => same(x, item.productId, item.size))) return cur;
          const next = [...cur];
          next.splice(Math.min(index, next.length), 0, item);
          return next;
        });
        setLastRemoved(null);
        if (undoTimer.current) clearTimeout(undoTimer.current);
      },
      syncWithCatalog: (products) => {
        setItems((cur) => {
          let changed = false;
          const next = cur.map((i) => {
            const p = products.find((x) => x.id === i.productId);
            if (!p) return i;
            const price = Number(p.retail);
            const unitPrice = price > 0 ? price : i.unitPrice;
            const image = p.image_url ?? i.image ?? null;
            const name = p.name ?? i.name;
            const slug = p.slug ?? i.slug;
            if (unitPrice === i.unitPrice && image === (i.image ?? null) && name === i.name && slug === i.slug) return i;
            changed = true;
            return { ...i, unitPrice, image, name, slug };
          });
          return changed ? next : cur;
        });
      },
      clear: () => setItems([]),
      applyPromo: (p) => setPromo(p),
      clearPromo: () => {
        setPromo(null);
        clearStoredPromo();
      },
    };
  }, [items, open, promo, hydrated, lastRemoved]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const CART_CONSTANTS = { FREE_SHIPPING_OVER, SHIPPING_FLAT };
