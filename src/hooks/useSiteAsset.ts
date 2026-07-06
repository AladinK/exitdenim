import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getHomeAssets } from "@/lib/site-assets.functions";

let cache: Record<string, { url: string; alt: string | null }> | null = null;
let inflight: Promise<Record<string, { url: string; alt: string | null }>> | null = null;
const listeners = new Set<(v: Record<string, { url: string; alt: string | null }>) => void>();

export function useSiteAssets() {
  const fetchAssets = useServerFn(getHomeAssets);
  const [assets, setAssets] = useState<Record<string, { url: string; alt: string | null }>>(cache || {});

  useEffect(() => {
    if (cache) { setAssets(cache); return; }
    const cb = (v: Record<string, { url: string; alt: string | null }>) => setAssets(v);
    listeners.add(cb);
    if (!inflight) {
      inflight = fetchAssets({})
        .then((v) => { cache = v; listeners.forEach((l) => l(v)); return v; })
        .catch(() => ({}));
    }
    return () => { listeners.delete(cb); };
  }, []); // eslint-disable-line

  return assets;
}

export function useSiteAsset(key: string, fallbackUrl?: string): string {
  const assets = useSiteAssets();
  return assets[key]?.url || fallbackUrl || "";
}
