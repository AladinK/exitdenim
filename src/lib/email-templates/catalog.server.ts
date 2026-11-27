import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  EMAIL_PRODUCT_FIELDS,
  emailItems,
  emailRecommendations,
  withStock,
  type EmailItem,
  type EmailProduct,
  type OrderRow,
} from "./format";

/**
 * Slike i linkovi poručenih modela i preporuke za e-mail o porudžbini. Nikad ne baca
 * grešku: ako katalog nije dostupan, e-mail ide bez slika i preporuka.
 */
export async function orderEmailExtras(
  sb: SupabaseClient<Database>,
  rows: OrderRow[],
  campaign: string,
): Promise<{ items: EmailItem[]; recommendations: EmailProduct[] }> {
  const ids = [...new Set(rows.map((r) => r.product_id).filter((id): id is string => !!id))];
  try {
    const [catalog, ordered, availability] = await Promise.all([
      sb
        .from("products_public")
        .select(EMAIL_PRODUCT_FIELDS)
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      // Poručeni model je možda u međuvremenu sklonjen iz prodaje; slika i dalje treba.
      ids.length
        ? sb.from("products_public").select("id, slug, image_url, category").in("id", ids)
        : Promise.resolve({ data: [], error: null }),
      sb.rpc("get_stock_availability"),
    ]);
    if (catalog.error)
      console.error("[e-mail] katalog za preporuke nije učitan:", catalog.error.message);
    const products = withStock(catalog.data, availability.error ? null : availability.data);
    return {
      items: emailItems(rows, [...(ordered.data ?? []), ...products], campaign),
      recommendations: emailRecommendations(products, rows, campaign),
    };
  } catch (error) {
    console.error("[e-mail] podaci o modelima nisu učitani:", error);
    return { items: emailItems(rows, [], campaign), recommendations: [] };
  }
}
