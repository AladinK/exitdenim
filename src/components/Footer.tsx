import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white/85 mt-24">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="light" className="h-10" />
            <p className="text-lg md:text-xl mt-6 max-w-md leading-snug text-white/80">
              Премијум деним, дизајниран за ротацију у бутицима. Произведено у Новом Пазару, Србија.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/postani-partner" className="btn-accent">Затражите B2B приступ</Link>
              <Link to="/katalog" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white">
                Погледајте каталог
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.16em] text-white/55 font-semibold">Шоурум</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/katalog" className="hover:text-accent transition-colors">B2B Каталог</Link></li>
              <li><Link to="/jeans" className="hover:text-accent transition-colors">Фармерке</Link></li>
              <li><Link to="/chino" className="hover:text-accent transition-colors">Чино</Link></li>
              <li><Link to="/cargo" className="hover:text-accent transition-colors">Карго</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.16em] text-white/55 font-semibold">Кућа</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/postani-partner" className="hover:text-accent transition-colors">Партнерски програм</Link></li>
              <li><Link to="/proizvodnja" className="hover:text-accent transition-colors">Производња</Link></li>
              <li><Link to="/media-kit" className="hover:text-accent transition-colors">Медиа кит</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">Често постављана питања</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.16em] text-white/55 font-semibold">Велепродаја</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>Нови Пазар, Србија</li>
              <li><a href="mailto:wholesale@exitdenim.rs" className="hover:text-accent transition-colors">wholesale@exitdenim.rs</a></li>
              <li>WhatsApp · Viber</li>
              <li className="tabular-nums">+381 6X XXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/55">
          <div>© {new Date().getFullYear()} EXIT Denim · Произведено у Србији</div>
          <div className="flex gap-6">
            <Link to="/faq" className="hover:text-white">Услови коришћења</Link>
            <Link to="/faq" className="hover:text-white">Политика приватности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
