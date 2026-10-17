# 猫耳律动 · 公开心愿单（已有库只跑本文件）
# Supabase → SQL → New query → 整段 Run

create extension if not exists "pgcrypto";

create table if not exists public.song_wishes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null default '',
  title text not null,
  artist text not null default '',
  song_key text not null,
  status text not null default 'open' check (status in ('open', 'done')),
  created_at timestamptz not null default now(),
  done_at timestamptz
);

create unique index if not exists song_wishes_open_key_uidx
  on public.song_wishes (song_key)
  where status = 'open';

create index if not exists song_wishes_status_idx
  on public.song_wishes (status, created_at desc);

alter table public.song_wishes enable row level security;

drop policy if exists "song_wishes_select_all" on public.song_wishes;
create policy "song_wishes_select_all"
  on public.song_wishes for select
  using (true);

drop policy if exists "song_wishes_insert_own" on public.song_wishes;
create policy "song_wishes_insert_own"
  on public.song_wishes for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "song_wishes_update_auth" on public.song_wishes;
create policy "song_wishes_update_auth"
  on public.song_wishes for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "song_wishes_delete_own" on public.song_wishes;
create policy "song_wishes_delete_own"
  on public.song_wishes for delete
  to authenticated
  using (auth.uid() = author_id);
