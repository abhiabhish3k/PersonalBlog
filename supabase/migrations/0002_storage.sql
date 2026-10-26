-- Storage bucket and metadata used by the Supabase-backed media uploader.

-- Explicit API grants are needed in addition to RLS policies.
grant usage on schema public to anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select on public.settings to anon, authenticated;
grant update on public.settings to authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.media to authenticated;
grant select, insert, update, delete on public.subscribers to authenticated;
grant insert on public.subscribers to anon;
grant select, insert, update, delete on public.messages to authenticated;
grant insert on public.messages to anon;


create or replace function public.is_admin() returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
-- Safe to run once after 0001_init.sql, including if the bucket was created manually.

alter table public.media add column if not exists name text;
alter table public.media add column if not exists content_type text;
alter table public.media add column if not exists size_bytes bigint;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public images can be viewed via their public URLs. Only authenticated admins
-- may upload, replace, or delete objects in this bucket.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'media_admin_insert'
  ) then
    create policy media_admin_insert on storage.objects
      for insert to authenticated
      with check (bucket_id = 'media' and public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'media_admin_update'
  ) then
    create policy media_admin_update on storage.objects
      for update to authenticated
      using (bucket_id = 'media' and public.is_admin())
      with check (bucket_id = 'media' and public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'media_admin_delete'
  ) then
    create policy media_admin_delete on storage.objects
      for delete to authenticated
      using (bucket_id = 'media' and public.is_admin());
  end if;
end $$;
