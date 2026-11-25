# Selidba sa Lovable-a — korak po korak

Cilj: isti sajt, istog izgleda, na vašem hostingu i sa vašom bazom, tako da ga više niko ne može ugasiti osim vas.

Redosled je bitan. Stari sajt ostaje uključen do poslednjeg koraka, pa u svakom trenutku možete da stanete ili da se vratite.

## Zašto sajt sada pada

Kod sajta radi. Pala je **baza na Lovable Cloud-u** (pauzirana je), pa svaka stranica koja čita proizvode vraća grešku 500, dok stranice bez proizvoda rade.

Lovable pauzira bazu kada potrošite kredite ili posle oko 7 dana bez aktivnosti. Dok je baza tamo, to može da se ponovi. Zato se seli i baza, ne samo sajt.

## Šta je već urađeno u kodu

- Uklonjeni su svi Lovable paketi i servisi (build, Google prijava, e-mail, Telegram, AI, slike).
- Izgled je isti: stari i novi sajt su upoređeni piksel po piksel na telefonu i desktopu.
- Sajt više ne pada kada baza ne odgovara (vidi README).
- Ispravljena je greška zbog koje je odobrenim B2B partnerima umesto veleprodajne cene pisalo „€NaN".
- Pripremljena je, kao opcija, ispravka za prikaz popusta (vidi dole, korak 2).

## Šta morate vi (samo vi imate pristup)

### 1. Probudite bazu na Lovable-u i izvezite podatke

Bez ovoga nema proizvoda, porudžbina ni naloga na novom sajtu.

1. Lovable → vaš projekat → **Cloud** → **Overview**.
2. Ako piše da je baza pauzirana: **Top up** (dopuna kredita), pa **Wake up**. Sama dopuna je ne budi.
3. Sajt bi posle nekoliko minuta trebalo ponovo da radi. Proverite exitdenim.shop.
4. Izvoz baze: **More → Database → Manage → Settings → Export project data → Export data → Database → Export → Start export**. Dobijate jedan fajl sa svim tabelama, nalozima i lozinkama (lozinke su šifrovane i ostaju važeće). Dozvoljen je jedan izvoz na 24 sata, a radi samo dok je baza budna.
5. Fotografije proizvoda **nisu** u tom fajlu. Skinite ih posebno: **More → Storage**, obe fascikle: `product-images` i `site-assets`. Zadržite iste nazive fascikli i fajlova.

Nazivi stavki u meniju mogu malo da se razlikuju. Tražite izvoz baze („export") i skladište („storage").

### 2. Napravite svoj Supabase projekat

