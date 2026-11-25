import { createIsomorphicFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

/** Zaglavlje kojim stranica tokom SSR-a traži drugačiji HTTP status; čita ga src/server.ts. */
export const STATUS_HEADER = "x-exit-status";

/**
 * Tokom SSR-a označava odgovor kao privremeno nedostupan (503). Pretraživači tako
 * znaju da je zastoj kratkotrajan i ne izbacuju stranicu iz indeksa, a posetilac
 * i dalje dobija ceo sajt sa obaveštenjem. U pregledaču ne radi ništa.
 */
export const markTemporarilyUnavailable = createIsomorphicFn()
  .server(() => {
    setResponseHeader(STATUS_HEADER, "503");
    setResponseHeader("Retry-After", "300");
    setResponseHeader("Cache-Control", "no-store");
  })
  .client(() => {});
