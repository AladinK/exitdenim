import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

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
  // Public availability only — exposed as 1/0 so callers keep the existing
  // stock map shape without leaking raw inventory quantities.
  const { data: availability } = await sb.rpc("get_stock_availability");
  const stockBy: Record<string, Record<string, number>> = {};
  (availability || []).forEach((s) => {
    if (!s.product_id) return;
    if (!stockBy[s.product_id]) stockBy[s.product_id] = {};
    stockBy[s.product_id][s.size] = s.in_stock ? 1 : 0;
  });
  const resolved = await Promise.all(
    (products || []).map(async (p) => ({
      ...p,
      image_url: await signIfPath(sb, p.image_url),
      stock: (p.id && stockBy[p.id]) || {},
    })),
  );
  return resolved as ProductWithStock[];
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: product, error } = await sb
      .from("products_public")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) return null;
    const { data: availability } = await sb.rpc("get_stock_availability");
    const stockMap: Record<string, number> = {};
    (availability || [])
      .filter((s) => s.product_id === product.id)
      .forEach((s) => { stockMap[s.size] = s.in_stock ? 1 : 0; });
    const image_url = await signIfPath(sb, product.image_url);
    return { ...product, image_url, stock: stockMap } as ProductWithStock;
  });

// Authenticated: returns real inventory quantities for a product.
// Used by B2B partners in the size-matrix order flow.
export const getStockQuantities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ productId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("stock")
      .select("size, quantity")
      .eq("product_id", data.productId);
    if (error) throw new Error(error.message);
    const map: Record<string, number> = {};
    (rows || []).forEach((r) => { map[r.size] = r.quantity; });
    return map;
  });
