import { createFileRoute } from "@tanstack/react-router";
const BODY = `# EXIT Denim

> EXIT Denim je srpski proizvođač muških farmerki i pantalona koji nudi i izradu za personalizovane brendove (private label), završnu obradu najvišeg kvaliteta i 35 godina iskustva u poslovima vezanim za izvoz.

EXIT Denim — TRI-B DOO posluje u Srbiji. Ponuda obuhvata muške farmerke, chino i cargo pantalone, veleprodaju za butike i private-label proizvodnju za druge brendove. Mogućnosti personalizacije, minimalne količine, cena i rokovi za proizvodnju potvrđuju se u direktnom dogovoru. Maloprodajni uslovi nisu automatski uslovi private-label proizvodnje.

## Stranice
- [Izrada za vaš brend — private label](/private-label): Personalizovani brendovi, završna obrada najvišeg kvaliteta i 35 godina izvoznog iskustva.
- [O proizvodnji](/proizvodnja): EXIT radionica i proizvodnja u Srbiji.
- [Veleprodaja za butike](/postani-partner): Informacije o partnerskoj saradnji.
- [Kontakt](/kontakt): Direktan razgovor o proizvodnji i kolekciji.
- [Katalog](/katalog): Sve muške farmerke i pantalone.
- [Muške farmerke](/jeans): Denim modeli i izbor kroja.
- [Chino pantalone](/chino): Muške chino pantalone.
- [Cargo pantalone](/cargo): Muške pantalone sa bočnim džepovima.
- [Široke farmerke](/wide-flare): Relaxed, bootcut i flare.
- [Slim farmerke](/slim-farmerke): Uski kroj.
- [Regular Slim farmerke](/regular-slim-farmerke): Regular slim kroj.
- [Relaxed farmerke](/relaxed-farmerke): Opušten kroj.
- [Bootcut farmerke](/bootcut-farmerke): Nogavica koja se blago širi od kolena.
- [Flare farmerke](/flare-farmerke): Široka nogavica od kolena.
- [Cropped farmerke](/cropped-farmerke): Skraćena nogavica.
- [Česta pitanja](/faq): Pitanja o maloprodaji i poručivanju.

## Optional
- [Media kit](/media-kit): Informacije i materijali brenda.
- [Sitemap](/sitemap.xml): Indeks javnih stranica.
`;
export const Route = createFileRoute("/llms.txt")({
  server: { handlers: { GET: async () => new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } }) } },
});
