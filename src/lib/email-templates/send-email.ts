import * as React from "react";
import { render } from "@react-email/render";
import { TEMPLATES } from "./registry";

// Samo za server. E-mail se šalje preko Resend-a (https://resend.com) običnim HTTP
// pozivom, bez dodatnog paketa, pa radi na svakom hostingu.
//
//   RESEND_API_KEY  — ključ iz Resend naloga (bez njega se e-mail preskače)
//   EMAIL_FROM      — pošiljalac, npr. "EXIT Denim <porudzbine@exitdenim.shop>";
//                     domen mora biti potvrđen u Resend-u
//   EMAIL_REPLY_TO  — adresa na koju kupac odgovara (podrazumevano poslovni e-mail)

const DEFAULT_FROM = "EXIT Denim <porudzbine@exitdenim.shop>";
const DEFAULT_REPLY_TO = "office@bennelijeans.com";

export type SendTemplateEmailResult =
  | { sent: true; id?: string }
  | { sent: false; reason: "not_configured" };

export interface SendTemplateEmailOptions {
  templateData?: Record<string, any>;
  /** Isti ključ u roku od 24h ne šalje isti e-mail dvaput (ponovljeni pokušaji). */
  idempotencyKey?: string;
  replyTo?: string;
}

export class EmailSendError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "EmailSendError";
  }
}

/**
 * Renderuje registrovan šablon i šalje ga. Ako e-mail nije podešen, vraća
 * { sent: false } i samo beleži upozorenje: porudžbina ne sme da zavisi od e-maila.
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {},
): Promise<SendTemplateEmailResult> {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Šablon '${templateName}' ne postoji. Dostupni: ${Object.keys(TEMPLATES).join(", ")}`,
    );
  }

  // Šablon sa fiksnim primaocem (obaveštenja) ima prednost nad prosleđenom adresom.
  const recipient = template.to || to;
  if (!recipient) throw new Error("Nedostaje adresa primaoca.");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[e-mail] RESEND_API_KEY nije podešen; '${templateName}' nije poslat.`);
    return { sent: false, reason: "not_configured" };
  }

  const templateData = options.templateData ?? {};
  const element = React.createElement(template.component, templateData);
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "exitdenim-shop/1.0",
      ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey.slice(0, 256) } : {}),
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || DEFAULT_FROM,
      to: [recipient],
      reply_to: options.replyTo || process.env.EMAIL_REPLY_TO || DEFAULT_REPLY_TO,
      subject,
      html,
      text,
      tags: [{ name: "template", value: templateName.replace(/[^A-Za-z0-9_-]/g, "_") }],
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new EmailSendError(
      `Resend je odbio e-mail (${response.status}): ${detail.slice(0, 300)}`,
      response.status,
    );
  }
  const body = (await response.json().catch(() => ({}))) as { id?: string };
  return { sent: true, id: body.id };
}
