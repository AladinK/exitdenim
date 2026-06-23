import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Lock } from "lucide-react";
import { Logo } from "./Logo";
import { useB2BAccess } from "@/lib/b2b";

const NAV = [
  { to: "/katalog", label: "B2B Katalog" },
  { to: "/jeans", label: "Jeans" },
  { to: "/chino", label: "Chino" },
  { to: "/cargo", label: "Cargo" },
  { to: "/proizvodnja", label: "Proizvodnja" },
  { to: "/media-kit", label: "Media Kit" },
  { to: "/faq", label: "FAQ" },
  { to: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { approved } = useB2BAccess();

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Logo className="h-7" />
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {approved ? (
            <span className="eyebrow text-accent">B2B aktivan</span>
          ) : (
            <Link to="/postani-partner" className="text-sm font-medium flex items-center gap-1.5 text-foreground/80 hover:text-foreground">
              <Lock className="w-3.5 h-3.5" /> B2B login
            </Link>
          )}
          <Link to="/postani-partner" className="btn-primary">
            Zatraži B2B pristup
          </Link>
        </div>
        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium border-b border-border/60"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/postani-partner"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4"
            >
              Zatraži B2B pristup
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
