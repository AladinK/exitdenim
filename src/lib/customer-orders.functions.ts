import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BRAND } from "@/lib/brand";
import { isValidPhone, samePhone } from "@/lib/cart-helpers";
import { BUNDLE, bestDiscount } from "@/lib/discounts";

const itemSchema = z.object({
  productId: z.string().uuid(),
  size: z.string().min(1).max(8),
  quantity: z.number().int().min(1).max(20),
});

const contactSchema = z.object({
  // Email je opcion: kupci pouzećem često ga nemaju ili ne žele da ga daju; telefon je obavezan.
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .default("")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Email nije ispravan"),
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(40)
    .refine(isValidPhone, "Telefon nije ispravan. Upišite broj, na primer 064 123 4567."),
});

const shippingSchema = z.object({
  address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(80),
  postal: z.string().trim().max(12).default(""),
  country: z.string().trim().min(2).max(80).default("Srbija"),
});

const orderInput = z.object({
  items: z.array(itemSchema).min(1).max(20),
  contact: contactSchema,
  shipping: shippingSchema,
  note: z.string().trim().max(500).optional().nullable(),
  promo: z
    .object({ code: z.string().trim().min(4).max(40), pct: z.number().int() })
    .optional()
    .nullable(),
});

const FREE_SHIPPING_OVER = 0; // free shipping on all orders
const SHIPPING_FLAT = 0;

/**
 * Create a customer (retail) order. Works for guests and authenticated users.
 * Server recalculates prices from DB (never trusts client).
 */
export const createCustomerOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const { createPublicServerClient, supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const sb = createPublicServerClient();

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
    const [{ data: products, error: pErr }, { data: availability, error: sErr }] =
      await Promise.all([
        sb.from("products_public").select("id, sku, name, retail, sizes, active").in("id", ids),
        sb.rpc("get_stock_availability"),
      ]);
    if (pErr) throw new Error(pErr.message);
    // Stanje se proverava i na serveru: korpa na telefonu kupca može biti stara danima.
    // Ako sama provera stanja ne uspe, porudžbinu ne odbijamo zbog toga.
    if (sErr) console.error("[porudžbina] provera stanja nije uspela:", sErr.message);
    const inStock = sErr
      ? null
      : new Set(
          (availability ?? []).filter((s) => s.in_stock).map((s) => `${s.product_id}:${s.size}`),
        );

    let subtotal = 0;
    const items = data.items.map((i) => {
      const p = products?.find((x) => x.id === i.productId);
      if (!p || !p.active) throw new Error(`Artikal nije dostupan (${i.productId})`);
      if (!p.sizes?.includes(i.size))
        throw new Error(`Veličina ${i.size} nije dostupna za ${p.name}`);
      if (inStock && !inStock.has(`${p.id}:${i.size}`)) {
        throw new Error(
          `Veličina ${i.size} za model ${p.name} je u međuvremenu rasprodata. Uklonite je iz korpe ili izaberite drugu veličinu.`,
        );
      }
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
    // Popust se računa ovde, ne veruje se korpi: veći od količinskog (2+ komada) i
    // točka sreće (samo 5/10/15%); ne sabiraju se.
    const pieces = items.reduce((s, it) => s + it.quantity, 0);
    const best = bestDiscount(subtotal, pieces, data.promo?.pct ?? 0);
    const pct = best.pct;
    const discount = best.amount;
    const promoCode =
      best.source === "wheel" ? data.promo!.code : best.source === "bundle" ? BUNDLE.code : null;
    const total = subtotal - discount + shipping_cost;

    // Use admin client for the write path: everything is validated & priced server-side.
    // This avoids RLS EXISTS-subquery blocking guests from inserting order items.
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
        shipping_country: data.shipping.country || "Srbija",
        shipping_method: "courier",
        shipping_cost,
        subtotal,
        discount,
        promo_code: promoCode,
        promo_pct: pct,
        total,
        payment_method: "cod",
        status: "pending",
        note: data.note || null,
      })
      .select("id, order_number")
      .single();
    if (oErr || !order) throw new Error(oErr?.message || "Greška pri kreiranju porudžbine");

    const { error: iErr } = await insertClient
      .from("customer_order_items")
      .insert(items.map((it) => ({ ...it, order_id: order.id })));
    if (iErr) throw new Error(iErr.message);

    // Obaveštenja idu paralelno i nikad ne obaraju porudžbinu: ona je već upisana.
    // Vlasnik dobija Telegram poruku i e-mail (dva kanala, da nijedna ne promakne),
    // kupac potvrdu na e-mail.
    const fullAddress = `${data.shipping.address}, ${data.shipping.postal} ${data.shipping.city}`;
    const [{ notifyOrderTelegram }, { sendTemplateEmail }] = await Promise.all([
      import("./telegram.server"),
      import("@/lib/email-templates/send-email"),
    ]);
    const outcomes = await Promise.allSettled([
      notifyOrderTelegram({
        orderNumber: order.order_number,
        name: data.contact.name,
        phone: data.contact.phone,
        email: data.contact.email,
        address: data.shipping.address,
        city: data.shipping.city,
        postal: data.shipping.postal,
        items,
        shipping: shipping_cost,
        discount,
        promoCode,
        total,
        note: data.note,
      }),
      sendTemplateEmail("order-notification", process.env.ORDER_NOTIFY_EMAIL || BRAND.email, {
        templateData: {
          orderNumber: order.order_number,
          name: data.contact.name,
          phone: data.contact.phone,
          email: data.contact.email,
          address: fullAddress,
          items,
          discount,
          promoCode,
          total,
          note: data.note,
        },
        idempotencyKey: `order-notification-${order.id}`,
        replyTo: data.contact.email || undefined,
      }),
      // Potvrda kupcu ide samo ako je upisao email.
      data.contact.email
        ? sendTemplateEmail("order-confirmation", data.contact.email, {
            templateData: {
              name: data.contact.name,
              orderNumber: order.order_number,
              items,
              subtotal,
              shipping: shipping_cost,
              discount,
              promoCode,
              total,
              address: fullAddress,
            },
            idempotencyKey: `order-confirmation-${order.id}`,
          })
        : Promise.resolve({ sent: false, skipped: true }),
    ]);
    outcomes.forEach((outcome, index) => {
      if (outcome.status === "rejected") {
        console.error(
          `[porudžbina ${order.order_number}] obaveštenje ${index + 1}/3 nije poslato:`,
          outcome.reason,
        );
      }
    });
    const ownerNotified =
      (outcomes[0].status === "fulfilled" && outcomes[0].value === true) ||
      (outcomes[1].status === "fulfilled" && outcomes[1].value.sent);
    if (!ownerNotified) {
      console.error(
        `[porudžbina ${order.order_number}] VLASNIK NIJE OBAVEŠTEN: podesite TELEGRAM_BOT_TOKEN ili RESEND_API_KEY.`,
      );
    }

    return { orderNumber: order.order_number, id: order.id, subtotal, shipping_cost, total };
  });

