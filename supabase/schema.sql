-- ============================================================
-- Kubo v0.4 — Esquema de base de datos
-- Ejecuta este archivo completo en el SQL Editor de tu proyecto
-- de Supabase (Project > SQL Editor > New query > Run).
-- Es incremental respecto a versiones anteriores (usa
-- `if not exists` / `create or replace`), así que puedes volver
-- a correr el archivo completo sin duplicar nada.
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

create index if not exists budgets_user_idx
  on public.budgets (user_id);

create index if not exists goals_user_idx
  on public.goals (user_id);

-- ------------------------------------------------------------
-- Tabla: budgets
-- Un límite mensual por categoría (recurrente, sin fecha fija:
-- aplica a "el mes en curso" cada mes). Una sola fila por
-- categoría y usuario.
-- ------------------------------------------------------------
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  monthly_amount numeric(12, 2) not null check (monthly_amount > 0),
  created_at timestamptz not null default now(),
  unique (user_id, category_id)
);

alter table public.budgets enable row level security;

create policy "Los usuarios ven sus propios presupuestos"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean sus propios presupuestos"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios editan sus propios presupuestos"
  on public.budgets for update
  using (auth.uid() = user_id);

create policy "Los usuarios eliminan sus propios presupuestos"
  on public.budgets for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Tabla: goals
-- Metas de ahorro. `current_amount` se actualiza directamente
-- (sin tabla de contribuciones aparte) cada vez que el usuario
-- registra un aporte o un retiro.
-- ------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  icon text not null default 'target',
  target_amount numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  target_date date,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "Los usuarios ven sus propias metas"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean sus propias metas"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios editan sus propias metas"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Los usuarios eliminan sus propias metas"
  on public.goals for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Tabla: recurring_transactions
-- Plantillas de movimientos que se repiten (sueldo, alquiler,
-- suscripciones). `next_occurrence` avanza cada vez que el
-- cliente genera la transacción real correspondiente (ver
-- `useRunDueRecurringTransactions` en el frontend) — no depende
-- de un cron en el servidor.
-- ------------------------------------------------------------
create table if not exists public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  kind text not null check (kind in ('income', 'expense')),
  frequency text not null check (frequency in ('weekly', 'monthly', 'yearly')),
  next_occurrence date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.recurring_transactions enable row level security;

create policy "Los usuarios ven sus propios recurrentes"
  on public.recurring_transactions for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean sus propios recurrentes"
  on public.recurring_transactions for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios editan sus propios recurrentes"
  on public.recurring_transactions for update
  using (auth.uid() = user_id);

create policy "Los usuarios eliminan sus propios recurrentes"
  on public.recurring_transactions for delete
  using (auth.uid() = user_id);

create index if not exists recurring_transactions_user_idx
  on public.recurring_transactions (user_id);

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

-- ------------------------------------------------------------
-- Función: delete_own_account
-- Permite que un usuario autenticado elimine su propia cuenta
-- (perfil, categorías, transacciones, presupuestos y metas se
-- eliminan en cascada por las FKs; el registro en auth.users se
-- borra al final). Nunca puede borrar la cuenta de otra persona:
-- siempre opera sobre auth.uid().
-- ------------------------------------------------------------
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

grant execute on function public.delete_own_account() to authenticated;
