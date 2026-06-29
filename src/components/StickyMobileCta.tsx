import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

export function StickyMobileCta() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) return null;

  return (
    <div className="lg:hidden fixed bottom-4 inset-x-4 z-30">
      {user ? (
        <Link to="/narudzba" className="btn-primary w-full shadow-2xl">
          Моја поруџбина <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <Link to="/postani-partner" className="btn-primary w-full shadow-2xl">
          Затражите B2B приступ <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
