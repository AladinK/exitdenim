import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, LogOut, ShoppingBag, Shield, User as UserIcon, ChevronDown } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/orders.functions";

const NAV: Array<{ to: any; label: string }> = [
  { to: "/", label: "Почетна" },
  { to: "/katalog", label: "Продавница" },
  { to: "/postani-partner", label: "Постаните партнер" },
  { to: "/proizvodnja", label: "Производња" },
  { to: "/kontakt", label: "Контакт" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border"
          : "bg-background/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="EXIT Denim — Почетна">
          <Logo className="h-8" />
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
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border hover:border-foreground/40 transition-colors"
                aria-label="Кориснички мени"
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
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Пријављени сте као</div>
                    <div className="text-sm font-semibold truncate mt-0.5">{displayName}</div>
                    {user.email && displayName !== user.email && (
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    )}
                    <div className="mt-2">
                      {isApproved ? (
                        <span className="chip text-accent"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> B2B одобрен</span>
                      ) : (
                        <span className="chip text-muted-foreground">На чекању</span>
                      )}
                    </div>
                  </div>
                  <div className="py-1">
                    {profile?.isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                        <Shield className="w-4 h-4 text-accent" /> Админ панел
                      </Link>
                    )}
                    {isApproved && (
                      <Link to="/narudzba" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                        <ShoppingBag className="w-4 h-4" /> Моја поруџбина
                      </Link>
                    )}
                    <Link to="/katalog" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                      <UserIcon className="w-4 h-4" /> Каталог
                    </Link>
                  </div>
                  <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm border-t border-border hover:bg-secondary text-muted-foreground hover:text-foreground">
                    <LogOut className="w-4 h-4" /> Одјава
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" className="text-[14px] font-medium text-muted-foreground hover:text-foreground px-3 py-2">
                Пријава
              </Link>
              <Link to="/postani-partner" className="btn-primary">B2B Приступ</Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Затвори мени" : "Отвори мени"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-0 z-50 bg-background flex flex-col animate-fade-up">
          <div className="container-x flex items-center justify-between h-16 border-b border-border">
            <Logo className="h-8" />
            <button onClick={() => setOpen(false)} aria-label="Затвори мени" className="inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="container-x flex-1 overflow-y-auto py-6 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-lg font-medium py-3 px-3 rounded-md hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            {user && profile?.isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-lg font-medium py-3 px-3 rounded-md text-accent hover:bg-secondary">Админ панел</Link>
            )}
            {user && isApproved && (
              <Link to="/narudzba" onClick={() => setOpen(false)} className="text-lg font-medium py-3 px-3 rounded-md hover:bg-secondary">Моја поруџбина</Link>
            )}
          </nav>
          <div className="container-x border-t border-border py-4">
            {user ? (
              <button onClick={() => { signOut(); setOpen(false); }} className="btn-outline w-full">
                <LogOut className="w-4 h-4" /> Одјава
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/postani-partner" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Затражите B2B приступ
                </Link>
                <Link to="/auth" onClick={() => setOpen(false)} className="btn-outline w-full">
                  Пријава
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
