import { MEDIA } from "@/lib/media";
import { useSiteAsset } from "@/hooks/useSiteAsset";

/** EXIT Denim znak. Slika se može zameniti iz administracije (ključ "logo"). */
export function Logo({ className = "" }: { className?: string }) {
  const src = useSiteAsset("logo", MEDIA.logo);
  return (
    <img
      src={src}
      alt="EXIT Denim"
      width={360}
      height={202}
      decoding="async"
      className={`site-logo ${className}`}
    />
  );
}
