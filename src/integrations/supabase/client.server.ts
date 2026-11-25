// Serverski Supabase klijenti. Nikada ne uvoziti iz koda koji ide u pregledač.
//
// - supabaseAdmin: service role ključ, zaobilazi RLS. Samo za proverene serverske radnje.
// - createPublicServerClient(): javni ključ, važi RLS; za čitanje kataloga na serveru.
//
// U server funkcijama učitavati dinamički:
//   const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import {
  SERVER_FIRST_READ_TIMEOUT_MS,
  SERVER_REQUEST_TIMEOUT_MS,
  createSupabaseFetch,
  requireAdminConfig,
  requirePublicConfig,
} from "./env";

const serverAuth = { storage: undefined, persistSession: false, autoRefreshToken: false } as const;
// Biblioteka sama ponavlja neuspele upite (1 s, 2 s, 4 s). Na serveru to znači da posetilac
// čeka 7 sekundi na stranicu kada baza ne radi, pa ponavljanje gasimo: ispad se javlja
// odmah, a stranica prelazi na rezervni sadržaj.
const serverDb = { retry: false } as const;

function createSupabaseAdminClient() {
  const { url, key } = requireAdminConfig();
  return createClient<Database>(url, key, {
    global: { fetch: createSupabaseFetch(key, {
      timeoutMs: SERVER_REQUEST_TIMEOUT_MS,
      firstAttemptTimeoutMs: SERVER_FIRST_READ_TIMEOUT_MS,
    }) },
    auth: serverAuth,
    db: serverDb,
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});

export function createPublicServerClient() {
  const { url, key } = requirePublicConfig();
  return createClient<Database>(url, key, {
    global: { fetch: createSupabaseFetch(key, {
      timeoutMs: SERVER_REQUEST_TIMEOUT_MS,
      firstAttemptTimeoutMs: SERVER_FIRST_READ_TIMEOUT_MS,
    }) },
    auth: serverAuth,
    db: serverDb,
  });
}
