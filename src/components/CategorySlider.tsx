import { useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { homeAssetsQuery } from "@/lib/product-queries";
import { MEDIA } from "@/lib/media";

// Fotografije kategorija dolaze iz administracije; dok ih nema (ili baza ne odgovara)
// koriste se fotografije iz public/media/.
const categories = [
  { to: "/jeans", name: "Farmerke", key: "category_jeans", fallback: MEDIA.studioDenim, alt: "Muške plave farmerke EXIT na modelu" },
  { to: "/chino", name: "Chino pantalone", key: "category_chino", fallback: MEDIA.studioPair, alt: "Muške svetle chino pantalone EXIT na modelu" },
  { to: "/cargo", name: "Džeparke", key: "category_cargo", fallback: MEDIA.studioCargo, alt: "Muške cargo pantalone EXIT sa bočnim džepovima" },
] as const;

export function CategorySlider() {
  const { data: assets } = useSuspenseQuery(homeAssetsQuery());
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const sync = () =>
      setEdges({
        start: element.scrollLeft < 2,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    element.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", sync);
    };
  }, []);

  const move = (direction: number) => {
    const element = track.current;
    const first = element?.firstElementChild;
    if (!element || !first) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({
      left: direction * (first.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section className="container-x pt-8 md:pt-12" aria-label="Kolekcije EXIT">
      <div
        ref={track}
        id="category-track"
        className="category-track"
        tabIndex={0}
        aria-label="Farmerke, chino pantalone i džeparke"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {categories.map((category) => {
          const asset = assets[category.key];
          return (
            <Link key={category.key} to={category.to} className="category-card">
              <img
                src={asset?.url || category.fallback}
                alt={asset?.alt || category.alt}
                width={1000}
                height={1500}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 44vw, 76vw"
              />
              <div className="category-card__label">
                <h3>{category.name}</h3>
                <ArrowUpRight aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="track-controls">
        <button type="button" className="icon-button" aria-label="Prethodna kategorija" aria-controls="category-track" disabled={edges.start} onClick={() => move(-1)}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <button type="button" className="icon-button" aria-label="Sledeća kategorija" aria-controls="category-track" disabled={edges.end} onClick={() => move(1)}>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
