import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ecommerce } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import editorial from "@/assets/exit-concrete-editorial.webp";
import editorialMobile from "@/assets/exit-concrete-mobile.webp";

export function Hero() {
  return (
    <section className="exit-cover relative isolate overflow-hidden text-foreground" aria-label="EXIT Denim kolekcija">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 767px)" srcSet={editorialMobile} />
        <img src={editorial} alt="Muške plave farmerke EXIT, ravne nogavice, na modelu ispred betonske arhitekture" fetchPriority="high" loading="eager" width={1600} height={1008} className="h-full w-full object-cover" />
      </picture>
      <div className="exit-cover-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="exit-cover-content px-5 py-6 md:px-12 md:py-10">
        <p className="text-[11px] font-medium">EXIT / PROIZVEDENO U SRBIJI</p>
        <h1 className="exit-masthead">Muške<br />farmerke<span className="exit-masthead-period">.</span></h1>
        <p className="exit-cover-sub text-sm md:text-lg">Bez suvišnog.<br />Samo dobar teksas.</p>
        <div className="exit-cover-action">
          <Button asChild size="lg" className="h-12 rounded-none bg-primary text-primary-foreground shadow-none hover:bg-primary/90 px-6">
            <Link to="/katalog" onClick={() => ecommerce.cta("shop_all", "hero")}>Izaberite farmerke <ArrowRight /></Link>
          </Button>
          <Link to="/wide-flare" className="mt-4 inline-flex items-center gap-2 text-xs underline underline-offset-4">Pogledajte široke krojeve <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
      <span className="exit-cover-caption text-[10px] mono">TEKSAS / EXIT DENIM</span>
    </section>
  );
}
