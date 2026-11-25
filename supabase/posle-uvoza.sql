-- EXIT Denim — posle uvoza podataka sa Lovable-a
-- ================================================
-- Pokreće se u Supabase SQL Editor-u, POSLE uvoza izvezene baze u novi projekat.
-- Ne menja nijedan podatak i ništa što se vidi na sajtu. Bezbedno je pokrenuti ga i ponovo.

-- Skladišta za fotografije (privatna; sajt izdaje potpisane adrese sa servera).
-- Izvoz baze ne sadrži fajlove, a na novom projektu skladišta možda još ne postoje.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', false), ('site-assets', 'site-assets', false)
on conflict (id) do nothing;

-- Kratak pregled: šta je stiglo uvozom.
select 'proizvodi' as tabela, count(*) as redova from public.products
union all select 'stanje', count(*) from public.stock
union all select 'porudžbine (kupci)', count(*) from public.customer_orders
union all select 'porudžbine (B2B)', count(*) from public.orders
union all select 'nalozi', count(*) from public.profiles
union all select 'administratori', count(*) from public.user_roles where role = 'admin';
