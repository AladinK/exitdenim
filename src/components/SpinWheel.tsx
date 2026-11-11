import { supabase } from "@/integrations/supabase/client";
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

// Editorial, near-monochrome wheel: ink / ivory alternating, brand green only on the top prize.
const SEG_FILL = ["var(--ivory)", "var(--indigo)", "var(--ivory)", "var(--brand-green)", "var(--ivory)", "var(--indigo)", "var(--ivory)", "var(--gold)"];
const SEG_TEXT = ["var(--ink)", "var(--ivory)", "var(--ink)", "var(--ink)", "var(--ink)", "var(--ivory)", "var(--ink)", "var(--ink)"];

/** Opens the spin-wheel modal from anywhere (e.g. the navbar link). */
export function openSpinWheel() {
  window.dispatchEvent(new Event("exit:open-wheel"));
  track("spin_wheel_open");
}

export function SpinWheel() {
  const { promo, applyPromo } = useCart();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ pct: number; code: string } | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    const onOpen = () => { void supabase.auth.getSession().then(({ data }) => { if (data.session) setOpen(true); }); };
    window.addEventListener("exit:open-wheel", onOpen);
    return () => window.removeEventListener("exit:open-wheel", onOpen);
  }, []);

  useEffect(() => {
    setMounted(true);
    const existing = readPromo();
    if (existing) setHasSpun(true);
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

  const conic = `conic-gradient(from 0deg, ${SEGMENTS.map(
    (_, i) => `${SEG_FILL[i]} ${i * SEG_DEG}deg ${(i + 1) * SEG_DEG}deg`,
  ).join(", ")})`;

  const close = () => !spinning && setOpen(false);

  return createPortal(
    <>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="EXIT privilegija — točak popusta"
        >
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={close} />

          <div className="relative w-full sm:max-w-[820px] max-h-[94vh] overflow-y-auto bg-background shadow-2xl ring-1 ring-ivory/15 grid sm:grid-cols-[1.05fr_1fr] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={close}
              disabled={spinning}
              aria-label="Zatvori"
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full inline-flex items-center justify-center bg-background/90 text-foreground hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            {/* Left — wheel stage */}
            <div className="relative bg-ink text-ivory flex flex-col items-center justify-center px-6 pt-9 pb-7 sm:py-12 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_50%_45%,var(--ivory)_0,transparent_60%)]" />
              <div className="relative text-[10px] uppercase tracking-[0.35em] text-ivory/60">EXIT Denim · Beograd</div>

              <div className="relative mt-6 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px]">
                {/* Pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-t-[14px] border-l-transparent border-r-transparent border-t-ivory drop-shadow" />
                </div>
                {/* Outer ring */}
                <div className="absolute -inset-2 rounded-full border border-ivory/20" />
                <div
                  className="w-full h-full rounded-full ring-1 ring-ivory/40"
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
                      <span
                        className={`mt-4 sm:mt-5 font-semibold tracking-[0.12em] ${s.respin ? "text-[8px] sm:text-[9px]" : "text-[12px] sm:text-[14px]"}`}
                        style={{ color: SEG_TEXT[i] }}
                      >
                        {s.respin ? "JOŠ 1" : s.label}
                      </span>
                    </div>
                  ))}
                  {/* Segment dividers */}
                  {SEGMENTS.map((_, i) => (
                    <div
                      key={`d${i}`}
                      className="absolute left-1/2 top-0 h-1/2 w-px bg-ink/15 origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${i * SEG_DEG}deg)` }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 m-auto w-[62px] h-[62px] sm:w-[72px] sm:h-[72px] rounded-full bg-ink ring-1 ring-ivory/30 flex items-center justify-center">
                  <span className="font-display text-[13px] sm:text-[15px] tracking-[0.08em] text-ivory">EXIT</span>
                </div>
              </div>

              <div className="relative mt-6 text-[10px] uppercase tracking-[0.3em] text-ivory/50 hidden sm:block">
                Premium denim · 12 oz · Proizvedeno u Srbiji
              </div>
            </div>

            {/* Right — copy & action */}
            <div className="flex flex-col justify-center px-6 py-7 sm:px-10 sm:py-12">
              {result ? (
                <div className="animate-fade-up">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Čestitamo</div>
                  <h2 className="mt-3 font-display text-[44px] sm:text-[56px] leading-none tracking-tight">
                    −{result.pct}%
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    Vaš popust je aktiviran i biće automatski obračunat na celu porudžbinu.
                  </p>
                  <div className="mt-6 border-t border-b border-border py-3 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Vaš kod</span>
                    <span className="font-mono text-[13px] tracking-[0.15em]">{result.code}</span>
                  </div>
                  <button onClick={() => setOpen(false)} className="btn-primary w-full justify-center mt-6 h-12">
                    Nastavi kupovinu
                  </button>
                </div>
              ) : hasSpun && promo ? (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Vaša privilegija</div>
                  <h2 className="mt-3 font-display text-[40px] sm:text-[48px] leading-none tracking-tight">−{promo.pct}%</h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    Popust je već aktivan i primenjuje se automatski na kasi.
                  </p>
                  <button onClick={() => setOpen(false)} className="btn-primary w-full justify-center mt-6 h-12">
                    Nastavi kupovinu
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Ekskluzivno online</div>
                  <h2 className="mt-3 font-display text-[30px] sm:text-[38px] leading-[1.02] tracking-tight">
                    Do 15% popusta na vašu porudžbinu
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    Zavrtite točak i otključajte svoju privilegiju. Popust se primenjuje automatski na kasi.
                  </p>
                  <ul className="mt-5 space-y-1.5 text-[13px]">
                    <li className="flex items-center gap-2.5"><span className="w-1 h-1 rounded-full bg-accent" />Besplatna dostava širom Srbije</li>
                    <li className="flex items-center gap-2.5"><span className="w-1 h-1 rounded-full bg-accent" />Plaćanje pouzećem</li>
                    <li className="flex items-center gap-2.5"><span className="w-1 h-1 rounded-full bg-accent" />Premium denim 12 oz, 98% pamuk</li>
                  </ul>
                  <button onClick={spin} disabled={spinning} className="btn-primary w-full justify-center mt-7 h-12 disabled:opacity-60">
                    {spinning ? "Točak se okreće…" : "Zavrtite točak"}
                  </button>
                  <button
                    onClick={close}
                    disabled={spinning}
                    className="mt-3 w-full text-center text-[12px] text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-40"
                  >
                    Ne, hvala
                  </button>
                  <p className="mt-5 text-[10px] leading-relaxed text-muted-foreground/80">
                    Jedan pokušaj po uređaju.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
