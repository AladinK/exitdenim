import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, ShoppingBag, Shield } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/orders.functions";

const NAV: Array<{ to: any; label: string }> = [
  { to: "/", label: "Home" },
  { to: "/katalog", label: "B2B Catalog" },
  { to: "/jeans", label: "Jeans" },
  { to: "/chino", label: "Chino" },
  { to: "/cargo", label: "Cargo" },
  { to: "/postani-partner", label: "Become a Partner" },
  { to: "/proizvodnja", label: "Production" },
  { to: "/kontakt", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile({}).then(setProfile).catch(() => {});
    } else {
      setProfile(null);
    }
  }, [user]); // eslint-disable-line

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const isApproved = profile?.profile?.status === "approved";

  return (
    <header
      className={`sticky top-0 z-40 transition-[background,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md shadow-[0_1px_0_0_var(--color-border)]" : "bg-background"
      }`}
    >
      {/* Announcement bar */}
      <div className="hidden md:block bg-foreground text-background text-[10px] tracking-[0.32em] uppercase">
        <div className="container-x flex items-center justify-between py-2">
          <span>Premium Denim · Made in Novi Pazar, Serbia</span>
          <span className="text-accent">B2B Wholesale Showroom — Pristup samo za butike</span>
        </div>
      </div>

      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo className="h-8" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-underline text-[11px] uppercase tracking-[0.22em] font-medium text-foreground/75 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          {user && profile?.isAdmin && (
            <Link to="/admin" className="text-[11px] uppercase tracking-[0.22em] flex items-center gap-1.5 text-foreground/75 hover:text-foreground">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          {user && isApproved && (
            <Link to="/narudzba" className="text-[11px] uppercase tracking-[0.22em] flex items-center gap-1.5 text-foreground/75 hover:text-foreground">
              <ShoppingBag className="w-3.5 h-3.5" /> Order
            </Link>
          )}
          {user ? (
            <>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground max-w-[160px] truncate">
                {profile?.profile?.boutique_name || user.email}
              </span>
              <button onClick={signOut} aria-label="Sign out" className="border border-foreground/30 hover:border-foreground p-2.5 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">B2B Access</Link>
          )}
        </div>

        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer — full-screen */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-0 z-50 bg-background flex flex-col">
          <div className="container-x flex items-center justify-between h-20 border-b border-border">
            <Logo className="h-8" />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 -mr-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="container-x flex-1 overflow-y-auto py-8 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="serif text-3xl py-4 border-b border-border/60 tracking-tight"
              >
                {n.label}
              </Link>
            ))}
            {user && profile?.isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="serif text-3xl py-4 border-b border-border/60 text-accent">Admin panel</Link>
            )}
            {user && isApproved && (
              <Link to="/narudzba" onClick={() => setOpen(false)} className="serif text-3xl py-4 border-b border-border/60">My Order</Link>
            )}
          </nav>
          <div className="container-x border-t border-border py-5 bg-foreground text-background">
            {user ? (
              <button onClick={() => { signOut(); setOpen(false); }} className="w-full flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.22em]">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="w-full flex items-center justify-center py-3 text-[11px] uppercase tracking-[0.22em] text-background">
                Zatraži B2B pristup →
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
