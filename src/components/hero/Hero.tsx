import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { homeAssetsQuery } from "@/lib/product-queries";
import { ecommerce } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { data: assets } = useSuspenseQuery(homeAssetsQuery());
  const bg = assets["hero"]?.url || assets["hero_texture"]?.url || "";
  return (
    <section className="exit-cover relative isolate overflow-hidden bg-ink text-cover-foreground" aria-label="EXIT Denim kolekcija">
      {bg && <img src={bg} alt={assets.hero?.alt || "EXIT Denim — muškarac u plavom teksasu u gradu"} fetchPriority="high" loading="eager" width={1400} height={1207} className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_40%]" />}
      <div className="exit-cover-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="h-full flex flex-col justify-between px-5 py-6 md:px-12 md:py-8">
        <div>
          <div className="flex items-center justify-between text-[11px] md:text-xs font-medium">
            <span>IZ SRBIJE. ZA SVAKI DAN.</span>
            <span>KOLEKCIJA / 2026</span>
          </div>
          <h1 className="exit-masthead mt-5 text-cover-foreground">EXIT<span className="block">DENIM</span></h1>
        </div>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <p className="text-2xl md:text-4xl font-medium leading-tight">Dobar kroj.<br />Vaš karakter.</p>
            <p className="mt-3 text-sm text-cover-foreground/85">Muške farmerke iz naše proizvodnje.</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Button asChild size="lg" className="h-12 rounded-none bg-accent text-accent-foreground shadow-none hover:bg-accent/90 px-6">
              <Link to="/katalog" onClick={() => ecommerce.cta("shop_all", "hero")}>Pronađite svoj kroj <ArrowRight /></Link>
            </Button>
            <span className="text-xs text-cover-foreground/85">Besplatna dostava · Plaćanje pouzećem</span>
          </div>
        </div>
      </div>
    </section>
  );
}
