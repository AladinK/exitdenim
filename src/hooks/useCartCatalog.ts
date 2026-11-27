import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { catalogQuery } from "@/lib/product-queries";
import { lineInfo, lineKey, type LineInfo } from "@/lib/cart-helpers";
import { useCart } from "@/hooks/useCart";

/**
 * Proverava stavke korpe prema katalogu (isti keš kao prodavnica, bez dodatnog upita
 * kad je katalog već učitan): koje veličine postoje, šta je rasprodato i koja je cena.
 * Stanje se primenjuje samo kad je katalog sveže pročitan iz baze.
 */
export function useCartCatalog(enabled: boolean) {
  const { items, syncWithCatalog } = useCart();
  const { data } = useQuery({ ...catalogQuery(), enabled: enabled && items.length > 0 });
  const live = data?.state === "live" ? data.products : null;

  useEffect(() => {
    if (live) syncWithCatalog(live);
    // syncWithCatalog se menja sa korpom; dovoljno je pokrenuti ga kad stigne katalog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  const info = useMemo(() => {
    const m = new Map<string, LineInfo | null>();
    for (const i of items) m.set(lineKey(i), lineInfo(i, live));
    return m;
  }, [items, live]);

  const problems = items.filter((i) => {
    const s = info.get(lineKey(i))?.status;
    return s === "soldOut" || s === "unavailable";
  });

  return { info, problems, blocking: problems.length > 0 };
}
