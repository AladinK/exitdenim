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
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoAsset.url}
        alt=""
        aria-hidden
        className="h-9 sm:h-10 w-auto shrink-0"
        style={isLight ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0)" }}
      />
      <div className="flex flex-col leading-none">
        <span
          className={`${ink} text-[18px] sm:text-[20px] tracking-[-0.045em]`}
          style={{ fontWeight: 800 }}
        >
          EXIT<span className="serif-accent ml-1.5" style={{ fontWeight: 400 }}>Denim</span>
        </span>
        {!compact && (
          <span className={`mt-1 text-[9.5px] uppercase tracking-[0.28em] ${sub} font-medium`}>
            Novi Pazar · B2B
          </span>
        )}
      </div>
    </div>
  );
}
