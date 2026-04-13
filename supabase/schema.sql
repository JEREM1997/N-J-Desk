create extension if not exists "pgcrypto";

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

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  company_name text not null default 'N&J Intérieurs',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default current_owner_id() references users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  postal_code text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type project_status as enum ('prospect','devis_envoye','devis_accepte','planifie','en_cours','termine','sav');

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default current_owner_id() references users(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  site_address text,
  description text,
  status project_status not null default 'prospect',
  start_date date,
  estimated_end_date date,
  quote_amount numeric(12,2) default 0,
  billed_amount numeric(12,2) default 0,
  deposit_received numeric(12,2) default 0,
  balance_received numeric(12,2) default 0,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type task_priority as enum ('basse','moyenne','haute','critique');
create type task_status as enum ('todo','en_cours','done');

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default current_owner_id() references users(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  title text not null,
  details text,
  due_date date,
  priority task_priority not null default 'moyenne',
  status task_status not null default 'todo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default current_owner_id() references users(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  file_name text not null,
  category text default 'autre' check (category in ('devis', 'facture', 'plan', 'contrat', 'autre')),
  file_path text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default current_owner_id() references users(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  file_path text not null,
  phase text check (phase in ('avant', 'apres')),
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default current_owner_id() references users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  action_type text not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create type service_ticket_status as enum ('ouvert','planifie','resolu');

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
alter table clients add column if not exists postal_code text;
alter table clients alter column owner_id set default current_owner_id();
alter table projects alter column owner_id set default current_owner_id();
alter table tasks alter column owner_id set default current_owner_id();
alter table documents alter column owner_id set default current_owner_id();
alter table photos alter column owner_id set default current_owner_id();
alter table activity_logs alter column owner_id set default current_owner_id();
