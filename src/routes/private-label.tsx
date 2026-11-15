import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useSiteAssets } from "@/hooks/useSiteAsset";
import { EcoProduction } from "@/components/EcoProduction";
import { BRAND_HISTORY_TEXT, EXPORT_TEXT, MANUFACTURING, organizationSchema } from "@/lib/brand";
import { b2bLanguageLinks } from "@/lib/b2b-english";

const URL = "https://exitdenim.shop/private-label";
const TITLE = "Izrada za vaš brend · Private label — EXIT Denim";
const DESCRIPTION = "EXIT Denim, Novi Pazar od 1991: private-label proizvodnja, oko 5.000 komada jeansa mesečno, 35 zaposlenih i izvoz u EU i zemlje bivše Jugoslavije.";

export const Route = createFileRoute("/private-label")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }, ...b2bLanguageLinks("/private-label", "/en/private-label")],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Izrada za personalizovane brendove — EXIT Denim",
        serviceType: "Private-label proizvodnja denima i pantalona",
        description: DESCRIPTION,
        url: URL,
        provider: { "@type": "Organization", "@id": organizationSchema["@id"], name: organizationSchema.name, legalName: organizationSchema.legalName, url: organizationSchema.url, address: organizationSchema.address },
      }),
    }],
  }),
  component: PrivateLabelPage,
});

function PrivateLabelPage() {
  const assets = useSiteAssets();
  const workshop = assets["page_proizvodnja"] || assets["workshop"];

  return (
    <Layout>
      <article className="container-x py-12 md:py-20">
        <nav aria-label="Putanja" className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Početna</Link>
          <span aria-hidden="true"> / </span>
          <span>Izrada za vaš brend</span>
        </nav>
        <header className="mt-10 max-w-4xl">
          <Link to="/en/private-label" lang="en" hrefLang="en" className="inline-block mb-6 text-sm underline underline-offset-4">English · Private label</Link>
          <p className="text-sm text-muted-foreground">EXIT Denim · Proizvodnja u Srbiji</p>
          <h1 className="mt-5 text-4xl md:text-6xl leading-tight tracking-normal">Izrada za vaš brend</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            EXIT nudi izradu personalizovanih brendova — private-label proizvodnju denima i pantalona, sa završnom obradom najvišeg kvaliteta i 35 godina iskustva u poslovima vezanim za izvoz.
          </p>
          <Button asChild size="lg" className="mt-8 h-auto min-h-12 rounded-sm py-3 whitespace-normal">
            <Link to="/kontakt">Razgovarajmo o vašem brendu <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </header>

        <dl className="mt-14 grid gap-8 border-y border-border py-8 md:grid-cols-3">
          {[["Od 1991.", "EXIT Denim · Novi Pazar"], [MANUFACTURING.averageMonthlyJeans.toLocaleString("sr-RS"), "Komada jeansa mesečno u proseku"], [String(MANUFACTURING.employees), "Zaposlenih u firmi"]].map(([term, detail]) => (
            <div key={term}><dt className="text-2xl font-semibold">{term}</dt><dd className="mt-2 text-sm text-muted-foreground">{detail}</dd></div>
          ))}
        </dl>

        {workshop?.url && <figure className="mt-12 aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-muted"><img src={workshop.url} alt={workshop.alt || "EXIT Denim proizvodnja u Srbiji"} className="h-full w-full object-cover" loading="lazy" decoding="async" /></figure>}

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <section>
            <h2 className="text-2xl tracking-normal">Šta je private-label proizvodnja?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Private label znači izradu proizvoda za vaš sopstveni brend. EXIT je proizvodni partner za brendove koji žele personalizovane denim proizvode i pantalone, uz dogovor o zahtevima kolekcije i završnoj obradi.</p>
          </section>
          <section>
            <h2 className="text-2xl tracking-normal">Završna obrada najvišeg kvaliteta</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Pažnja prema završnoj obradi važan je deo EXIT ponude. Izgled proizvoda, detalji i finiš usaglašavaju se sa zahtevima vašeg brenda, kako bi kolekcija imala prepoznatljiv identitet.</p>
          </section>
          <section>
            <h2 className="text-2xl tracking-normal">Izvoz u EU i region</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{BRAND_HISTORY_TEXT} {EXPORT_TEXT}</p>
          </section>
          <section>
            <h2 className="text-2xl tracking-normal">Dogovor prema vašoj kolekciji</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Za ponudu pošaljite opis kolekcije, željene modele, okvirne količine i zahteve za završnu obradu. Mogućnosti personalizacije, minimalne količine, cena i rokovi potvrđuju se pojedinačno, pre početka saradnje.</p>
          </section>
        </div>

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-2xl tracking-normal">Vaš brend. EXIT proizvodnja.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Javite nam se sa idejom za svoju kolekciju i razgovarajmo o proizvodnji.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild size="lg"><Link to="/kontakt">Kontakt <ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/proizvodnja">O proizvodnji</Link></Button>
          </div>
        </section>
      </article>
      <EcoProduction />
    </Layout>
  );
}