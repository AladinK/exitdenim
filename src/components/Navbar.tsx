import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Lock, LogOut, ShoppingBag, Shield } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/orders.functions";

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

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

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
            >{n.label}</Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {user && profile?.isAdmin && (
            <Link to="/admin" className="text-sm font-medium flex items-center gap-1.5 text-foreground/80 hover:text-foreground">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          {user && profile?.profile?.status === "approved" && (
            <Link to="/narudzba" className="text-sm font-medium flex items-center gap-1.5 text-foreground/80 hover:text-foreground">
              <ShoppingBag className="w-3.5 h-3.5" /> Narudžba
            </Link>
          )}
          {user ? (
            <>
              <span className="text-xs text-muted-foreground">{profile?.profile?.boutique_name || user.email}</span>
              <button onClick={signOut} className="btn-outline text-xs px-3 py-2">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium flex items-center gap-1.5 text-foreground/80 hover:text-foreground">
                <Lock className="w-3.5 h-3.5" /> Login
              </Link>
              <Link to="/auth" className="btn-primary">Zatraži B2B pristup</Link>
            </>
          )}
        </div>
        <button className="lg:hidden p-2 -mr-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-base font-medium border-b border-border/60">{n.label}</Link>
            ))}
            {user && profile?.isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="py-3 text-base font-medium border-b border-border/60 text-accent">Admin panel</Link>
            )}
            {user && profile?.profile?.status === "approved" && (
              <Link to="/narudzba" onClick={() => setOpen(false)} className="py-3 text-base font-medium border-b border-border/60">Moja narudžba</Link>
            )}
            {user ? (
              <button onClick={() => { signOut(); setOpen(false); }} className="btn-outline mt-4">
                <LogOut className="w-4 h-4" /> Odjavi se
              </button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="btn-primary mt-4">Zatraži B2B pristup</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
