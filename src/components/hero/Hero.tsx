import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ecommerce } from "@/lib/analytics";
import { MEDIA } from "@/lib/media";

const SLIDES = [
  {
    image: MEDIA.coverSeated,
    mobile: MEDIA.coverPortraitMobile,
    title: "Muške farmerke, šivene u Novom Pazaru",
    caption: "Od 1991. godine. Besplatna dostava, plaćate kad paket stigne.",
    cta: "Pogledajte farmerke",
    alt: "Originalna EXIT kolekcija: muške plave farmerke na modelu u studiju",
    to: "/jeans",
  },
  {
    image: MEDIA.cityDenim,
    mobile: MEDIA.cityDenim,
    title: "Teksas, izbliza",
    caption: "Denim za svaki dan.",
    cta: "Svi modeli",
    alt: "EXIT teksas u gradu, plave farmerke i košulja na modelu",
    to: "/katalog",
  },
  {
    image: MEDIA.coverOriginal,
    mobile: MEDIA.coverOriginalMobile,
    title: "Vaš kroj, vaša širina",
    caption: "Relaxed, bootcut i flare, u veličinama 31–40.",
    cta: "Široke farmerke",
    alt: "EXIT originalna studijska kolekcija farmerki",
    to: "/wide-flare",
  },
] as const;

const SLIDE_MS = 7500;

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
    sync();
    media.addEventListener("change", sync);
    const element = root.current;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false));
    if (element) observer.observe(element);
    const visibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", sync);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      request.current++;
    };
  }, []);

  // Sledeća fotografija se prvo dekodira, pa tek onda prikazuje: bez praznog kadra.
  const select = async (index: number) => {
    const slide = SLIDES[index];
    if (!slide || index === active) return;
    const id = ++request.current;
    const image = new Image();
    image.src = window.matchMedia("(max-width: 767px)").matches ? slide.mobile : slide.image;
    try {
      await image.decode();
    } catch {
      return;
    }
    if (id !== request.current) return;
    setLoaded((previous) => (previous.includes(index) ? previous : [...previous, index]));
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (id === request.current) setActive(index);
      }),
    );
  };

  const playing = !paused && visible && !reduced;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      void select((active + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, playing]); // select čita trenutni slajd

  return (
    <section
      ref={root}
      className="hero"
      aria-label="EXIT Denim kolekcija"
      aria-roledescription="slajder"
      data-playing={playing}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      {SLIDES.map(
        (slide, index) =>
          loaded.includes(index) && (
            <picture key={slide.to} className="hero__frame" data-active={active === index} aria-hidden={active !== index}>
              <source media="(max-width: 767px)" srcSet={slide.mobile} />
              <img
                src={slide.image}
                alt={slide.alt}
                fetchPriority={index === 0 ? "high" : "low"}
                loading="eager"
                decoding={index === 0 ? "sync" : "async"}
                width={1400}
                height={933}
              />
            </picture>
          ),
      )}
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__copy">
        {SLIDES.map((slide, index) => (
          <div key={slide.to} className="hero__slide" data-active={active === index} aria-hidden={active !== index} inert={active !== index}>
            {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
            <p>{slide.caption}</p>
            <div className="hero__actions">
              <Link to={slide.to} className="btn-primary" onClick={() => ecommerce.cta("shop_all", "hero")}>
                {slide.cta}
              </Link>
              <Link to="/vodic-za-farmerke" className="hero__link">
                Pronađite svoju veličinu
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="hero__dots" role="group" aria-label="Fotografije kolekcije">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.to}
            type="button"
            className="hero__dot"
            aria-label={`Fotografija ${index + 1} od ${SLIDES.length}`}
            aria-pressed={active === index}
            onClick={() => {
              void select(index);
            }}
          >
            <span>{active === index && <i key={active} />}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
