import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { BRAND, SIZE_EXCHANGE, SIZE_EXCHANGE_TEXT } from "@/lib/brand";
import { BUNDLE } from "@/lib/discounts";
import { phoneHref } from "@/lib/contact";

const PAGE_URL = `${BRAND.url}/uslovi-kupovine`;
const TITLE = "Uslovi kupovine — EXIT Denim";
const DESCRIPTION =
  "Uslovi kupovine na exit.fashion: prodavac, cene i popusti, plaćanje pouzećem, besplatna dostava, zamena veličine, odustanak u roku od 14 dana i reklamacije.";
const SELLER = `${BRAND.legalName}, ${BRAND.streetAddress}, 36300 ${BRAND.city}, Srbija`;

// Obrazac za odustanak od ugovora zaključenog na daljinu (Zakon o zaštiti potrošača).
const WITHDRAWAL_FORM = [
  "OBRAZAC ZA ODUSTANAK OD UGOVORA ZAKLJUČENOG NA DALJINU",
  "",
  `Prodavcu: ${SELLER}, e-mail: ${BRAND.email}`,
  "",
  "Ovim obaveštavam da odustajem od ugovora o prodaji sledeće robe:",
  "Artikal, veličina i količina: ",
  "Broj porudžbine: ",
  "Datum prijema robe: ",
  "Ime i prezime: ",
  "Adresa: ",
  "Telefon: ",
  "Broj tekućeg računa za povraćaj novca: ",
  "Datum: ",
  "Potpis (samo ako se obrazac šalje na papiru): ",
].join("\n");

export const Route = createFileRoute("/uslovi-kupovine")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: TermsPage,
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-8 mt-8">
      <h2 className="text-xl md:text-2xl">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

