-- EXIT Denim — osnovna šema baze
-- ==============================
-- Jedan fajl koji zamenjuje 29 Lovable migracija (arhivirane u supabase/arhiva-lovable/).
-- Pravi istu strukturu koju sajt koristi na Lovable-u (provereno prema izvozu baze od
-- 25.11.2026), plus:
--   1. privatna skladišta product-images i site-assets se prave ovde, pa nova baza
--      radi bez ručnog podešavanja,
--   2. porudžbine upisuje samo server (bez direktnog upisa gostiju kroz API),
--   3. uvoz postojećih naloga ne pokreće pravila za nove naloge (vidi handle_new_user).
-- Javni pogled products_public je namerno isti kao na Lovable-u (bez kolone on_sale),
-- da sajt izgleda isto; prikaz popusta se uključuje skriptom supabase/prikaz-popusta.sql.
--
-- Fajl je bezbedan za ponovno pokretanje na praznoj bazi; na bazi sa podacima se NE pokreće.

-- ---------------------------------------------------------------------------
-- Tipovi
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'partner');
create type public.partner_status as enum ('pending', 'approved', 'rejected');
create type public.product_category as enum ('jeans', 'chino', 'cargo');
create type public.product_fit as enum ('Slim', 'Regular Slim', 'Relaxed', 'Cargo', 'Bootcut', 'Flare', 'Cropped');
create type public.order_status as enum ('draft', 'submitted', 'confirmed', 'shipped', 'cancelled');
create type public.customer_order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- ---------------------------------------------------------------------------
-- Uloge korisnika
-- ---------------------------------------------------------------------------
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Provera uloge. Telo je u šemi "private" (nije izložena kroz API) i radi sa pravima
-- vlasnika, da pravila ispod ne zavise od toga šta pozivalac sme da vidi u user_roles.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

create function private._has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
revoke all on function private._has_role(uuid, public.app_role) from public, anon;
grant execute on function private._has_role(uuid, public.app_role) to authenticated, service_role;

create function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security invoker
set search_path = public, private
as $$
  select private._has_role(_user_id, _role)
$$;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke all on public.user_roles from anon, authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

create policy "Users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins insert roles" on public.user_roles
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update roles" on public.user_roles
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete roles" on public.user_roles
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- Zajednički okidač: updated_at
-- ---------------------------------------------------------------------------
create function public.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Pri uvozu se zadržava originalno vreme poslednje izmene.
  if coalesce(current_setting('exitdenim.uvoz', true), '') = 'da' then
    return new;
  end if;
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.touch_updated_at() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Profili (B2B partneri i kupci sa nalogom)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  boutique_name text,
  country text,
  city text,
  contact_person text,
  phone text,
  instagram text,
  website text,
  store_type text,
  monthly_qty text,
  categories text[] default '{}',
  message text,
  status public.partner_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

create policy "Users read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Admins read all profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
-- Korisnik menja svoje podatke, ali ne i status odobrenja.
create policy "Users update own profile" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and status = (select p.status from public.profiles p where p.id = auth.uid()));
create policy "Admins update any profile" on public.profiles
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Novi nalog dobija profil. Prvi nalog u praznoj bazi postaje administrator,
-- zato se vlasnik registruje PRE nego što sajt postane javan.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_first boolean;
begin
  -- Pri uvozu postojećih naloga (npr. sa Lovable-a) profili i uloge stižu iz izvoza.
  if coalesce(current_setting('exitdenim.uvoz', true), '') = 'da' then
    return new;
  end if;

  insert into public.profiles (id, email, boutique_name, country, city, contact_person, phone, instagram, website, store_type, monthly_qty, categories, message)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'boutique_name',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'contact_person',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'instagram',
    new.raw_user_meta_data->>'website',
    new.raw_user_meta_data->>'store_type',
    new.raw_user_meta_data->>'monthly_qty',
    coalesce(string_to_array(new.raw_user_meta_data->>'categories', ','), '{}'),
    new.raw_user_meta_data->>'message'
  )
  on conflict (id) do nothing;

  select not exists (select 1 from public.user_roles where role = 'admin') into is_first;
  if is_first then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
    update public.profiles set status = 'approved' where id = new.id;
  end if;

  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Proizvodi
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sku text not null unique,
  name text not null,
  category public.product_category not null,
  fit public.product_fit not null,
  fabric text not null,
  weight text not null,
  sizes text[] not null default '{}',
  wholesale numeric(10, 2) not null,
  retail numeric(10, 2) not null,
  moq int not null default 10,
  delivery text not null default '5-7 dana',
  description text,
  color text not null,
  image_url text,
  gallery text[] not null default '{}',
  active boolean not null default true,
  on_sale boolean not null default false,
  sort_order int not null default 0,
  fabric_oz numeric,
  composition text,
  wash_finish text,
  pack_distribution jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;

