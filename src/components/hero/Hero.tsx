import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ecommerce } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import editorial from "@/assets/exit-original-cover.webp.asset.json";
import editorialMobile from "@/assets/exit-original-cover-mobile.webp.asset.json";
import studioPair from "@/assets/exit-studio-pair.webp.asset.json";

export function Hero() {
  return (
    <section className="exit-studio" aria-label="EXIT Denim kolekcija">
      <div className="exit-studio-photographs relative isolate overflow-hidden">
      <picture className="exit-studio-main">
        <source media="(max-width: 767px)" srcSet={editorialMobile.url} />
        <img src={editorial.url} alt="Muškarac u tamnoplavim farmerkama i žena u svetloplavom teksasu ispred zida sa stripovima" fetchPriority="high" loading="eager" width={1200} height={1500} className="h-full w-full object-cover" />
      </picture>
      <img className="exit-studio-secondary" src={studioPair.url} width={900} height={1125} alt="EXIT studijska kolekcija: sive muške farmerke i tamne široke farmerke" loading="lazy" decoding="async" />
      <div className="exit-studio-label text-cover-foreground bg-ink px-3 py-2 text-[10px] mono">PROIZVEDENO U SRBIJI</div>
      <h1 className="exit-studio-wordmark">EXIT<span>DENIM</span></h1>
      <span className="exit-studio-index mono text-cover-foreground bg-ink text-[10px] px-3 py-2">STUDIJSKA KOLEKCIJA / 01</span>
      </div>
      <div className="exit-studio-shop bg-accent text-accent-foreground px-5 md:px-12">
        <p className="font-medium text-sm md:text-xl">Muške farmerke.<br /><span className="font-normal">Vaš kroj, na prvom mestu.</span></p>
        <Button asChild size="lg" className="h-12 rounded-none bg-ink text-cover-foreground shadow-none hover:bg-ink/90 px-5">
          <Link to="/katalog" onClick={() => ecommerce.cta("shop_all", "hero")}>Izaberite model <ArrowRight /></Link>
        </Button>
      </div>
    </section>
  );
}
