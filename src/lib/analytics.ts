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
  addToCart: (item: TrackedItem) =>
    track("add_to_cart", {
      ecommerce: { currency: CURRENCY, value: item.price * (item.quantity ?? 1), items: [item] },
    }),
  viewCart: (items: TrackedItem[], value: number) =>
    track("view_cart", { ecommerce: { currency: CURRENCY, value, items } }),
  beginCheckout: (items: TrackedItem[], value: number) =>
    track("begin_checkout", { ecommerce: { currency: CURRENCY, value, items } }),
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
