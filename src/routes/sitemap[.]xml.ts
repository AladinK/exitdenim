import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://exitdenim.shop";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/katalog", changefreq: "weekly", priority: "0.9" },
          ...[
            "/jeans",
            "/chino",
            "/cargo",
            "/wide-flare",
            "/slim-farmerke",
            "/regular-slim-farmerke",
            "/relaxed-farmerke",
            "/bootcut-farmerke",
            "/flare-farmerke",
            "/cropped-farmerke",
          ].map((path) => ({ path, changefreq: "weekly" as const, priority: "0.9" })),
          { path: "/postani-partner", changefreq: "monthly", priority: "0.8" },
          { path: "/proizvodnja", changefreq: "monthly", priority: "0.6" },
          { path: "/private-label", changefreq: "monthly", priority: "0.8" },
          { path: "/en/manufacturing", changefreq: "monthly", priority: "0.6" },
          { path: "/en/private-label", changefreq: "monthly", priority: "0.8" },
          { path: "/media-kit", changefreq: "monthly", priority: "0.5" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/vodic-za-farmerke", changefreq: "monthly", priority: "0.8" },
          { path: "/kontakt", changefreq: "monthly", priority: "0.5" },
        ];
        // Bez baze ne šaljemo krnju mapu sajta: pretraživač bi zaključio da su proizvodi
        // uklonjeni. Status 503 mu kaže da proba kasnije i zadrži ono što već zna.
        try {
          const { createPublicServerClient } =
            await import("@/integrations/supabase/client.server");
          const { data, error } = await createPublicServerClient()
            .from("products_public")
            .select("slug, updated_at")
            .eq("active", true);
          if (error) throw new Error(error.message);
          for (const p of data ?? []) {
            if (p.slug)
              entries.push({
                path: `/proizvod/${p.slug}`,
                changefreq: "weekly",
                priority: "0.8",
                lastmod: p.updated_at?.slice(0, 10),
              });
          }
        } catch (e) {
          console.error("[sitemap] proizvodi nisu učitani:", e);
          return new Response("Sitemap is temporarily unavailable", {
            status: 503,
            headers: { "Retry-After": "600", "Cache-Control": "no-store" },
          });
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
