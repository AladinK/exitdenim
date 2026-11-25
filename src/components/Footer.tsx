import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { BRAND } from "@/lib/brand";
import { phoneHref, whatsappHref } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="site-footer">
      <span className="stitch" aria-hidden="true" />
      <div className="container-x site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Logo />
            <p className="site-footer__statement mt-6">
              Denim koji nosite, ne koji nosi vas.
            </p>
            <p className="mt-3 text-[0.9375rem]">
              Krojimo i šijemo u Novom Pazaru od {BRAND.foundedYear}. godine. Plaćate kad paket stigne.
            </p>
            <p className="mt-3 text-[0.9375rem]">
              Ekološki pristup proizvodnji uz lasersku tehnologiju španske kompanije Jeanologia.
            </p>
          </div>

          <nav aria-labelledby="footer-shop">
            <h2 id="footer-shop">Prodavnica</h2>
            <ul>
              <li><Link to="/katalog">Svi modeli</Link></li>
              <li><Link to="/jeans">Farmerke</Link></li>
              <li><Link to="/wide-flare">Široke farmerke</Link></li>
              <li><Link to="/chino">Chino</Link></li>
              <li><Link to="/cargo">Cargo (džeparke)</Link></li>
              <li><Link to="/vodic-za-farmerke">Vodič za farmerke</Link></li>
              <li><Link to="/faq">Česta pitanja</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-exit">
            <h2 id="footer-exit">EXIT</h2>
            <ul>
              <li><Link to="/proizvodnja">Proizvodnja</Link></li>
              <li><Link to="/postani-partner">Veleprodaja (B2B)</Link></li>
              <li><Link to="/private-label">Izrada za vaš brend</Link></li>
              <li><Link to="/en/manufacturing" lang="en" hrefLang="en">Manufacturing · EN</Link></li>
              <li><Link to="/en/private-label" lang="en" hrefLang="en">Private label · EN</Link></li>
              <li><Link to="/media-kit">Media kit</Link></li>
              <li>
                <a href="https://www.google.com/preferences/source?q=exitdenim.shop" target="_blank" rel="noopener noreferrer">
                  Omiljeni izvor na Google-u
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2>Kontakt</h2>
            <ul>
              <li><span className="text-background">Ahmed Kurtanović</span></li>
              <li><a href={phoneHref}>{BRAND.phoneLabel}</a></li>
              <li><a href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp i Viber</a></li>
              <li><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
              <li><a href={BRAND.instagram} target="_blank" rel="noopener noreferrer">@exit.denim</a></li>
              <li><span>{BRAND.streetAddress}, {BRAND.city}</span></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__legal">
          <div>
            © {new Date().getFullYear()} EXIT Denim — {BRAND.legalName} · PIB {BRAND.taxId} · MB {BRAND.registrationId}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/faq">Uslovi kupovine</Link>
            <Link to="/privatnost">Politika privatnosti</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
