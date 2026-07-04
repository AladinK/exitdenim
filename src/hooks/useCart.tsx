import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  update: (productId: string, size: string, qty: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "exit_cart_v1";
const FREE_SHIPPING_OVER = 15000; // RSD
const SHIPPING_FLAT = 500; // RSD

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    return {
      items,
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      open,
      setOpen,
      add: (item, qty = 1) => {
        setItems((cur) => {
          const idx = cur.findIndex((x) => x.productId === item.productId && x.size === item.size);
          if (idx >= 0) {
            const next = [...cur];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
            return next;
          }
          return [...cur, { ...item, quantity: qty }];
        });
      },
      update: (productId, size, qty) => {
        setItems((cur) =>
          cur
            .map((x) => (x.productId === productId && x.size === size ? { ...x, quantity: Math.max(0, qty) } : x))
            .filter((x) => x.quantity > 0),
        );
      },
      remove: (productId, size) => {
        setItems((cur) => cur.filter((x) => !(x.productId === productId && x.size === size)));
      },
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const CART_CONSTANTS = { FREE_SHIPPING_OVER, SHIPPING_FLAT };
