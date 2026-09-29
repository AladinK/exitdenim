import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertApproved(context: any) {
  const { data: profile } = await context.supabase
    .from("profiles").select("status").eq("id", context.userId).maybeSingle();
  const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!isAdmin && profile?.status !== "approved") throw new Error("Samo za odobrene B2B partnere.");
}

export const getB2BSpecs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ productId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertApproved(context);
    const { data: row, error } = await context.supabase
      .from("products")
      .select("fabric_oz, composition, wash_finish, pack_distribution, moq, delivery")
      .eq("id", data.productId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row as null | {
      fabric_oz: number | null; composition: string | null; wash_finish: string | null;
      pack_distribution: Record<string, number> | null; moq: number; delivery: string;
    };
  });

export const requestSample = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ productId: z.string().uuid(), size: z.string().min(1).max(10), note: z.string().max(500).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertApproved(context);
    const { error } = await context.supabase.from("sample_requests").insert({
      user_id: context.userId, product_id: data.productId, size: data.size, note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
