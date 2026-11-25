-- EXIT Denim — prikaz popusta (OPCIONO)
-- =====================================
-- Od 19.11.2026. popust se prikazuje samo na proizvodima označenim "Na popustu" u
-- administraciji. Ta oznaka se, međutim, ne vidi na sajtu: javni pogled products_public
-- napravljen je pre nje i ne sadrži kolonu on_sale. Zato trenutno nijedan proizvod ne
-- prikazuje oznaku "−40%" ni precrtanu cenu, iako su neki tako označeni.
--
-- Ova skripta dodaje kolonu u pogled. POSLEDICA: proizvodi označeni "Na popustu"
-- ponovo prikazuju "−40%" i precrtanu cenu. Pokrenite je samo ako to želite.
--
-- Napomena: precrtana cena se računa iz sadašnje (sadašnja / 0,6), nije upisana stvarna
-- ranija cena. Proverite da li takav prikaz odgovara pravilima o isticanju sniženja.
--
-- Bezbedno je pokrenuti je i ponovo. Povratak na staro: uklonite on_sale iz liste kolona.

drop view if exists public.products_public;

create view public.products_public
with (security_invoker = on) as
select
  id, sku, slug, name, category, fit, fabric, weight, color, description, sizes, retail,
  image_url, gallery, moq, delivery, active, on_sale, sort_order, created_at, updated_at
from public.products
where active = true;

revoke all on public.products_public from anon, authenticated;
grant select on public.products_public to anon, authenticated;
grant all on public.products_public to service_role;

-- Pogled radi sa pravima posetioca, pa posetilac mora smeti da pročita i ovu kolonu.
grant select (on_sale) on public.products to anon, authenticated;

select count(*) filter (where on_sale) as na_popustu, count(*) as ukupno_aktivnih
from public.products_public;
