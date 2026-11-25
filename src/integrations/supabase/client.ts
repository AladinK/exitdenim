// Supabase klijent za pregledač (i za SSR bez prijavljenog korisnika).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { createSupabaseFetch, supabasePublishableKey, supabaseUrl } from "./env";

// Bez podešene baze sajt mora i dalje da radi (umesto modela prikaže obaveštenje sa
// kontaktom). Zato se klijent tada pravi sa adresom koja ne postoji: svaki upit vrati
// grešku koju stranica obradi, umesto da sajt padne.
const NOT_CONFIGURED_URL = "https://baza-nije-podesena.invalid";

function createSupabaseClient() {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  const configured = Boolean(url && key);
  if (!configured && typeof window !== "undefined") {
    console.warn("[baza] Supabase nije podešen (SUPABASE_URL i SUPABASE_PUBLISHABLE_KEY).");
  }
  const apiKey = key ?? "nije-podesen";
  return createClient<Database>(url ?? NOT_CONFIGURED_URL, apiKey, {
    global: { fetch: createSupabaseFetch(apiKey) },
    auth: { persistSession: true, autoRefreshToken: configured },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
