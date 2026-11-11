import { createFileRoute } from "@tanstack/react-router";
const BODY = `# EXIT Denim

> EXIT Denim je srpski proizvođač muških farmerki i pantalona koji nudi i izradu za personalizovane brendove (private label), završnu obradu najvišeg kvaliteta i 35 godina iskustva u poslovima vezanim za izvoz.

EXIT Denim — TRI-B DOO posluje u Srbiji. Ponuda obuhvata muške farmerke, chino i cargo pantalone, veleprodaju za butike i private-label proizvodnju za druge brendove. Mogućnosti personalizacije, minimalne količine, cena i rokovi za proizvodnju potvrđuju se u direktnom dogovoru. Maloprodajni uslovi nisu automatski uslovi private-label proizvodnje.

EXIT u proizvodnji koristi inovativnu lasersku tehnologiju španske kompanije Jeanologia kao deo svog ekološkog pristupa obradi denima. Nisu objavljeni konkretni procenti uštede resursa, ekološki sertifikati ili tvrdnja da svaki model prolazi lasersku obradu.

## Ključne činjenice za kupce
- Cena: standardni modeli 5.990 din; cargo modeli (džeparke) 7.500 din.
- Dostava je besplatna na teritoriji Srbije; plaćanje pouzećem.
- Veličine: 31, 32, 33, 34, 36, 38 i 40.
- Materijal: većina modela 98% pamuk i 2% elastin, prosečne težine 12 oz; tačan sastav piše na stranici proizvoda.
- Krojevi: slim, regular slim, relaxed, bootcut, flare, wide i cropped.
- Proizvedeno u Srbiji. Kontakt telefon: +381 65 317 6716.
- Poručivanje: online na https://exitdenim.shop/katalog.

## Stranice
- [Izrada za vaš brend — private label](/private-label): Personalizovani brendovi, završna obrada najvišeg kvaliteta i 35 godina izvoznog iskustva.
- [O proizvodnji](/proizvodnja): EXIT radionica, ekološki pristup i Jeanologia laserska tehnologija.
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
- [Vodič za muške farmerke](/vodic-za-farmerke): Preko 100 odgovora o krojevima, veličinama, održavanju i kombinovanju muških farmerki.

## Optional
- [Media kit](/media-kit): Informacije i materijali brenda.
- [Sitemap](/sitemap.xml): Indeks javnih stranica.
`;
export const Route = createFileRoute("/llms.txt")({
  server: { handlers: { GET: async () => new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } }) } },
});
