import { createFileRoute } from "@tanstack/react-router";

// Provera obaveštenja o porudžbinama, bez slanja poruke i bez otkrivanja ključeva:
//   /api/status-obavestenja
// Telegram: da li je token podešen, koji je bot i da li bot može da piše vlasniku
// (vlasnik mora bar jednom da pritisne Start kod tog bota). E-mail: da li je Resend podešen.

const OWNER_CHAT_ID = 1149811950;
let lastRun = 0;
let lastResult: unknown = null;

async function telegramStatus() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return { podesen: false, poruka: "TELEGRAM_BOT_TOKEN nije podešen na hostingu." };
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || String(OWNER_CHAT_ID);
  const call = async (method: string, body?: Record<string, unknown>) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(8_000),
    });
    return (await res.json().catch(() => ({ ok: false, description: `HTTP ${res.status}` }))) as {
      ok: boolean;
      description?: string;
      result?: Record<string, unknown>;
    };
  };
  try {
    const me = await call("getMe");
    if (!me.ok) return { podesen: true, tokenIspravan: false, greska: me.description };
    const chat = await call("getChat", { chat_id: chatId });
    return {
      podesen: true,
      tokenIspravan: true,
      bot: me.result?.username ? `@${me.result.username}` : null,
      vlasnikDostupan: chat.ok,
      greska: chat.ok ? undefined : chat.description,
      savet: chat.ok
        ? undefined
        : "Vlasnik treba da otvori ovog bota u Telegramu i pritisne Start, pa da proba ponovo.",
    };
  } catch (error) {
    return { podesen: true, greska: error instanceof Error ? error.message : String(error) };
  }
}

export const Route = createFileRoute("/api/status-obavestenja")({
  server: {
    handlers: {
      GET: async () => {
        // Najviše jedna provera u 10 sekundi po serveru, da niko ne zatrpa Telegram.
        if (!lastResult || Date.now() - lastRun > 10_000) {
          lastRun = Date.now();
          lastResult = {
            vreme: new Date().toISOString(),
            telegram: await telegramStatus(),
            email: {
              podesen: Boolean(process.env.RESEND_API_KEY),
              posiljalac: process.env.EMAIL_FROM || "EXIT Denim <porudzbine@exit.fashion>",
            },
          };
        }
        return Response.json(lastResult, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
