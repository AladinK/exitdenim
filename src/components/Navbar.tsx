import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, LogOut, ShoppingBag, Shield, User as UserIcon, Package, ArrowUpRight, Truck, Sparkles } from "lucide-react";
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

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
  ["Slim", "Uži kroj"], ["Regular Slim", "Ravan, blago uži"], ["Relaxed", "Opušten kroj"],
  ["Bootcut", "Blago proširene nogavice"], ["Flare", "Široke nogavice"], ["Cargo", "Džeparke"], ["Cropped", "Kraće nogavice"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getMyProfile>> | null>(null);
  useEffect(() => {
    let current = true;
    setProfile(null);
    if (user) void fetchProfile({}).then((data) => { if (current) setProfile(data); }).catch(() => {});
    return () => { current = false; };
  }, [user, fetchProfile]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const close = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  const signOut = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  };
  const isApproved = profile?.profile?.status === "approved";
  const displayName = profile?.profile?.boutique_name || user?.user_metadata?.full_name || user?.email || "Vaš nalog";
  const closeMenu = (label: string) => { ecommerce.cta(`menu_${label}`, "mobile_menu"); setOpen(false); };

  return <header className={`exit-navigation ${pathname === "/" && !scrolled ? "exit-navigation-home" : "exit-navigation-solid"}`}>
    <div className="exit-navigation-inner">
      <div className="exit-header-start">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="fashion" className="exit-menu-trigger xl:hidden" aria-label="Otvori meni"><Menu /><span>Meni</span></Button>
          </SheetTrigger>
          <SheetContent side="left" className="storefront exit-menu-panel" id="mobile-menu">
            <div className="exit-menu-heading">
              <Link to="/" aria-label="EXIT Denim — Početna" onClick={() => setOpen(false)}><Logo /></Link>
              <SheetTitle className="sr-only">Glavni meni</SheetTitle>
              <SheetDescription className="sr-only">Prodavnica, krojevi, pomoć i vaš nalog.</SheetDescription>
            </div>
            <div className="exit-menu-scroll">
              <div className="exit-menu-section-label">Prodavnica</div>
              <nav aria-label="Glavni meni" className="exit-menu-primary">
                {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => closeMenu(n.label)} activeOptions={{ exact: true }} activeProps={{ className: "is-active" }}>
                  <span>{n.label}</span><ArrowUpRight aria-hidden="true" />
                </Link>)}
              </nav>
              <details className="exit-menu-fits">
                <summary>Izaberite kroj</summary>
                <div>{FITS.map(([fit, label]) => <Link key={fit} to="/katalog" search={{ fit }} onClick={() => closeMenu(fit)}>{label}<span>{fit}</span></Link>)}</div>
              </details>
              <nav aria-label="Pomoć i EXIT" className="exit-menu-secondary">
                {INFO.map((n) => <Link key={n.to} to={n.to} onClick={() => closeMenu(n.label)}>{n.label}</Link>)}
              </nav>
              <Button variant="ghost" className="exit-menu-promo" onClick={() => { setOpen(false); window.setTimeout(openSpinWheel, 250); }}><Sparkles />Osvojite popust</Button>
            </div>
            <div className="exit-menu-bottom">
              {user ? <>
                <div className="exit-menu-user">{displayName}</div>
                <div className="flex flex-wrap gap-2">
                  {profile?.isAdmin && <Button asChild variant="outline"><Link to="/admin" onClick={() => setOpen(false)}><Shield />Administracija</Link></Button>}
                  {isApproved && <Button asChild variant="outline"><Link to="/narudzba" onClick={() => setOpen(false)}>B2B porudžbina</Link></Button>}
                  <Button asChild variant="outline"><Link to="/moje-porudzbine" onClick={() => setOpen(false)}><Package />Moje porudžbine</Link></Button>
                  <Button variant="ghost" onClick={signOut}><LogOut />Odjava</Button>
                </div>
              </> : <Button asChild variant="outline" className="w-full"><Link to="/auth" onClick={() => setOpen(false)}><UserIcon />Prijava / registracija</Link></Button>}
              <p><Truck />Besplatna dostava · Plaćanje pouzećem</p>
            </div>
          </SheetContent>
        </Sheet>
        <nav aria-label="Prodavnica" className="exit-navigation-links hidden xl:flex">
          {NAV.map((n) => <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "is-active" }}>{n.label}</Link>)}
        </nav>
      </div>
      <Link to="/" className="exit-navigation-logo" aria-label="EXIT Denim — Početna"><Logo /></Link>
      <div className="exit-header-actions">
        <StoreSearch />
        <Button variant="fashion" size="icon" className="exit-header-icon" aria-label={`Korpa (${cartCount})`} title="Korpa" onClick={() => setCartOpen(true)}>
          <ShoppingBag />{cartCount > 0 && <span className="exit-cart-count">{cartCount}</span>}
        </Button>
        <div className="hidden xl:block">
          {user ? <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="fashion" size="icon" className="exit-header-icon" aria-label="Korisnički meni" title="Vaš nalog"><UserIcon /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="storefront exit-account-menu">
              <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profile?.isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Shield />Administracija</Link></DropdownMenuItem>}
              {isApproved && <DropdownMenuItem asChild><Link to="/narudzba"><ShoppingBag />B2B porudžbina</Link></DropdownMenuItem>}
              <DropdownMenuItem asChild><Link to="/moje-porudzbine"><Package />Moje porudžbine</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => { void signOut(); }}><LogOut />Odjava</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <Button asChild variant="fashion" size="icon" className="exit-header-icon"><Link to="/auth" aria-label="Prijava" title="Prijava"><UserIcon /></Link></Button>}
        </div>
      </div>
    </div>
  </header>;
}
