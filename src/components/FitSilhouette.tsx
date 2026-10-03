// Front-view trouser silhouette per fit: thigh (t), knee (k), hem (e) widths per leg.
const SHAPES: Record<string, { t: number; k: number; e: number }> = {
  Slim: { t: 24, k: 13, e: 11 },
  "Regular Slim": { t: 28, k: 18, e: 15 },
  Relaxed: { t: 34, k: 27, e: 27 },
  Bootcut: { t: 25, k: 15, e: 28 },
  Flare: { t: 25, k: 13, e: 30 },
  Cargo: { t: 32, k: 24, e: 22 },
};

export function FitSilhouette({ fit, className }: { fit: string; className?: string }) {
  const s = SHAPES[fit] ?? SHAPES["Regular Slim"];
  const h = (n: number) => n / 2;
  const d = [
    "M20 4 H80",
    `L${65 + h(s.t)} 52`,
    `L${65 + h(s.k)} 105`,
    `L${65 + h(s.e)} 156`,
    `H${65 - h(s.e)}`,
    `L${65 - h(s.k)} 105`,
    "L50 60",
    `L${35 + h(s.k)} 105`,
    `L${35 + h(s.e)} 156`,
    `H${35 - h(s.e)}`,
    `L${35 - h(s.k)} 105`,
    `L${35 - h(s.t)} 52`,
    "Z",
  ].join(" ");
  return (
    <svg viewBox="0 0 100 160" className={className} role="img" aria-label={`${fit} fit silueta`}>
      <path d={d} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="20" y1="12" x2="80" y2="12" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      <line x1="50" y1="12" x2="50" y2="40" stroke="currentColor" strokeWidth={1} opacity={0.5} />
      {fit === "Cargo" && (
        <>
          <rect x={35 - h(s.t) + 2} y={66} width={12} height={16} fill="none" stroke="currentColor" strokeWidth={1} />
          <rect x={65 + h(s.t) - 14} y={66} width={12} height={16} fill="none" stroke="currentColor" strokeWidth={1} />
        </>
      )}
      <line x1="0" y1="105" x2="100" y2="105" stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 3" opacity={0.35} />
    </svg>
  );
}
