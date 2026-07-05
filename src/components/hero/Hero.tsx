import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RevealLines, FadeUp } from "@/components/RevealText";
import { Magnetic } from "@/components/Magnetic";

const DenimWeave = lazy(() => import("./DenimWeave"));

export function Hero() {
  const [enableGL, setEnableGL] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) setEnableGL(true);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#141d2f] text-[color:var(--ivory)]">
      <div className="absolute inset-0 -z-10" aria-hidden>
        {enableGL ? (
          <Suspense fallback={<StaticFallback />}>
            <DenimWeave />
          </Suspense>
        ) : (
          <StaticFallback />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1526]/40 via-transparent to-[#0d1526]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_30%,rgba(0,0,0,0.35),transparent_60%)]" />
      </div>

      <div className="container-x relative min-h-[92svh] flex flex-col justify-end pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-8 items-end">
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
                Мала породична производња из Новог Пазара. Стабилан крој, поштен рок, марже 2.4–2.8×.
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
                  Каталог
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
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
