import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, Ruler, Truck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/hero/Hero";
import { EcoProduction } from "@/components/EcoProduction";
import { HomeCollection } from "@/components/HomeCollection";
import { DenimEditorial } from "@/components/DenimEditorial";
import { CategorySlider } from "@/components/CategorySlider";
import { BRAND, BRAND_HISTORY_TEXT, EXPORT_TEXT, MANUFACTURING, organizationSchema } from "@/lib/brand";
import { loadHome } from "@/lib/catalog-loader";
import { MEDIA, absoluteMedia } from "@/lib/media";

const TITLE = "EXIT Denim — Muške farmerke proizvedene u Srbiji";
const DESCRIPTION =
  "Muške farmerke, muški jeans i teksas pantalone domaće proizvodnje — slim, regular, relaxed, bootcut i flare. 5.990 din, besplatna dostava, plaćanje pouzećem, dostava po celoj Srbiji.";

export const Route = createFileRoute("/")({
  loader: ({ context }) => loadHome(context.queryClient),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://exitdenim.shop/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: absoluteMedia(MEDIA.coverSeated) },
      { name: "twitter:image", content: absoluteMedia(MEDIA.coverSeated) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://exitdenim.shop/" },
      { rel: "preload", as: "image", href: MEDIA.coverSeated, media: "(min-width: 768px)", fetchPriority: "high" },
      { rel: "preload", as: "image", href: MEDIA.coverPortraitMobile, media: "(max-width: 767px)", fetchPriority: "high" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationSchema) },
      {
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "EXIT Denim", url: "https://exitdenim.shop/" }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <Layout>
      <Hero />

      <div className="service-line">
        <span>
          <Truck aria-hidden="true" /> Besplatna dostava u Srbiji
        </span>
        <span>
          <Banknote aria-hidden="true" /> Plaćanje pouzećem
        </span>
        <Link to="/vodic-za-farmerke">
          <Ruler aria-hidden="true" /> Pomoć oko veličine
        </Link>
      </div>

      <CategorySlider />
      <HomeCollection />
      <EcoProduction />
      <DenimEditorial />

      <section className="band-dark section-pad" aria-labelledby="brand-title">
        <div className="container-x">
          <span className="stitch-tick" aria-hidden="true" />
          <h2 id="brand-title" className="mt-3 max-w-[22ch]">
            EXIT Denim, Novi Pazar, od {BRAND.foundedYear}.
          </h2>
          <dl className="facts mt-10">
            <div>
              <dt>Godina osnivanja</dt>
              <dd>{BRAND.foundedYear}</dd>
            </div>
            <div>
              <dt>Zaposlenih</dt>
              <dd>{MANUFACTURING.employees}</dd>
            </div>
            <div>
              <dt>Komada jeansa mesečno, u proseku</dt>
              <dd>oko {MANUFACTURING.averageMonthlyJeans.toLocaleString("sr-RS")}</dd>
            </div>
            <div>
              <dt>Izvoz</dt>
              <dd>EU i region</dd>
            </div>
          </dl>
          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-12 text-[0.9375rem] leading-relaxed text-background/80">
            <p>{BRAND_HISTORY_TEXT}</p>
            <div>
              <p>{EXPORT_TEXT}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-background">
                <Link to="/proizvodnja" className="section-head__link">
                  O brendu i proizvodnji <ArrowRight aria-hidden="true" />
                </Link>
                <Link to="/private-label" className="section-head__link">
                  Izrada za vaš brend <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x section-pad" aria-labelledby="cargo-story-title">
        <div className="story">
          <img
            src={MEDIA.studioCargo}
            alt="Muške maslinastozelene EXIT džeparke sa bočnim džepovima, model u pokretu"
            width={900}
            height={945}
            loading="lazy"
            decoding="async"
          />
          <div className="story__copy">
            <p>Džeparke</p>
            <h2 id="cargo-story-title">
              Sloboda
              <br />u pokretu
            </h2>
            <Link to="/cargo" className="btn-primary">
              Pogledajte džeparke <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x pb-4 md:pb-8" aria-labelledby="fit-note-title">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:gap-16 md:items-end border-t border-line pt-10 md:pt-16">
          <div>
            <p className="eyebrow">Pre nego što izaberete</p>
            <h2 id="fit-note-title" className="mt-2">
              Dobar izbor počinje <span className="text-ink-3">pravom veličinom</span>
            </h2>
          </div>
          <div className="max-w-md md:justify-self-end">
            <p className="text-ink-2">
              Uzak ili opušten? Ravna ili šira nogavica? Pronađite razliku između krojeva i izaberite veličinu koja vam odgovara.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/vodic-za-farmerke" className="btn-dark">
                Vodič za kroj i veličinu
              </Link>
              <Link to="/kontakt" className="btn-outline">
                Pitajte nas za savet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
