-- ============================================================
-- Kubo v0.2 — Esquema de base de datos
-- Ejecuta este archivo completo en el SQL Editor de tu proyecto
-- de Supabase (Project > SQL Editor > New query > Run).
-- ============================================================

-- Extensión necesaria para gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabla: profiles
-- Un perfil por usuario autenticado. Se crea automáticamente
-- cuando alguien se registra (ver trigger al final).
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  currency text not null default 'PEN',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Los usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Los usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------
-- Tabla: categories
-- Categorías de transacciones. Cada usuario tiene las suyas
-- (se siembran categorías por defecto al registrarse).
-- ------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('income', 'expense', 'both')),
  icon text not null default 'circle-dollar-sign',
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table public.categories enable row level security;

create policy "Los usuarios ven sus propias categorías"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean sus propias categorías"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios editan sus propias categorías"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Los usuarios eliminan sus propias categorías"
  on public.categories for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Tabla: transactions
-- ------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  kind text not null check (kind in ('income', 'expense')),
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Los usuarios ven sus propias transacciones"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean sus propias transacciones"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios editan sus propias transacciones"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Los usuarios eliminan sus propias transacciones"
  on public.transactions for delete
  using (auth.uid() = user_id);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, occurred_on desc);

-- ------------------------------------------------------------
-- Trigger: al crear un usuario nuevo, se crea su perfil y se
-- siembran las categorías por defecto.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.categories (user_id, name, kind, icon) values
    (new.id, 'Alimentación', 'expense', 'utensils-crossed'),
    (new.id, 'Vivienda', 'expense', 'home'),
    (new.id, 'Transporte', 'expense', 'car'),
    (new.id, 'Suscripciones', 'expense', 'tv'),
    (new.id, 'Entretenimiento', 'expense', 'gamepad-2'),
    (new.id, 'Salud', 'expense', 'heart-pulse'),
    (new.id, 'Sueldo', 'income', 'wallet'),
    (new.id, 'Freelance', 'income', 'laptop'),
    (new.id, 'Otros', 'both', 'circle-dollar-sign');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
