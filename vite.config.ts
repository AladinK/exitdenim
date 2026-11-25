import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Standardna TanStack Start + Nitro postavka, bez ijednog paketa vezanog za platformu.
// Nitro sam prepoznaje Vercel, Netlify i Cloudflare Pages tokom build-a; za ostale
// ciljeve postavite NITRO_PRESET (npr. cloudflare-module ili node-server).
export default defineConfig(({ mode }) => {
  // Serverske promenljive (bez VITE_ prefiksa) za lokalni `vite dev`.
  // U produkciji ih postavlja hosting i nikada ne ulaze u klijentski paket.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    server: { port: 3000 },
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
        // Fotografije u /media/ imaju stalna imena: pregledač ih čuva nedelju dana,
        // a u pozadini proverava da li ima novije verzije.
        routeRules: {
          "/media/**": { headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=2592000" } },
        },
      }),
      viteReact(),
    ],
  };
});
