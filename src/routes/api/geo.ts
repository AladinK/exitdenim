import { createFileRoute } from "@tanstack/react-router";

// Zemlja posetioca, iz zaglavlja koja dodaje hosting (Cloudflare, Vercel, Netlify,
// CloudFront). Koristi je samo baner za kolačiće: u zemljama gde je pristanak obavezan
// oglašivački kolačići čekaju izbor posetioca. Ništa se ne čuva.
function countryFrom(headers: Headers): string | null {
  const direct =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-country") ||
    headers.get("cloudfront-viewer-country");
  if (direct && /^[A-Za-z]{2}$/.test(direct)) return direct.toUpperCase();

  const netlify = headers.get("x-nf-geo");
  if (netlify) {
    try {
      const code = JSON.parse(atob(netlify))?.country?.code;
      if (typeof code === "string" && /^[A-Za-z]{2}$/.test(code)) return code.toUpperCase();
    } catch {
      /* nepoznat oblik zaglavlja */
    }
  }
  return null;
}

export const Route = createFileRoute("/api/geo")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const country = countryFrom(request.headers);
        return Response.json(
          { country: country === "XX" || country === "T1" ? null : country },
          { headers: { "Cache-Control": "private, no-store" } },
        );
      },
    },
  },
});
