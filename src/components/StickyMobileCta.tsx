import { Link } from "@tanstack/react-router";

export function StickyMobileCta() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-foreground text-background border-t border-background/20">
      <Link to="/postani-partner" className="flex items-center justify-center py-4 font-semibold text-sm tracking-wide">
        Zatraži B2B pristup →
      </Link>
    </div>
  );
}
