import { useRef, useState } from "react";

export function Gallery({ images, alt, sku }: { images: string[]; alt: string; sku: string }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const go = (i: number) => {
    setActive(i);
    const el = scroller.current;
    if (el) {
      el.scrollTo({
        left: el.clientWidth * i,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
  };

  if (!images.length) {
    return (
      <div className="grid aspect-[4/5] place-items-center bg-paper-3 text-sm text-ink-3 lg:rounded-xl">
        {sku} · fotografija uskoro
      </div>
    );
  }

  return (
    <div className={images.length > 1 ? "gallery" : "gallery gallery--single"}>
      <div className="relative min-w-0">
        <div
          ref={scroller}
          className="gallery__track"
          onScroll={(e) => {
            const el = e.currentTarget;
            const next = Math.round(el.scrollLeft / el.clientWidth);
            if (next !== active) setActive(next);
          }}
        >
          {images.map((src, i) => (
            <div key={src} className="gallery__slide">
              <img
                src={src}
                alt={i === 0 ? alt : `${alt} — pogled ${i + 1}`}
                fetchPriority={i === 0 ? "high" : "auto"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                width={1024}
                height={1280}
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <span className="tag gallery__count" aria-hidden="true">
            {active + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs" role="group" aria-label="Fotografije modela">
          {images.map((src, i) => (
            <button key={src} type="button" className="gallery__thumb" onClick={() => go(i)} aria-pressed={active === i} aria-label={`Fotografija ${i + 1} od ${images.length}`}>
              <img src={src} alt="" loading="lazy" decoding="async" width={144} height={180} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
