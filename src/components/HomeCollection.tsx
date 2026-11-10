import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { productsQuery } from "@/lib/product-queries";
import { Button } from "@/components/ui/button";
import { productAlt } from "@/lib/seo-labels";

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
  const visible = products.filter((p) => !filter.fits.length || filter.fits.includes(p.fit)).slice(0, 3);
  return (
    <section className="exit-collection px-5 md:px-12 py-10 md:py-16" aria-labelledby="models-heading">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs text-muted-foreground mb-3">KROJEVI / EXIT</p><h2 id="models-heading" className="text-3xl md:text-5xl">Kako volite da nosite?</h2></div>
        <Button asChild variant="link" className="h-auto px-0 text-foreground"><Link to="/katalog">Svi modeli <ArrowUpRight /></Link></Button>
      </div>
      <div role="group" aria-label="Izaberite kroj" className="flex flex-wrap gap-x-5 gap-y-1 mt-6 mb-7 border-b border-border">
        {FILTERS.map((f, i) => (
          <Button key={f.label} variant="ghost" aria-pressed={active === i} onClick={() => setActive(i)} className={`h-11 rounded-none border-b-2 px-0 bg-transparent hover:bg-transparent hover:text-foreground ${active === i ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}>{f.label}</Button>
        ))}
      </div>
      {visible.length > 0 ? (
        <div className="exit-showroom-grid grid gap-x-5 md:gap-x-8 gap-y-7">
          {visible.map((product, i) => (
            <Link key={product.id} to="/proizvod/$slug" params={{ slug: product.slug }} className="exit-showroom-link group block min-w-0">
              <div className="flex justify-between items-center text-[11px] mb-3 text-muted-foreground"><span>{String(i + 1).padStart(2, "0")} / {product.fit}</span><ArrowUpRight className="h-4 w-4 text-foreground" /></div>
              <div className="exit-showroom-product relative overflow-hidden bg-secondary">
                {product.image_url && <img src={product.image_url} alt={productAlt(product)} width={1100} height={1467} loading="lazy" decoding="async" className="h-full w-full object-cover" />}
              </div>
              <div className="border-b border-border py-4">
                <h3 className="text-sm leading-snug font-medium line-clamp-2">{product.name}</h3>
                <div className="flex flex-wrap justify-between gap-2 mt-3 text-xs"><span className="text-muted-foreground">{product.color}</span><span className="font-semibold tabular-nums">{Number(product.retail).toLocaleString("sr-RS")} din</span></div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="min-h-56 flex flex-col justify-center items-start gap-4"><p>Trenutno nema modela u ovom kroju.</p><Button variant="outline" onClick={() => setActive(0)}>Pogledajte ostale krojeve</Button></div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">Besplatna dostava u Srbiji. Plaćate kada preuzmete paket.</p>
    </section>
  );
}