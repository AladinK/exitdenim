import logoAsset from "@/assets/exit-logo.png.asset.json";

type Variant = "dark" | "light";

export function Logo({
  className = "h-9 sm:h-10",
  variant = "dark",
}: {
  className?: string;
  variant?: Variant;
}) {
  return (
    <img
      src={logoAsset.url}
      alt="EXIT Denim"
      className={`${className} w-auto ${variant === "light" ? "invert brightness-0" : ""}`}
      style={variant === "light" ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
