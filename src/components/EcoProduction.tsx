import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { LazyVideo } from "./LazyVideo";
import { MEDIA } from "@/lib/media";

export function EcoProduction({ language = "sr" }: { language?: "sr" | "en" }) {
  const en = language === "en";
  return (
    <section
      lang={language}
      className="band-soft section-pad"
      aria-label={en ? "Environmental approach to manufacturing" : "Ekološki pristup proizvodnji"}
    >
      <Reveal className="container-x grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16 md:items-end">
        <div>
          <span className="stitch-tick" aria-hidden="true" />
          <p className="eyebrow mt-3">{en ? "EXIT · Responsible manufacturing" : "EXIT · Odgovornija proizvodnja"}</p>
          <h2 className="mt-2">
            {en ? "An environmental approach, with laser precision" : "Ekološki pristup, preciznost lasera"}
          </h2>
        </div>
        <div>
          <p className="text-base md:text-lg leading-relaxed text-ink-2">
            {en
              ? "We use laser technology from the Spanish company Jeanologia as part of our environmental approach to denim manufacturing and finishing, with attention to detail and the character of the garment. Processes depend on the collection and the individual model; this does not imply identical laser finishing for every product or quantified environmental savings."
              : "U proizvodnji koristimo inovativnu lasersku tehnologiju španske kompanije Jeanologia. Ona je deo našeg ekološkog pristupa izradi i završnoj obradi denima — uz pažnju prema detaljima i prepoznatljivom karakteru proizvoda."}
          </p>
          {en ? (
            <Link to="/en/manufacturing" className="section-head__link mt-3">
              About our manufacturing <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/proizvodnja" className="section-head__link mt-3">
              Više o Jeanologia obradi <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
        <figure className="md:col-span-2">
          <div className="video-frame">
            <LazyVideo
              src={MEDIA.laserVideo}
              poster={MEDIA.laserPoster}
              label={en ? "Denim laser finishing using Jeanologia technology" : "Laserska obrada denima Jeanologia tehnologijom"}
            />
          </div>
          <figcaption className="mt-3 text-[0.8125rem] text-ink-3">
            {en ? "Laser finishing in EXIT denim production" : "Laserska obrada denima u proizvodnji EXIT"}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
