import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/** Returns current user's profile + role flags */
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const isAdmin = (roles || []).some((r) => r.role === "admin");
    return { profile, isAdmin };
  });

/** Get or create the active draft order for current user */
export const getMyDraftOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    let { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*, products(sku, name, image_url, color))")
      .eq("user_id", userId)
      .eq("status", "draft")
      .maybeSingle();
    if (!order) {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({ user_id: userId })
        .select("*, order_items(*, products(sku, name, image_url, color))")
        .single();
      if (error) throw new Error(error.message);
      order = newOrder;
    }
    return order;
  });

/** Add or update line item(s) from a size matrix (product + sizes -> qty) */
export const addToOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      productId: z.string().uuid(),
      sizes: z.record(z.string(), z.number().int().min(0)),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify partner is approved
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.status !== "approved") {
      throw new Error("Tvoj B2B nalog još nije odobren.");
    }

    // Load product wholesale price
    const { data: product, error: pErr } = await supabase
      .from("products")
      .select("id, wholesale, moq")
      .eq("id", data.productId)
      .maybeSingle();
    if (pErr || !product) throw new Error("Proizvod nije pronađen.");

    const total = Object.values(data.sizes).reduce((a, b) => a + b, 0);
    if (total < product.moq) {
      throw new Error(`Minimalna količina za ovaj artikal je ${product.moq} komada.`);
    }

    // Get / create draft order
    let { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "draft")
      .maybeSingle();
    if (!order) {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({ user_id: userId })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      order = newOrder;
    }

    // Remove existing items for this product, then insert fresh ones
    await supabase.from("order_items").delete().eq("order_id", order.id).eq("product_id", data.productId);

    const rows = Object.entries(data.sizes)
      .filter(([, qty]) => qty > 0)
      .map(([size, qty]) => ({
        order_id: order!.id,
        product_id: data.productId,
        size,
        quantity: qty,
        unit_price: product.wholesale,
      }));
    if (rows.length) {
      const { error: iErr } = await supabase.from("order_items").insert(rows);
      if (iErr) throw new Error(iErr.message);
    }
    return { ok: true, orderId: order.id };
  });

export const removeOrderItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ itemId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("order_items").delete().eq("id", data.itemId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ orderId: z.string().uuid(), note: z.string().max(2000).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: order } = await supabase
      .from("orders")
      .select("id, total_pieces")
      .eq("id", data.orderId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!order) throw new Error("Narudžba nije pronađena.");
    if (order.total_pieces === 0) throw new Error("Narudžba je prazna.");
    const { error } = await supabase
      .from("orders")
      .update({ status: "submitted", note: data.note, submitted_at: new Date().toISOString() })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("*, order_items(quantity)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });
