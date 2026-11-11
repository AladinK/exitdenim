import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import city from "@/assets/exit-city-denim.webp.asset.json";
import studio from "@/assets/exit-studio-denim.webp.asset.json";
import straight from "@/assets/exit-straight-denim.webp.asset.json";
import { Reveal } from "./Reveal";

export function DenimEditorial() {
  return (
    <section className="exit-denim-editorial border-y border-border" aria-labelledby="denim-editorial-title">
      <Reveal className="px-5 md:px-12 pt-9 md:pt-14 flex flex-wrap items-end justify-between gap-5">
        <div><p className="mono text-xs text-muted-foreground mb-4">EXIT / ORIGINALNE FOTOGRAFIJE</p><h2 id="denim-editorial-title" className="text-3xl md:text-5xl">Teksas, izbliza.</h2></div>
        <Button asChild variant="link" className="p-0 h-auto text-foreground"><Link to="/jeans">Kolekcija farmerki <ArrowUpRight /></Link></Button>
      </Reveal>
      <div className="exit-denim-photo-grid px-5 md:px-12 py-8 md:py-12">
        <figure className="exit-denim-city"><img src={city.url} width={800} height={690} alt="EXIT plavi teksas u gradskoj fotografiji, detalji košulje i farmerki" loading="lazy" decoding="async" /><figcaption className="mono text-[10px] text-muted-foreground mt-3">01 / TEKSAS U GRADU</figcaption></figure>
        <figure><img src={studio.url} width={700} height={1053} alt="Originalne svetloplave EXIT farmerke sa poderanim detaljima na modelu" loading="lazy" decoding="async" /><figcaption className="mono text-[10px] text-muted-foreground mt-3">02 / DETALJI I KARAKTER</figcaption></figure>
        <figure><img src={straight.url} width={700} height={1053} alt="Muške plave EXIT farmerke na modelu, prikaz cele nogavice" loading="lazy" decoding="async" /><figcaption className="mono text-[10px] text-muted-foreground mt-3">03 / ČISTA LINIJA</figcaption></figure>
      </div>
    </section>
  );
}