# 猫耳律动 · 账号数据同步（本机与网站共用）
# Supabase → SQL → New query → 整段 Run
# 听歌次数、自建歌单、我喜欢 按登录账号保存

create table if not exists public.user_sync (
  user_id uuid primary key references auth.users (id) on delete cascade,
  play_stats jsonb not null default '{}'::jsonb,
  playlists jsonb not null default '[]'::jsonb,
  playlists_rev bigint not null default 0,
  likes jsonb not null default '{}'::jsonb,
  likes_rev bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_sync enable row level security;

drop policy if exists "user_sync_select_own" on public.user_sync;
create policy "user_sync_select_own"
  on public.user_sync for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_sync_insert_own" on public.user_sync;
create policy "user_sync_insert_own"
  on public.user_sync for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "user_sync_update_own" on public.user_sync;
create policy "user_sync_update_own"
  on public.user_sync for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