-- Veleprodajna cena (wholesale) nije čitljiva kroz javni API ni za jednu ulogu osim
-- service_role: zato se pravo čitanja daje kolonu po kolonu, bez nje.
revoke all on public.products from anon, authenticated;
grant select (
  id, slug, sku, name, category, fit, fabric, weight, sizes, retail, moq, delivery, description,
  color, image_url, gallery, active, on_sale, sort_order, created_at, updated_at
) on public.products to anon;
grant select (
  id, slug, sku, name, category, fit, fabric, weight, sizes, retail, moq, delivery, description,
  color, image_url, gallery, active, on_sale, sort_order, fabric_oz, composition, wash_finish,
  pack_distribution, created_at, updated_at
) on public.products to authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

create policy "Public reads active products" on public.products
  for select to anon using (active = true);
create policy "Authenticated reads active products" on public.products
  for select to authenticated using (active = true or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- Javni pogled za prodavnicu: bez veleprodajne cene i B2B specifikacija.
create view public.products_public
with (security_invoker = on) as
select
  id, sku, slug, name, category, fit, fabric, weight, color, description, sizes, retail,
  image_url, moq, delivery, active, sort_order, created_at, updated_at, gallery
from public.products
where active = true;
revoke all on public.products_public from anon, authenticated;
grant select on public.products_public to anon, authenticated;
grant all on public.products_public to service_role;

-- ---------------------------------------------------------------------------
-- Stanje (lager)
-- ---------------------------------------------------------------------------
create table public.stock (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  quantity int not null default 0,
  updated_at timestamptz not null default now(),
  unique (product_id, size)
);
alter table public.stock enable row level security;
revoke all on public.stock from anon, authenticated;
grant select, insert, update, delete on public.stock to authenticated;
grant all on public.stock to service_role;

-- Tačne količine vide samo odobreni partneri i administratori.
create policy "Approved partners and admins read stock" on public.stock
  for select to authenticated
  using (
    public.has_role(auth.uid(), 'admin')
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.status = 'approved')
  );
create policy "Admins manage stock" on public.stock
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Javnosti se izlaže samo "ima / nema" po veličini, nikad količina.
create function public.get_stock_availability()
returns table (product_id uuid, size text, in_stock boolean)
language sql
stable
security definer
set search_path = public
as $$
  select s.product_id, s.size, (s.quantity > 0)
  from public.stock s
  join public.products p on p.id = s.product_id
  where p.active = true;
$$;
revoke all on function public.get_stock_availability() from public;
grant execute on function public.get_stock_availability() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- B2B porudžbine
-- ---------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default 'EX-' || to_char(now(), 'YYMMDD') || '-' || lpad((floor(random() * 10000))::text, 4, '0'),
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.order_status not null default 'draft',
  total_pieces int not null default 0,
  total_value numeric(12, 2) not null default 0,
  note text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;

create policy "Users read own orders" on public.orders
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins read all orders" on public.orders
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users create own orders" on public.orders
  for insert to authenticated with check (auth.uid() = user_id);
-- Partner menja svoju porudžbinu dok je nacrt; slanjem (status submitted) je predaje.
create policy "Users update own draft" on public.orders
  for update to authenticated
  using (auth.uid() = user_id and status = 'draft')
  with check (auth.uid() = user_id and status in ('draft', 'submitted'));
create policy "Admins update any order" on public.orders
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Users delete own draft" on public.orders
  for delete to authenticated using (auth.uid() = user_id and status = 'draft');

create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  size text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10, 2) not null,
  created_at timestamptz not null default now()
);
alter table public.order_items enable row level security;
revoke all on public.order_items from anon, authenticated;
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;

create policy "Users read own order items" on public.order_items
  for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "Admins read all order items" on public.order_items
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users manage own draft items" on public.order_items
  for all to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'draft'))
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid() and o.status = 'draft'));
create index order_items_order_id_idx on public.order_items (order_id);

create function public.recalc_order_totals()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  oid uuid;
begin
  oid := coalesce(new.order_id, old.order_id);
  update public.orders set
    total_pieces = coalesce((select sum(quantity) from public.order_items where order_id = oid), 0),
    total_value = coalesce((select sum(quantity * unit_price) from public.order_items where order_id = oid), 0)
  where id = oid;
  return null;
end;
$$;
revoke all on function public.recalc_order_totals() from public, anon, authenticated;

