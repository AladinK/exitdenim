import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Layout } from "./Layout";
import { EcoProduction } from "./EcoProduction";
import { Button } from "./ui/button";
import { BRAND, MANUFACTURING } from "@/lib/brand";
import { ENGLISH_HISTORY, ENGLISH_EXPORT, type EnglishB2BPage } from "@/lib/b2b-english";

export function EnglishB2B({ page }: { page: EnglishB2BPage }) {
  const privateLabel = page === "privateLabel";
  return (
    <Layout>
      <article lang="en">
        <header className="container-x py-12 md:py-20">
          <nav aria-label="Business pages and language" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link to="/en/manufacturing" aria-current={!privateLabel ? "page" : undefined} className="underline underline-offset-4">Manufacturing</Link>
            <Link to="/en/private-label" aria-current={privateLabel ? "page" : undefined} className="underline underline-offset-4">Private label</Link>
            <Link to={privateLabel ? "/private-label" : "/proizvodnja"} lang="sr" hrefLang="sr" className="text-muted-foreground">Srpski</Link>
            <span aria-current="true">English</span>
          </nav>
          <p className="mt-12 text-sm text-muted-foreground">EXIT Denim · Novi Pazar, Serbia · Since {BRAND.foundedYear}</p>
          <h1 className="mt-5 text-4xl md:text-6xl max-w-4xl leading-tight">{privateLabel ? "Private-label denim for your brand." : "EXIT Denim. Manufacturing in Serbia."}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">{privateLabel ? "Denim and trouser manufacturing for fashion brands, with collection-specific finishing and individually agreed production requirements." : ENGLISH_HISTORY}</p>
          <Button asChild size="lg" className="mt-8 h-auto min-h-12 py-3 whitespace-normal"><a href={`mailto:${BRAND.email}?subject=${encodeURIComponent("EXIT Denim — " + (privateLabel ? "Private-label enquiry" : "Manufacturing enquiry"))}`}>Discuss your collection <ArrowRight aria-hidden="true" /></a></Button>
          <dl className="mt-14 grid gap-8 border-y border-border py-8 md:grid-cols-3">
            {[[String(BRAND.foundedYear), "Brand founded in Novi Pazar"], ["Approx. " + MANUFACTURING.averageMonthlyJeans.toLocaleString("en-GB"), "Pairs of jeans per month on average"], [String(MANUFACTURING.employees), "Employees at TRI-B DOO"]].map(([value, label]) => <div key={label}><dt className="text-2xl font-semibold">{value}</dt><dd className="mt-2 text-sm text-muted-foreground">{label}</dd></div>)}
          </dl>
        </header>
        <section className="container-x pb-12 md:pb-20 grid gap-10 md:grid-cols-2">
          <div><h2 className="text-2xl">{privateLabel ? "Your label. Our manufacturing." : "Production in Novi Pazar"}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{privateLabel ? ENGLISH_HISTORY + " We manufacture denim and trousers for personalised brands. The look, details and finishing are agreed to suit your collection." : `Our production address is ${BRAND.streetAddress}, ${BRAND.city}, Serbia. Average output is not a promise of reserved capacity for any individual order.`}</p></div>
          <div><h2 className="text-2xl">Export to the EU and the region</h2><p className="mt-4 leading-relaxed text-muted-foreground">{ENGLISH_EXPORT}</p></div>
          <div><h2 className="text-2xl">Collection requirements</h2><p className="mt-4 leading-relaxed text-muted-foreground">Send your collection brief, intended models, approximate quantities and finishing requirements. Personalisation options, minimum order quantities, prices and lead times are confirmed directly before cooperation begins.</p></div>
          <div><h2 className="text-2xl">Certification enquiries</h2><p className="mt-4 leading-relaxed text-muted-foreground">Please contact EXIT for information about certification relevant to your collection.</p></div>
        </section>
        <EcoProduction language="en" />
        <section className="container-x py-12 md:py-20">
          <h2 className="text-3xl">Let’s discuss your collection.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Business production and export terms are agreed separately. Retail offers on the Serbian store do not automatically apply to EU or private-label orders.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild className="h-auto min-h-12 py-3 whitespace-normal break-all"><a href={`mailto:${BRAND.email}`}><Mail aria-hidden="true" />{BRAND.email}</a></Button>
            <Button asChild variant="outline" className="h-auto min-h-12 py-3"><a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />WhatsApp</a></Button>
          </div>
          <address className="mt-8 not-italic text-sm leading-relaxed text-muted-foreground">{BRAND.name} · {BRAND.legalName}<br />{BRAND.streetAddress}, {BRAND.city}, Serbia<br />Tax ID (PIB): {BRAND.taxId} · Company registration: {BRAND.registrationId}<br /><a href={`tel:${BRAND.phone}`} className="underline underline-offset-4">{BRAND.phoneLabel}</a></address>
        </section>
      </article>
    </Layout>
  );
}