import { queryOptions } from "@tanstack/react-query";
import {
  getProductBySlug,
  listProducts,
  type Catalog,
  type CatalogState,
  type ProductResult,
} from "@/lib/products.functions";
import { getHomeAssets } from "@/lib/site-assets.functions";

const FRESH_MS = 5 * 60_000;
// Dok baza ne odgovara, pregledač sam proverava ponovo, pa se prodavnica vrati
// čim baza proradi, bez ručnog osvežavanja stranice.
const RETRY_MS = 20_000;

const whileDegraded = (state: CatalogState | undefined) =>
  state && state !== "live" ? RETRY_MS : false;

const catalogOptions = {
  queryKey: ["catalog"] as const,
  queryFn: () => listProducts(),
  staleTime: (query: { state: { data?: Catalog } }) =>
    query.state.data && query.state.data.state !== "live" ? RETRY_MS : FRESH_MS,
  refetchInterval: (query: { state: { data?: Catalog } }) => whileDegraded(query.state.data?.state),
};

/** Ceo odgovor kataloga, uključujući stanje (live / stale / down). */
export const catalogQuery = () => queryOptions(catalogOptions);

/** Samo lista proizvoda; deli isti keš sa catalogQuery. */
export const productsQuery = () =>
  queryOptions({ ...catalogOptions, select: (catalog: Catalog) => catalog.products });

/** Samo stanje kataloga; deli isti keš sa catalogQuery. */
export const catalogStateQuery = () =>
  queryOptions({ ...catalogOptions, select: (catalog: Catalog) => catalog.state });

const productOptions = (slug: string) => ({
  queryKey: ["product", slug] as const,
  queryFn: () => getProductBySlug({ data: { slug } }),
  staleTime: (query: { state: { data?: ProductResult } }) =>
    query.state.data && query.state.data.state !== "live" ? RETRY_MS : FRESH_MS,
  refetchInterval: (query: { state: { data?: ProductResult } }) =>
    whileDegraded(query.state.data?.state),
});

/** Odgovor za jedan proizvod, sa stanjem. */
export const productResultQuery = (slug: string) => queryOptions(productOptions(slug));

/** Samo proizvod (ili null). */
export const productQuery = (slug: string) =>
  queryOptions({ ...productOptions(slug), select: (result: ProductResult) => result.product });

export const homeAssetsQuery = () =>
  queryOptions({ queryKey: ["home-assets"], queryFn: () => getHomeAssets(), staleTime: FRESH_MS });
