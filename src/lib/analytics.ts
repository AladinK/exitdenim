/**
 * GA4 / GTM-compatible ecommerce event layer.
 * Pushes to window.dataLayer (and gtag when present). No-ops on the server.
 */

type Params = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Params[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === "function") window.gtag("event", event, params);
}

function sessionId() {
  try {
    let s = sessionStorage.getItem("exit_sid");
    if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("exit_sid", s); }
    return s;
  } catch { return null; }
}

/** Persist key funnel events so the admin can see them. */
function logEvent(event: "add_to_cart" | "begin_checkout", items: TrackedItem[], value: number) {
  if (typeof window === "undefined") return;
  if (event === "begin_checkout" && !window.location.pathname.startsWith("/kasa")) return;
  const device = window.matchMedia("(max-width: 767px)").matches ? "telefon" : "računar";
  const sid = sessionId();
  if (event === "begin_checkout") {
    const key = "exit_co_notified";
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        import("@/lib/checkout-notify.functions").then(({ notifyCheckoutStarted }) =>
          notifyCheckoutStarted({
            data: {
              items: items.slice(0, 20).map((i) => ({ name: i.item_name.slice(0, 120), size: i.item_variant ?? null, qty: Math.max(1, Math.min(50, i.quantity ?? 1)) })),
              value: Math.round(value),
              device,
            },
          }),
        ).catch(() => {});
      }
    } catch {}
  }
  import("@/integrations/supabase/client").then(({ supabase }) => {
    const rows = (items.length ? items : [null]).map((it) => ({
      event,
      product_name: it?.item_name ?? null,
      size: event === "add_to_cart" ? (it?.item_variant ?? null) : null,
      price: it?.price ?? null,
      value,
      device,
      session_id: sid,
    }));
    supabase.from("cart_events").insert(rows).then(() => {});
  }).catch(() => {});
}

export type TrackedItem = {
  item_id: string;
  item_name: string;
  item_category?: string | null;
  item_variant?: string | null;
  price: number;
  quantity?: number;
};

export const CURRENCY = "RSD";

export function itemFromProduct(p: {
  sku?: string | null;
  id?: string;
  name: string;
  category?: string | null;
  fit?: string | null;
  retail: number | string;
}, extra: Partial<TrackedItem> = {}): TrackedItem {
  return {
    item_id: p.sku || p.id || p.name,
    item_name: p.name,
    item_category: p.category ?? null,
    item_variant: p.fit ?? null,
    price: Number(p.retail),
    quantity: 1,
    ...extra,
  };
}

export const ecommerce = {
  viewItemList: (listName: string, items: TrackedItem[]) =>
    track("view_item_list", { item_list_name: listName, ecommerce: { items } }),
  selectItem: (listName: string, item: TrackedItem) =>
    track("select_item", { item_list_name: listName, ecommerce: { items: [item] } }),
  viewItem: (item: TrackedItem) =>
    track("view_item", { ecommerce: { currency: CURRENCY, value: item.price, items: [item] } }),
  selectSize: (item: TrackedItem, size: string) =>
    track("select_size", { size, ecommerce: { items: [{ ...item, item_variant: size }] } }),
  addToCart: (item: TrackedItem) => {
    logEvent("add_to_cart", [item], item.price * (item.quantity ?? 1));
    track("add_to_cart", {
      ecommerce: { currency: CURRENCY, value: item.price * (item.quantity ?? 1), items: [item] },
    });
  },
  viewCart: (items: TrackedItem[], value: number) =>
    track("view_cart", { ecommerce: { currency: CURRENCY, value, items } }),
  beginCheckout: (items: TrackedItem[], value: number) => {
    logEvent("begin_checkout", items, value);
    track("begin_checkout", { ecommerce: { currency: CURRENCY, value, items } });
  },
  addShippingInfo: (items: TrackedItem[], value: number) =>
    track("add_shipping_info", { ecommerce: { currency: CURRENCY, value, items } }),
  addPaymentInfo: (items: TrackedItem[], value: number) =>
    track("add_payment_info", {
      ecommerce: { currency: CURRENCY, value, payment_type: "COD", items },
    }),
  purchase: (transactionId: string, items: TrackedItem[], value: number, shipping: number) =>
    track("purchase", {
      ecommerce: { transaction_id: transactionId, currency: CURRENCY, value, shipping, items },
    }),
  search: (term: string) => track("search", { search_term: term }),
  filterUse: (filter: string, value: string) => track("filter_use", { filter_name: filter, filter_value: value }),
  cta: (label: string, location: string) => track("cta_click", { cta_label: label, cta_location: location }),
};
