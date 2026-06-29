import logoAsset from "@/assets/exit-logo.png.asset.json";

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
  const ink = isLight ? "text-white" : "text-foreground";
  const sub = isLight ? "text-white/55" : "text-muted-foreground";
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoAsset.url}
        alt="EXIT Denim"
        className="h-15 sm:h-16 w-auto shrink-0"
        style={isLight ? { filter: "brightness(0) invert(1)", height: "60px" } : { filter: "brightness(0)", height: "60px" }}
      />
    </div>
  );
}
