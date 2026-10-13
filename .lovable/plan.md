# Praćenje "Dodaj u korpu" i "Započeta kupovina"

## Odgovor na pitanje
Trenutno to ne može da se vidi. Sajt beleži ove događaje samo u pregledaču kupca. Nijedan servis (Google Analytics, Meta Pixel) nije povezan, a korpa se ne čuva na serveru. Vidljive su samo završene porudžbine.

## Šta pravim
1. **Beleženje događaja:** svaki "Dodaj u korpu" i "Započni kupovinu" upisuje se u bazu: proizvod, veličina, cena, vreme, telefon ili računar. Bez ličnih podataka.
2. **Admin pregled "Aktivnost":** brojevi za danas, 7 i 30 dana: dodavanja u korpu, započete kupovine, završene porudžbine, procenat konverzije i najčešće dodavani modeli i veličine.
3. **Telegram (opciono):** kratka poruka kada neko započne kupovinu.

## Tehnički detalji
- Nova tabela `cart_events` (event, product_id, size, price, device, session_id, created_at). RLS: anon/authenticated smeju samo INSERT, a čitaju samo admini.
- Javna server funkcija `logEvent` sa zod validacijom i ograničenim skupom vrednosti. Poziva se iz `ecommerce.addToCart` i `ecommerce.beginCheckout` u `src/lib/analytics.ts`.
- Sesija je nasumičan ID u sessionStorage.
- Novi tab u `admin.tsx` sa zbirnim upitima.
