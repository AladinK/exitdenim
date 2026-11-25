import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { MEDIA } from "@/lib/media";
import { Reveal } from "./Reveal";

export function DenimEditorial() {
  return (
    <section className="container-x section-pad" aria-labelledby="denim-editorial-title">
      <Reveal className="section-head">
        <div>
          <span className="stitch-tick" aria-hidden="true" />
          <p className="eyebrow mt-3">Originalne EXIT fotografije</p>
          <h2 id="denim-editorial-title" className="mt-2">Krojevi u pokretu</h2>
        </div>
        <Link to="/jeans" className="section-head__link">
          Kolekcija farmerki <ArrowUpRight aria-hidden="true" />
        </Link>
      </Reveal>
      <div className="editorial-grid mt-8 md:mt-12">
        <figure className="editorial-grid__wide">
          <img src={MEDIA.cityDenim} width={800} height={690} alt="EXIT plavi teksas u gradskoj fotografiji, detalji košulje i farmerki" loading="lazy" decoding="async" />
          <figcaption>Teksas u gradu</figcaption>
        </figure>
        <figure>
          <img src={MEDIA.studioDenim} width={700} height={1053} alt="Originalne svetloplave EXIT farmerke sa poderanim detaljima na modelu" loading="lazy" decoding="async" />
          <figcaption>Detalji i karakter</figcaption>
        </figure>
        <figure>
          <img src={MEDIA.straightDenim} width={700} height={1053} alt="Muške plave EXIT farmerke na modelu, prikaz cele nogavice" loading="lazy" decoding="async" />
          <figcaption>Čista linija</figcaption>
        </figure>
      </div>
    </section>
  );
}
