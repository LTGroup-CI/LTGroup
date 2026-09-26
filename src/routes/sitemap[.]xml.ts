import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://ltgroup-ci.com";
const SUPABASE_URL = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
const SUPABASE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/a-propos", "/activites", "/projets", "/services", "/actualites", "/temoignages", "/contact"];
        const urls = staticPaths.map((path) => `<url><loc>${SITE_URL}${path}</loc></url>`);

        if (SUPABASE_URL && SUPABASE_KEY) {
          const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
          const [activities, projects, news] = await Promise.all([
            db.from("activities").select("slug,updated_at").eq("is_active", true),
            db.from("projects").select("slug,updated_at").eq("is_published", true),
            db.from("news").select("slug,updated_at").eq("is_published", true),
          ]);

          for (const item of activities.data ?? []) {
            urls.push(`<url><loc>${SITE_URL}/activites/${encodeURIComponent(item.slug)}</loc>${item.updated_at ? `<lastmod>${xml(item.updated_at)}</lastmod>` : ""}</url>`);
          }
          for (const item of projects.data ?? []) {
            urls.push(`<url><loc>${SITE_URL}/projets/${encodeURIComponent(item.slug)}</loc>${item.updated_at ? `<lastmod>${xml(item.updated_at)}</lastmod>` : ""}</url>`);
          }
          for (const item of news.data ?? []) {
            urls.push(`<url><loc>${SITE_URL}/actualites/${encodeURIComponent(item.slug)}</loc>${item.updated_at ? `<lastmod>${xml(item.updated_at)}</lastmod>` : ""}</url>`);
          }
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
          },
        });
      },
    },
  },
});
