import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  LogOut,
  Menu,
  Package,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
  User as UserIcon,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { openSpinWheel } from "./SpinWheel";
import { Logo } from "./Logo";
import { StoreSearch } from "./StoreSearch";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/orders.functions";
import { ecommerce } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/katalog", label: "Svi modeli" },
  { to: "/jeans", label: "Farmerke" },
  { to: "/wide-flare", label: "Široke farmerke" },
  { to: "/chino", label: "Chino pantalone" },
  { to: "/cargo", label: "Džeparke" },
] as const;
const INFO = [
  { to: "/vodic-za-farmerke", label: "Vodič za farmerke" },
  { to: "/faq", label: "Kupovina i dostava" },
  { to: "/kontakt", label: "Kontakt i pomoć" },
  { to: "/proizvodnja", label: "O nama i proizvodnji" },
  { to: "/private-label", label: "Izrada za vaš brend" },
  { to: "/postani-partner", label: "Veleprodaja" },
] as const;
const FITS = [
  ["Slim", "Uži kroj"],
  ["Regular Slim", "Ravan, blago uži"],
  ["Relaxed", "Opušten kroj"],
  ["Bootcut", "Blago proširene nogavice"],
  ["Flare", "Široke nogavice"],
  ["Cargo", "Džeparke"],
  ["Cropped", "Kraće nogavice"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getMyProfile>> | null>(null);

  useEffect(() => {
    let current = true;
    setProfile(null);
    if (user) {
      void fetchProfile({})
        .then((data) => {
          if (current) setProfile(data);
        })
        .catch(() => {});
    }
    return () => {
      current = false;
    };
  }, [user, fetchProfile]);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const close = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  const signOut = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  };
  const isApproved = profile?.profile?.status === "approved";
  const displayName =
    profile?.profile?.boutique_name || user?.user_metadata?.full_name || user?.email || "Vaš nalog";
  const closeMenu = (label: string) => {
    ecommerce.cta(`menu_${label}`, "mobile_menu");
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__start">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button type="button" className="icon-button site-header__menu-trigger" aria-label="Otvori meni">
                <Menu aria-hidden="true" />
                <span className="hidden sm:inline">Meni</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="menu-panel w-full max-w-[420px] sm:max-w-[420px]" id="mobile-menu">
              <div className="menu-panel__head">
                <Link to="/" aria-label="EXIT Denim — Početna" onClick={() => setOpen(false)}>
                  <Logo />
                </Link>
                <SheetTitle className="sr-only">Glavni meni</SheetTitle>
                <SheetDescription className="sr-only">Prodavnica, krojevi, pomoć i vaš nalog.</SheetDescription>
              </div>
              <div className="menu-panel__scroll">
                <div className="menu-panel__label">Prodavnica</div>
                <nav aria-label="Glavni meni" className="menu-primary">
                  {NAV.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => closeMenu(n.label)}
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "is-active" }}
                    >
                      <span>{n.label}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  ))}
                </nav>
                <details className="menu-fits">
                  <summary>
                    Izaberite kroj <ChevronDown aria-hidden="true" />
                  </summary>
                  <div>
                    {FITS.map(([fit, label]) => (
                      <Link key={fit} to="/katalog" search={{ fit }} onClick={() => closeMenu(fit)}>
                        {label}
                        <span>{fit}</span>
                      </Link>
                    ))}
                  </div>
                </details>
                <div className="menu-panel__label">Pomoć i EXIT</div>
                <nav aria-label="Pomoć i EXIT" className="menu-secondary">
                  {INFO.map((n) => (
                    <Link key={n.to} to={n.to} onClick={() => closeMenu(n.label)}>
                      {n.label}
                    </Link>
                  ))}
                </nav>
                {user && (
                  <Button
                    variant="ghost"
                    className="mt-3 -ml-3 justify-start"
                    onClick={() => {
                      setOpen(false);
                      window.setTimeout(openSpinWheel, 250);
                    }}
                  >
                    <Sparkles aria-hidden="true" />
                    Osvojite popust
                  </Button>
                )}
              </div>
              <div className="menu-panel__foot">
                {user ? (
                  <>
                    <div className="menu-panel__user">{displayName}</div>
                    <div className="flex flex-wrap gap-2">
                      {profile?.isAdmin && (
                        <Button asChild variant="outline">
                          <Link to="/admin" onClick={() => setOpen(false)}>
                            <Shield aria-hidden="true" />
                            Administracija
                          </Link>
                        </Button>
                      )}
                      {isApproved && (
                        <Button asChild variant="outline">
                          <Link to="/narudzba" onClick={() => setOpen(false)}>
                            B2B porudžbina
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="outline">
                        <Link to="/moje-porudzbine" onClick={() => setOpen(false)}>
                          <Package aria-hidden="true" />
                          Moje porudžbine
                        </Link>
                      </Button>
                      <Button variant="ghost" onClick={signOut}>
                        <LogOut aria-hidden="true" />
                        Odjava
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <UserIcon aria-hidden="true" />
                      Prijava i registracija
                    </Link>
                  </Button>
                )}
                <p>
                  <Truck aria-hidden="true" />
                  Besplatna dostava · plaćanje pouzećem
                </p>
              </div>
            </SheetContent>
          </Sheet>
          <nav aria-label="Prodavnica" className="site-header__links">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "is-active" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link to="/" className="site-header__logo" aria-label="EXIT Denim — Početna">
          <Logo />
        </Link>

        <div className="site-header__end">
          <StoreSearch />
          <div className="hidden xl:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="icon-button" aria-label="Vaš nalog" title="Vaš nalog">
                    <UserIcon aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="account-menu">
                  <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {profile?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield aria-hidden="true" />
                        Administracija
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isApproved && (
                    <DropdownMenuItem asChild>
                      <Link to="/narudzba">
                        <ShoppingBag aria-hidden="true" />
                        B2B porudžbina
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/moje-porudzbine">
                      <Package aria-hidden="true" />
                      Moje porudžbine
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      void signOut();
                    }}
                  >
                    <LogOut aria-hidden="true" />
                    Odjava
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="icon-button" aria-label="Prijava" title="Prijava">
                <UserIcon aria-hidden="true" />
              </Link>
            )}
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={cartCount > 0 ? `Korpa, ${cartCount} artikala` : "Korpa"}
            title="Korpa"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag aria-hidden="true" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