1. [supabase.com](https://supabase.com) → **New project**, region **Frankfurt (eu-central-1)**. Lozinku baze sačuvajte.
2. Uvoz podataka iz koraka 1:
   - **Imate izvoz** (preporučeno): uvezite ga (`pg_restore` na adresu baze iz **Project Settings → Database**), zatim u **SQL Editor** pokrenite `supabase/posle-uvoza.sql`. Taj fajl pravi skladišta za fotografije i ispiše koliko je čega uvezeno; na sajtu ne menja ništa.
   - **Nemate izvoz** (počinjete od nule): u **SQL Editor** pokrenite `supabase/migrations/20261125120000_osnovna_sema.sql`. Prvi nalog koji se registruje postaje administrator, pa se registrujte vi, pre nego što sajt bude javan.
3. **Storage**: u fascikle `product-images` i `site-assets` otpremite fajlove iz koraka 1.5, sa istim nazivima i podfasciklama.
4. **Authentication → URL Configuration**: Site URL `https://exitdenim.shop`, a u Redirect URLs dodajte `https://exitdenim.shop/**` i privremenu adresu hostinga iz koraka 4.
5. **Google prijava** (ako je želite i dalje): **Authentication → Providers → Google**. Potreban je vaš OAuth klijent iz Google Cloud konzole, jer je dosadašnji bio Lovable-ov. Ako ovo preskočite, dugme „Nastavi sa Google" se samo sakrije, a prijava e-mailom radi.

**Opciono, prikaz popusta:** od 19.11. popust treba da se vidi samo na proizvodima koje u administraciji označite „Na popustu", ali se zbog greške u bazi ne vidi ni na jednom. `supabase/prikaz-popusta.sql` to ispravlja: označeni proizvodi ponovo dobijaju „−40%" i precrtanu cenu. Pokrenite ga samo ako to želite. Precrtana cena se računa iz sadašnje, pa proverite da li takav prikaz odgovara pravilima o isticanju sniženja.

**Plan:** besplatan Supabase plan pauzira projekat posle 7 dana slabe aktivnosti, što je isti problem koji sada imate. Za prodavnicu koja prima porudžbine uzmite **Pro (25 $/mesec)**: nema pauziranja, a baza se svakodnevno čuva.

### 3. Obaveštenja o porudžbinama

Ranije su išla preko Lovable-a. Podesite bar jedno, inače porudžbina ostaje upisana samo u administraciji.

- **Telegram:** u Telegramu otvorite `@BotFather` → `/newbot` → dobijate token. Zatim otvorite svog novog bota i pritisnite **Start** (bot ne može prvi da vam piše). Token ide u `TELEGRAM_BOT_TOKEN`.
- **E-mail:** nalog na [resend.com](https://resend.com) → **Domains → Add domain** `exitdenim.shop` → unesite ponuđene DNS zapise kod name.com → **API Keys → Create**. Ključ ide u `RESEND_API_KEY`. Bez potvrđenog domena e-mail ne stiže kupcima.

### 4. Hosting

| Hosting | Cena | Napomena |
| --- | --- | --- |
| **Vercel Pro** | oko 20 $/mesec | Najjednostavnije podešavanje. Besplatan plan nije dozvoljen za prodavnice. |
| **Cloudflare Workers Paid** | oko 5 $/mesec | Ista vrsta servera koju je koristio Lovable. Besplatan plan dozvoljava 10 ms procesora po zahtevu, što je za ovaj sajt premalo. |
| Netlify (besplatno) | 0 | Ne preporučuje se: kada potrošite mesečne kredite, sajt se pauzira. |

Podešavanje je isto na oba: povežite ovaj GitHub repo i izaberite granu **`nezavisan-hosting`** (ne `main`, koji i dalje pripada Lovable-u).

**Vercel**

1. **Add New → Project → Import** ovaj repo. Podrazumevana podešavanja su dobra (komanda `npm run build`, Node 22).
2. **Settings → Environments → Production → Branch Tracking**: upišite `nezavisan-hosting`.
3. **Settings → Environment Variables**: unesite promenljive iz tabele ispod, pa **Redeploy**.

**Cloudflare**

1. **Workers & Pages → Create → Import a repository**, grana `nezavisan-hosting`.
2. Build command `npm run build`, deploy command `npx wrangler deploy`.
3. U **Build variables** dodajte `NITRO_PRESET=cloudflare-module` i obe `VITE_` promenljive iz tabele.
4. Ostale promenljive unesite u **Settings → Variables and Secrets** kao tip **Secret**. Obične (Text) promenljive Cloudflare briše pri svakom objavljivanju.

Promenljive okruženja (imena i objašnjenja su u `.env.example`):

| Ime | Obavezno | Odakle |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | da | Supabase → Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | da | isto mesto, „publishable" ključ |
| `SUPABASE_SERVICE_ROLE_KEY` | da, tajno | isto mesto, „secret" ključ |
| `TELEGRAM_BOT_TOKEN` | jedno od dva | korak 3 |
| `RESEND_API_KEY` | jedno od dva | korak 3 |
| `AI_API_KEY`, `AI_MODEL` | ne | samo za dugme „AI popuni" u administraciji |

Posle izmene promenljivih pokrenite novo objavljivanje (Redeploy), jer se javne vrednosti ugrađuju pri build-u. Dok ih ne unesete, sajt koristi javne vrednosti iz fajla `.env` u repou, a one još pokazuju na staru Lovable bazu.

### 5. Fotografije brenda

Naslovne fotografije, logo i video (14 fajlova, oko 8 MB) bili su na Lovable-ovom serveru. Sada žive u repou, u `public/media/`.

Preuzimaju se same: GitHub → **Actions → Fotografije brenda** treba da ima zelenu kvačicu. Ako nema, pritisnite **Run workflow**. Rezervni način, na računaru: `npm run assets:pull`, pa komitujte `public/media/`.

**Ovo mora biti gotovo pre koraka 7.** Kada domen ode sa Lovable-a, te fotografije se odande više ne mogu skinuti.

### 6. Proverite novi sajt na privremenoj adresi

Hosting daje privremenu adresu (npr. `nesto.vercel.app`). Pre prebacivanja domena prođite:

- [ ] Početna, „Svi modeli" i jedan proizvod izgledaju isto kao na starom sajtu, sa svim fotografijama.
- [ ] Probna porudžbina prolazi do kraja i stiže vam Telegram poruka ili e-mail.
- [ ] Prijava u administraciju radi starom lozinkom; proizvodi, stanje i porudžbine su tu.
- [ ] Odobren B2B nalog vidi veleprodajne cene.

### 7. Prebacite domen

Kod **name.com** (tamo je domen) zamenite DNS zapise onima koje vam pokaže hosting u **Domains → Add** `exitdenim.shop`. Sada domen pokazuje na Lovable: `A  exitdenim.shop → 185.158.133.1`.

Promena se širi od nekoliko minuta do nekoliko sati. **Povratak:** vratite stari A zapis i sajt je ponovo na Lovable-u.

### 8. Posle prebacivanja

- Sačekajte nekoliko dana pa otkažite Lovable pretplatu. Do tada ga ne dirajte: služi kao rezerva.
- Grana `nezavisan-hosting` se spaja u `main` tek kada je Lovable isključen sa repoa, jer Lovable sam prati `main`.
- Google Search Console: proverite da `https://exitdenim.shop/sitemap.xml` i dalje radi.

## Mesečni troškovi posle selidbe

| Stavka | Cena |
| --- | --- |
| Supabase Pro | 25 $ |
| Hosting | 5 $ (Cloudflare) ili 20 $ (Vercel) |
| Resend (e-mail) | 0 do 100 e-mailova dnevno, što je oko 50 porudžbina; preko toga 20 $ |
| Telegram | 0 |
| **Ukupno** | **30–45 $ mesečno** |

Cene su proverene u novembru 2026. i mogu da se promene.
