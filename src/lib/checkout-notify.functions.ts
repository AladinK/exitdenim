import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  items: z.array(z.object({ name: z.string().max(120), size: z.string().max(10).nullable(), qty: z.number().int().min(1).max(50) })).max(20),
  value: z.number().min(0).max(10_000_000),
  device: z.enum(["telefon", "računar"]),
});

export const notifyCheckoutStarted = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const { sendOwnerTelegram } = await import("./telegram.server");
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const lines = data.items.map((i) => `• ${esc(i.name)}${i.size ? ` — vel. ${esc(i.size)}` : ""} × ${i.qty}`).join("\n");
    await sendOwnerTelegram(`🧾 <b>Neko je započeo kupovinu</b> (${data.device})\n\n${lines}\n\n<b>Vrednost: ${data.value} din</b>`);
    return { ok: true };
  });
