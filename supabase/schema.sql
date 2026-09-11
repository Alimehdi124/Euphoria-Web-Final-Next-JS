create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  brand text not null default 'Euphoria',
  category text not null,
  color text not null default 'Black',
  price numeric(10, 2) not null check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total numeric(10, 2) not null check (total >= 0),
  shipping_address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists shipping_address jsonb not null default '{}'::jsonb;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0)
);

create or replace function public.create_order(p_items jsonb, p_shipping_address jsonb default '{}'::jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  product_row record;
  quantity integer;
  order_id uuid;
  total numeric(10, 2) := 0;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;

  for item in select value from jsonb_array_elements(p_items)
  loop
    quantity := (item->>'quantity')::integer;
    if quantity is null or quantity < 1 then raise exception 'Invalid quantity'; end if;
    select id, name->>'en' as product_name, price, stock into product_row
      from public.products where slug = item->>'slug' and is_active = true for update;
    if not found then raise exception 'Product not found'; end if;
    if product_row.stock < quantity then raise exception 'Insufficient stock'; end if;
    total := total + product_row.price * quantity;
  end loop;

  insert into public.orders (user_id, total, shipping_address)
  values (auth.uid(), total, p_shipping_address)
  returning id into order_id;

  for item in select value from jsonb_array_elements(p_items)
  loop
    quantity := (item->>'quantity')::integer;
    select id, name->>'en' as product_name, price into product_row
      from public.products where slug = item->>'slug' and is_active = true;
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price)
      values (order_id, product_row.id, product_row.product_name, quantity, product_row.price);
    update public.products set stock = stock - quantity, updated_at = now() where id = product_row.id;
  end loop;
  return order_id;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories" on public.categories for select using (is_active = true or public.is_admin());
drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products for select using (is_active = true or public.is_admin());
drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read product images" on public.product_images;
create policy "public read product images" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_active = true or public.is_admin())));
drop policy if exists "admins manage product images" on public.product_images;
create policy "admins manage product images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "users read own order items" on public.order_items;
create policy "users read own order items" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
drop policy if exists "admins manage order items" on public.order_items;
create policy "admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public read product images storage" on storage.objects;
create policy "public read product images storage" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
