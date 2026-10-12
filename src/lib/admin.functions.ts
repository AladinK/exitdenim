import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ===== Product schemas =====
const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "samo mala slova, brojevi i crtice"),
  sku: z.string().min(1).max(60),
  name: z.string().min(1).max(160),
  category: z.enum(["jeans", "chino", "cargo"]),
  fit: z.enum(["Slim", "Regular Slim", "Relaxed", "Cargo"]),
  fabric: z.string().min(1).max(200),
  weight: z.string().min(1).max(40),
  sizes: z.array(z.string().min(1).max(8)).min(1),
  wholesale: z.number().nonnegative(),
  retail: z.number().nonnegative(),
  moq: z.number().int().nonnegative(),
  delivery: z.string().min(1).max(80),
  description: z.string().max(2000).nullable().optional(),
  color: z.string().min(1).max(60),
  image_url: z.string().max(500).nullable().optional(),
  gallery: z.array(z.string().min(1).max(500)).max(20).optional(),
  active: z.boolean(),
  sort_order: z.number().int(),
});

const stockSchema = z.object({
  productId: z.string().uuid(),
  entries: z.array(z.object({ size: z.string().min(1).max(8), quantity: z.number().int().nonnegative() })),
});


async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin role required.");
}

export const listPartners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const setPartnerStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      partnerId: z.string().uuid(),
      status: z.enum(["pending", "approved", "rejected"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    // Admin update bypasses the self-status-locking policy via the
    // "Admins update any profile" policy.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ status: data.status })
      .eq("id", data.partnerId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAllOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("orders")
      .select("*, order_items(*, products(sku, name, color))")
      .neq("status", "draft")
      .order("submitted_at", { ascending: false });
    if (error) throw new Error(error.message);
    const userIds = Array.from(new Set((data ?? []).map((o: any) => o.user_id).filter(Boolean)));
    let profilesById: Record<string, any> = {};
    if (userIds.length) {
      const { data: profs } = await context.supabase
        .from("profiles")
        .select("id, boutique_name, country, city, email")
        .in("id", userIds);
      profilesById = Object.fromEntries((profs ?? []).map((p: any) => [p.id, p]));
    }
    return (data ?? []).map((o: any) => ({ ...o, profiles: profilesById[o.user_id] ?? null }));
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      status: z.enum(["submitted", "confirmed", "shipped", "cancelled"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const [partners, pending, submitted, confirmed] = await Promise.all([
      sb.from("profiles").select("id", { count: "exact", head: true }),
      sb.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
      sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "submitted"),
      sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    ]);
    return {
      partners: partners.count ?? 0,
      pending: pending.count ?? 0,
      submitted: submitted.count ?? 0,
      confirmed: confirmed.count ?? 0,
    };
  });

// =========================================================================
// PRODUCTS / STOCK / IMAGES (admin)
// =========================================================================

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    // Wholesale column is not readable through the Data API by any role
    // except service_role; use the admin client after verifying admin.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const { data: stock } = await supabaseAdmin.from("stock").select("*");
    const stockBy: Record<string, Record<string, number>> = {};
    (stock || []).forEach((s: any) => {
      (stockBy[s.product_id] ||= {})[s.size] = s.quantity;
    });
    return (products || []).map((p: any) => ({ ...p, stock: stockBy[p.id] || {} }));
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = { ...data };
    if (!payload.id) delete (payload as any).id;
    // Use admin client so the returning `select('*')` can read the wholesale
    // column, which is revoked from all non-service_role roles.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .upsert(payload, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });


export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const upsertStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => stockSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const rows = data.entries.map((e) => ({
      product_id: data.productId,
      size: e.size,
      quantity: e.quantity,
    }));
    const { error } = await context.supabase
      .from("stock")
      .upsert(rows, { onConflict: "product_id,size" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Resolves a stored image reference (full URL or storage path inside the
 * `product-images` bucket) to a long-lived signed URL the browser can render.
 */
export const signProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ path: z.string().min(1).max(500) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (/^https?:\/\//i.test(data.path)) return { url: data.path };
    const { data: signed, error } = await context.supabase
      .storage.from("product-images")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

// ===== Retail (customer) orders =====
export const listAllCustomerOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("customer_orders")
      .select("*, customer_order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateCustomerOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("customer_orders")
      .update({ status: data.status })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);

    if (data.status !== "pending") {
      try {
        const { data: o } = await context.supabase
          .from("customer_orders")
          .select("order_number, customer_email, customer_name")
          .eq("id", data.orderId)
          .single();
        if (o?.customer_email) {
          const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
          await sendTemplateEmail("order-status", o.customer_email, {
            templateData: { name: o.customer_name, orderNumber: o.order_number, status: data.status },
            idempotencyKey: `order-status-${data.orderId}-${data.status}`,
          });
        }
      } catch (e) {
        console.error("Order status email error", e);
      }
    }
    return { ok: true };
  });


// ===== AI autofill for product form =====
export const aiFillProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ name: z.string().min(1).max(160), imagePath: z.string().max(500).nullable() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI nije podešen.");
    let imageUrl: string | null = null;
    if (data.imagePath) {
      if (/^https?:\/\//i.test(data.imagePath)) imageUrl = data.imagePath;
      else {
        const { data: s } = await context.supabase.storage.from("product-images").createSignedUrl(data.imagePath, 600);
        imageUrl = s?.signedUrl ?? null;
      }
    }
    const content: any[] = [{
      type: "text",
      text: `Naziv proizvoda: "${data.name}". Ti si copywriter za EXIT Denim, srpski brend muških farmerki. Na osnovu naziva${imageUrl ? " i fotografije" : ""} popuni podatke o proizvodu. Piši na srpskom latinicom, prirodno i premium, bez izmišljenih garancija. Opis 2-3 kratke rečenice o kroju, izgledu i nošenju.`,
    }];
    if (imageUrl) content.push({ type: "image_url", image_url: { url: imageUrl } });
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content }],
        tools: [{
          type: "function",
          function: {
            name: "fill_product",
            parameters: {
              type: "object",
              properties: {
                category: { type: "string", enum: ["jeans", "chino", "cargo"] },
                fit: { type: "string", enum: ["Slim", "Regular Slim", "Relaxed", "Bootcut", "Flare", "Cargo"] },
                color: { type: "string", description: "boja na srpskom, npr. Tamno plava, Crna, Bež" },
                fabric: { type: "string", description: "npr. 98% pamuk, 2% elastin, denim" },
                weight: { type: "string", description: "npr. 12 oz" },
                description: { type: "string" },
              },
              required: ["category", "fit", "color", "fabric", "weight", "description"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "fill_product" } },
      }),
    });
    if (res.status === 429) throw new Error("Previše zahteva, pokušaj za minut.");
    if (res.status === 402) throw new Error("Nema AI kredita u radnom prostoru.");
    if (!res.ok) throw new Error("AI greška: " + res.status);
    const j: any = await res.json();
    const args = j.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("AI nije vratio podatke.");
    return JSON.parse(args) as {
      category: "jeans" | "chino" | "cargo";
      fit: "Slim" | "Regular Slim" | "Relaxed" | "Bootcut" | "Flare" | "Cargo";
      color: string; fabric: string; weight: string; description: string;
    };
  });
