import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  HEADQUARTERS,
  PLACES,
  PLACE_COUNT,
  type Country,
  type Place,
} from "@/lib/prodajna-mesta";
import {
  CONTEXT_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  REGION_PATH,
  projectToMap,
} from "@/lib/prodajna-mesta-mapa";

const PAGE_URL = "https://www.exit.fashion/prodajna-mesta";
const TITLE = "Prodajna mesta — EXIT farmerke u Srbiji, BiH i Crnoj Gori";
const DESCRIPTION = `EXIT farmerke prodaju butici i predstavnici u ${PLACE_COUNT} gradova: Niš, Kragujevac, Banja Luka, Podgorica i drugi. Pogledajte mapu i pronađite svoj grad.`;
const COUNTRIES = Object.keys(PLACES) as Country[];

export const Route = createFileRoute("/prodajna-mesta")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: ProdajnaMesta,
});

type Marker = Place & { key: string; country: Country; x: number; y: number };

/** Položaji na mapi; mesta koja bi se preklopila malo se razmaknu da se vide oba logoa. */
function useMarkers(): Marker[] {
  return useMemo(() => {
    const list: Marker[] = COUNTRIES.flatMap((country) =>
      PLACES[country].map((place) => {
        const [x, y] = projectToMap(place.lon, place.lat);
        return { ...place, key: `${country}-${place.name}`, country, x, y };
      }),
    );
    const MIN = 15;
    for (let round = 0; round < 6; round++) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i], b = list[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          let d = Math.hypot(dx, dy);
          if (d >= MIN) continue;
          if (d < 0.01) { dx = 1; dy = 0; d = 1; }
          const push = (MIN - d) / 2;
          a.x -= (dx / d) * push; a.y -= (dy / d) * push;
          b.x += (dx / d) * push; b.y += (dy / d) * push;
        }
      }
    }
    return list;
  }, []);
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/** Mali EXIT znak: zelena strelica iz logoa na crnom krugu. */
function ExitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="10" fill="var(--ink, #0D0D0C)" />
      <path d="M7.2 5.6 11.8 10 7.2 14.4" fill="none" stroke="#749D02" strokeWidth="3" strokeLinecap="round" strokeLinejoin="miter" />
    </svg>
  );
}

function ProdajnaMesta() {
  const markers = useMarkers();
  const [active, setActive] = useState<string | null>(null);
  const [hqX, hqY] = projectToMap(HEADQUARTERS.lon, HEADQUARTERS.lat);

  return (
    <Layout>
      <section className="bg-foreground text-background">
        <div className="container-x py-20 md:py-28">
          <div className="text-[10px] uppercase tracking-[0.36em] text-accent">Prodajna mesta</div>
          <h1 className="mt-7 h1-editorial text-background">
            EXIT u vašem <span className="italic">gradu</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-background/75 leading-relaxed">
            Naše farmerke prodaju butici i predstavnici u {PLACE_COUNT} gradova u Srbiji, Bosni i Hercegovini i Crnoj Gori.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <figure className="mx-auto max-w-5xl">
            <div
              className="relative w-full overflow-hidden rounded-[var(--radius-card,12px)] bg-secondary"
              style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
            >
              <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                <path d={CONTEXT_PATH} fill="var(--background)" opacity="0.7" />
                <path d={REGION_PATH} fill="var(--border)" stroke="var(--muted-foreground)" strokeOpacity="0.35" strokeWidth="0.8" />
              </svg>

              <ul className="absolute inset-0 m-0 list-none p-0">
                {markers.map((m) => {
                  const on = active === m.key;
                  return (
                    <li
                      key={m.key}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: pct(m.x, MAP_WIDTH), top: pct(m.y, MAP_HEIGHT), zIndex: on ? 30 : 10 }}
                    >
                      <button
                        type="button"
                        aria-label={`${m.name}, ${m.country}`}
                        aria-pressed={on}
                        onClick={() => setActive(m.key)}
                        onMouseEnter={() => setActive(m.key)}
                        onMouseLeave={() => setActive((cur) => (cur === m.key ? null : cur))}
                        onFocus={() => setActive(m.key)}
                        className="group relative block rounded-full p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <ExitMark className={`block h-3.5 w-3.5 sm:h-[18px] sm:w-[18px] transition-transform duration-200 ${on ? "scale-125" : ""}`} />
                        <span
                          className={`pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium text-background shadow-sm transition-opacity duration-150 ${on ? "opacity-100" : "opacity-0"}`}
                        >
                          {m.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
                <li
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pct(hqX, MAP_WIDTH), top: pct(hqY, MAP_HEIGHT), zIndex: 20 }}
                >
                  <span className="flex items-center gap-1.5" aria-label={`${HEADQUARTERS.name} — ${HEADQUARTERS.label.toLowerCase()}`}>
                    <ExitMark className="block h-5 w-5 rounded-full ring-2 ring-[#749D02] ring-offset-1 ring-offset-secondary sm:h-7 sm:w-7" />
                    <span className="hidden whitespace-nowrap rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold sm:inline">
                      {HEADQUARTERS.name}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ExitMark className="h-4 w-4" /> Butik ili predstavnik EXIT-a</span>
              <span className="inline-flex items-center gap-2">
                <ExitMark className="h-4 w-4 rounded-full ring-2 ring-[#749D02] ring-offset-1 ring-offset-background" /> {HEADQUARTERS.name} — {HEADQUARTERS.label.toLowerCase()}
              </span>
              <span>Dodirnite ili pređite mišem preko znaka za naziv grada.</span>
            </figcaption>
          </figure>

          <div className="mx-auto mt-16 grid max-w-5xl gap-10 md:grid-cols-3">
            {COUNTRIES.map((country) => (
              <div key={country}>
                <h2 className="eyebrow">
                  {country} <span className="text-muted-foreground">· {PLACES[country].length}</span>
                </h2>
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[...PLACES[country]]
                    .sort((a, b) => a.name.localeCompare(b.name, "sr"))
                    .map((place) => {
                      const key = `${country}-${place.name}`;
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => setActive(key)}
                            onMouseEnter={() => setActive(key)}
                            onMouseLeave={() => setActive((cur) => (cur === key ? null : cur))}
                            className={`text-left transition-colors hover:text-foreground ${active === key ? "text-foreground font-semibold" : "text-foreground/75"}`}
                          >
                            {place.name}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-10 grid gap-8 md:grid-cols-2">
            <div>
              <div className="eyebrow">Adresa u vašem gradu</div>
              <p className="mt-4 serif text-2xl leading-tight">
                Pišite nam na Viber ili WhatsApp i javićemo vam gde u vašem gradu možete da kupite EXIT.
              </p>
              <a href="https://wa.me/381653176716" className="btn-outline mt-6 tabular-nums">+381 65 317 6716</a>
            </div>
            <div>
              <div className="eyebrow">Nema nas u vašem gradu?</div>
              <p className="mt-4 text-foreground/75 leading-relaxed">
                Poručite online: dostava je besplatna u celoj Srbiji, a plaćate pouzećem.
              </p>
              <Link to="/katalog" className="btn-outline mt-6">Pogledajte modele</Link>
              <p className="mt-8 text-foreground/75 leading-relaxed">
                Imate butik i želite EXIT u ponudi?{" "}
                <Link to="/postani-partner" className="text-foreground underline underline-offset-4">Postanite partner</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
