import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/hero/Hero";
import { EcoProduction } from "@/components/EcoProduction";
import { HomeCollection } from "@/components/HomeCollection";
import { DenimEditorial } from "@/components/DenimEditorial";
import { Button } from "@/components/ui/button";
import { homeAssetsQuery, productsQuery } from "@/lib/product-queries";
import editorial from "@/assets/exit-seated-cover.webp.asset.json";
import editorialMobile from "@/assets/exit-portrait-cover-mobile.webp.asset.json";
import cargoStudio from "@/assets/exit-studio-cargo.webp.asset.json";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery()),
      context.queryClient.ensureQueryData(homeAssetsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "EXIT Denim — Muške farmerke proizvedene u Srbiji" },
      { name: "description", content: "Muške farmerke, muški jeans i teksas pantalone domaće proizvodnje — slim, regular, relaxed, bootcut i flare. 5.990 din, besplatna dostava, plaćanje pouzećem, dostava po celoj Srbiji." },
      { property: "og:title", content: "EXIT Denim — Muške farmerke proizvedene u Srbiji" },
      { property: "og:description", content: "Muške farmerke, muški jeans i teksas pantalone domaće proizvodnje — slim, regular, relaxed, bootcut i flare. 5.990 din, besplatna dostava, plaćanje pouzećem, dostava po celoj Srbiji." },
      { property: "og:url", content: "https://exitdenim.shop/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: editorial.url },
      { name: "twitter:image", content: editorial.url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://exitdenim.shop/" },
      { rel: "preload", as: "image", href: editorial.url, media: "(min-width: 768px)", fetchPriority: "high" },
      { rel: "preload", as: "image", href: editorialMobile.url, media: "(max-width: 767px)", fetchPriority: "high" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "EXIT Denim", url: "https://exitdenim.shop/", telephone: "+381653176716" }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "EXIT Denim", url: "https://exitdenim.shop/" }) },
    ],
  }),
  component: HomePage,
});


function HomePage() {
  const { data: assets } = useSuspenseQuery(homeAssetsQuery());
  const categories = [
    { to: "/jeans", name: "Farmerke", note: "Teksas. U vašem kroju.", key: "category_jeans", alt: "Muške plave farmerke EXIT na modelu", number: "01" },
    { to: "/chino", name: "Chino pantalone", note: "Od jutra do večeri.", key: "category_chino", alt: "Muške svetle chino pantalone EXIT na modelu", number: "02" },
    { to: "/cargo", name: "Džeparke", note: "Više prostora. Više detalja.", key: "category_cargo", alt: "Muške cargo pantalone EXIT sa bočnim džepovima", number: "03" },
  ] as const;
  return (
    <Layout>
      <div className="exit-home bg-background">
        <Hero />
        <div className="exit-service-line border-b border-border px-5 md:px-12 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
          <span>Besplatna dostava u Srbiji</span>
          <span>Plaćanje pouzećem</span>
          <Link to="/vodic-za-farmerke" className="inline-flex items-center gap-2 font-medium">Pomoć oko veličine <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <section className="exit-category-campaigns px-4 md:px-8 py-6 md:py-8" aria-labelledby="collection-heading">
          <div className="sr-only">
            <h2 id="collection-heading" className="text-2xl md:text-4xl">I van teksasa.</h2>
            <span className="hidden md:block text-xs text-muted-foreground">EXIT / ASORTIMAN</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link key={c.key} to={c.to} className="exit-category-entry group block relative overflow-hidden rounded-lg">
                <div className="exit-category-image overflow-hidden bg-secondary">
                  {assets[c.key]?.url && <img src={assets[c.key].url} alt={assets[c.key].alt || c.alt} width={1000} height={1500} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />}
                </div>
                <div className="exit-category-label bg-control text-control-foreground rounded-lg px-4 py-2"><h3 className="text-base font-normal">{c.name}</h3></div>
              </Link>
            ))}
          </div>
        </section>
        <HomeCollection />
        <EcoProduction />
        <DenimEditorial />
        <section className="exit-cargo-story relative isolate overflow-hidden text-cover-foreground" aria-labelledby="cargo-story-title">
          <img src={cargoStudio.url} alt="Muške maslinastozelene EXIT džeparke sa bočnim džepovima, model u pokretu" width={900} height={945} loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="exit-cargo-shade absolute inset-0 -z-10" aria-hidden="true" />
          <div className="px-5 md:px-12 py-8 md:py-12 flex h-full flex-col items-start justify-between">
            <p className="mono text-xs">02 / DŽEPARKE</p>
            <div><h2 id="cargo-story-title" className="text-4xl md:text-6xl text-cover-foreground">Sloboda<br />u pokretu.</h2><Button asChild variant="secondary" className="mt-6 rounded-none h-12"><Link to="/cargo">Pogledajte džeparke <ArrowRight /></Link></Button></div>
          </div>
        </section>
        <section className="exit-fit-note px-5 md:px-12 py-10 md:py-16 border-y border-border grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <p className="text-xs text-muted-foreground mb-4">PRE NEGO ŠTO IZABERETE</p>
            <h2 className="text-3xl md:text-5xl leading-tight">Dobar izbor počinje<br /><span className="text-muted-foreground">pravom veličinom.</span></h2>
          </div>
          <div className="max-w-md md:justify-self-end">
            <p className="text-base leading-relaxed text-muted-foreground">Uzak ili opušten? Ravna ili šira nogavica? Pronađite razliku između krojeva i izaberite veličinu koja vam odgovara.</p>
            <Button asChild variant="link" className="mt-5 h-auto p-0 text-foreground"><Link to="/vodic-za-farmerke">Vodič za kroj i veličinu <ArrowRight /></Link></Button>
            <Link to="/kontakt" className="block mt-4 text-sm underline underline-offset-4 text-muted-foreground">Pitajte nas za savet</Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
