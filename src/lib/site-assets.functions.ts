import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const HOME_ASSET_KEYS = [
  "hero",
  "hero_texture",
  "lookbook",
  "workshop",
  "category_jeans",
  "category_chino",
  "category_cargo",
  "logo",
  "seal",
  "page_proizvodnja",
] as const;
export type HomeAssetKey = (typeof HOME_ASSET_KEYS)[number];

// Reads and signed URLs go through the privileged server client so the
// site_assets table and site-assets bucket need no public/anon read policy.
async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function signIfPath(value: string): Promise<string> {
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  const sb = await adminClient();
  const { data } = await sb.storage.from("site-assets").createSignedUrl(value, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? value;
}

export type SiteAssets = Record<string, { url: string; alt: string | null }>;

async function readHomeAssets(): Promise<SiteAssets> {
  const sb = await adminClient();
  const { data, error } = await sb.from("site_assets").select("key,url,alt");
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const paths = [
    ...new Set(
      rows.map((r) => r.url).filter((url) => !/^https?:\/\//i.test(url) && !url.startsWith("/")),
    ),
  ];
  const signed: Record<string, string> = {};
  if (paths.length) {
    const { data: urls, error: signingError } = await sb.storage
      .from("site-assets")
      .createSignedUrls(paths, 60 * 60 * 24 * 7);
    if (signingError) throw new Error(signingError.message);
    for (const item of urls ?? []) {
      if (item.path && item.signedUrl) signed[item.path] = item.signedUrl;
    }
  }
  const out: SiteAssets = {};
  for (const row of rows) out[row.key] = { url: signed[row.url] ?? row.url, alt: row.alt };
  return out;
}

/**
 * Javno — mapa ključ -> adresa slike (potpisana za privatne putanje).
 * Nikad ne baca grešku: bez baze vraća poslednje zapamćene slike ili praznu mapu,
 * a komponente tada koriste fotografije iz public/media/.
 */
export const getHomeAssets = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteAssets> => {
    const { rememberSnapshot, recallSnapshot, guarded, BackendCoolingDownError } = await import(
      "./catalog-snapshot.server"
    );
    try {
      const assets = await guarded("home-assets", readHomeAssets);
      rememberSnapshot("home-assets", assets);
      return assets;
    } catch (error) {
      if (!(error instanceof BackendCoolingDownError)) console.error("[slike sajta] baza nije dostupna:", error);
      return recallSnapshot<SiteAssets>("home-assets") ?? {};
    }
  },
);

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin only.");
}

export const adminListSiteAssets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase.from("site_assets").select("*");
    if (error) throw new Error(error.message);
    const map: Record<string, { url: string; alt: string | null; signed: string }> = {};
    await Promise.all(
      (data ?? []).map(async (r: any) => {
        const signed = await signIfPath(r.url);
        map[r.key] = { url: r.url, alt: r.alt, signed };
      }),
    );
    return map;
  });

export const upsertSiteAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      key: z.enum(HOME_ASSET_KEYS),
      url: z.string().min(1).max(500),
      alt: z.string().max(200).nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("site_assets")
      .upsert(
        { key: data.key, url: data.url, alt: data.alt ?? null, updated_by: context.userId, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSiteAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ key: z.enum(HOME_ASSET_KEYS) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("site_assets").delete().eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