function TermsPage() {
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${BRAND.email}?subject=${encodeURIComponent("Odustanak od ugovora")}&body=${encodeURIComponent(WITHDRAWAL_FORM)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WITHDRAWAL_FORM);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Layout>
      <article className="container-x py-12 md:py-16 max-w-3xl">
        <div className="eyebrow">Kupovina preko sajta</div>
        <h1 className="mt-4 text-4xl md:text-5xl">Uslovi kupovine</h1>
        <p className="mt-4 text-muted-foreground">
          Ovi uslovi važe za kupovinu preko sajta {BRAND.url.replace("https://", "")}. Važe od 27. novembra 2026.
        </p>

        <Section id="prodavac" title="1. Prodavac">
          <p>
            {BRAND.legalName}, {BRAND.streetAddress}, 36300 {BRAND.city}, Srbija. PIB {BRAND.taxId}, matični broj{" "}
            {BRAND.registrationId}. Brend: {BRAND.name}.
          </p>
          <p>
            Kontakt: <a className="underline" href={phoneHref}>{BRAND.phoneLabel}</a> (poziv, Viber, WhatsApp) i{" "}
            <a className="underline" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
          </p>
        </Section>

        <Section id="porudzbina" title="2. Porudžbina">
          <p>
            Artikle dodajete u korpu i porudžbinu šaljete na strani Kasa. Pre slanja vidite artikle, veličine, količine,
            ukupan iznos i način plaćanja. Kad je porudžbina primljena, na sajtu dobijate broj porudžbine, a potvrdu i na
            e-mail ako ste ga upisali.
          </p>
          <p>Ako nešto treba da promenite (veličinu, adresu), javite se što pre, dok paket nije poslat.</p>
        </Section>

        <Section id="cene" title="3. Cene i popusti">
          <p>
            Cene su u dinarima. Plaćate iznos „Ukupno” iz porudžbine; dostava je besplatna i nema dodatnih troškova.
          </p>
          <p>
            Kad u korpi imate {BUNDLE.minQty} ili više komada, dobijate {BUNDLE.pct}% popusta na celu porudžbinu. Popust
            sa točka sreće (5, 10 ili 15%) ne sabira se sa ovim popustom: važi veći. Popust se obračunava pri slanju
            porudžbine i vidi se u korpi i na kasi.
          </p>
        </Section>

        <Section id="placanje" title="4. Plaćanje">
          <p>Plaćanje je pouzećem: iznos plaćate kuriru gotovinom kad preuzmete paket. Kartice se ne naplaćuju preko sajta.</p>
        </Section>

        <Section id="isporuka" title="5. Isporuka">
          <p>
            Šaljemo kurirskom službom na adrese u Srbiji, besplatno. Porudžbina se šalje u roku od 1–2 radna dana, a
            isporuka traje 2–5 radnih dana od porudžbine.
          </p>
        </Section>

        <Section id="zamena" title={`6. Zamena veličine (${SIZE_EXCHANGE.days} dana)`}>
          <p>{SIZE_EXCHANGE_TEXT}</p>
        </Section>

        <Section id="odustanak" title="7. Odustanak od kupovine (14 dana)">
          <p>
            Imate pravo da odustanete od kupovine u roku od 14 dana od dana kada ste primili robu, bez navođenja razloga.
            Ako ste jednom porudžbinom primili više paketa, rok teče od prijema poslednjeg.
          </p>
          <p>
            Odustanak izjavljujete na obrascu ispod ili na drugi nedvosmislen način (e-mailom ili pismom). Rok je
            ispoštovan ako izjavu pošaljete pre isteka 14 dana.
          </p>
          <p>
            Robu vraćate na adresu: {SELLER}, najkasnije 14 dana od slanja izjave. Direktne troškove vraćanja robe snosi
            kupac.
          </p>
          <p>
            Novac vraćamo bez odlaganja, a najkasnije 14 dana od prijema izjave o odustanku, uplatom na tekući račun koji
            navedete u izjavi. Povraćaj možemo da odložimo dok ne primimo robu ili dokaz da je poslata.
          </p>
          <p>
            Robu možete pregledati kao u radnji. Ako je korišćena više od toga, odgovarate za umanjenu vrednost robe.
          </p>
        </Section>

        <Section id="reklamacije" title="8. Reklamacije">
          <p>
            Za saobraznost robe odgovaramo dve godine od isporuke. Ako primetite nedostatak, javite nam se u roku od dva
            meseca od kada ste ga primetili.
          </p>
          <p>
            Reklamaciju možete izjaviti telefonom, e-mailom ili poštom na adresu prodavca. Navedite broj porudžbine (ili
            priložite drugi dokaz o kupovini) i opišite nedostatak. Troškove slanja robe sa nedostatkom snosi prodavac.
          </p>
          <p>
            Na reklamaciju odgovaramo u roku od 8 dana od prijema, a rešavamo je u roku od 15 dana. Reklamaciju ne
            odbijamo zato što nemate originalnu ambalažu.
          </p>
        </Section>

        <Section id="sporovi" title="9. Vansudsko rešavanje sporova">
          <p>
            Ako se ne složimo oko reklamacije ili druge stvari iz kupovine, možete pokrenuti vansudsko rešavanje
            potrošačkog spora pred telom sa Liste tela za vansudsko rešavanje potrošačkih sporova koju vodi ministarstvo
            nadležno za zaštitu potrošača. Postupak je za potrošača besplatan. Možete se obratiti i tržišnoj inspekciji.
          </p>
        </Section>

        <Section id="privatnost" title="10. Privatnost">
          <p>
            Podatke iz porudžbine koristimo samo za isporuku i kontakt u vezi sa porudžbinom. Više u{" "}
            <Link to="/privatnost" className="underline">Politici privatnosti</Link>.
          </p>
        </Section>

        <Section id="obrazac" title="Obrazac za odustanak">
          <p>Popunite i pošaljite e-mailom ili poštom. Isti tekst možete poslati i porukom na Viber ili WhatsApp.</p>
          <pre className="whitespace-pre-wrap border border-border bg-secondary/40 p-4 text-[13px] leading-relaxed font-sans">
            {WITHDRAWAL_FORM}
          </pre>
          <div className="flex flex-wrap gap-2">
            <a className="btn-primary" href={mailto}>Pošalji e-mailom</a>
            <button type="button" className="btn-outline" onClick={copy}>{copied ? "Kopirano" : "Kopiraj obrazac"}</button>
          </div>
        </Section>
      </article>
    </Layout>
  );
}
