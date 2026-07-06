import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
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

function publicClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function signIfPath(sb: any, value: string): Promise<string> {
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  const { data } = await sb.storage.from("site-assets").createSignedUrl(value, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? value;
}

/** Public — returns map of key -> resolved URL (signed for private storage paths). */
export const getHomeAssets = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb.from("site_assets").select("key,url,alt");
  if (error) throw new Error(error.message);
  const out: Record<string, { url: string; alt: string | null }> = {};
  await Promise.all(
    (data ?? []).map(async (r: any) => {
      out[r.key] = { url: await signIfPath(sb, r.url), alt: r.alt };
    }),
  );
  return out;
});

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
        const signed = await signIfPath(context.supabase, r.url);
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
