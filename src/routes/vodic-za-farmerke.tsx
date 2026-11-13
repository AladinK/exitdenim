import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { GUIDE, GUIDE_COUNT } from "@/lib/jeans-guide";

const URL = "https://exitdenim.shop/vodic-za-farmerke";
const TITLE = "Vodič za muške farmerke — najčešća pitanja | EXIT Denim";
const DESC = "Koji kroj farmerki odabrati, kako izabrati veličinu i dužinu, kako prati i održavati farmerke i kako ih kombinovati. Odgovori na preko 100 pitanja.";

export const Route = createFileRoute("/vodic-za-farmerke")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: GUIDE.flatMap((s) =>
            s.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          ),
        }),
      },
    ],
  }),
  component: Guide,
});

function Guide() {
  return (
    <Layout>
      <section className="container-x pt-10 md:pt-16 pb-8 max-w-4xl">
        <nav aria-label="Putanja" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Početna</Link> / <span>Vodič za farmerke</span>
        </nav>
        <h1 className="mt-4 text-[clamp(2rem,5.5vw,4rem)] leading-none">Najčešća pitanja o muškim farmerkama</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Jednostavni odgovori na {GUIDE_COUNT} pitanja: kako izabrati kroj, veličinu i dužinu, kako prati farmerke i kako ih nositi.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {GUIDE.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-block border border-border px-3 py-1.5 text-sm hover:border-foreground">{s.title}</a>
            </li>
          ))}
        </ul>
      </section>

      <div className="container-x pb-16 max-w-4xl space-y-14">
        {GUIDE.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <h2 className="text-2xl md:text-3xl">{s.title}</h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {s.items.map(([q, a]) => (
                <details key={q} className="py-4">
                  <summary className="cursor-pointer font-medium">{q}</summary>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section className="border border-border p-6 md:p-8">
          <h2 className="text-xl md:text-2xl">Niste sigurni koji broj ili kroj?</h2>
          <p className="mt-2 text-muted-foreground">Pišite nam na WhatsApp ili Viber pre porudžbine. Dostava je besplatna, a plaćate pouzećem.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/katalog" className="btn-primary">Pogledaj sve modele</Link>
            <a href="https://wa.me/381653176716" className="btn-outline">Pitaj na WhatsApp-u</a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
