import logoAsset from "@/assets/exit-logo.png.asset.json";

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={logoAsset.url} alt="EXIT Denim" className={className} />;
}
