// Stalne javne adrese fotografija iz privatnog skladišta.
//
// Fotografije proizvoda i slike sajta su u privatnim bucket-ima. Umesto potpisanih
// linkova (menjaju se pri svakom učitavanju i ističu posle 7 dana) sajt ih služi sa
// sopstvene adrese /img/<p|s>/<putanja>. Tako ih pregledač, CDN, Google slike i
// deljeni linkovi pamte, a stranica ne čeka potpisivanje pri svakom prikazu.
//
//   /img/p/<putanja>  →  bucket product-images
//   /img/s/<putanja>  →  bucket site-assets

export const IMAGE_BUCKETS = { p: "product-images", s: "site-assets" } as const;
export type ImageBucketCode = keyof typeof IMAGE_BUCKETS;

const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  avif: "image/avif",
  gif: "image/gif",
};

/** Putanja u skladištu (ne pun URL i ne adresa sa sajta). */
export function isStoragePath(value: string | null | undefined): value is string {
  return !!value && !/^https?:\/\//i.test(value) && !value.startsWith("/");
}

/** Putanja u skladištu → adresa na sajtu. Pune adrese i /media/... ostaju iste. */
export function publicImageUrl(value: string, bucket: ImageBucketCode): string;
export function publicImageUrl(value: string | null | undefined, bucket: ImageBucketCode): string | null;
export function publicImageUrl(value: string | null | undefined, bucket: ImageBucketCode) {
  if (!value) return null;
  if (!isStoragePath(value)) return value;
  return `/img/${bucket}/${value.split("/").map(encodeURIComponent).join("/")}`;
}

/** Adresa sa sajta → apsolutni URL (za og:image, strukturisane podatke i sitemap). */
export function absoluteUrl(value: string | null | undefined, origin: string): string | null {
  if (!value) return null;
  if (/^https:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${origin.replace(/\/+$/, "")}${value}`;
}

/**
 * Proverava deo adrese posle /img/ i vraća bucket, putanju i tip sadržaja.
 * Dozvoljene su samo slike (bez SVG-a i HTML-a) i putanje bez skokova u druge foldere.
 */
export function parseImageRequest(
  splat: string,
): { bucket: (typeof IMAGE_BUCKETS)[ImageBucketCode]; path: string; contentType: string } | null {
  const slash = splat.indexOf("/");
  if (slash < 1) return null;
  const code = splat.slice(0, slash);
  if (!(code in IMAGE_BUCKETS)) return null;
  let path: string;
  try {
    path = splat
      .slice(slash + 1)
      .split("/")
      .map((part) => decodeURIComponent(part))
      .join("/");
  } catch {
    return null;
  }
  if (!path || path.length > 400) return null;
  if (path.split("/").some((part) => !part || part === "." || part === "..")) return null;
  if (/[\\\u0000-\u001f\u007f]/.test(path)) return null;
  const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) return null;
  return { bucket: IMAGE_BUCKETS[code as ImageBucketCode], path, contentType };
}
