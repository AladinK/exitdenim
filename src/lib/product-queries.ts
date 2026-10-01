import { queryOptions } from "@tanstack/react-query";
import { getProductBySlug, listProducts } from "@/lib/products.functions";

export const productsQuery = () =>
  queryOptions({ queryKey: ["products"], queryFn: () => listProducts(), staleTime: 5 * 60_000 });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
    staleTime: 5 * 60_000,
  });
