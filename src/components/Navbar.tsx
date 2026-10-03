import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, LogOut, ShoppingBag, Shield, User as UserIcon, ChevronDown, Package, ArrowRight, Wallet, Truck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Logo } from "./Logo";
import { FitSilhouette } from "./FitSilhouette";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/orders.functions";
import { ecommerce } from "@/lib/analytics";

const FITS = ["Slim", "Regular Slim", "Relaxed", "Bootcut", "Flare", "Cargo"];

const NAV: Array<{ to: any; label: string }> = [
  { to: "/katalog", label: "Shop all" },
  { to: "/wide-flare", label: "Wide & Flare" },
  { to: "/jeans", label: "Farmerke" },
  { to: "/chino", label: "Chino" },
  { to: "/cargo", label: "Cargo" },
  { to: "/proizvodnja", label: "O nama" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const [profile, setProfile] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) fetchProfile({}).then(setProfile).catch(() => {});
    else setProfile(null);
  }, [user]); // eslint-disable-line

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); setMenuOpen(false); }, [pathname]);

  // Escape closes; lock page scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);


  const signOut = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const isApproved = profile?.profile?.status === "approved";
  const displayName = profile?.profile?.boutique_name || user?.user_metadata?.full_name || user?.email || "";
  const initials = (displayName || "?").split(/\s+/).map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-background/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className={`container-x flex items-center justify-between transition-all duration-500 ${scrolled ? "h-14" : "h-20"}`}>
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="EXIT Denim — Početna">
          <Logo className={`transition-all duration-500 ${scrolled ? "h-6" : "h-8"}`} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative px-3 py-2 text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              activeProps={{ className: "text-foreground after:scale-x-100" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary text-foreground"
            aria-label={`Korpa (${cartCount})`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold inline-flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border hover:border-foreground/40 transition-colors"
                aria-label="Korisnički meni"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-foreground text-background text-[11px] font-semibold flex items-center justify-center">{initials}</span>
                )}
                <span className="text-[13px] font-medium max-w-[140px] truncate">{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Prijavljeni ste kao</div>
                    <div className="text-sm font-semibold truncate mt-0.5">{displayName}</div>
                    {user.email && displayName !== user.email && (
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    )}
                    <div className="mt-2">
                      {isApproved ? (
                        <span className="chip text-accent"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> B2B odobren</span>
                      ) : (
                        <span className="chip text-muted-foreground">Na čekanju</span>
                      )}
                    </div>
                  </div>
                  <div className="py-1">
                    {profile?.isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                        <Shield className="w-4 h-4 text-accent" /> Admin panel
                      </Link>
                    )}
                    {isApproved && (
                      <Link to="/narudzba" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                        <ShoppingBag className="w-4 h-4" /> Moja porudžbina
                      </Link>
                    )}
                    <Link to="/moje-porudzbine" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                      <Package className="w-4 h-4" /> Moje porudžbine
                    </Link>
                    <Link to="/katalog" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                      <UserIcon className="w-4 h-4" /> Katalog
                    </Link>

                  </div>
                  <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm border-t border-border hover:bg-secondary text-muted-foreground hover:text-foreground">
                    <LogOut className="w-4 h-4" /> Odjava
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" className="text-[14px] font-medium text-muted-foreground hover:text-foreground px-3 py-2">
                Prijava
              </Link>
              <Link to="/katalog" className="btn-primary">Uzmi sad</Link>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary text-foreground"
            aria-label={`Korpa (${cartCount})`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold inline-flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>


      </div>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`lg:hidden fixed inset-x-0 bottom-0 ${scrolled ? "top-14" : "top-20"} z-40 bg-background border-t border-border flex flex-col transition-[opacity,transform] duration-300 ease-out ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="container-x pt-2 flex flex-col" aria-label="Glavni meni">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                tabIndex={open ? 0 : -1}
                onClick={() => { ecommerce.cta(`menu_${n.label}`, "mobile_menu"); setOpen(false); }}
                className="flex items-center justify-between py-4 border-b border-border text-[22px] font-[family-name:var(--font-display)] uppercase active:bg-secondary"
                activeProps={{ className: "text-accent" }}
              >
                {n.label}
                <ArrowRight className="w-5 h-5" />
              </Link>
            ))}
          </nav>

          <div className="container-x pt-6">
            <div className="eyebrow mb-3">Kupuj po fitu</div>
            <div className="grid grid-cols-3 gap-2">
              {FITS.map((f) => (
                <Link
                  key={f}
                  to="/katalog"
                  search={{ fit: f }}
                  tabIndex={open ? 0 : -1}
                  onClick={() => { ecommerce.cta(`menu_fit_${f}`, "mobile_menu"); setOpen(false); }}
                  className="border border-border py-3 flex flex-col items-center gap-1.5 active:bg-secondary"
                >
                  <FitSilhouette fit={f} className="h-14 w-auto" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em]">{f}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="container-x py-6 flex flex-col">
            {user && profile?.isAdmin && (
              <Link to="/admin" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="py-3 text-sm flex items-center gap-2 text-accent">
                <Shield className="w-4 h-4" /> Admin panel
              </Link>
            )}
            {user && isApproved && (
              <Link to="/narudzba" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="py-3 text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> B2B porudžbina
              </Link>
            )}
            {user && (
              <Link to="/moje-porudzbine" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="py-3 text-sm flex items-center gap-2">
                <Package className="w-4 h-4" /> Moje porudžbine
              </Link>
            )}
            <Link to="/kontakt" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="py-3 text-sm flex items-center gap-2 text-muted-foreground">
              Pomoć oko veličine i kontakt
            </Link>
          </div>
        </div>

        <div className="border-t border-border bg-background container-x py-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3">
          <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Wallet className="w-3.5 h-3.5" /> Plaćaš kad stigne</span>
            <span className="inline-flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Besplatno 15.000+</span>
          </div>
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 text-sm font-semibold truncate">{displayName}</div>
              <button tabIndex={open ? 0 : -1} onClick={() => { signOut(); setOpen(false); }} className="btn-outline shrink-0">
                <LogOut className="w-4 h-4" /> Odjava
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Link to="/katalog" tabIndex={open ? 0 : -1} onClick={() => { ecommerce.cta("menu_shop_cta", "mobile_menu"); setOpen(false); }} className="btn-primary w-full">
                Pogledaj sve modele
              </Link>
              <Link to="/auth" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="btn-outline">
                Prijava
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
