import { BRAND } from "@/lib/brand";
import { phoneHref, viberHref, whatsappHref } from "@/lib/contact";

/**
 * Prikazuje se umesto liste modela SAMO kada baza ne odgovara (inače je nema na sajtu).
 * Kupac i dalje može da poruči porukom ili pozivom, a stranica se sama osveži čim
 * baza proradi. Izgled prati postojeće prazno stanje kataloga („Nema rezultata").
 */
export function CatalogUnavailable({
  title = "Modeli se trenutno ne učitavaju",
  message = "Imamo kratak tehnički zastoj i radimo na njemu. Prodaja ne staje: pišite nam ili pozovite, pa ćemo proveriti veličinu i primiti porudžbinu. Plaćate pouzećem, kao i uvek.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div
      className="text-center py-16 px-5 border border-dashed border-border"
      role="status"
      aria-live="polite"
    >
      <div className="serif text-2xl">{title}</div>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          className="btn-primary"
          href={whatsappHref(
            "Zdravo, želim da poručim farmerke. Sajt mi trenutno ne učitava modele.",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <a className="btn-outline" href={viberHref}>
          Viber
        </a>
        <a className="btn-outline" href={phoneHref}>
          {BRAND.phoneLabel}
        </a>
      </div>
      <p className="text-xs text-muted-foreground mt-5">
        Stranica će se sama osvežiti kada modeli ponovo budu dostupni.
      </p>
    </div>
  );
}
