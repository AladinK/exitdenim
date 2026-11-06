import { useQuery } from "@tanstack/react-query";
import { homeAssetsQuery } from "@/lib/product-queries";

export function useSiteAssets() {
  const { data } = useQuery(homeAssetsQuery());
  return data ?? {};
}

export function useSiteAsset(key: string, fallbackUrl?: string): string {
  const assets = useSiteAssets();
  return assets[key]?.url || fallbackUrl || "";
}
