-- Exécuter ce patch si votre projet Supabase a été initialisé AVANT
-- l'ajout des champs/tables récents.
-- Ce script est idempotent (safe à rejouer).

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  company_name text not null default 'N&J Intérieurs',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function current_owner_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from users
  where auth_user_id = auth.uid()
  limit 1
$$;

create type if not exists service_ticket_status as enum ('ouvert','planifie','resolu');

create table if not exists service_tickets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default current_owner_id() references users(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  priority task_priority not null default 'moyenne',
  status service_ticket_status not null default 'ouvert',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table documents add column if not exists category text default 'autre';
alter table documents drop constraint if exists documents_category_check;
alter table documents
  add constraint documents_category_check
  check (category in ('devis', 'facture', 'plan', 'contrat', 'autre'));

alter table clients add column if not exists postal_code text;

alter table clients alter column owner_id set default current_owner_id();
alter table projects alter column owner_id set default current_owner_id();
alter table tasks alter column owner_id set default current_owner_id();
alter table documents alter column owner_id set default current_owner_id();
alter table photos alter column owner_id set default current_owner_id();
alter table activity_logs alter column owner_id set default current_owner_id();
alter table service_tickets alter column owner_id set default current_owner_id();
