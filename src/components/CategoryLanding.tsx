import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { productsQuery } from "@/lib/product-queries";
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
            { "@type": "ListItem", position: 2, name: "Shop", item: BASE + "/katalog" },
            { "@type": "ListItem", position: 3, name: l.h1, item: BASE + l.path },
          ],
        }),
      },
    ],
  };
}

export function CategoryLanding({ page }: { page: LandingPage }) {
  const { data } = useSuspenseQuery(productsQuery());
  const items = (data ?? []).filter(page.match);
  return (
    <Layout>
      <section className="container-x pt-10 md:pt-16 pb-8">
        <nav aria-label="Putanja" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Početna</Link> / <Link to="/katalog" className="hover:text-foreground">Shop</Link> / <span>{page.h1}</span>
        </nav>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] leading-none">{page.h1}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{page.intro}</p>
      </section>

      <section className="container-x pb-16" aria-label="Modeli">
        {items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-8 md:gap-y-12">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-muted-foreground">Novi modeli stižu uskoro. <Link to="/katalog" className="underline">Pogledaj sve modele</Link>.</p>
        )}
      </section>

      <section className="container-x pb-16 grid md:grid-cols-2 gap-10 max-w-5xl">
        {page.sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-xl md:text-2xl">{s.h}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{s.p}</p>
          </div>
        ))}
      </section>

      <section className="container-x pb-16 max-w-3xl">
        <h2 className="text-xl md:text-2xl">Česta pitanja</h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {page.faq.map((f) => (
            <details key={f.q} className="py-4 group">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-x pb-20">
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Pogledaj i</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {LANDING_PAGES.filter((l) => l.path !== page.path).map((l) => (
            <li key={l.path}><a href={l.path} className="inline-block border border-border px-3 py-1.5 text-sm hover:border-foreground">{l.label}</a></li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
