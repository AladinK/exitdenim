# Selidba na Vercel — korak po korak

Sajt ide na **Vercel**, a baza je **Supabase** koju pravite iz samog Vercel-a: jedan nalog, jedan račun. Kod je spreman: sajt izgleda isto kao sada, a tabele u bazi se prave same pri prvom objavljivanju.

Stari sajt na Lovable-u ostaje uključen do koraka 7, pa u svakom trenutku možete da stanete ili da se vratite.

**Zašto sajt sada pada:** kod radi, ali je baza na Lovable Cloud-u pauzirana (Lovable je pauzira kada se potroše krediti ili posle oko 7 dana bez aktivnosti). Zato se seli i baza, ne samo sajt.

## Stanje 25.11.2026.

Urađeno:

- Vercel projekat `exitdenim` radi na `exitdenim.vercel.app`, sa novom bazom.
- Baza je Supabase projekat `exitdenim` (Frankfurt), napravljen u Supabase-u i povezan sa Vercel-om preko Supabase integracije (Production). Ključeve je Vercel dobio sam.
- Podaci sa Lovable-a (izvoz od 25.11.2026) su prebačeni: nalog vlasnika, 13 proizvoda, stanje, porudžbine i statistika korpe. Svih 27 fotografija je u skladištima `product-images` i `site-assets`.
- Prijava: dozvoljene su adrese `exitdenim.shop`, `www.exitdenim.shop` i `exitdenim.vercel.app`.
- `TELEGRAM_BOT_TOKEN` je na Vercel-u (Production).

Ostaje:

- Domen (korak 7). Pre prebacivanja prenesite porudžbine koje su na stari sajt stigle posle izvoza. Posle prebacivanja u Supabase-u stavite Site URL na `https://exitdenim.shop` (korak 4.1).
- E-mail preko Resend-a (koraci 4.2 i 5) i Google prijava (korak 4.3).
- Lovable isključiti sa GitHub repoa kada stari sajt više nije potreban (korak 8).

## 1. Vercel nalog i projekat

