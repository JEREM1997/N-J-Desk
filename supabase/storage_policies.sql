-- Supabase Storage policies for N&J Desk
-- Bucket utilisé par l'app: project-files
-- Script idempotent (safe à rejouer)

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

drop policy if exists "project_files_select_authenticated" on storage.objects;
drop policy if exists "project_files_insert_authenticated" on storage.objects;
drop policy if exists "project_files_update_authenticated" on storage.objects;
drop policy if exists "project_files_delete_authenticated" on storage.objects;

create policy "project_files_select_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'project-files');

create policy "project_files_insert_authenticated"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-files');

create policy "project_files_update_authenticated"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-files')
with check (bucket_id = 'project-files');

create policy "project_files_delete_authenticated"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-files');
