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
 * Da li je zahtev samo čitanje, pa sme da se ponovi bez rizika od dvostrukog upisa.
 * Neka čitanja idu kao POST: RPC funkcije za čitanje (get_*, has_*, is_*) i
 * potpisivanje adresa u skladištu.
 */
export function isRepeatableRead(method: string, url: string): boolean {
  const m = method.toUpperCase();
  if (m === "GET" || m === "HEAD") return true;
  if (m !== "POST") return false;
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return false;
  }
  return (
    /^\/rest\/v1\/rpc\/(get_|has_|is_)[a-z0-9_]*$/i.test(pathname) ||
    /^\/storage\/v1\/object\/sign\//.test(pathname)
  );
}

/** Greška koja znači da odgovor nije stigao (veza pukla ili je zaglavljena). */
function isConnectionFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === "TimeoutError") return true;
  // undici: TypeError("fetch failed") sa uzrokom ECONNRESET, UND_ERR_SOCKET, ETIMEDOUT...
  return error.name === "TypeError" && /fetch failed|terminated|socket/i.test(error.message);
}

/**
 * fetch koji uvek šalje `apikey`, a nove (sb_*) ključeve ne šalje kao Bearer token.
 *
 * Sa `timeoutMs` zahtev se prekida posle zadatog roka: server tako ne čeka bazu koja
 * ne odgovara, pa prodavnica prikaže rezervni sadržaj umesto da stranica visi.
 *
 * Čitanja se jednom ponavljaju kada veza zakaže. Serverska funkcija se između poseta
 * "zamrzne", pa prvi zahtev posle pauze ume da dobije staru, mrtvu vezu i zaglavi se
 * do isteka roka, iako je baza zdrava. Prvi pokušaj zato ima kraći rok, a ponovljeni
 * ide novom vezom. Upisi se nikad ne ponavljaju automatski (rizik od duplog upisa).
 */
export function createSupabaseFetch(
  supabaseKey: string,
  options: { timeoutMs?: number; firstAttemptTimeoutMs?: number } = {},
): typeof fetch {
  return async (input, init) => {
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

    const isRequestObject = typeof Request !== "undefined" && input instanceof Request;
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method ?? (isRequestObject ? (input as Request).method : "GET");
    // Telo iz Request objekta može da se pročita samo jednom, pa se takav zahtev ne ponavlja.
    const repeatable = !isRequestObject && isRepeatableRead(method, url);
    const attempts = repeatable ? 2 : 1;

    for (let attempt = 1; ; attempt++) {
      const ms =
        attempt === 1 && repeatable
          ? Math.min(options.firstAttemptTimeoutMs ?? options.timeoutMs, options.timeoutMs)
          : options.timeoutMs;
      const timeout = AbortSignal.timeout(ms);
      const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
      try {
        return await fetch(input, { ...init, headers, signal });
      } catch (error) {
        const callerGaveUp = Boolean(init?.signal?.aborted);
        if (attempt >= attempts || callerGaveUp || !isConnectionFailure(error)) throw error;
        let where = url;
        try {
          where = new URL(url).pathname;
        } catch {
          /* ostaje cela adresa */
        }
        console.warn(
          `[baza] ponavljam čitanje posle ${timeout.aborted ? `isteka roka (${ms} ms)` : "prekinute veze"}: ${method.toUpperCase()} ${where}`,
        );
      }
    }
  };
}

/** Rok za serverske upite ka bazi (i za ponovljeni pokušaj čitanja). */
export const SERVER_REQUEST_TIMEOUT_MS = 5_000;
/**
 * Rok za prvi pokušaj čitanja. Normalan odgovor iz Frankfurta stiže za 20–150 ms, a
 * zaglavljena veza ne odgovara uopšte, pa je kratak rok dovoljan i štedi čekanje.
 */
export const SERVER_FIRST_READ_TIMEOUT_MS = 1_500;
