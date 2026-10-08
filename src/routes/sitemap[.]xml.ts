import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://exitdenim.shop";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/katalog", changefreq: "weekly", priority: "0.9" },
          { path: "/postani-partner", changefreq: "monthly", priority: "0.8" },
          { path: "/proizvodnja", changefreq: "monthly", priority: "0.6" },
          { path: "/media-kit", changefreq: "monthly", priority: "0.5" },
          { path: "/faq", changefreq: "monthly", priority: "0.5" },
          { path: "/kontakt", changefreq: "monthly", priority: "0.5" },
        ];
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
          const { data } = await sb.from("products").select("slug").eq("active", true);
          for (const p of data ?? []) if (p.slug) entries.push({ path: `/proizvod/${p.slug}`, changefreq: "weekly", priority: "0.8" });
        } catch (e) { console.error("sitemap products", e); }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
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
