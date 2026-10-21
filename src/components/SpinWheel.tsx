import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { readPromo, savePromo, makeCode, ALLOWED_PCT } from "@/lib/promo";
import { track } from "@/lib/analytics";

// 8 segments; the multi-5% layout is the weighting (15% is rare, respin very rare).
const SEGMENTS: { label: string; pct?: number; respin?: boolean }[] = [
  { label: "5%", pct: 5 },
  { label: "10%", pct: 10 },
  { label: "5%", pct: 5 },
  { label: "15%", pct: 15 },
  { label: "5%", pct: 5 },
  { label: "10%", pct: 10 },
  { label: "5%", pct: 5 },
  { label: "JOŠ JEDAN", respin: true },
];
const WEIGHTS = [22, 12, 22, 6, 20, 10, 6, 2];
const SEG_DEG = 360 / SEGMENTS.length;

function pickSegment(): number {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < WEIGHTS.length; i++) {
    r -= WEIGHTS[i];
    if (r <= 0) return i;
  }
  return 0;
}

const SEG_COLORS = ["#0D0D0C", "#1A2A48", "#0D0D0C", "#749D02", "#0D0D0C", "#1A2A48", "#0D0D0C", "#B89968"];

export function SpinWheel() {
  const { promo, applyPromo } = useCart();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ pct: number; code: string } | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const autoOpened = useRef(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("exit:open-wheel", onOpen);
    return () => window.removeEventListener("exit:open-wheel", onOpen);
  }, []);

  useEffect(() => {
    setMounted(true);
    const existing = readPromo();
    if (existing) setHasSpun(true);
    // One gentle auto-open per device, only if the visitor hasn't won yet.
    if (!existing && !sessionStorage.getItem("exit_wheel_seen")) {
      const t = setTimeout(() => {
        if (!autoOpened.current && !readPromo()) {
          autoOpened.current = true;
          sessionStorage.setItem("exit_wheel_seen", "1");
          setOpen(true);
          track("spin_wheel_auto_open");
        }
      }, 18000);
      return () => clearTimeout(t);
    }
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const idx = pickSegment();
    // Land the pointer (top) on the segment center: rotate so segment center hits -90°.
    const segCenter = idx * SEG_DEG + SEG_DEG / 2;
    const jitter = (Math.random() - 0.5) * (SEG_DEG * 0.5);
    const target = rotation + 360 * 6 + (360 - ((rotation % 360) + segCenter + jitter) % 360);
    setRotation(target);
    track("spin_wheel_spin");

    window.setTimeout(() => {
      setSpinning(false);
      const seg = SEGMENTS[idx];
      if (seg.respin) {
        // Extra spin — the casino near-miss hook.
        window.setTimeout(() => spin(), 900);
        return;
      }
      const pct = seg.pct!;
      const code = makeCode(pct);
      const won = { pct, code, wonAt: Date.now() };
      savePromo(won);
      applyPromo(won);
      setResult({ pct, code });
      setHasSpun(true);
      track("spin_wheel_win", { pct, code });
    }, 4600);
  };

  if (!mounted) return null;

  const conic = `conic-gradient(from -90deg, ${SEGMENTS.map(
    (_, i) => `${SEG_COLORS[i]} ${i * SEG_DEG}deg ${(i + 1) * SEG_DEG}deg`,
  ).join(", ")})`;

  return createPortal(
    <>
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Točak sreće">
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => !spinning && setOpen(false)} />
          <div className="relative w-full max-w-sm bg-background border border-border shadow-2xl p-6 text-center">
            <button
              onClick={() => setOpen(false)}
              disabled={spinning}
              aria-label="Zatvori"
              className="absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center hover:bg-secondary disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="eyebrow">EXIT točak sreće</div>
            <h2 className="mt-2 text-2xl">Zavrti i osvoji popust</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Popust važi odmah, na celu porudžbinu. Jedan spin po poseti.
            </p>

            {/* Wheel */}
            <div className="relative mx-auto mt-6 w-[260px] h-[260px]">
              {/* Pointer */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-accent" />
              <div
                className="w-full h-full rounded-full border-4 border-foreground shadow-xl"
                style={{
                  background: conic,
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? "transform 4.5s cubic-bezier(.17,.67,.12,.99)" : "none",
                }}
              >
                {SEGMENTS.map((s, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex justify-center"
                    style={{ transform: `rotate(${i * SEG_DEG + SEG_DEG / 2}deg)` }}
                  >
                    <span className="mt-4 text-[11px] font-bold tracking-wider text-[#F5F0E7] [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-background border-2 border-foreground flex items-center justify-center text-[10px] font-bold tracking-[0.2em]">
                EXIT
              </div>
            </div>

            {/* Result / CTA */}
            {result ? (
              <div className="mt-6 animate-fade-up">
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Osvojili ste</div>
                <div className="mt-1 text-4xl font-bold text-accent">−{result.pct}%</div>
                <div className="mt-2 inline-block border border-dashed border-foreground px-3 py-1.5 text-sm font-mono tracking-widest">
                  {result.code}
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Popust je sačuvan i primenjuje se automatski na kasi.
                </p>
                <button onClick={() => setOpen(false)} className="btn-primary w-full justify-center mt-4">
                  Nastavi kupovinu
                </button>
              </div>
            ) : hasSpun && promo ? (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Već imate osvojen popust od <b className="text-foreground">−{promo.pct}%</b> — primenjuje se automatski na kasi.
                </p>
                <button onClick={() => setOpen(false)} className="btn-outline w-full justify-center mt-4">
                  Zatvori
                </button>
              </div>
            ) : (
              <button onClick={spin} disabled={spinning} className="btn-primary w-full justify-center mt-6 disabled:opacity-60">
                {spinning ? "Točak se vrti…" : "Zavrti točak"}
              </button>
            )}
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
