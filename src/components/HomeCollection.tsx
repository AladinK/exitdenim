import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { productsQuery } from "@/lib/product-queries";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

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
    <section className="exit-collection px-5 md:px-12 py-10 md:py-16" aria-labelledby="models-heading">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs text-muted-foreground mb-3">IZABERITE SVOJ PAR</p><h2 id="models-heading" className="text-3xl md:text-5xl">Kroj po vašem.</h2></div>
        <Button asChild variant="link" className="h-auto px-0 text-foreground"><Link to="/katalog">Svi modeli <ArrowUpRight /></Link></Button>
      </div>
      <div role="group" aria-label="Izaberite kroj" className="flex flex-wrap gap-x-5 gap-y-1 mt-6 mb-7 border-b border-border">
        {FILTERS.map((f, i) => (
          <Button key={f.label} variant="ghost" aria-pressed={active === i} onClick={() => setActive(i)} className={`h-11 rounded-none border-b-2 px-0 bg-transparent hover:bg-transparent hover:text-foreground ${active === i ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}>{f.label}</Button>
        ))}
      </div>
      {visible.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="min-h-56 flex flex-col justify-center items-start gap-4"><p>Trenutno nema modela u ovom kroju.</p><Button variant="outline" onClick={() => setActive(0)}>Pogledajte ostale krojeve</Button></div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">Besplatna dostava u Srbiji. Plaćate kada preuzmete paket.</p>
    </section>
  );
}