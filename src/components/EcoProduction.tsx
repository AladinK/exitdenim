import { Link } from "@tanstack/react-router";
import { Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EcoProduction() {
  return (
    <section className="border-y border-border bg-background py-12 md:py-16" aria-label="Ekološki pristup proizvodnji">
      <div className="container-x grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
        <div>
          <Leaf className="h-6 w-6 text-accent" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-4 text-sm text-muted-foreground">EXIT · Odgovornija proizvodnja</p>
          <h2 className="mt-3 text-2xl md:text-3xl leading-tight tracking-normal">Ekološki pristup.<br />Preciznost lasera.</h2>
        </div>
        <div>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            U proizvodnji koristimo inovativnu lasersku tehnologiju španske kompanije Jeanologia. Ona je deo našeg ekološkog pristupa izradi i završnoj obradi denima — uz pažnju prema detaljima i prepoznatljivom karakteru proizvoda.
          </p>
          <Button asChild variant="link" className="mt-5 h-auto p-0 whitespace-normal text-left">
            <Link to="/proizvodnja">Više o Jeanologia obradi <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}