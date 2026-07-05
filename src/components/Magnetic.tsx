import { useRef, type ReactNode } from "react";

/**
 * Magnetic hover — child element eases toward the cursor within its bounding box.
 * No-op on touch and when prefers-reduced-motion is set.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined") {
      if (window.matchMedia("(hover: none)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    }
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <span
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-block ${className}`}
      style={{ willChange: "transform" }}
    >
      <span ref={ref} className="inline-block transition-transform duration-300 ease-out" style={{ willChange: "transform" }}>
        {children}
      </span>
    </span>
  );
}
