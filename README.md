# EXIT Denim — prodavnica i B2B portal

Sajt [exitdenim.shop](https://exitdenim.shop): maloprodaja (plaćanje pouzećem), B2B portal za butike i administracija proizvoda, stanja i porudžbina.

Ovo je isti sajt, istog izgleda, **bez ijedne zavisnosti od Lovable-a**: objavljuje se na Vercel-u (ili bilo kom drugom hostingu), a baza je vaš sopstveni Supabase projekat.

Selidba sa Lovable-a je završena 25.11.2026 (Lovable projekat je obrisan). Šta je urađeno i šta je ostalo opisuje [SELIDBA.md](./SELIDBA.md).

## Šta je gde

| Deo | Gde živi |
| --- | --- |
| Kod sajta | ovaj repo (TanStack Start, React 19, Tailwind 4) |
| Proizvodi, stanje, porudžbine, nalozi | Supabase baza |
| Fotografije proizvoda | Supabase Storage (`product-images`, `site-assets`) |
| Fotografije i video brenda | `public/media/` u ovom repou |
| Tajni ključevi | podešavanja hostinga (nikad u repou) |

## Pokretanje na svom računaru

Potreban je Node 22.

```bash
npm install
cp .env.example .env.local   # pa popunite vrednosti
npm run dev                  # http://localhost:3000
```

Ostale komande:

```bash
npm run check        # tipovi + testovi
npm run build        # produkcijski build
npm start            # pokreće build (cilj node-server)
npm run assets:pull  # preuzima fotografije brenda sa starog sajta u public/media/
npm run db:migrate   # pravi/dopunjava tabele u bazi (POSTGRES_URL_NON_POOLING)
```

## Objavljivanje

Sajt je pripremljen za **Vercel** (server u Frankfurtu, `fra1`); uputstvo je u [SELIDBA.md](./SELIDBA.md). Bazu (Supabase) povežete preko Vercel → Storage, pa Vercel sam upisuje sve adrese i ključeve.

Pre svakog build-a (`npm run build`):

1. `scripts/pull-media.mjs --soft` proveri da su fotografije brenda u `public/media/`.
2. `scripts/db-migrate.mjs` napravi ili dopuni tabele iz `supabase/migrations/`, samo jednom po fajlu. Na Vercel-u radi samo za produkciju, da probne verzije ne menjaju pravu bazu.

Kod radi i na drugim hostinzima: Nitro sam prepoznaje Netlify i Cloudflare Pages, a za ostale postavite `NITRO_PRESET` (npr. `cloudflare-module` ili `node-server`). Promenljive okruženja su opisane u [.env.example](./.env.example).

## Kada baza ne odgovara

Sajt ne pada. Stranice sa modelima prikazuju poslednji zapamćeni katalog, a ako ga nema, obaveštenje sa WhatsApp-om, Viber-om i telefonom (odgovor ima status 503, pa pretraživači znaju da je zastoj privremen). Ako upis porudžbine ne uspe, kasa nudi slanje iste porudžbine porukom, već popunjene.

Zapamćeni katalog živi u memoriji servera: na hostinzima koji gase neaktivne instance važi dok je instanca budna.

## Izgled se ne menja slučajno

Biblioteke koje utiču na izgled (React, Tailwind, Radix, ikone) zakucane su u `package.json` na tačne verzije koje je sajt koristio i ranije. Pre selidbe je novi sajt upoređen sa starim piksel po piksel, na telefonu i desktopu. Kada menjate te verzije, uporedite izgled ponovo.

## Baza

Važeća šema je u `supabase/migrations/`. Originalne migracije iz Lovable perioda čuvaju se, samo kao istorija, u `supabase/arhiva-lovable/`.

## Provere

`npm test` pokriva logiku koja ne sme da pukne: tekst porudžbine za slanje porukom, obaveštenje vlasniku, prikaz cena i spisak fotografija brenda. GitHub Actions na svaku izmenu pokreće tipove, testove i build (`.github/workflows/provera.yml`).
