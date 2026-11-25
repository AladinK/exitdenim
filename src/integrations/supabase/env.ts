// Jedno mesto za podešavanja Supabase veze.
//
// Vrednosti dolaze iz promenljivih okruženja na hostingu. Prihvataju se i imena koja
// Supabase sam upisuje kada se poveže sa Vercel-om (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY,
// SUPABASE_SECRET_KEY, NEXT_PUBLIC_..., stari SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY),
// pa posle povezivanja ne treba ništa prepisivati ručno.
//
// Javni par (adresa + publishable ključ) ugrađuje se i u kod za pregledač pri build-u
// (vite.config.ts bira po ISTOM redosledu), tako da pregledač i server uvek gađaju istu bazu.
// Tajni ključ postoji samo na serveru.

function runtimeEnv(name: string): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  const value = process.env[name];
  return value ? value : undefined;
}

const firstOf = (...names: string[]) => {
  for (const name of names) {
    const value = runtimeEnv(name);
    if (value) return value;
  }
  return undefined;
};

/** Redosled imena; isti spisak koristi vite.config.ts za kod u pregledaču. */
export const SUPABASE_URL_NAMES = ["VITE_SUPABASE_URL", "SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"];
export const SUPABASE_PUBLISHABLE_KEY_NAMES = [
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];
export const SUPABASE_SECRET_KEY_NAMES = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"];

export function supabaseUrl(): string | undefined {
  return firstOf(...SUPABASE_URL_NAMES) || import.meta.env.VITE_SUPABASE_URL || undefined;
}

export function supabasePublishableKey(): string | undefined {
  return (
    firstOf(...SUPABASE_PUBLISHABLE_KEY_NAMES) ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    undefined
  );
}

export function supabaseServiceRoleKey(): string | undefined {
  return firstOf(...SUPABASE_SECRET_KEY_NAMES);
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
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ]);
  }
  return { url, key };
}

export function requireAdminConfig(): { url: string; key: string } {
  const url = supabaseUrl();
  const key = supabaseServiceRoleKey();
  if (!url || !key) {
    throw new SupabaseConfigError([
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_SECRET_KEY (ili SUPABASE_SERVICE_ROLE_KEY)"] : []),
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
