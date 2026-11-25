// Poslednji uspešno učitan katalog, čuvan u memoriji servera.
//
// U normalnom radu se NE koristi: svaki zahtev čita stanje uživo iz baze. Služi samo
// kao rezerva kada baza ne odgovori, da kupci i dalje vide modele umesto prazne
// stranice. Zapamćene adrese slika su potpisane na 7 dana, pa je rok trajanja kraći.
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type Entry<T> = { at: number; value: T };
const store = new Map<string, Entry<unknown>>();

export function rememberSnapshot<T>(key: string, value: T): void {
  store.set(key, { at: Date.now(), value });
}

export function recallSnapshot<T>(key: string): T | undefined {
  const entry = store.get(key) as Entry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() - entry.at > MAX_AGE_MS) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

// Osigurač: posle neuspelog čitanja baza se preskače kratko vreme, da svaki sledeći
// posetilac ne čeka na isti istek roka. Posle pauze sledeći zahtev proba ponovo.
// Svaka vrsta podataka ima svoj osigurač, a greška u podešavanju ga ne aktivira.
const COOL_DOWN_MS = 15_000;
const retryAfter = new Map<string, number>();

export class BackendCoolingDownError extends Error {
  constructor() {
    super("baza se preskače dok traje pauza posle ispada");
    this.name = "BackendCoolingDownError";
  }
}

/** Izvršava čitanje iz baze uz osigurač za dati ključ. */
export async function guarded<T>(key: string, read: () => Promise<T>): Promise<T> {
  if (Date.now() < (retryAfter.get(key) ?? 0)) throw new BackendCoolingDownError();
  try {
    const value = await read();
    retryAfter.delete(key);
    return value;
  } catch (error) {
    const misconfigured = error instanceof Error && error.name === "SupabaseConfigError";
    if (!misconfigured) retryAfter.set(key, Date.now() + COOL_DOWN_MS);
    throw error;
  }
}
