import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/**
 * Generate a B2B line-sheet PDF for a single SKU. Wholesale prices and
 * exact per-size stock counts are business-sensitive, so this endpoint is
 * restricted to approved partners and admins. The bytes are returned as a
 * base64 string so the caller can build a blob download in the browser.
 */
export const generateLineSheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ sku: z.string().min(1).max(60) }).parse(d))
  .handler(async ({ data, context }) => {
    // AuthZ: approved partner OR admin.
    const [{ data: profile }, { data: isAdmin }] = await Promise.all([
      context.supabase.from("profiles").select("status").eq("id", context.userId).maybeSingle(),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    ]);
    if (!isAdmin && profile?.status !== "approved") {
      throw new Error("Forbidden: approved B2B partner required.");
    }

    // Load data with the admin client (bypasses RLS/column revokes) now that
    // we've verified the caller is entitled to see wholesale + stock.
    const [{ PDFDocument, StandardFonts, rgb }, { supabaseAdmin }] = await Promise.all([
      import("pdf-lib"),
      import("@/integrations/supabase/client.server"),
    ]);
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("sku", data.sku)
      .maybeSingle();
    if (!product) throw new Error("Not found");
    const { data: stock } = await supabaseAdmin
      .from("stock")
      .select("size, quantity")
      .eq("product_id", product.id);

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const reg = await pdf.embedFont(StandardFonts.Helvetica);
    const ink = rgb(0.07, 0.08, 0.12);
    const muted = rgb(0.45, 0.45, 0.5);
    const olive = rgb(0.5, 0.62, 0.32);

    page.drawText("EXIT DENIM", { x: 40, y: 790, size: 22, font: bold, color: ink });
    page.drawText("B2B LINE SHEET · NOVI PAZAR, SRBIJA", { x: 40, y: 772, size: 8, font: reg, color: muted });
    page.drawRectangle({ x: 40, y: 766, width: 515, height: 1, color: ink });

    let imageY = 480;
    if (product.image_url) {
      try {
        const imgUrl = product.image_url.startsWith("http")
          ? product.image_url
          : `https://project--${process.env.SUPABASE_PROJECT_ID ?? "alsgwxcoicrvmqtqqrqj"}.lovable.app${product.image_url}`;
        const res = await fetch(imgUrl);
        if (res.ok) {
          const buf = new Uint8Array(await res.arrayBuffer());
          const img = await pdf.embedJpg(buf).catch(() => pdf.embedPng(buf));
          const dims = img.scale(0.18);
          page.drawImage(img, { x: 40, y: imageY, width: 240, height: 240 * (dims.height / dims.width) });
        }
      } catch { /* skip image on failure */ }
    }

    page.drawText(product.sku, { x: 310, y: 720, size: 10, font: reg, color: muted });
    page.drawText(product.name, { x: 310, y: 700, size: 18, font: bold, color: ink });
    page.drawText(product.color, { x: 310, y: 678, size: 12, font: reg, color: olive });

    const specs: [string, string][] = [
      ["FIT", product.fit],
      ["TKANINA", product.fabric],
      ["TEZINA", product.weight],
      ["VELICINE", product.sizes.join(", ")],
      ["MOQ", `${product.moq} kom`],
      ["ISPORUKA", product.delivery],
    ];
    let y = 640;
    specs.forEach(([k, v]) => {
      page.drawText(k, { x: 310, y, size: 7, font: bold, color: muted });
      page.drawText(v, { x: 310, y: y - 12, size: 10, font: reg, color: ink });
      y -= 28;
    });

    page.drawText("VELEPRODAJA", { x: 310, y: 460, size: 7, font: bold, color: muted });
    page.drawText(`EUR ${Number(product.wholesale).toFixed(2)}`, { x: 310, y: 444, size: 16, font: bold, color: ink });
    page.drawText("PREPORUCENA MALOPRODAJA", { x: 430, y: 460, size: 7, font: bold, color: muted });
    page.drawText(`RSD ${Number(product.retail).toLocaleString("sr-RS")}`, { x: 430, y: 444, size: 12, font: reg, color: ink });

    page.drawText("STOCK PO VELICINI", { x: 40, y: 430, size: 8, font: bold, color: muted });
    const cellW = 70;
    product.sizes.forEach((s: string, i: number) => {
      const x = 40 + i * cellW;
      page.drawRectangle({ x, y: 380, width: cellW - 4, height: 36, borderColor: ink, borderWidth: 0.5 });
      page.drawText(s, { x: x + 8, y: 402, size: 9, font: bold, color: ink });
      const qty = stock?.find((r) => r.size === s)?.quantity ?? 0;
      page.drawText(`${qty} kom`, { x: x + 8, y: 388, size: 9, font: reg, color: muted });
    });

    if (product.description) {
      const desc = String(product.description);
      page.drawText("OPIS", { x: 40, y: 350, size: 8, font: bold, color: muted });
      const words = desc.split(/\s+/);
      let line = "";
      let dy = 336;
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (reg.widthOfTextAtSize(test, 9) > 515) {
          page.drawText(line, { x: 40, y: dy, size: 9, font: reg, color: ink });
          line = w;
          dy -= 14;
        } else {
          line = test;
        }
      }
      if (line) page.drawText(line, { x: 40, y: dy, size: 9, font: reg, color: ink });
    }

    page.drawRectangle({ x: 40, y: 50, width: 515, height: 1, color: ink });
    page.drawText("EXIT Denim — TRI-B DOO · Bekim Kurtanovic · +381 65 370 1701 · @exit.denim · Made in Serbia", { x: 40, y: 36, size: 8, font: reg, color: muted });
    page.drawText(new Date().toLocaleDateString("sr-RS"), { x: 510, y: 36, size: 8, font: reg, color: muted });

    const bytes = await pdf.save();
    // Base64 keeps the payload JSON-safe for the server-fn response envelope.
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64");
    return { sku: data.sku, pdfBase64: base64 };
  });
