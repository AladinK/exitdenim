import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

/**
 * Premium floating B2B pill — visible only on mobile, only on public routes.
 * Hides for authenticated/admin/order/auth routes and for the partner page itself.
 */
export function StickyMobileCta() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const hide =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/narudzba") ||
    pathname.startsWith("/postani-partner");
  if (hide) return null;

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 pointer-events-none">
      <div
        className="pointer-events-auto mx-3 mb-3 rounded-full border border-border bg-background/95 backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(27,26,23,0.45)] flex items-center gap-2 pl-4 pr-1.5 py-1.5"
        style={{ marginBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex-1 min-w-0 leading-tight">
          <div className="text-[9.5px] uppercase tracking-[0.24em] text-muted-foreground font-medium">
            EXIT Denim · Велепродаја
          </div>
          <div className="text-[13px] font-semibold text-foreground truncate">
            {user ? "Моја поруџбина" : "Затражите B2B приступ"}
          </div>
        </div>
        <Link
          to={user ? "/narudzba" : "/postani-partner"}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background pl-4 pr-3.5 py-2.5 text-[11.5px] font-semibold tracking-[0.1em] uppercase"
        >
          {user ? "Отвори" : "Пријава"} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
