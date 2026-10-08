import logoAsset from "@/assets/exit-logo.png.asset.json";
import { useSiteAsset } from "@/hooks/useSiteAsset";

type Variant = "dark" | "light";

/**
 * EXIT Denim brand lockup: chevron mark + wordmark + B2B subtitle.
 * On mobile the mark is larger so the brand reads clearly at a glance.
 */
export function Logo({
  className = "",
  variant = "dark",
  compact = false,
}: {
  className?: string;
  variant?: Variant;
  /** Hide the subtitle line (use inside dense chrome) */
  compact?: boolean;
}) {
  const isLight = variant === "light";
  const src = useSiteAsset("logo", logoAsset.url);
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={src}
        alt="EXIT Denim"
        className="h-15 sm:h-16 w-auto shrink-0"
        style={isLight ? { filter: "invert(1) hue-rotate(180deg)", mixBlendMode: "screen", height: "56px" } : { mixBlendMode: "multiply", height: "56px" }}
      />
    </div>
  );
}

