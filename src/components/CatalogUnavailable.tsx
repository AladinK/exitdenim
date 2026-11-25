import { MessageCircle, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { phoneHref, viberHref, whatsappHref } from "@/lib/contact";

/**
 * Prikazuje se umesto liste modela kada baza ne odgovara. Kupac i dalje zna gde je
 * i može odmah da poruči porukom ili pozivom; stranica se sama osvežava čim baza proradi.
 */
export function CatalogUnavailable({
  title = "Modeli se trenutno ne učitavaju",
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="notice notice--strong" role="status" aria-live="polite">
      <div>
        <h2>{title}</h2>
        <p className="mt-2">
          {message ??
            "Imamo kratak tehnički zastoj i radimo na njemu. Prodaja ne staje: pišite nam ili pozovite, pa ćemo proveriti veličinu i primiti porudžbinu. Plaćate pouzećem, kao i uvek."}
        </p>
      </div>
      <div className="notice__actions">
        <a className="btn-primary" href={whatsappHref("Zdravo, želim da poručim farmerke. Sajt mi trenutno ne učitava modele.")} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" className="h-5 w-5" /> WhatsApp
        </a>
        <a className="btn-outline" href={viberHref}>
          <MessageCircle aria-hidden="true" className="h-5 w-5" /> Viber
        </a>
        <a className="btn-outline" href={phoneHref}>
          <Phone aria-hidden="true" className="h-5 w-5" /> {BRAND.phoneLabel}
        </a>
      </div>
      <p className="text-[0.8125rem]">Stranica će se sama osvežiti kada modeli ponovo budu dostupni.</p>
    </div>
  );
}