/** Authenticated user's own retail order history */
export const listMyCustomerOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("customer_orders")
      .select(
        "id, order_number, status, total, subtotal, shipping_cost, created_at, customer_order_items(id, product_name, product_sku, size, quantity, unit_price)",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/**
 * Javni pregled porudžbine: broj porudžbine i email ili telefon kojim je poručeno
 * (gost bez naloga). Bez oba podatka porudžbina se ne prikazuje.
 */
export const lookupCustomerOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        orderNumber: z.string().trim().min(4).max(40),
        email: z.string().trim().email().max(255).optional(),
        phone: z.string().trim().min(6).max(40).optional(),
      })
      .refine((v) => !!v.email || !!v.phone, "Potreban je email ili telefon")
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("customer_orders")
      .select(
        "id, order_number, status, total, subtotal, discount, promo_code, shipping_cost, shipping_address, shipping_city, shipping_postal, shipping_country, customer_name, customer_email, customer_phone, created_at, customer_order_items(id, product_name, product_sku, size, quantity, unit_price)",
      )
      .eq("order_number", data.orderNumber)
      .limit(5);
    if (error) throw new Error(error.message);
    const email = data.email?.toLowerCase();
    const match = (rows ?? []).find((o) =>
      email
        ? (o.customer_email ?? "").trim().toLowerCase() === email
        : samePhone(o.customer_phone ?? "", data.phone ?? ""),
    );
    if (!match) return null;
    // Email i telefon kupca se ne vraćaju u pregledač.
    const { customer_email: _e, customer_phone: _p, ...order } = match;
    return order;
  });
