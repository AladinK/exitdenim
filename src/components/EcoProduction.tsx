import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import laserVideo from "@/assets/jeanologia_laser_finishing.mp4.asset.json";
import laserPoster from "@/assets/jeanologia_laser_poster.jpg.asset.json";

export function EcoProduction({ language = "sr" }: { language?: "sr" | "en" }) {
  const en = language === "en";
  return (
    <section lang={language} className="exit-eco border-y border-border bg-background py-12 md:py-16" aria-label={en ? "Environmental approach to manufacturing" : "Ekološki pristup proizvodnji"}>
      <Reveal className="container-x grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
        <div>
          <p className="mt-4 text-sm text-muted-foreground">{en ? "EXIT · Responsible manufacturing" : "EXIT · Odgovornija proizvodnja"}</p>
          <h2 className="mt-3 text-2xl md:text-3xl leading-tight tracking-normal">{en ? "An environmental approach." : "Ekološki pristup."}<br />{en ? "Laser precision." : "Preciznost lasera."}</h2>
        </div>
        <div>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {en ? "We use laser technology from the Spanish company Jeanologia as part of our environmental approach to denim manufacturing and finishing, with attention to detail and the character of the garment. Processes depend on the collection and the individual model; this does not imply identical laser finishing for every product or quantified environmental savings." : "U proizvodnji koristimo inovativnu lasersku tehnologiju španske kompanije Jeanologia. Ona je deo našeg ekološkog pristupa izradi i završnoj obradi denima — uz pažnju prema detaljima i prepoznatljivom karakteru proizvoda."}
          </p>
          <Button asChild variant="link" className="mt-5 h-auto p-0 whitespace-normal text-left">
            {en ? <Link to="/en/manufacturing">About our manufacturing <ArrowRight aria-hidden="true" /></Link> : <Link to="/proizvodnja">Više o Jeanologia obradi <ArrowRight aria-hidden="true" /></Link>}
          </Button>
        </div>
        <figure className="md:col-span-2 overflow-hidden rounded-md bg-muted">
          <video className="block aspect-video w-full object-cover" src={laserVideo.url} poster={laserPoster.url} autoPlay muted loop playsInline preload="none" aria-label={en ? "Denim laser finishing using Jeanologia technology" : "Laserska obrada denima Jeanologia tehnologijom"} />
          <figcaption className="px-1 pt-2 text-xs text-muted-foreground">{en ? "Laser finishing in EXIT denim production." : "Laserska obrada denima u proizvodnji EXIT."}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}