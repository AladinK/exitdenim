import { useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { homeAssetsQuery } from "@/lib/product-queries";
import { Button } from "@/components/ui/button";

const categories = [
  { to: "/jeans", name: "Farmerke", key: "category_jeans", alt: "Muške plave farmerke EXIT na modelu" },
  { to: "/chino", name: "Chino pantalone", key: "category_chino", alt: "Muške svetle chino pantalone EXIT na modelu" },
  { to: "/cargo", name: "Džeparke", key: "category_cargo", alt: "Muške cargo pantalone EXIT sa bočnim džepovima" },
] as const;

export function CategorySlider() {
  const { data: assets } = useSuspenseQuery(homeAssetsQuery());
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const sync = () => setEdges({ start: element.scrollLeft < 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    element.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => { observer.disconnect(); element.removeEventListener("scroll", sync); };
  }, []);
  const move = (direction: number) => {
    const element = track.current;
    const first = element?.firstElementChild;
    if (!element || !first) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({ left: direction * (first.getBoundingClientRect().width + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <section className="exit-category-campaigns exit-category-slider px-4 md:px-8 py-6 md:py-8" aria-label="Kolekcije EXIT" aria-roledescription="slajder">
      <div ref={track} id="exit-category-track" className="exit-category-track" tabIndex={0} aria-label="Farmerke, chino pantalone i džeparke" onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
      }}>
        {categories.map((category) => (
          <Link key={category.key} to={category.to} className="exit-category-entry group block relative overflow-hidden rounded-lg">
            <div className="exit-category-image overflow-hidden bg-secondary">
              {assets[category.key]?.url && <img src={assets[category.key].url} alt={assets[category.key].alt || category.alt} width={1000} height={1500} loading="lazy" decoding="async" className="h-full w-full object-cover" />}
            </div>
            <div className="exit-category-label px-4 py-2"><h3 className="text-base font-normal">{category.name}</h3></div>
          </Link>
        ))}
      </div>
      <div className="exit-category-slider-controls">
        <Button variant="ghost" size="icon" aria-label="Prethodna kategorija" title="Prethodna kategorija" aria-controls="exit-category-track" disabled={edges.start} onClick={() => move(-1)}><ArrowLeft /></Button>
        <Button variant="ghost" size="icon" aria-label="Sledeća kategorija" title="Sledeća kategorija" aria-controls="exit-category-track" disabled={edges.end} onClick={() => move(1)}><ArrowRight /></Button>
      </div>
    </section>
  );
}