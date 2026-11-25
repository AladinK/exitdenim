// Jedno mesto za podešavanja Supabase veze.
//
// Javni par (URL + publishable ključ) ugrađuje se pri build-u iz VITE_* promenljivih
// (fajl .env u repou), a server ga može zameniti promenljivama SUPABASE_URL i
// SUPABASE_PUBLISHABLE_KEY bez novog build-a. Tajni ključ (service role) postoji
// samo na serveru, u podešavanjima hostinga.

function runtimeEnv(name: string): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  const value = process.env[name];
  return value ? value : undefined;
}

export function supabaseUrl(): string | undefined {
  return runtimeEnv("SUPABASE_URL") || import.meta.env.VITE_SUPABASE_URL || undefined;
}

export function supabasePublishableKey(): string | undefined {
  return (
    runtimeEnv("SUPABASE_PUBLISHABLE_KEY") ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    undefined
  );
}

export function supabaseServiceRoleKey(): string | undefined {
  return runtimeEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export class SupabaseConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Nedostaje podešavanje baze: ${missing.join(", ")}. Dodajte ga u promenljive okruženja na hostingu (vidi .env.example).`,
    );
    this.name = "SupabaseConfigError";
  }
}

export function requirePublicConfig(): { url: string; key: string } {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) {
    throw new SupabaseConfigError([
      ...(!url ? ["VITE_SUPABASE_URL"] : []),
      ...(!key ? ["VITE_SUPABASE_PUBLISHABLE_KEY"] : []),
    ]);
  }
  return { url, key };
}

export function requireAdminConfig(): { url: string; key: string } {
  const url = supabaseUrl();
  const key = supabaseServiceRoleKey();
  if (!url || !key) {
    throw new SupabaseConfigError([
      ...(!url ? ["VITE_SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_SERVICE_ROLE_KEY"] : []),
    ]);
  }
  return { url, key };
}

function isNewApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

/**
 * fetch koji uvek šalje `apikey`, a nove (sb_*) ključeve ne šalje kao Bearer token.
 * Sa `timeoutMs` zahtev se prekida posle zadatog roka: server tako ne čeka bazu koja
 * ne odgovara, pa prodavnica prikaže rezervni sadržaj umesto da stranica visi.
 */
export function createSupabaseFetch(
  supabaseKey: string,
  options: { timeoutMs?: number } = {},
): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);

    if (!options.timeoutMs) return fetch(input, { ...init, headers });
    const timeout = AbortSignal.timeout(options.timeoutMs);
    const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
    return fetch(input, { ...init, headers, signal });
  };
}

/** Rok za serverske upite ka bazi. */
export const SERVER_REQUEST_TIMEOUT_MS = 5_000;
