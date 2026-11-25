import { useEffect, useRef, useState } from "react";

/**
 * Video bez zvuka koji se učitava i pušta tek kada uđe u kadar, a zaustavlja kada izađe.
 * Posetilac koji ne skroluje do njega ne troši podatke. Uz "smanjeno kretanje" ili
 * štednju podataka ostaje naslovna slika sa kontrolama.
 */
export function LazyVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setManual(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void video.play().catch(() => setManual(true));
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      controls={manual}
      aria-label={label}
    />
  );
}
