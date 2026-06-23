import logoAsset from "@/assets/exit-logo.png.asset.json";

export function Logo({ className = "h-7", showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src={logoAsset.url} alt="EXIT Denim" className={className} />
      {showWordmark && (
        <span className="hidden sm:inline serif text-[0.78rem] uppercase tracking-[0.32em] font-medium text-foreground/85">
          Denim · B2B
        </span>
      )}
    </span>
  );
}
