import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ecommerce } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import editorial from "@/assets/exit-seated-cover.webp.asset.json";
import editorialMobile from "@/assets/exit-portrait-cover-mobile.webp.asset.json";
import city from "@/assets/exit-city-denim.webp.asset.json";
import original from "@/assets/exit-original-cover.webp.asset.json";

const SLIDES = [
  { image: editorial.url, mobile: editorialMobile.url, title: "Muške farmerke.", caption: "Originalan karakter.", alt: "Originalna EXIT kolekcija: muške plave farmerke na modelu u studiju", to: "/jeans" },
  { image: city.url, mobile: city.url, title: "Teksas, izbliza.", caption: "Denim za svaki dan.", alt: "EXIT teksas u gradu, plave farmerke i košulja na modelu", to: "/katalog" },
  { image: original.url, mobile: original.url, title: "Vaš kroj.", caption: "Proizvedeno u Srbiji.", alt: "EXIT originalna studijska kolekcija farmerki", to: "/wide-flare" },
] as const;

export function Hero() {
  const [active, setActive] = useState(0);
  const slide = SLIDES[active] ?? SLIDES[0];
  return (
    <section className="exit-campaign" aria-label="EXIT Denim kolekcija" aria-roledescription="slajder">
      <div className="exit-campaign-photo relative isolate overflow-hidden">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 767px)" srcSet={slide.mobile} />
        <img src={slide.image} alt={slide.alt} fetchPriority="high" loading="eager" width={1400} height={933} className="h-full w-full object-cover" />
      </picture>
      <div className="exit-campaign-copy" aria-live="polite">
        <h1 className="text-cover-foreground">{slide.title}</h1>
        <p className="text-cover-foreground text-sm">{slide.caption}</p>
        <Button asChild variant="fashion" className="mt-3 h-9 px-5">
          <Link to={slide.to} onClick={() => ecommerce.cta("shop_all", "hero")}>Izaberite model</Link>
        </Button>
      </div>
      <div className="exit-slide-controls bg-control" role="group" aria-label="Kampanjske fotografije">
        {SLIDES.map((s, i) => <Button key={s.title} variant="ghost" size="icon" className="exit-slide-dot" aria-label={`Prikaži kampanju ${i + 1}`} aria-pressed={active === i} onClick={() => setActive(i)}><span /></Button>)}
      </div>
      </div>
    </section>
  );
}
