-- 猫耳律动 · 云端听歌白名单（管理员 = user_no 0）
-- Supabase → SQL → New query → 整段 Run
-- 作用：限制开启时，非管理员且不在白名单的用户只能看到自己上传的云端歌

create extension if not exists "pgcrypto";

-- ========== 全局开关（单行） ==========
create table if not exists public.cloud_listen_settings (
  id smallint primary key check (id = 1),
  restrict_enabled boolean not null default true,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.cloud_listen_settings (id, restrict_enabled)
values (1, true)
on conflict (id) do nothing;

alter table public.cloud_listen_settings enable row level security;

-- ========== 白名单好友 ==========
create table if not exists public.cloud_listen_allowlist (
  friend_id uuid primary key references public.profiles (id) on delete cascade,
  added_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.cloud_listen_allowlist enable row level security;

-- ========== 辅助：是否创世神管理员 ==========
create or replace function public.is_cloud_listen_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.user_no = 0
  );
$$;

revoke all on function public.is_cloud_listen_admin() from public;
grant execute on function public.is_cloud_listen_admin() to authenticated, anon;

create or replace function public.cloud_listen_restrict_enabled()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select s.restrict_enabled from public.cloud_listen_settings s where s.id = 1),
    true
  );
$$;

revoke all on function public.cloud_listen_restrict_enabled() from public;
grant execute on function public.cloud_listen_restrict_enabled() to authenticated, anon;

create or replace function public.can_listen_shared_cloud()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    not public.cloud_listen_restrict_enabled()
    or public.is_cloud_listen_admin()
    or exists (
      select 1
      from public.cloud_listen_allowlist a
      where a.friend_id = auth.uid()
    );
$$;

revoke all on function public.can_listen_shared_cloud() from public;
grant execute on function public.can_listen_shared_cloud() to authenticated, anon;

-- ========== settings RLS ==========
drop policy if exists "cloud_listen_settings_select" on public.cloud_listen_settings;
create policy "cloud_listen_settings_select"
  on public.cloud_listen_settings for select
  to authenticated, anon
  using (true);

drop policy if exists "cloud_listen_settings_update_admin" on public.cloud_listen_settings;
create policy "cloud_listen_settings_update_admin"
  on public.cloud_listen_settings for update
  to authenticated
  using (public.is_cloud_listen_admin())
  with check (public.is_cloud_listen_admin());

drop policy if exists "cloud_listen_settings_insert_admin" on public.cloud_listen_settings;
create policy "cloud_listen_settings_insert_admin"
  on public.cloud_listen_settings for insert
  to authenticated
  with check (public.is_cloud_listen_admin());

-- ========== allowlist RLS ==========
drop policy if exists "cloud_listen_allowlist_select" on public.cloud_listen_allowlist;
create policy "cloud_listen_allowlist_select"
  on public.cloud_listen_allowlist for select
  to authenticated
  using (
    public.is_cloud_listen_admin()
    or friend_id = auth.uid()
  );

drop policy if exists "cloud_listen_allowlist_insert_admin" on public.cloud_listen_allowlist;
create policy "cloud_listen_allowlist_insert_admin"
  on public.cloud_listen_allowlist for insert
  to authenticated
  with check (public.is_cloud_listen_admin());

drop policy if exists "cloud_listen_allowlist_delete_admin" on public.cloud_listen_allowlist;
create policy "cloud_listen_allowlist_delete_admin"
  on public.cloud_listen_allowlist for delete
  to authenticated
  using (public.is_cloud_listen_admin());

drop policy if exists "cloud_listen_allowlist_update_admin" on public.cloud_listen_allowlist;
create policy "cloud_listen_allowlist_update_admin"
  on public.cloud_listen_allowlist for update
  to authenticated
  using (public.is_cloud_listen_admin())
  with check (public.is_cloud_listen_admin());

-- ========== 替换云端曲库公开 SELECT ==========
drop policy if exists "cloud_songs_select_all" on public.cloud_songs;
drop policy if exists "cloud_songs_select_acl" on public.cloud_songs;
create policy "cloud_songs_select_acl"
  on public.cloud_songs for select
  to authenticated, anon
  using (
    -- 未登录：限制开启时看不到任何云端元数据（避免匿名扫库）
    (
      auth.uid() is not null
      and (
        uploader_id = auth.uid()
        or public.can_listen_shared_cloud()
      )
    )
    or (
      auth.uid() is null
      and not public.cloud_listen_restrict_enabled()
    )
  );
