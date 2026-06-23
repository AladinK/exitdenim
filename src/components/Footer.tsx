import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="bg-background inline-block p-3">
              <Logo className="h-8" showWordmark={false} />
            </div>
            <p className="serif text-2xl md:text-3xl mt-8 max-w-md leading-tight text-background/90">
              Premium denim, designed for boutique rotation. Produced in Novi Pazar, Serbia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="btn-accent">Request B2B Access</Link>
              <Link to="/katalog" className="btn-outline border-background text-background hover:bg-background hover:text-foreground">
                View Catalog
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.28em] text-background/55">Showroom</div>
            <ul className="mt-5 space-y-2.5 text-sm text-background/80">
              <li><Link to="/katalog" className="hover:text-accent transition-colors">B2B Catalog</Link></li>
              <li><Link to="/jeans" className="hover:text-accent transition-colors">Jeans</Link></li>
              <li><Link to="/chino" className="hover:text-accent transition-colors">Chino</Link></li>
              <li><Link to="/cargo" className="hover:text-accent transition-colors">Cargo</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.28em] text-background/55">House</div>
            <ul className="mt-5 space-y-2.5 text-sm text-background/80">
              <li><Link to="/postani-partner" className="hover:text-accent transition-colors">Partner Program</Link></li>
              <li><Link to="/proizvodnja" className="hover:text-accent transition-colors">Production</Link></li>
              <li><Link to="/media-kit" className="hover:text-accent transition-colors">Media Kit</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.28em] text-background/55">Wholesale Desk</div>
            <ul className="mt-5 space-y-2.5 text-sm text-background/80">
              <li>Novi Pazar, Srbija</li>
              <li><a href="mailto:wholesale@exitdenim.rs" className="hover:text-accent transition-colors">wholesale@exitdenim.rs</a></li>
              <li>WhatsApp · Viber</li>
              <li className="tabular-nums">+381 6X XXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/15 mt-16 pt-6 flex flex-col md:flex-row justify-between gap-3 text-[10px] uppercase tracking-[0.28em] text-background/55">
          <div>© {new Date().getFullYear()} EXIT Denim · Made in Serbia</div>
          <div className="flex gap-6">
            <span>Private B2B Showroom</span>
            <span>By Application Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
