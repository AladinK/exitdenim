import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type StockRow = Database["public"]["Tables"]["stock"]["Row"];

export type ProductWithStock = ProductRow & { stock: Record<string, number> };

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

async function signIfPath(sb: ReturnType<typeof publicClient>, image_url: string | null) {
  if (!image_url) return null;
  if (/^https?:\/\//i.test(image_url) || image_url.startsWith("/")) return image_url;
  const { data } = await sb.storage.from("product-images").createSignedUrl(image_url, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data: products, error } = await sb
    .from("products_public")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  const { data: stock } = await sb.from("stock").select("*");
  const stockBy: Record<string, Record<string, number>> = {};
  (stock || []).forEach((s: StockRow) => {
    if (!stockBy[s.product_id]) stockBy[s.product_id] = {};
    stockBy[s.product_id][s.size] = s.quantity;
  });
  const resolved = await Promise.all(
    (products || []).map(async (p) => ({
      ...p,
      image_url: await signIfPath(sb, p.image_url),
      stock: stockBy[p.id] || {},
    })),
  );
  return resolved as ProductWithStock[];
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: product, error } = await sb
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) return null;
    const { data: stock } = await sb.from("stock").select("size, quantity").eq("product_id", product.id);
    const stockMap: Record<string, number> = {};
    (stock || []).forEach((s) => { stockMap[s.size] = s.quantity; });
    return { ...product, stock: stockMap } as ProductWithStock;
  });
