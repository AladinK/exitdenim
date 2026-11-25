import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { catalogQuery } from "@/lib/product-queries";
import { CatalogUnavailable } from "@/components/CatalogUnavailable";
import { usePartner } from "@/hooks/usePartner";
import { LANDING_PAGES, type LandingPage } from "@/lib/landing-pages";

const BASE = "https://exitdenim.shop";

export function landingHead(l: LandingPage) {
  return {
    meta: [
      { title: l.title },
      { name: "description", content: l.description },
      { property: "og:title", content: l.title },
      { property: "og:description", content: l.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: BASE + l.path },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: BASE + l.path }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Početna", item: BASE + "/" },
            { "@type": "ListItem", position: 2, name: "Svi modeli", item: BASE + "/katalog" },
            { "@type": "ListItem", position: 3, name: l.h1, item: BASE + l.path },
          ],
        }),
      },
    ],
  };
}

export function CategoryLanding({ page }: { page: LandingPage }) {
  const { data: catalog } = useSuspenseQuery(catalogQuery());
  const { approved, wholesale } = usePartner();
  const items = catalog.products.filter(page.match);
  return (
    <Layout>
      <section className="container-x pt-2 pb-8 md:pb-12">
        <nav aria-label="Putanja" className="flex min-h-12 flex-wrap items-center gap-x-2 text-sm text-ink-3">
          <Link to="/" className="hover:text-foreground">Početna</Link>
          <span aria-hidden="true">/</span>
          <Link to="/katalog" className="hover:text-foreground">Svi modeli</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink-2">{page.h1}</span>
        </nav>
        <h1 className="mt-4 md:mt-8">{page.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{page.intro}</p>
      </section>

      <section className="container-x pb-16" aria-label="Modeli">
        {catalog.state === "down" ? (
          <CatalogUnavailable />
        ) : items.length ? (
          <>
            <p className="mb-6 text-sm text-ink-3">{items.length} {items.length === 1 ? "model" : "modela"}</p>
            <div className="product-grid">
              {items.map((p, index) => (
                <ProductCard key={p.id} product={p} eager={index < 4} wholesale={approved ? wholesale[p.id] : undefined} />
              ))}
            </div>
          </>
        ) : (
          <div className="notice">
            <p>Novi modeli u ovoj kategoriji stižu uskoro.</p>
            <div><Link to="/katalog" className="btn-outline">Pogledajte sve modele</Link></div>
          </div>
        )}
      </section>

      <section className="band-soft section-pad">
        <div className="container-x grid gap-x-16 gap-y-10 md:grid-cols-2">
          {page.sections.map((s) => (
            <div key={s.h}>
              <span className="stitch-tick" aria-hidden="true" />
              <h2 className="mt-3 text-xl md:text-2xl">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x section-pad max-w-3xl">
        <h2 className="text-xl md:text-2xl">Česta pitanja</h2>
        <div className="mt-4 border-t border-line">
          {page.faq.map((f) => (
            <details key={f.q} className="disclosure">
              <summary>{f.q}<Plus aria-hidden="true" /></summary>
              <div className="disclosure__body"><p>{f.a}</p></div>
            </details>
          ))}
        </div>
      </section>

      <section className="container-x pb-8">
        <h2 className="text-base font-semibold tracking-normal">Pogledajte i</h2>
        <ul className="choice-row mt-4">
          {LANDING_PAGES.filter((l) => l.path !== page.path).map((l) => (
            <li key={l.path}><Link to={l.path as "/jeans"} className="choice">{l.label}</Link></li>
          ))}
          <li><Link to="/vodic-za-farmerke" className="choice">Vodič: kako izabrati farmerke</Link></li>
        </ul>
      </section>
    </Layout>
  );
}
