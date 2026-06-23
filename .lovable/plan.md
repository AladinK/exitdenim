
# Pun B2B sistem — razvoj svih delova

Trenutno: frontend + mock proizvodi + localStorage. Cilj: pretvoriti u pravi B2B sistem sa bazom, login-om, admin odobravanjem, narudžbama, AI fotkama proizvoda i auto-generisanim PDF-ovima.

## 1. Backend (Lovable Cloud)

Uključujem Lovable Cloud i pravim shemu sa RLS:

```text
profiles          (id PK→auth.users, boutique_name, country, city,
                   contact, phone, email, instagram, website,
                   store_type, monthly_qty, status: pending|approved|rejected,
                   message, created_at)
user_roles        (user_id, role: admin|partner)   ← zaseban table, has_role() fn
products          (id, slug, sku, name, category, fit, fabric, weight,
                   sizes[], wholesale, retail, moq, delivery_days,
                   description, color, hero_image, gallery[], active)
stock             (product_id, size, quantity)
orders            (id, user_id, status: draft|submitted|confirmed|shipped|cancelled,
                   total_pieces, total_value, note, submitted_at)
order_items       (id, order_id, product_id, size, quantity, unit_price)
```

**RLS pravila:**
- `products`, `stock`: SELECT za `anon` (svi vide proizvode, ali se cijena u UI sakrije do odobrenja); samo `admin` UPDATE/INSERT
- `profiles`: svako vidi svoj red, admin vidi sve
- `orders`/`order_items`: vlasnik vidi svoje, admin sve

**Storage bucket** `product-images` (public read) za AI generisane fotke.

## 2. Autentikacija + odobravanje partnera

- Stranica `/postani-partner` — registracija (email + password) + B2B podaci → kreira `profiles` red sa `status: pending`
- Stranica `/login` — email/password
- `/_authenticated/katalog`, `/_authenticated/proizvod/$slug`, `/_authenticated/narudzba` — vidljive cijene, size matrix i naručivanje **samo ako** je `profiles.status === 'approved'`
- Ako nije odobren → "Tvoj nalog čeka odobrenje" stranica
- Auth email-ovi: welcome + "Tvoj B2B nalog je odobren" (preko Lovable Cloud auth + Resend tranzakcioni)

## 3. Admin panel `/_authenticated/admin`

Zaštita: `has_role(user, 'admin')`. Tabovi:

- **Partneri** — lista `profiles` filterana po statusu, dugmad Odobri / Odbij, prikaz Instagram/sajta/lokacije
- **Narudžbe** — lista submitted orders sa proširivim line item-ima (proizvod × veličina × količina), promjena statusa, export CSV, download PDF narudžbe
- **Proizvodi** — CRUD: SKU, fit, tkanina, cijene, MOQ; upload galerije; toggle "active"; stock matrix editor po veličini
- **Stats** — broj partnera, broj narudžbi sezone, top SKU

Seed migracija: kreira admin user_role za prvi nalog koji se registruje sa specifičnim email-om (postavlja se kao secret).

## 4. Narudžbe — pravi flow

- Size matrix upisuje u `orders` (status `draft`) preko server function
- `/_authenticated/narudzba` — pregled draft narudžbe, izmjena količina, brisanje stavki, ukupno komada/EUR, dugme **"Pošalji upit"**
- Pri slanju: status → `submitted`, admin email notifikacija sa PDF prilogom narudžbe, partner dobija potvrdu na email
- Stock se **rezerviše** (decrement) tek kad admin postavi `confirmed`

## 5. AI fotke proizvoda (8 proizvoda)

Generišem premium studio fotke kroz Lovable Image API (`openai/gpt-image-2`):

- 8 hero fotki: ravan denim/pant na betonu, top-down, prirodno svjetlo, sjenka, tamno-sivi background
- 1 hero banner za naslovnu (model leđa, denim, urban)
- 1 fotka radionice za `/proizvodnja` (industrijske mašine, denim role)
- 1 grupna fotka za `/media-kit`

Skladište u `src/assets/` (project assets), URL-ovi se sid u `products.hero_image`/`gallery` kroz migraciju.

## 6. Auto-generisani PDF (line sheet + katalog)

Server route `/api/line-sheet/$sku.pdf` i `/api/catalog.pdf`:

- `pdf-lib` (radi na Cloudflare Workers)
- Line sheet: 1 strana A4 — logo, SKU, slika, fit/tkanina/težina, size matrix tabela, MOQ, isporuka, **cijene samo ako je caller approved partner**
- Katalog: cover + jedna strana po proizvodu, generiše se on-demand
- Dugme "Download PDF" sad zaista skida fajl

## 7. Sticky polish

- Pravi `/login` i `/logout`
- Navbar pokazuje boutique name + status badge kad je ulogovan
- `<ClientOnly>` zaštita za auth state da se izbjegne SSR flicker
- Empty states: prazna narudžba, nema partnera, nema narudžbi
- Mobile sticky CTA se sakriva kad je partner već odobren (zamjenjuje se sa "Vidi katalog")
- `sitemap.xml` sa svim javnim rutama (već robots.txt postoji)

## 8. Šta NIJE u ovom planu

- Engleski jezik (kasnije, prema tvom odgovoru)
- Online plaćanje (B2B je inquiry-only)
- Realtime notifikacije
- Stock import iz vanjskog ERP-a

## Tehnički detalji

- TanStack Start + Cloud (Supabase): `createServerFn` + `requireSupabaseAuth` za svaki zaštićeni endpoint
- Auth gate kroz integration-managed `_authenticated/route.tsx`
- Public reads (lista proizvoda za neulogovane) idu preko server publishable client sa `TO anon` SELECT policy
- AI fotke generisane jednokratno kroz agent imagegen tool i commitovane kao project assets — bez runtime troška
- PDF generation u server route, ne u serverFn (return-uje binarni Response)
- Resend za tranzakcione email-ove → tražim `RESEND_API_KEY` u kasnijem koraku

## Redoslijed implementacije

1. Enable Cloud + migracija (schema, RLS, seed admin role)
2. Auth stranice (login, register, "čekanje odobrenja")
3. Server funkcije: products list, get product, submit application, submit order
4. Refactor `/katalog` i `/proizvod/$slug` da koriste bazu umjesto mock
5. AI generisanje 11 slika → update products migracija sa URL-ovima
6. Admin panel (partneri / narudžbe / proizvodi / stock)
7. PDF server routes (line sheet + katalog)
8. Email notifikacije (Resend secret + tranzakcioni)
9. Polish: sitemap, empty states, sticky CTA logika, sign-out hygiene

Reci "implement plan" kad ti odgovara — krećem sa Cloud uključivanjem.
