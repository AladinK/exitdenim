// Klijentski middleware: uz svaki poziv server funkcije šalje token prijavljenog korisnika.
import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    // Na serveru (SSR) nema sesije iz pregledača, pa nema ni tokena za slanje.
    if (typeof window === "undefined") return next();
    let token: string | undefined;
    try {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    } catch {
      // Baza nije podešena ili sesija nije čitljiva: poziv ide bez tokena, kao gost.
    }
    return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
  },
);
