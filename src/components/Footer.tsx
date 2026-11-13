import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";


export function Footer() {
  return (
    <footer className="relative overflow-hidden exit-footer bg-background text-foreground border-t border-border mt-12">
      <div className="relative container-x pt-20 pb-10">

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="h-10" />
            <p className="text-lg md:text-xl mt-6 max-w-md leading-snug text-foreground">
              Denim koji nosite, ne koji nosi vas. Pravljeno u Srbiji. Plaćate kad stigne.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Ekološki pristup proizvodnji uz inovativnu lasersku tehnologiju španske kompanije Jeanologia.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild><Link to="/katalog">Svi modeli</Link></Button>
              <Button asChild variant="outline"><Link to="/jeans">Farmerke</Link></Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">Prodavnica</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/katalog" className="hover:text-accent transition-colors">Svi modeli</Link></li><li><Link to="/wide-flare" className="hover:text-accent transition-colors">Široke farmerke</Link></li>
              <li><Link to="/jeans" className="hover:text-accent transition-colors">Farmerke</Link></li><li><Link to="/chino" className="hover:text-accent transition-colors">Chino</Link></li><li><Link to="/cargo" className="hover:text-accent transition-colors">Cargo (džeparke)</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">EXIT</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/postani-partner" className="hover:text-accent transition-colors">Veleprodaja (B2B)</Link></li>
              <li><Link to="/proizvodnja" className="hover:text-accent transition-colors">Proizvodnja</Link></li>
               <li><Link to="/private-label" className="hover:text-accent transition-colors">Izrada za vaš brend</Link></li>
              <li>
                <a href="https://www.google.com/preferences/source?q=exitdenim.shop" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent transition-colors">
                  Omiljeni izvor na Google-u
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </a>
              </li>
              <li><Link to="/media-kit" className="hover:text-accent transition-colors">Media kit</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">Česta pitanja</Link></li>
              <li><Link to="/vodic-za-farmerke" className="hover:text-accent transition-colors">Vodič za farmerke</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">Kontakt</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>Ahmed Kurtanović</li>
              <li className="text-muted-foreground">EXIT Denim — TRI-B DOO</li>
              <li>Srbija</li>
              <li className="tabular-nums text-muted-foreground">PIB: {BRAND.taxId} · MB: {BRAND.registrationId}</li>
              <li><a href={`mailto:${BRAND.email}`} className="break-all hover:text-accent transition-colors">{BRAND.email}</a></li>
              <li className="tabular-nums"><a href="https://wa.me/381653176716" className="hover:text-accent transition-colors">+381 65 317 6716</a></li>
              <li className="text-muted-foreground">WhatsApp · Viber</li>
              <li><a href="https://instagram.com/exit.denim" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">@exit.denim</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border mt-14 pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} EXIT Denim · Proizvedeno u Srbiji</div>
          <div className="flex gap-6">
            <Link to="/faq" className="hover:text-foreground">Uslovi kupovine</Link>
            <Link to="/privatnost" className="hover:text-foreground">Politika privatnosti</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
