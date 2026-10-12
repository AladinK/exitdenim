import { useRef, useState } from "react";

export function Gallery({ images, alt, sku, fit }: { images: string[]; alt: string; sku: string; fit: string }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const go = (i: number) => {
    setActive(i);
    const el = scroller.current;
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };
  if (!images.length) {
    return (
      <div className="aspect-[4/5] bg-secondary relative flex items-center justify-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {sku}
      </div>
    );
  }
  return (
    <div>
      <div className="relative">
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none bg-secondary"
        >
          {images.map((src, i) => (
            <div key={src} className="snap-center shrink-0 w-full aspect-[4/5]">
              <img
                src={src}
                alt={i === 0 ? alt : `${alt} — slika ${i + 1}`}
                fetchPriority={i === 0 ? "high" : "auto"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover"
                width={1024}
                height={1280}
              />
            </div>
          ))}
        </div>
        <span className="absolute left-3 top-3 bg-background text-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
          {fit} fit
        </span>
        {images.length > 1 && (
          <span className="absolute right-3 bottom-3 bg-background/90 px-2 py-1 text-[10px] tabular-nums">
            {active + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-2 px-5 md:px-0 flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Prikaži sliku ${i + 1}`}
              className={`shrink-0 w-16 md:w-20 aspect-[4/5] overflow-hidden border-2 ${i === active ? "border-primary" : "border-transparent opacity-70"}`}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
