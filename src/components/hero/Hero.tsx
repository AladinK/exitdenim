import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ecommerce } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import editorial from "@/assets/exit-original-cover.webp.asset.json";
import editorialMobile from "@/assets/exit-original-cover-mobile.webp.asset.json";

export function Hero() {
  return (
    <section className="exit-cover exit-original-cover relative isolate overflow-hidden text-cover-foreground" aria-label="EXIT Denim kolekcija">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 767px)" srcSet={editorialMobile.url} />
        <img src={editorial.url} alt="Muškarac u tamnoplavim farmerkama i žena u svetloplavom teksasu ispred zida sa stripovima" fetchPriority="high" loading="eager" width={1200} height={1500} className="h-full w-full object-cover" />
      </picture>
      <div className="exit-cover-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="exit-cover-content px-5 py-6 md:px-12 md:py-10">
        <p className="text-[11px] font-medium">EXIT / PROIZVEDENO U SRBIJI</p>
        <h1 className="exit-masthead text-cover-foreground">Muške<br />farmerke<span className="exit-masthead-period">.</span></h1>
        <p className="exit-cover-sub text-sm md:text-lg">Bez suvišnog.<br />Samo dobar teksas.</p>
        <div className="exit-cover-action">
          <Button asChild size="lg" className="h-12 rounded-none bg-accent text-accent-foreground shadow-none hover:bg-accent/90 px-6">
            <Link to="/katalog" onClick={() => ecommerce.cta("shop_all", "hero")}>Izaberite farmerke <ArrowRight /></Link>
          </Button>
          <Link to="/wide-flare" className="mt-4 inline-flex items-center gap-2 text-xs underline underline-offset-4">Pogledajte široke krojeve <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
      <span className="exit-cover-caption text-[10px] mono">TEKSAS / EXIT DENIM</span>
    </section>
  );
}
