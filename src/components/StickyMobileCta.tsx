import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

export function StickyMobileCta() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  // Hide on auth and admin to reduce noise
  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-foreground text-background">
      <div className="h-px bg-accent/60" />
      {user ? (
        <Link to="/narudzba" className="flex items-center justify-center gap-2 py-4 text-[11px] uppercase tracking-[0.22em] font-medium">
          My Order <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <Link to="/auth" className="flex items-center justify-center gap-2 py-4 text-[11px] uppercase tracking-[0.22em] font-medium">
          Zatraži B2B pristup <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
