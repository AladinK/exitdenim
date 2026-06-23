import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container-x py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="bg-background inline-block p-2 rounded-sm">
            <Logo className="h-7" />
          </div>
          <p className="mt-5 text-sm text-background/70 max-w-sm leading-relaxed">
            EXIT Denim — muški denim, chino i cargo. Wholesale partner za butike u Srbiji,
            BiH, Crnoj Gori, Sjevernoj Makedoniji, Hrvatskoj, Sloveniji i Grčkoj.
          </p>
        </div>
        <div>
          <div className="eyebrow text-background/60">B2B</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/postani-partner" className="hover:text-accent">Postani partner</Link></li>
            <li><Link to="/katalog" className="hover:text-accent">B2B Katalog</Link></li>
            <li><Link to="/media-kit" className="hover:text-accent">Media Kit</Link></li>
            <li><Link to="/proizvodnja" className="hover:text-accent">Proizvodnja</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-background/60">Kontakt</div>
          <ul className="mt-4 space-y-2 text-sm text-background/80">
            <li>Novi Pazar, Srbija</li>
            <li>wholesale@exitdenim.rs</li>
            <li>WhatsApp / Viber</li>
            <li>+381 6X XXX XXXX</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/15">
        <div className="container-x py-5 flex flex-col md:flex-row justify-between text-xs text-background/60 gap-2">
          <div>© {new Date().getFullYear()} EXIT Denim. Made in Serbia.</div>
          <div>B2B wholesale platform</div>
        </div>
      </div>
    </footer>
  );
}
