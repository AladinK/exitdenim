import { createFileRoute } from "@tanstack/react-router";
const BODY = `# EXIT Denim

> EXIT Denim je srpski proizvođač muških farmerki (muški jeans, teksas pantalone, farmerice) iz vlastite radionice u Srbiji. Online prodaja na https://exitdenim.shop sa dostavom po celoj Srbiji i plaćanjem pouzećem.

## Ključne informacije
- Proizvodi: muške farmerke / jeans / teksas pantalone, chino i cargo pantalone
- Krojevi (fit): Slim, Regular Slim, Relaxed, Bootcut, Flare, Cargo
- Cena: 4.950 RSD po komadu
- Dostava: cela Srbija, 500 RSD, besplatna za porudžbine od 9.450 RSD
- Plaćanje: pouzećem (kuriru pri preuzimanju)
- Slanje: u roku od 1–2 radna dana
- Made in Serbia — domaća proizvodnja
- Kontakt: Ahmed Kurtanović, +381 65 3171 6716
- Veleprodaja (B2B) za butike: https://exitdenim.shop/postani-partner

## Stranice
- [Sve muške farmerke i pantalone](https://exitdenim.shop/katalog)
- [Wide & Flare farmerke](https://exitdenim.shop/wide-flare)
- [O proizvodnji](https://exitdenim.shop/proizvodnja)
- [Česta pitanja](https://exitdenim.shop/faq)
- [Kontakt](https://exitdenim.shop/kontakt)
- [Sitemap](https://exitdenim.shop/sitemap.xml)
`;
export const Route = createFileRoute("/llms.txt")({
  server: { handlers: { GET: async () => new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } }) } },
});
