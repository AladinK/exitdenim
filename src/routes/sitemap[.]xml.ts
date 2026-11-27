import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { absoluteUrl, publicImageUrl } from "@/lib/image-urls";

const BASE_URL = "https://www.exit.fashion";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
  /** Apsolutne adrese fotografija (Google slike). */
  images?: string[];
}

const xmlEscape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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
          { path: "/uslovi-kupovine", changefreq: "yearly", priority: "0.4" },
          { path: "/vodic-za-farmerke", changefreq: "monthly", priority: "0.8" },
          { path: "/prodajna-mesta", changefreq: "monthly", priority: "0.7" },
          { path: "/kontakt", changefreq: "monthly", priority: "0.5" },
        ];
        // Bez baze ne šaljemo krnju mapu sajta: pretraživač bi zaključio da su proizvodi
        // uklonjeni. Status 503 mu kaže da proba kasnije i zadrži ono što već zna.
        try {
          const { createPublicServerClient } =
            await import("@/integrations/supabase/client.server");
          const { data, error } = await createPublicServerClient()
            .from("products_public")
            .select("slug, updated_at, image_url, gallery")
            .eq("active", true);
          if (error) throw new Error(error.message);
          for (const p of data ?? []) {
            if (!p.slug) continue;
            const gallery = Array.isArray(p.gallery)
              ? p.gallery.filter((g): g is string => typeof g === "string")
              : [];
            const images = [p.image_url, ...gallery]
              .map((src) => absoluteUrl(publicImageUrl(src, "p"), BASE_URL))
              .filter((src, i, all): src is string => !!src && all.indexOf(src) === i);
            entries.push({
              path: `/proizvod/${p.slug}`,
              changefreq: "weekly",
              priority: "0.8",
              lastmod: p.updated_at?.slice(0, 10),
              images,
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
            ...(e.images ?? []).map(
              (src) => `    <image:image><image:loc>${xmlEscape(src)}</image:loc></image:image>`,
            ),
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
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
