import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/hero/Hero";
import { EcoProduction } from "@/components/EcoProduction";
import { HomeCollection } from "@/components/HomeCollection";
import { Button } from "@/components/ui/button";
import { homeAssetsQuery, productsQuery } from "@/lib/product-queries";
import editorial from "@/assets/exit-original-cover.webp.asset.json";
import editorialMobile from "@/assets/exit-original-cover-mobile.webp.asset.json";

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
        <HomeCollection />
        <section className="px-5 md:px-12 pt-4 pb-12 md:pb-20" aria-labelledby="collection-heading">
          <div className="flex items-end justify-between gap-4 border-t border-foreground pt-5 mb-7">
            <h2 id="collection-heading" className="text-2xl md:text-4xl">Ostatak garderobe.</h2>
            <span className="hidden md:block text-xs text-muted-foreground">EXIT / ASORTIMAN</span>
          </div>
          <div className="exit-category-list grid grid-cols-1 sm:grid-cols-3 gap-0 md:gap-6">
            {categories.map((c) => (
              <Link key={c.key} to={c.to} className="group block">
                <div className="exit-category-image overflow-hidden bg-secondary">
                  {assets[c.key]?.url && <img src={assets[c.key].url} alt={assets[c.key].alt || c.alt} width={1000} height={1500} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />}
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-border py-4">
                  <div><h3 className="text-xl md:text-2xl">{c.name}</h3><p className="mt-2 text-sm text-muted-foreground">{c.note}</p></div>
                  <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground mono">{c.number}</span><ArrowUpRight className="h-5 w-5" /></div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="exit-fit-note px-5 md:px-12 py-10 md:py-16 border-y border-border grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <p className="text-xs text-muted-foreground mb-4">PRE NEGO ŠTO IZABERETE</p>
            <h2 className="text-3xl md:text-5xl leading-tight">Kroj menja sve.<br /><span className="text-muted-foreground">Veličina pravi razliku.</span></h2>
          </div>
          <div className="max-w-md md:justify-self-end">
            <p className="text-base leading-relaxed text-muted-foreground">Uzak ili opušten? Ravna ili šira nogavica? Pronađite razliku između krojeva i izaberite veličinu koja vam odgovara.</p>
            <Button asChild variant="link" className="mt-5 h-auto p-0 text-foreground"><Link to="/vodic-za-farmerke">Vodič za kroj i veličinu <ArrowRight /></Link></Button>
            <Link to="/kontakt" className="block mt-4 text-sm underline underline-offset-4 text-muted-foreground">Pitajte nas za savet</Link>
          </div>
        </section>
        <EcoProduction />
        <section className="bg-ink text-cover-foreground px-5 md:px-12 py-10 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-7">
          <div><p className="text-xs text-cover-foreground/60 mb-4">JEDNOSTAVNO, OD IZBORA DO VRATA.</p><h2 className="text-3xl md:text-5xl text-cover-foreground">Vaš par čeka.</h2><p className="mt-4 text-sm text-cover-foreground/80">Dostavu plaćamo mi. Paket plaćate kuriru.</p></div>
          <Button asChild size="lg" className="h-12 rounded-none bg-accent text-accent-foreground shadow-none hover:bg-accent/90"><Link to="/katalog">Pogledajte sve modele <ArrowRight /></Link></Button>
        </section>
      </div>
    </Layout>
  );
}
