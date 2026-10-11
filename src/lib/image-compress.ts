/**
 * Browser-side image compression: resizes to a max edge and re-encodes as WebP.
 * Falls back to the original file for SVG/GIF or if the browser can't encode WebP.
 */
export async function compressToWebP(
  file: File,
  opts: { maxEdge?: number; quality?: number } = {},
): Promise<{ blob: Blob; ext: string; type: string }> {
  const { maxEdge = 2000, quality = 0.82 } = opts;
  const passthrough = { blob: file as Blob, ext: file.name.split(".").pop()?.toLowerCase() || "jpg", type: file.type };
  if (!file.type.startsWith("image/") || /svg|gif/.test(file.type)) return passthrough;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return passthrough;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
    if (!blob || blob.type !== "image/webp") return passthrough;
    // Keep original if it's already smaller and already WebP
    if (file.type === "image/webp" && file.size <= blob.size) return passthrough;
    return { blob, ext: "webp", type: "image/webp" };
  } catch {
    return passthrough;
  }
}
