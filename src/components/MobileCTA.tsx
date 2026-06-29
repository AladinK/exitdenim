import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Sticky bottom CTA shown on mobile only. Hidden when on partner / auth / admin
 * routes where the action is already the primary intent.
 */
export function MobileCTA() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const hide =
    user ||
    pathname.startsWith("/postani-partner") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/narudzba");

  if (hide) return null;

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 pointer-events-none">
      <div
        className="pointer-events-auto mx-3 mb-3 rounded-full border border-border bg-background/95 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(27,26,23,0.35)] flex items-center gap-2 pl-4 pr-1.5 py-1.5"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
            Велепродаја
          </div>
          <div className="text-[13px] font-semibold text-foreground truncate -mt-0.5">
            Затражите B2B приступ
          </div>
        </div>
        <Link
          to="/postani-partner"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2.5 text-[12px] font-semibold tracking-wide"
        >
          Пријава <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
