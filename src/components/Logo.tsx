type Variant = "dark" | "light";

export function Logo({
  className = "",
  variant = "dark",
  compact = false,
}: {
  className?: string;
  variant?: Variant;
  compact?: boolean;
}) {
  const ink = variant === "dark" ? "text-foreground" : "text-background";
  const sub = variant === "dark" ? "text-foreground/55" : "text-background/70";

  return (
    <span className={`inline-flex items-center gap-3 leading-none ${className}`}>
      {/* Selvedge mark */}
      <span className="relative inline-flex flex-col items-center justify-center">
        <span className="h-7 w-[3px] bg-[var(--selvedge)] rounded-[1px]" aria-hidden />
      </span>

      {/* Wordmark */}
      <span className="inline-flex flex-col items-start">
        <span
          className={`serif ${ink} font-medium tracking-[0.06em] text-[1.45rem] sm:text-[1.6rem]`}
          style={{ lineHeight: 0.95 }}
        >
          EXIT<span className="text-[var(--selvedge)]">.</span>DENIM
        </span>
        {!compact && (
          <span
            className={`mono ${sub} mt-1 text-[8.5px] sm:text-[9px] uppercase tracking-[0.34em]`}
          >
            B2B Wholesale · Novi&nbsp;Pazar / RS
          </span>
        )}
      </span>
    </span>
  );
}
