import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/**
 * Proizvod kako ga vidi prodavnica. Veleprodajna cena i B2B specifikacije nisu deo
 * javnog pogleda; odobreni partneri ih dobijaju posebnim pozivom (getWholesalePrices).
 */
export type ProductWithStock = Omit<
  ProductRow,
  "wholesale" | "fabric_oz" | "composition" | "wash_finish" | "pack_distribution"
> & {
  stock: Record<string, number>;
  wholesale?: number;
};

/**
 * live  — podaci su upravo pročitani iz baze
 * stale — baza ne odgovara; prikazan je poslednji zapamćeni katalog
 * down  — baza ne odgovara i nema zapamćenog kataloga
 */
export type CatalogState = "live" | "stale" | "down";
export type Catalog = { products: ProductWithStock[]; state: CatalogState };
export type ProductResult = { product: ProductWithStock | null; state: CatalogState };

const CATALOG_KEY = "catalog";
const isStoragePath = (url: string | null | undefined): url is string =>
  !!url && !/^https?:\/\//i.test(url) && !url.startsWith("/");

async function serverClients() {
  return import("@/integrations/supabase/client.server");
}

/**
 * Potpisuje putanje iz privatnog skladišta jednim zahtevom. Ako potpisivanje ne uspe
 * (npr. nije podešen SUPABASE_SERVICE_ROLE_KEY), katalog se i dalje prikazuje, samo
 * bez tih fotografija; greška ostaje u logu servera.
 */
async function signProductImages(paths: string[]): Promise<Record<string, string>> {
  const signed: Record<string, string> = {};
  if (!paths.length) return signed;
  try {
    const { supabaseAdmin } = await serverClients();
    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrls(paths, 60 * 60 * 24 * 7);
    if (error) throw new Error(error.message);
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) signed[item.path] = item.signedUrl;
    }
  } catch (error) {
    console.error("[katalog] fotografije nisu potpisane:", error);
  }
  return signed;
}

function stockByProduct(
  rows: { product_id: string; size: string; in_stock: boolean }[] | null,
): Record<string, Record<string, number>> {
  // Javno se izlaže samo 1/0 po veličini, nikad tačne količine.
  const map: Record<string, Record<string, number>> = {};
  for (const row of rows ?? []) {
    if (!row.product_id) continue;
    (map[row.product_id] ??= {})[row.size] = row.in_stock ? 1 : 0;
  }
  return map;
}

async function readCatalog(): Promise<ProductWithStock[]> {
  const { createPublicServerClient } = await serverClients();
  const sb = createPublicServerClient();
  const [products, availability] = await Promise.all([
    sb.from("products_public").select("*").eq("active", true).order("sort_order", { ascending: true }),
    sb.rpc("get_stock_availability"),
  ]);
  if (products.error) throw new Error(products.error.message);
  if (availability.error) throw new Error(availability.error.message);

  const list = products.data ?? [];
  const stock = stockByProduct(availability.data);
  const signed = await signProductImages([
    ...new Set(list.map((p) => p.image_url).filter(isStoragePath)),
  ]);

  return list.map((p) => ({
    ...p,
    on_sale: Boolean(p.on_sale),
    gallery: p.gallery ?? [],
    image_url: isStoragePath(p.image_url) ? (signed[p.image_url] ?? null) : (p.image_url ?? null),
    stock: (p.id && stock[p.id]) || {},
  })) as ProductWithStock[];
}

async function readProduct(slug: string): Promise<ProductWithStock | null> {
  const { createPublicServerClient } = await serverClients();
  const sb = createPublicServerClient();
  const [found, availability] = await Promise.all([
    sb.from("products_public").select("*").eq("slug", slug).eq("active", true).maybeSingle(),
    sb.rpc("get_stock_availability"),
  ]);
  if (found.error) throw new Error(found.error.message);
  if (availability.error) throw new Error(availability.error.message);
  const product = found.data;
  if (!product) return null;

  const stock: Record<string, number> = {};
  for (const row of availability.data ?? []) {
    if (row.product_id === product.id) stock[row.size] = row.in_stock ? 1 : 0;
  }
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.filter((g): g is string => typeof g === "string")
    : [];
  const signed = await signProductImages([
    ...new Set([product.image_url, ...gallery].filter(isStoragePath)),
  ]);
  const resolve = (url: string | null) =>
    isStoragePath(url) ? (signed[url] ?? null) : (url ?? null);

  return {
    ...product,
    on_sale: Boolean(product.on_sale),
    image_url: resolve(product.image_url),
    gallery: gallery.map(resolve).filter((url): url is string => !!url),
    stock,
  } as ProductWithStock;
}

/** Javni katalog. Nikad ne baca grešku: ispad baze se vraća kao stanje. */
export const listProducts = createServerFn({ method: "GET" }).handler(async (): Promise<Catalog> => {
  const { rememberSnapshot, recallSnapshot, guarded, BackendCoolingDownError } = await import(
    "./catalog-snapshot.server"
  );
  try {
    const products = await guarded(CATALOG_KEY, readCatalog);
    rememberSnapshot(CATALOG_KEY, products);
    return { products, state: "live" };
  } catch (error) {
    if (!(error instanceof BackendCoolingDownError)) console.error("[katalog] baza nije dostupna:", error);
    const snapshot = recallSnapshot<ProductWithStock[]>(CATALOG_KEY);
    return snapshot ? { products: snapshot, state: "stale" } : { products: [], state: "down" };
  }
});

/** Jedan proizvod. `product: null` uz stanje "live" znači da model zaista ne postoji. */
export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }): Promise<ProductResult> => {
    const { recallSnapshot, guarded, BackendCoolingDownError } = await import("./catalog-snapshot.server");
    try {
      return { product: await guarded(CATALOG_KEY, () => readProduct(data.slug)), state: "live" };
    } catch (error) {
      if (!(error instanceof BackendCoolingDownError)) {
        console.error(`[katalog] proizvod "${data.slug}" nije učitan:`, error);
      }
      const snapshot = recallSnapshot<ProductWithStock[]>(CATALOG_KEY);
      const product = snapshot?.find((p) => p.slug === data.slug) ?? null;
      return { product, state: product ? "stale" : "down" };
    }
  });

async function assertApprovedPartner(context: {
  supabase: SupabaseClient<Database>;
  userId: string;
}) {
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
}

// Prijavljeni partneri: tačne količine po veličini za jedan proizvod.
export const getStockQuantities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ productId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertApprovedPartner(context);
    const { data: rows, error } = await context.supabase
      .from("stock")
      .select("size, quantity")
      .eq("product_id", data.productId);
    if (error) throw new Error(error.message);
    const map: Record<string, number> = {};
    (rows || []).forEach((r) => {
      map[r.size] = r.quantity;
    });
    return map;
  });

// Prijavljeni partneri: veleprodajne cene (EUR) po proizvodu. Kolona `wholesale` nije
// čitljiva kroz javni API, pa se čita serverskim ključem tek posle provere odobrenja.
export const getWholesalePrices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertApprovedPartner(context);
    const { supabaseAdmin } = await serverClients();
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, wholesale")
      .eq("active", true);
    if (error) throw new Error(error.message);
    const prices: Record<string, number> = {};
    for (const row of data ?? []) prices[row.id] = Number(row.wholesale);
    return prices;
  });
