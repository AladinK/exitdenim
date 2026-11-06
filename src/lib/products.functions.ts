import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export type ProductWithStock = ProductRow & { stock: Record<string, number> };

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Public catalog configuration unavailable.");
  return createClient<Database>(
    url,
    key,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    },
  );
}

// Signed URLs are minted with the privileged server client so the storage
// buckets need no public/anon read policy at all.
async function signClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [{ data: products, error }, { data: availability }] = await Promise.all([sb
    .from("products_public")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true }), sb.rpc("get_stock_availability")]);
  if (error) throw new Error(error.message);
  // Public availability only — exposed as 1/0 so callers keep the existing
  // stock map shape without leaking raw inventory quantities.
  const stockBy: Record<string, Record<string, number>> = {};
  (availability || []).forEach((s) => {
    if (!s.product_id) return;
    if (!stockBy[s.product_id]) stockBy[s.product_id] = {};
    stockBy[s.product_id][s.size] = s.in_stock ? 1 : 0;
  });
  // Batch-sign storage paths in one request instead of one call per product.
  const list = products || [];
  const paths = [...new Set(list
    .map((p) => p.image_url)
    .filter((u): u is string => !!u && !/^https?:\/\//i.test(u) && !u.startsWith("/")))];
  const signed: Record<string, string> = {};
  if (paths.length) {
    const { data } = await (await signClient()).storage.from("product-images").createSignedUrls(paths, 60 * 60 * 24 * 7);
    (data || []).forEach((d) => { if (d.path && d.signedUrl) signed[d.path] = d.signedUrl; });
  }
  return list.map((p) => ({
    ...p,
    image_url: p.image_url ? signed[p.image_url] ?? (paths.includes(p.image_url) ? null : p.image_url) : null,
    stock: (p.id && stockBy[p.id]) || {},
  })) as ProductWithStock[];
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const [{ data: product, error }, { data: availability }] = await Promise.all([sb
      .from("products_public")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle(), sb.rpc("get_stock_availability")]);
    if (error) throw new Error(error.message);
    if (!product) return null;
    const stockMap: Record<string, number> = {};
    (availability || [])
      .filter((s) => s.product_id === product.id)
      .forEach((s) => { stockMap[s.size] = s.in_stock ? 1 : 0; });
    const originalGallery = Array.isArray(product.gallery) ? product.gallery.filter((g): g is string => typeof g === "string") : [];
    const paths = [...new Set([product.image_url, ...originalGallery].filter((url): url is string => !!url && !/^https?:\/\//i.test(url) && !url.startsWith("/")))];
    const signed: Record<string, string> = {};
    if (paths.length) {
      const { data: urls } = await (await signClient()).storage.from("product-images").createSignedUrls(paths, 60 * 60 * 24 * 7);
      for (const item of urls ?? []) if (item.path && item.signedUrl) signed[item.path] = item.signedUrl;
    }
    const resolve = (url: string | null) => url ? signed[url] ?? (paths.includes(url) ? null : url) : null;
    const image_url = resolve(product.image_url);
    const gallery = originalGallery.map(resolve).filter((url): url is string => !!url);
    return { ...product, image_url, gallery, stock: stockMap } as ProductWithStock;
  });

// Authenticated: returns real inventory quantities for a product.
// Used by B2B partners in the size-matrix order flow.
export const getStockQuantities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ productId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    // Exact per-size inventory is reserved for approved partners and admins.
    // Pending or rejected accounts fall back to boolean availability only.
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("status")
      .eq("id", context.userId)
      .maybeSingle();
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin && profile?.status !== "approved") {
      throw new Error("Forbidden: approved B2B partner required.");
    }
    const { data: rows, error } = await context.supabase
      .from("stock")
      .select("size, quantity")
      .eq("product_id", data.productId);
    if (error) throw new Error(error.message);
    const map: Record<string, number> = {};
    (rows || []).forEach((r) => { map[r.size] = r.quantity; });
    return map;
  });

