import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const itemSchema = z.object({
  productId: z.string().uuid(),
  size: z.string().min(1).max(8),
  quantity: z.number().int().min(1).max(20),
});

const contactSchema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
});

const shippingSchema = z.object({
  address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(80),
  postal: z.string().trim().min(3).max(12),
  country: z.string().trim().min(2).max(80).default("Србија"),
});

const orderInput = z.object({
  items: z.array(itemSchema).min(1).max(20),
  contact: contactSchema,
  shipping: shippingSchema,
  note: z.string().trim().max(500).optional().nullable(),
});

const FREE_SHIPPING_OVER = 15000;
const SHIPPING_FLAT = 500;

/**
 * Create a customer (retail) order. Works for guests and authenticated users.
 * Server recalculates prices from DB (never trusts client).
 */
export const createCustomerOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();

    // Try to read authenticated user from bearer, if any
    let userId: string | null = null;
    try {
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      const auth = getRequestHeader("authorization");
      if (auth?.startsWith("Bearer ")) {
        const token = auth.slice(7);
        const { data: u } = await sb.auth.getUser(token);
        userId = u.user?.id ?? null;
      }
    } catch {}

    const ids = Array.from(new Set(data.items.map((i) => i.productId)));
    const { data: products, error: pErr } = await sb
      .from("products_public")
      .select("id, sku, name, retail, sizes, active")
      .in("id", ids);
    if (pErr) throw new Error(pErr.message);

    let subtotal = 0;
    const items = data.items.map((i) => {
      const p = products?.find((x) => x.id === i.productId);
      if (!p || !p.active) throw new Error(`Артикал није доступан (${i.productId})`);
      if (!p.sizes?.includes(i.size)) throw new Error(`Величина ${i.size} није доступна за ${p.name}`);
      const price = Number(p.retail);
      subtotal += price * i.quantity;
      return {
        product_id: p.id!,
        product_name: p.name!,
        product_sku: p.sku!,
        size: i.size,
        quantity: i.quantity,
        unit_price: price,
      };
    });

    const shipping_cost = subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    const total = subtotal + shipping_cost;

    // Use admin client for the write path: everything is validated & priced server-side.
    // This avoids RLS EXISTS-subquery blocking guests from inserting order items.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const insertClient = supabaseAdmin;


    const { data: order, error: oErr } = await insertClient
      .from("customer_orders")
      .insert({
        user_id: userId,
        customer_email: data.contact.email,
        customer_name: data.contact.name,
        customer_phone: data.contact.phone,
        shipping_address: data.shipping.address,
        shipping_city: data.shipping.city,
        shipping_postal: data.shipping.postal,
        shipping_country: data.shipping.country || "Србија",
        shipping_method: "courier",
        shipping_cost,
        subtotal,
        total,
        payment_method: "cod",
        status: "pending",
        note: data.note || null,
      })
      .select("id, order_number")
      .single();
    if (oErr || !order) throw new Error(oErr?.message || "Грешка при креирању поруџбине");

    const { error: iErr } = await insertClient
      .from("customer_order_items")
      .insert(items.map((it) => ({ ...it, order_id: order.id })));
    if (iErr) throw new Error(iErr.message);

    return { orderNumber: order.order_number, id: order.id, subtotal, shipping_cost, total };
  });

/** Authenticated user's own retail order history */
export const listMyCustomerOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("customer_orders")
      .select("id, order_number, status, total, subtotal, shipping_cost, created_at, customer_order_items(id, product_name, product_sku, size, quantity, unit_price)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Public lookup by order number + email (for guest tracking) */
export const lookupCustomerOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ orderNumber: z.string().trim().min(4).max(40), email: z.string().trim().email() }).parse(d))
  .handler(async ({ data }) => {
    // Use admin only to look up by email+number combination (safe: requires both).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("customer_orders")
      .select("id, order_number, status, total, subtotal, shipping_cost, shipping_address, shipping_city, shipping_postal, shipping_country, customer_name, created_at, customer_order_items(id, product_name, product_sku, size, quantity, unit_price)")
      .eq("order_number", data.orderNumber)
      .eq("customer_email", data.email)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return order;
  });
