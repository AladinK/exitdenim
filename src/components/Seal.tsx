import sealAsset from "@/assets/exit-seal.png.asset.json";

type Props = {
  className?: string;
  tone?: "green" | "ink" | "ivory";
  opacity?: number;
  title?: string;
};

/**
 * EXIT brand seal (chevron mark) — used as a watermark/stamp across the site.
 * Recolored via CSS filters so the same PNG mark works in any tone.
 */
export function Seal({ className = "w-10 h-10", tone = "green", opacity = 1, title }: Props) {
  const filterByTone: Record<NonNullable<Props["tone"]>, string> = {
    // brand green ≈ #6FA03A
    green:
      "brightness(0) saturate(100%) invert(54%) sepia(45%) saturate(560%) hue-rotate(45deg) brightness(92%) contrast(86%)",
    ink: "brightness(0)",
    ivory: "brightness(0) invert(1)",
  };
  return (
    <img
      src={sealAsset.url}
      alt={title ?? "EXIT brand mark"}
      aria-hidden={title ? undefined : true}
      className={className}
      style={{ filter: filterByTone[tone], opacity }}
      draggable={false}
    />
  );
}
