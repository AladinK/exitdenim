import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function StickyMobileCta() {
  const { user } = useAuth();
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-foreground text-background border-t border-background/20">
      {user ? (
        <Link to="/narudzba" className="flex items-center justify-center py-4 font-semibold text-sm tracking-wide">
          Moja narudžba →
        </Link>
      ) : (
        <Link to="/auth" className="flex items-center justify-center py-4 font-semibold text-sm tracking-wide">
          Zatraži B2B pristup →
        </Link>
      )}
    </div>
  );
}
