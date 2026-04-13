-- RLS policies for N&J Desk
-- Exécuter après schema.sql
-- Script idempotent: on supprime d'abord les policies existantes

drop policy if exists users_select_own on users;
drop policy if exists users_update_own on users;
drop policy if exists users_insert_own on users;

drop policy if exists clients_select_own on clients;
drop policy if exists clients_insert_own on clients;
drop policy if exists clients_update_own on clients;
drop policy if exists clients_delete_own on clients;

drop policy if exists projects_select_own on projects;
drop policy if exists projects_insert_own on projects;
drop policy if exists projects_update_own on projects;
drop policy if exists projects_delete_own on projects;

drop policy if exists tasks_select_own on tasks;
drop policy if exists tasks_insert_own on tasks;
drop policy if exists tasks_update_own on tasks;
drop policy if exists tasks_delete_own on tasks;

drop policy if exists documents_select_own on documents;
drop policy if exists documents_insert_own on documents;
drop policy if exists documents_delete_own on documents;

drop policy if exists photos_select_own on photos;
drop policy if exists photos_insert_own on photos;
drop policy if exists photos_delete_own on photos;

drop policy if exists activity_logs_select_own on activity_logs;
drop policy if exists activity_logs_insert_own on activity_logs;

drop policy if exists service_tickets_select_own on service_tickets;
drop policy if exists service_tickets_insert_own on service_tickets;
drop policy if exists service_tickets_update_own on service_tickets;
drop policy if exists service_tickets_delete_own on service_tickets;

alter table users enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table documents enable row level security;
alter table photos enable row level security;
alter table activity_logs enable row level security;
alter table service_tickets enable row level security;

-- USERS
create policy users_select_own on users
for select using (auth_user_id = auth.uid());

create policy users_update_own on users
for update using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

create policy users_insert_own on users
for insert with check (auth_user_id = auth.uid());

-- CLIENTS
create policy clients_select_own on clients
for select using (
  exists (
    select 1 from users u
    where u.id = clients.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy clients_insert_own on clients
for insert with check (
  exists (
    select 1 from users u
    where u.id = clients.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy clients_update_own on clients
for update using (
  exists (
    select 1 from users u
    where u.id = clients.owner_id
      and u.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from users u
    where u.id = clients.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy clients_delete_own on clients
for delete using (
  exists (
    select 1 from users u
    where u.id = clients.owner_id
      and u.auth_user_id = auth.uid()
  )
);

-- PROJECTS
create policy projects_select_own on projects
for select using (
  exists (
    select 1 from users u
    where u.id = projects.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy projects_insert_own on projects
for insert with check (
  exists (
    select 1 from users u
    where u.id = projects.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy projects_update_own on projects
for update using (
  exists (
    select 1 from users u
    where u.id = projects.owner_id
      and u.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from users u
    where u.id = projects.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy projects_delete_own on projects
for delete using (
  exists (
    select 1 from users u
    where u.id = projects.owner_id
      and u.auth_user_id = auth.uid()
  )
);

-- TASKS
create policy tasks_select_own on tasks
for select using (
  exists (
    select 1 from users u
    where u.id = tasks.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy tasks_insert_own on tasks
for insert with check (
  exists (
    select 1 from users u
    where u.id = tasks.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy tasks_update_own on tasks
for update using (
  exists (
    select 1 from users u
    where u.id = tasks.owner_id
      and u.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from users u
    where u.id = tasks.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy tasks_delete_own on tasks
for delete using (
  exists (
    select 1 from users u
    where u.id = tasks.owner_id
      and u.auth_user_id = auth.uid()
  )
);

-- DOCUMENTS
create policy documents_select_own on documents
for select using (
  exists (
    select 1 from users u
    where u.id = documents.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy documents_insert_own on documents
for insert with check (
  exists (
    select 1 from users u
    where u.id = documents.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy documents_delete_own on documents
for delete using (
  exists (
    select 1 from users u
    where u.id = documents.owner_id
      and u.auth_user_id = auth.uid()
  )
);

-- PHOTOS
create policy photos_select_own on photos
for select using (
  exists (
    select 1 from users u
    where u.id = photos.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy photos_insert_own on photos
for insert with check (
  exists (
    select 1 from users u
    where u.id = photos.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy photos_delete_own on photos
for delete using (
  exists (
    select 1 from users u
    where u.id = photos.owner_id
      and u.auth_user_id = auth.uid()
  )
);

-- ACTIVITY LOGS
create policy activity_logs_select_own on activity_logs
for select using (
  exists (
    select 1 from users u
    where u.id = activity_logs.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy activity_logs_insert_own on activity_logs
for insert with check (
  exists (
    select 1 from users u
    where u.id = activity_logs.owner_id
      and u.auth_user_id = auth.uid()
  )
);

-- SERVICE TICKETS
create policy service_tickets_select_own on service_tickets
for select using (
  exists (
    select 1 from users u
    where u.id = service_tickets.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy service_tickets_insert_own on service_tickets
for insert with check (
  exists (
    select 1 from users u
    where u.id = service_tickets.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy service_tickets_update_own on service_tickets
for update using (
  exists (
    select 1 from users u
    where u.id = service_tickets.owner_id
      and u.auth_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from users u
    where u.id = service_tickets.owner_id
      and u.auth_user_id = auth.uid()
  )
);

create policy service_tickets_delete_own on service_tickets
for delete using (
  exists (
    select 1 from users u
    where u.id = service_tickets.owner_id
      and u.auth_user_id = auth.uid()
  )
);
