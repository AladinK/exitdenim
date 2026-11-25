import type { QueryClient } from "@tanstack/react-query";
import { markTemporarilyUnavailable } from "@/lib/http-status";
import { catalogQuery, homeAssetsQuery } from "@/lib/product-queries";

/**
 * Učitava katalog za stranicu. Nikad ne baca grešku; ako baza ne odgovara i nema
 * zapamćenog kataloga, odgovor dobija status 503 a stranica prikazuje obaveštenje.
 */
export async function loadCatalog(queryClient: QueryClient) {
  const catalog = await queryClient.ensureQueryData(catalogQuery());
  if (catalog.state === "down") markTemporarilyUnavailable();
  return catalog;
}

/** Katalog i slike sajta zajedno (početna). */
export async function loadHome(queryClient: QueryClient) {
  const [catalog] = await Promise.all([
    loadCatalog(queryClient),
    queryClient.ensureQueryData(homeAssetsQuery()),
  ]);
  return catalog;
}