1. [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub**.
2. Izaberite plan **Pro** (20 $ mesečno). Besplatan Hobby plan je samo za lične, nekomercijalne sajtove, a ovo je prodavnica.
3. **Add New → Project** → pored repoa `exitdenim` pritisnite **Import** → **Deploy**. Dok ne povežete bazu (korak 2), umesto modela piše da se trenutno ne učitavaju. To je očekivano.

## 2. Baza

1. U projektu na Vercel-u: **Storage → Create Database → Supabase**.
2. Region **Frankfurt (eu-central-1)**. Plan: za probu **Free**; pre prave prodaje **Pro** (25 $ mesečno), jer besplatna baza može da se pauzira, a Pro ima dnevnu rezervnu kopiju.
3. Povežite je sa projektom `exitdenim` (**Connect**, za Production i Preview). Vercel sam upisuje adrese i ključeve baze; ništa ne prepisujete ručno.

## 3. Objavite ponovo

**Deployments** → kod poslednjeg objavljivanja **⋯ → Redeploy**.

Tokom ovog objavljivanja sajt sam napravi tabele u bazi. U zapisu (Build Logs) piše `Baza: …osnovna_sema.sql: primenjeno`. Dobijate adresu oblika `exitdenim-….vercel.app`.

Svako sledeće objavljivanje proverava bazu i ne dira je ako je sve već tu. Probne verzije sajta (sve grane osim `main`) bazu ne menjaju.

## 4. Podešavanja baze

Vercel → **Storage** → vaša baza → **Open in Supabase**:

1. **Authentication → URL Configuration**: Site URL `https://exitdenim.shop`. U Redirect URLs dodajte `https://exitdenim.shop/**` i vašu `https://….vercel.app/**` adresu.
2. **Authentication → Emails → SMTP Settings**: uključite i unesite Resend (host `smtp.resend.com`, port `465`, korisnik `resend`, lozinka je Resend API ključ iz koraka 5, pošiljalac `porudzbine@exitdenim.shop`). Ugrađeni Supabase e-mail služi samo za probu, pa bez ovoga partneri ne dobijaju e-mail za potvrdu naloga.
3. Google prijava (opciono): **Authentication → Sign In / Providers → Google**, sa vašim Google OAuth ključem iz Google Cloud konzole (dosadašnji je bio Lovable-ov). Bez toga se dugme „Nastavi sa Google" samo sakrije, a prijava e-mailom radi.

## 5. Obaveštenja o porudžbinama

Ranije su išla preko Lovable-a. Podesite bar jedno, inače porudžbina ostaje samo u administraciji. Vercel → **Settings → Environment Variables**:

- `TELEGRAM_BOT_TOKEN`: u Telegramu otvorite `@BotFather` → `/newbot` → dobijate token. Zatim otvorite svog bota i pritisnite **Start**, jer bot ne može prvi da vam piše.
- `RESEND_API_KEY`: nalog na [resend.com](https://resend.com) → **Domains → Add domain** `exitdenim.shop` → ponuđene DNS zapise unesite kod name.com → **API Keys → Create**.

Posle dodavanja: **Deployments → ⋯ → Redeploy**.

## 6. Podaci i fotografije sa Lovable-a

Nova baza je prazna dok se ne prebace podaci.

1. Lovable → vaš projekat → **Cloud → Overview**: **Top up** (dopuna kredita), pa **Wake up**. Sama dopuna je ne budi.
2. Izvoz baze, dok je budna: **More → Database → Manage → Settings → Export project data → Export data → Database → Export → Start export**. Fajl pošaljite meni i ja pripremam uvoz: proizvodi, stanje, porudžbine i nalozi sa postojećim lozinkama. Fajl sadrži podatke kupaca, pa ga ne stavljajte na GitHub.
3. Fotografije proizvoda: GitHub → **Actions → Slike sa sajta** → **Run workflow**. U prilogu (**Artifacts → slike-sa-sajta**) je zip. Sadržaj fascikli `supabase-storage/product-images` i `supabase-storage/site-assets` otpremite u Supabase → **Storage**, u istoimena skladišta, sa istim podfasciklama.

Ako ne prebacujete stare podatke: prvi nalog registrovan na `/auth` postaje administrator, pa se registrujte vi pre nego što sajt bude javan.

## 7. Provera, pa domen

Na `….vercel.app` adresi proverite:

- [ ] početna, „Svi modeli" i jedan proizvod, sa fotografijama
- [ ] probna porudžbina stiže na Telegram ili e-mail
- [ ] prijava u administraciju; proizvodi, stanje i porudžbine su tu
- [ ] odobren B2B nalog vidi veleprodajne cene

Zatim Vercel → **Settings → Domains → Add** `exitdenim.shop`. Vercel prikaže DNS zapise; unesite ih kod name.com umesto sadašnjeg `A exitdenim.shop → 185.158.133.1` (to je Lovable). Promena se širi od nekoliko minuta do nekoliko sati.

**Povratak:** vratite stari A zapis i sajt je ponovo na Lovable-u.

## 8. Posle prebacivanja

- Lovable otkažite posle nekoliko dana. Do tada je rezerva.
- U Lovable-u ništa ne objavljujte (Publish), da stari sajt ne dobije novi kod pre vremena. Kada otkažete Lovable, isključite ga i sa GitHub repoa.
- Google Search Console: proverite da `https://exitdenim.shop/sitemap.xml` radi.

## Mesečni troškovi

| Stavka | Cena |
| --- | --- |
| Vercel Pro | 20 $ |
| Supabase | 0 $ za probu, 25 $ (Pro) za pravu prodaju |
| Resend (e-mail) | 0 $ do 100 e-mailova dnevno |
| Telegram | 0 $ |
| **Ukupno** | **20 $ za početak, 45 $ sa Supabase Pro** |

Cene su proverene u novembru 2026. i mogu da se promene.

## Šta je već urađeno u kodu

- Nema nijednog Lovable paketa ni servisa; sajt izgleda isto (upoređeno piksel po piksel, telefon i računar).
- Server radi u Frankfurtu (Vercel `fra1`), blizu kupaca i baze.
- Sajt ne pada kada baza ne odgovara: prikazuje poslednji katalog ili kontakt za porudžbinu, a kasa nudi slanje porudžbine porukom.
- Logo, fotografije, video i slika za deljenje linka su u repou (`public/media/`).
- Tabele baze se prave same (`scripts/db-migrate.mjs`, `supabase/migrations/`).
- Opciono: `supabase/prikaz-popusta.sql` vraća oznaku „−40%" na proizvode označene „Na popustu" (zbog greške u bazi ne vidi se od 19.11). Precrtana cena se računa iz sadašnje, pa proverite da li takav prikaz odgovara pravilima o isticanju sniženja.