create trigger order_items_recalc
  after insert or update or delete on public.order_items
  for each row execute function public.recalc_order_totals();

-- ---------------------------------------------------------------------------
-- Maloprodajne porudžbine (pouzećem)
-- ---------------------------------------------------------------------------
create table public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default (('EXR-' || to_char(now(), 'YYMMDD') || '-') || lpad((floor(random() * 10000))::text, 4, '0')),
  user_id uuid,
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_postal text not null,
  shipping_country text not null default 'Србија',
  shipping_method text not null default 'courier',
  shipping_cost numeric not null default 0,
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  promo_code text,
  promo_pct integer not null default 0,
  total numeric not null default 0,
  payment_method text not null default 'cod',
  status public.customer_order_status not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.customer_orders enable row level security;
-- Porudžbine upisuje isključivo server (service_role), posle provere cena i stanja.
-- Ni gost ni prijavljeni kupac nemaju direktan upis kroz API, pa niko ne može da
-- pošalje porudžbinu sa izmišljenom cenom.
revoke all on public.customer_orders from anon, authenticated;
grant select, update, delete on public.customer_orders to authenticated;
grant all on public.customer_orders to service_role;

create policy "Users view own orders" on public.customer_orders
  for select to authenticated using (user_id = auth.uid());
create policy "Admins manage all customer orders" on public.customer_orders
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create trigger customer_orders_touch_updated before update on public.customer_orders
  for each row execute function public.touch_updated_at();
create index customer_orders_user_id_idx on public.customer_orders (user_id);
create index customer_orders_created_at_idx on public.customer_orders (created_at desc);

create table public.customer_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.customer_orders (id) on delete cascade,
  product_id uuid not null,
  product_name text not null,
  product_sku text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null,
  created_at timestamptz not null default now()
);
alter table public.customer_order_items enable row level security;
revoke all on public.customer_order_items from anon, authenticated;
grant select, update, delete on public.customer_order_items to authenticated;
grant all on public.customer_order_items to service_role;

create policy "Users read items of own orders" on public.customer_order_items
  for select to authenticated
  using (exists (select 1 from public.customer_orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "Admins manage all customer order items" on public.customer_order_items
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create index customer_order_items_order_id_idx on public.customer_order_items (order_id);

-- ---------------------------------------------------------------------------
-- Zahtevi za uzorak (B2B)
-- ---------------------------------------------------------------------------
create table public.sample_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  note text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.sample_requests enable row level security;
revoke all on public.sample_requests from anon, authenticated;
grant select, insert, update on public.sample_requests to authenticated;
grant all on public.sample_requests to service_role;

create policy "Approved partners create own sample requests" on public.sample_requests
  for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.status = 'approved'));
create policy "Users read own sample requests" on public.sample_requests
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Admins update sample requests" on public.sample_requests
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- Događaji korpe (za pregled u administraciji)
-- ---------------------------------------------------------------------------
create table public.cart_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  product_id uuid,
  product_name text,
  size text,
  price numeric,
  value numeric,
  device text,
  session_id text,
  created_at timestamptz not null default now()
);
alter table public.cart_events enable row level security;
revoke all on public.cart_events from anon, authenticated;
grant insert on public.cart_events to anon, authenticated;
grant select on public.cart_events to authenticated;
grant all on public.cart_events to service_role;

create policy "Anyone logs cart events" on public.cart_events
  for insert to anon, authenticated with check (event in ('add_to_cart', 'begin_checkout'));
create policy "Admins read cart events" on public.cart_events
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create index cart_events_created_idx on public.cart_events (created_at desc);

-- ---------------------------------------------------------------------------
-- Slike sajta (naslovne, kategorije, logo) koje se menjaju iz administracije
-- ---------------------------------------------------------------------------
create table public.site_assets (
  key text primary key,
  url text not null,
  alt text,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.site_assets enable row level security;
-- Javnost ih čita preko servera (potpisane adrese), ne direktno.
revoke all on public.site_assets from anon, authenticated;
grant select, insert, update, delete on public.site_assets to authenticated;
grant all on public.site_assets to service_role;

create policy "site_assets admins read" on public.site_assets
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "site_assets admins insert" on public.site_assets
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "site_assets admins update" on public.site_assets
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "site_assets admins delete" on public.site_assets
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- Skladišta fajlova (privatna; javnosti se izdaju potpisane adrese sa servera)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', false), ('site-assets', 'site-assets', false)
on conflict (id) do nothing;

create policy "Admins read product images" on storage.objects
  for select to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins read site assets" on storage.objects
  for select to authenticated using (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));
create policy "site-assets admins insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));
create policy "site-assets admins update" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));
create policy "site-assets admins delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));
