import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  const [loaded, setLoaded] = useState<number[]>([0]);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  const root = useRef<HTMLElement>(null);
  const request = useRef(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener("change", sync);
    const element = root.current;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false));
    if (element) observer.observe(element);
    const visibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", sync); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); request.current++; };
  }, []);
  const select = async (index: number) => {
    const slide = SLIDES[index];
    if (!slide || index === active) return;
    const id = ++request.current;
    const image = new Image();
    image.src = window.matchMedia("(max-width: 767px)").matches ? slide.mobile : slide.image;
    try { await image.decode(); } catch { return; }
    if (id !== request.current) return;
    setLoaded((previous) => previous.includes(index) ? previous : [...previous, index]);
    requestAnimationFrame(() => requestAnimationFrame(() => { if (id === request.current) setActive(index); }));
  };
  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = window.setTimeout(() => { void select((active + 1) % SLIDES.length); }, 7500);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduced, visible]); // select uses the current active slide
  return (
    <section ref={root} className="exit-campaign" aria-label="EXIT Denim kolekcija" aria-roledescription="slajder" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
      <div className="exit-campaign-photo relative isolate overflow-hidden" data-active={active} data-playing={!paused && visible && !reduced}>
      {SLIDES.map((slide, index) => loaded.includes(index) && <picture key={slide.title} className="exit-campaign-frame absolute inset-0 -z-20" data-active={active === index} aria-hidden={active !== index}>
        <source media="(max-width: 767px)" srcSet={slide.mobile} />
        <img src={slide.image} alt={slide.alt} fetchPriority={index === 0 ? "high" : "low"} loading="eager" width={1400} height={933} className="h-full w-full object-cover" />
      </picture>)}
      <div className="exit-campaign-copy">
        <div className="exit-campaign-text-window"><div className="exit-campaign-text-track">
          {SLIDES.map((slide, index) => <div key={slide.title} className="exit-campaign-text" aria-hidden={active !== index} inert={active !== index}>
            {index === 0 ? <h1 className="text-cover-foreground">{slide.title}</h1> : <h2 className="text-cover-foreground">{slide.title}</h2>}
            <p className="text-cover-foreground text-sm">{slide.caption}</p>
            <Button asChild variant="fashion" className="mt-3 h-9 px-5"><Link to={slide.to} onClick={() => ecommerce.cta("shop_all", "hero")}>Izaberite model</Link></Button>
          </div>)}
        </div></div>
      </div>
      <div className="exit-slide-controls bg-control" role="group" aria-label="Kampanjske fotografije">
        {SLIDES.map((s, i) => <Button key={s.title} variant="ghost" size="icon" className="exit-slide-dot" aria-label={`Prikaži kampanju ${i + 1}`} aria-pressed={active === i} onClick={() => { void select(i); }}><span>{active === i && <i key={active} className="exit-slide-progress" />}</span></Button>)}
      </div>
      </div>
    </section>
  );
}
