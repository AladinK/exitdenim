import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RevealLines, FadeUp } from "@/components/RevealText";
import { Magnetic } from "@/components/Magnetic";

const DenimWeave = lazy(() => import("./DenimWeave"));

/**
 * Editorial hero with a lazy-loaded WebGL denim-weave scene.
 * SSR-safe: WebGL only mounts after client hydration and when the browser
 * has a fine pointer + no reduced-motion preference; otherwise a strong
 * static indigo fallback keeps the same composition.
 */
export function Hero() {
  const [enableGL, setEnableGL] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Enable on all non-reduced-motion clients; the shader is cheap and mobile-safe.
    if (!reduced) setEnableGL(true);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#141d2f] text-[color:var(--ivory)]">
      {/* Scene / fallback */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {enableGL ? (
          <Suspense fallback={<StaticFallback />}>
            <DenimWeave />
          </Suspense>
        ) : (
          <StaticFallback />
        )}
        {/* editorial contrast wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1526]/40 via-transparent to-[#0d1526]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_30%,rgba(0,0,0,0.35),transparent_60%)]" />
      </div>

      <div className="container-x relative min-h-[92svh] flex flex-col justify-between pt-28 pb-14 md:pt-32 md:pb-20">
        <FadeUp>
          <div className="flex items-center justify-between gap-6 text-[10px] uppercase tracking-[0.32em] mono text-[color:var(--ivory)]/70">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--ivory)]" />
              SS · 2026
            </span>
            <span className="hidden sm:inline">Нови Пазар — RS</span>
            <span>N° 01</span>
          </div>
        </FadeUp>

        <div className="mt-auto grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-8 items-end">
          <div className="md:col-span-8">
            <RevealLines
              as="h1"
              className="serif text-[color:var(--ivory)] font-normal tracking-[-0.02em] leading-[0.94] text-[clamp(3.25rem,10vw,9rem)]"
            >
              {[
                <span key="1">Деним</span>,
                <span key="2">
                  за <em className="italic serif-accent text-[color:var(--ivory)]/85">бутике</em>.
                </span>,
              ]}
            </RevealLines>
          </div>
          <div className="md:col-span-4 md:pl-6 md:border-l md:border-[color:var(--ivory)]/15">
            <FadeUp delay={0.35}>
              <p className="text-[15px] leading-[1.55] text-[color:var(--ivory)]/75 max-w-sm">
                Затворена платформа за одабране партнере — стабилни кројеви, поуздана
                испорука, марже 2.4–2.8×.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Magnetic strength={0.28}>
                  <Link
                    to="/postani-partner"
                    className="group inline-flex items-center gap-3 px-6 py-4 bg-[color:var(--ivory)] text-[color:var(--ink)] text-[11px] uppercase tracking-[0.24em] font-medium rounded-none hover:bg-white transition-colors"
                  >
                    Затражите приступ
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
                <Link
                  to="/katalog"
                  className="text-[11px] uppercase tracking-[0.24em] font-medium text-[color:var(--ivory)]/90 link-underline"
                >
                  Погледајте каталог
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay={0.5}>
          <div className="mt-14 md:mt-20 border-t border-[color:var(--ivory)]/15 pt-5 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-8 text-[10.5px] mono uppercase tracking-[0.22em] text-[color:var(--ivory)]/60">
            <div>MOQ · 10 ком</div>
            <div>Испорука · 15–25 дана</div>
            <div>Марже · 2.4–2.8×</div>
            <div className="md:text-right">180+ бутика у региону</div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function StaticFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 80% at 30% 20%, #24365a 0%, #172542 45%, #0e1830 80%), repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 5px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 5px)",
      }}
    />
  );
}
