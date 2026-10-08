const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

function headers() {
  return {
    Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": process.env.TELEGRAM_API_KEY!,
    "Content-Type": "application/json",
  };
}

async function resolveChatId(): Promise<string | number | null> {
  if (process.env.TELEGRAM_CHAT_ID) return process.env.TELEGRAM_CHAT_ID;
  const r = await fetch(`${GATEWAY_URL}/getUpdates`, { method: "POST", headers: headers(), body: "{}" });
  if (!r.ok) {
    console.error(`Telegram getUpdates failed [${r.status}]: ${await r.text()}`);
    return null;
  }
  const j = (await r.json()) as { result?: Array<{ message?: { chat?: { id: number; type: string } } }> };
  const chats = (j.result ?? []).map((u) => u.message?.chat).filter((c) => c && c.type === "private");
  return chats.length ? chats[chats.length - 1]!.id : null;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function notifyOrderTelegram(o: {
  orderNumber: string | number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  items: { product_name: string; size: string; quantity: number; unit_price: number }[];
  shipping: number;
  total: number;
  note?: string | null;
}) {
  if (!process.env.LOVABLE_API_KEY || !process.env.TELEGRAM_API_KEY) return;
  const chatId = await resolveChatId();
  if (!chatId) {
    console.error("Telegram: no chat found — send /start to the bot first.");
    return;
  }
  const lines = o.items.map((i) => `• ${esc(i.product_name)} — vel. ${esc(i.size)} × ${i.quantity} (${i.unit_price} din)`).join("\n");
  const text =
    `🛒 <b>Nova porudžbina #${o.orderNumber}</b>\n\n${lines}\n\n` +
    `Dostava: ${o.shipping} din\n<b>Ukupno: ${o.total} din</b> (pouzećem)\n\n` +
    `👤 ${esc(o.name)}\n📞 ${esc(o.phone)}\n✉️ ${esc(o.email)}\n📍 ${esc(o.address)}, ${esc(o.postal)} ${esc(o.city)}` +
    (o.note ? `\n📝 ${esc(o.note)}` : "");
  const r = await fetch(`${GATEWAY_URL}/sendMessage`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  if (!r.ok) console.error(`Telegram sendMessage failed [${r.status}]: ${await r.text()}`);
}
