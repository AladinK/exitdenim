// Obaveštenja vlasniku o novim porudžbinama, direktno preko Telegram Bot API-ja.
//
//   TELEGRAM_BOT_TOKEN — token bota (@BotFather → /mybots → API Token)
//   TELEGRAM_CHAT_ID   — opciono; podrazumevano privatni razgovor vlasnika sa botom
//
// Bez tokena se obaveštenje preskače; porudžbina se uvek upisuje u bazu.

// Privatni razgovor vlasnika sa @exitdenimbot.
const OWNER_CHAT_ID = 1149811950;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function telegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN);
}

export async function sendOwnerTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;
  const chatId = process.env.TELEGRAM_CHAT_ID || OWNER_CHAT_ID;
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      console.error(`[telegram] sendMessage ${response.status}: ${await response.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[telegram] poruka nije poslata:", error);
    return false;
  }
}

export type OrderNotice = {
  orderNumber: string | number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  items: { product_name: string; size: string; quantity: number; unit_price: number }[];
  shipping: number;
  discount?: number;
  promoCode?: string | null;
  total: number;
  note?: string | null;
};

export function formatOrderNotice(o: OrderNotice): string {
  const lines = o.items
    .map(
      (i) => `• ${esc(i.product_name)} — vel. ${esc(i.size)} × ${i.quantity} (${i.unit_price} din)`,
    )
    .join("\n");
  return (
    `🛒 <b>Nova porudžbina #${esc(String(o.orderNumber))}</b>\n\n${lines}\n\n` +
    `Dostava: ${o.shipping} din\n` +
    (o.discount && o.discount > 0
      ? `🎡 Točak sreće ${esc(o.promoCode || "")}: −${o.discount} din\n`
      : "") +
    `<b>Ukupno: ${o.total} din</b> (pouzećem)\n\n` +
    `👤 ${esc(o.name)}\n📞 ${esc(o.phone)}\n✉️ ${esc(o.email)}\n` +
    `📍 ${esc(o.address)}, ${esc(o.postal)} ${esc(o.city)}` +
    (o.note ? `\n📝 ${esc(o.note)}` : "")
  );
}

export async function notifyOrderTelegram(order: OrderNotice): Promise<boolean> {
  return sendOwnerTelegram(formatOrderNotice(order));
}
