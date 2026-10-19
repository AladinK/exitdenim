import { createFileRoute } from "@tanstack/react-router";
import { openCookieSettings } from "@/components/CookieBanner";

export const Route = createFileRoute("/privatnost")({
  head: () => ({
    meta: [
      { title: "Privatnost i kolačići — EXIT Denim" },
      { name: "description", content: "Kako EXIT Denim koristi podatke i Google Ads kolačiće za merenje porudžbina." },
      { property: "og:title", content: "Privatnost i kolačići — EXIT Denim" },
      { property: "og:description", content: "Kako EXIT Denim koristi podatke i Google Ads kolačiće za merenje porudžbina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-foreground">
      <h1 className="text-3xl font-semibold">Privatnost i kolačići</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>Podatke iz porudžbine (ime, telefon, e-mail, adresa) koristimo samo za isporuku i kontakt u vezi sa porudžbinom.</p>
        <p>Sajt koristi Google Ads oznaku (Google LLC) da izmeri kada neko posle klika na naš oglas završi porudžbinu (broj porudžbine i iznos) i da Google bolje prikazuje oglase. Google pri tome koristi kolačiće i podatke o uređaju. Posetiocima iz zemalja koje to zahtevaju oznaka se učitava tek posle pristanka.</p>
        <p>Kako Google koristi podatke: <a className="underline" href="https://business.safety.google/privacy/" target="_blank" rel="noreferrer">business.safety.google/privacy</a>.</p>
        <p>Pristanak možete povući ili promeniti bilo kada:</p>
        <button className="btn-outline" onClick={openCookieSettings}>Podešavanja kolačića</button>
      </div>
    </main>
  );
}
