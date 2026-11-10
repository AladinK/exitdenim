import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ecommerce } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import editorial from "@/assets/exit-seated-cover.webp.asset.json";
import editorialMobile from "@/assets/exit-portrait-cover-mobile.webp.asset.json";

export function Hero() {
  return (
    <section className="exit-campaign" aria-label="EXIT Denim kolekcija">
      <div className="exit-campaign-photo relative isolate overflow-hidden">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 767px)" srcSet={editorialMobile.url} />
        <img src={editorial.url} alt="Originalna EXIT kolekcija: muške plave farmerke na modelu u studiju" fetchPriority="high" loading="eager" width={1400} height={933} className="h-full w-full object-cover" />
      </picture>
      <div className="exit-campaign-copy">
        <p className="mono text-[10px] text-cover-foreground">DENIM / PROIZVEDENO U SRBIJI</p>
        <h1 className="exit-campaign-wordmark">EXIT<span>DENIM</span></h1>
        <p className="exit-campaign-caption text-cover-foreground text-sm">Muške farmerke. Originalan karakter.</p>
      </div>
      </div>
      <div className="exit-campaign-shop bg-background px-5 md:px-12 border-b border-border">
        <p className="text-xs md:text-sm text-muted-foreground">Od užeg do širokog kroja.<br /><span className="text-foreground font-medium">Izaberite farmerke za svaki dan.</span></p>
        <Button asChild size="lg" className="h-12 rounded-none bg-ink text-cover-foreground shadow-none hover:bg-ink/90 px-5">
          <Link to="/katalog" onClick={() => ecommerce.cta("shop_all", "hero")}>Izaberite model <ArrowRight /></Link>
        </Button>
      </div>
    </section>
  );
}
