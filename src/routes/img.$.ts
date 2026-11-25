import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { parseImageRequest } from "@/lib/image-urls";

// Fotografije iz privatnog skladišta na stalnoj adresi sajta: /img/p/... i /img/s/...
// (vidi src/lib/image-urls.ts). Odgovor pamti CDN, pa server čita sliku iz skladišta
// samo prvi put; svaka sledeća poseta je dobija direktno sa najbliže CDN tačke.
//
// Imena fajlova u skladištu sadrže vreme otpremanja, pa nova fotografija uvek dobija
// novu adresu. Zato pregledač sme da je čuva mesec dana, a CDN godinu dana (svaka nova
// objava sajta ionako prazni CDN).

const CACHE_OK = "public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=86400";

function notFound(cacheSeconds: number) {
  return new Response("Slika nije pronađena.", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`,
    },
  });
}

async function serveImage(splat: string, method: "GET" | "HEAD"): Promise<Response> {
  const parsed = parseImageRequest(splat);
  if (!parsed) return notFound(3600);

  const { requireAdminConfig, createSupabaseFetch, SERVER_REQUEST_TIMEOUT_MS } = await import(
    "@/integrations/supabase/env"
  );
  let config: { url: string; key: string };
  try {
    config = requireAdminConfig();
  } catch (error) {
    console.error("[slike] skladište nije podešeno:", error);
    return new Response("Slike trenutno nisu dostupne.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "300" },
    });
  }

  const storageFetch = createSupabaseFetch(config.key, {
    timeoutMs: SERVER_REQUEST_TIMEOUT_MS * 2,
    firstAttemptTimeoutMs: SERVER_REQUEST_TIMEOUT_MS,
  });
  const objectUrl = `${config.url.replace(/\/+$/, "")}/storage/v1/object/authenticated/${parsed.bucket}/${parsed.path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  let upstream: Response;
  try {
    upstream = await storageFetch(objectUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${config.key}` },
    });
  } catch (error) {
    console.error(`[slike] skladište ne odgovara (${parsed.bucket}/${parsed.path}):`, error);
    return new Response("Slika trenutno nije dostupna.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    });
  }

  if (!upstream.ok) {
    await upstream.body?.cancel().catch(() => {});
    // Skladište javlja nepostojeći fajl kao 400 ili 404.
    if (upstream.status === 400 || upstream.status === 404) return notFound(300);
    console.error(`[slike] skladište je vratilo ${upstream.status} za ${parsed.bucket}/${parsed.path}`);
    return new Response("Slika trenutno nije dostupna.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    });
  }

  // Slika se pročita cela pre slanja: CDN tako nikad ne zapamti prekinut fajl.
  let bytes: ArrayBuffer;
  try {
    bytes = await upstream.arrayBuffer();
  } catch (error) {
    console.error(`[slike] prekinuto čitanje ${parsed.bucket}/${parsed.path}:`, error);
    return new Response("Slika trenutno nije dostupna.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    });
  }

  const headers = new Headers({
    "Content-Type": parsed.contentType,
    "Content-Length": String(bytes.byteLength),
    "Cache-Control": CACHE_OK,
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  });
  for (const name of ["etag", "last-modified"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(method === "HEAD" ? null : bytes, { status: 200, headers });
}

export const Route = createFileRoute("/img/$")({
  server: {
    handlers: {
      GET: ({ params }) => serveImage(params._splat ?? "", "GET"),
      HEAD: ({ params }) => serveImage(params._splat ?? "", "HEAD"),
    },
  },
});
