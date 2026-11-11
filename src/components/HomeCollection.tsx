import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { productsQuery } from "@/lib/product-queries";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

const FILTERS = [
  { label: "Svi krojevi", fits: [] },
  { label: "Uži", fits: ["Slim", "Regular Slim"] },
  { label: "Opušteni", fits: ["Relaxed"] },
  { label: "Šire nogavice", fits: ["Bootcut", "Flare"] },
  { label: "Skraćeni", fits: ["Cropped"] },
];

export function HomeCollection() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const [active, setActive] = useState(0);
  const filter = FILTERS[active] ?? FILTERS[0];
  const visible = products.filter((p) => !filter.fits.length || filter.fits.includes(p.fit)).slice(0, 4);
  return (
    <section className="exit-collection px-4 md:px-8 py-9 md:py-14" aria-labelledby="models-heading">
      <div className="flex items-end justify-between gap-4">
        <h2 id="models-heading" className="text-lg md:text-xl">Pronađite svoj par.</h2>
        <Button asChild variant="link" className="h-auto px-0 text-foreground"><Link to="/katalog">Svi modeli <ArrowUpRight /></Link></Button>
      </div>
      <div role="group" aria-label="Izaberite kroj" className="flex flex-wrap gap-2 mt-5 mb-6">
        {FILTERS.map((f, i) => (
          <Button key={f.label} variant="fashion" aria-pressed={active === i} onClick={() => setActive(i)} className={`h-9 px-3 text-xs ${active === i ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}>{f.label}</Button>
        ))}
      </div>
      {visible.length > 0 ? (
        <div className="exit-showroom-grid grid gap-x-2 md:gap-x-3 gap-y-7">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="min-h-56 flex flex-col justify-center items-start gap-4"><p>Trenutno nema modela u ovom kroju.</p><Button variant="outline" onClick={() => setActive(0)}>Pogledajte ostale krojeve</Button></div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">Besplatna dostava u Srbiji. Plaćate kada preuzmete paket.</p>
    </section>
  );
}