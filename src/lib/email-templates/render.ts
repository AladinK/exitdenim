import type * as React from "react";
import { render } from "@react-email/render";

// React ne ume da ispiše HTML komentare, a Outlook na Windowsu čita samo njih
// (<!--[if mso]>). Šabloni zato ostave oznake, a ovde se zamene komentarima:
//   <meta name="x-mso-settings">  → podešavanja za oštar prikaz na ekranima sa uvećanjem
//   <span data-x-mso="open|close"> → tabela od 600 px oko sadržaja (Outlook ne zna max-width)

const MSO_HEAD =
  "<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->";
const MSO_OPEN =
  '<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->';
const MSO_CLOSE = "<!--[if mso]></td></tr></table><![endif]-->";

export function finishEmailHtml(html: string): string {
  let out = html
    // Oznake koje React ostavlja za hidrataciju (<!-- -->, <!--$-->...); e-mailu ne trebaju.
    .replace(/<!--(?: |\$|\/\$|html|head|body)-->/g, "")
    .replace(/<meta name="x-mso-settings"\s*\/?>/, MSO_HEAD)
    .replace(/<span data-x-mso="open"><\/span>/g, MSO_OPEN)
    .replace(/<span data-x-mso="close"><\/span>/g, MSO_CLOSE);
  if (!/xmlns:o=/.test(out)) {
    out = out.replace(
      /<html\b/,
      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"',
    );
  }
  return out;
}

/** Tekstualna verzija bez praznih gomila redova (prikazuju je satovi i stari klijenti). */
export function tidyPlainText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t\u00A0]+$/g, "").replace(/^[ \t\u00A0]+/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Tekstualna verzija: telefon, e-mail, mapa i nazivi artikala bez dugih adresa iza teksta.
const TEXT_SELECTORS = [
  'a[href^="tel:"]',
  'a[href^="mailto:"]',
  'a[href^="https://www.google.com/maps"]',
  "a[data-plain]",
].map((selector) => ({ selector, format: "inline" }));

export async function renderEmail(
  element: React.ReactElement,
): Promise<{ html: string; text: string }> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true, htmlToTextOptions: { selectors: TEXT_SELECTORS } }),
  ]);
  return { html: finishEmailHtml(html), text: tidyPlainText(text) };
}
