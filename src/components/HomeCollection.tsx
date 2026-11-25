import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { catalogQuery } from "@/lib/product-queries";
import { ProductCard } from "@/components/ProductCard";
import { CatalogUnavailable } from "@/components/CatalogUnavailable";

const FILTERS = [
  { label: "Svi krojevi", fits: [] as string[] },
  { label: "Uži", fits: ["Slim", "Regular Slim"] },
  { label: "Opušteni", fits: ["Relaxed"] },
  { label: "Šire nogavice", fits: ["Bootcut", "Flare"] },
  { label: "Skraćeni", fits: ["Cropped"] },
];

export function HomeCollection() {
  const { data: catalog } = useSuspenseQuery(catalogQuery());
  const [active, setActive] = useState(0);
  const filter = FILTERS[active] ?? FILTERS[0];
  const visible = catalog.products
    .filter((p) => !filter.fits.length || filter.fits.includes(p.fit))
    .slice(0, 8);

  return (
    <section className="container-x section-pad" aria-labelledby="models-heading">
      <div className="section-head">
        <div>
          <span className="stitch-tick" aria-hidden="true" />
          <h2 id="models-heading">Pronađite svoj par</h2>
        </div>
        <Link to="/katalog" className="section-head__link">
          Svi modeli <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      {catalog.state === "down" ? (
        <div className="mt-8">
          <CatalogUnavailable />
        </div>
      ) : (
        <>
          <div role="group" aria-label="Izaberite kroj" className="choice-row choice-row--scroll mt-6">
            {FILTERS.map((f, i) => (
              <button key={f.label} type="button" className="choice" aria-pressed={active === i} onClick={() => setActive(i)}>
                {f.label}
              </button>
            ))}
          </div>
          {visible.length > 0 ? (
            <div className="product-grid mt-8">
              {visible.map((product, index) => (
                <ProductCard key={product.id} product={product} eager={index < 2} />
              ))}
            </div>
          ) : (
            <div className="notice mt-8">
              <p>Trenutno nema modela u ovom kroju.</p>
              <div>
                <button type="button" className="btn-outline" onClick={() => setActive(0)}>
                  Pogledajte ostale krojeve
                </button>
              </div>
            </div>
          )}
          <div className="mt-10">
            <Link to="/katalog" className="btn-outline w-full sm:w-auto">
              Pogledajte sve modele
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
