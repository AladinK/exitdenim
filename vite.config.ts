import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Standardna TanStack Start + Nitro postavka, bez ijednog paketa vezanog za platformu.
// Nitro sam prepoznaje Vercel, Netlify i Cloudflare Pages tokom build-a; za ostale
// ciljeve postavite NITRO_PRESET (npr. cloudflare-module ili node-server).
// Isti redosled imena kao src/integrations/supabase/env.ts (server), da pregledač i
// server uvek koriste istu bazu. Prihvata i imena koja upisuje Supabase integracija na Vercel-u.
const SUPABASE_URL_NAMES = ["VITE_SUPABASE_URL", "SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"];
const SUPABASE_PUBLISHABLE_KEY_NAMES = [
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];
const firstOf = (env: Record<string, string | undefined>, names: string[]) =>
  names.map((name) => env[name]).find((value) => Boolean(value));

export default defineConfig(({ mode }) => {
  // Promenljive sa hostinga imaju prednost nad fajlovima .env / .env.local.
  // Serverske (bez VITE_ prefiksa) služe lokalnom `vite dev`; u produkciji ih postavlja
  // hosting i nikada ne ulaze u klijentski paket.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  // Javni par za kod u pregledaču (adresa baze i publishable ključ).
  const publicUrl = firstOf(process.env, SUPABASE_URL_NAMES);
  const publicKey = firstOf(process.env, SUPABASE_PUBLISHABLE_KEY_NAMES);
  if (publicUrl) process.env.VITE_SUPABASE_URL = publicUrl;
  if (publicKey) process.env.VITE_SUPABASE_PUBLISHABLE_KEY = publicKey;

  return {
    server: { port: 3000 },
    // Isti CSS procesor koji je sajt koristio i do sada, da izgled ostane isti.
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": path.resolve(import.meta.dirname, "src") },
      dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/query-core"],
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
      }),
      nitro({
        // Na Vercel-u server radi u Frankfurtu: blizu kupaca u Srbiji i blizu baze
        // (Supabase, eu-central-1). Ostali hostinzi ovo zanemaruju.
        vercel: { functions: { regions: ["fra1"] } },
        // Fotografije u /media/ imaju stalna imena: pregledač ih čuva nedelju dana,
        // a u pozadini proverava da li ima novije verzije.
        routeRules: {
          "/media/**": {
            headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=2592000" },
          },
        },
      }),
      viteReact(),
    ],
  };
});
