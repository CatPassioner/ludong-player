# 猫耳律动 · 一起听（好友邀请 + 播放同步）
# Supabase → SQL → New query → 整段 Run

create table if not exists public.listen_together_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  guest_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'rejected', 'cancelled', 'ended')),
  song_key text not null default '',
  cloud_song_id uuid,
  song_title text not null default '',
  song_artist text not null default '',
  song_cover text not null default '',
  audio_url text not null default '',
  playing boolean not null default false,
  position_ms integer not null default 0,
  seek_seq integer not null default 0,
  started_at timestamptz,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (host_id <> guest_id)
);

alter table public.listen_together_sessions
  add column if not exists started_at timestamptz;

create index if not exists listen_together_host_status_idx
  on public.listen_together_sessions (host_id, status, updated_at desc);

create index if not exists listen_together_guest_status_idx
  on public.listen_together_sessions (guest_id, status, updated_at desc);

create unique index if not exists listen_together_pair_open_idx
  on public.listen_together_sessions (host_id, guest_id)
  where status in ('pending', 'active');

alter table public.listen_together_sessions enable row level security;

drop policy if exists "listen_together_select_party" on public.listen_together_sessions;
create policy "listen_together_select_party"
  on public.listen_together_sessions for select
  to authenticated
  using (auth.uid() = host_id or auth.uid() = guest_id);

drop policy if exists "listen_together_insert_host" on public.listen_together_sessions;
create policy "listen_together_insert_host"
  on public.listen_together_sessions for insert
  to authenticated
  with check (
    auth.uid() = host_id
    and status = 'pending'
    and exists (
      select 1 from public.friendships f
      where f.user_id = auth.uid() and f.friend_id = guest_id
    )
  );

drop policy if exists "listen_together_update_party" on public.listen_together_sessions;
create policy "listen_together_update_party"
  on public.listen_together_sessions for update
  to authenticated
  using (auth.uid() = host_id or auth.uid() = guest_id)
  with check (auth.uid() = host_id or auth.uid() = guest_id);

drop policy if exists "listen_together_delete_party" on public.listen_together_sessions;
create policy "listen_together_delete_party"
  on public.listen_together_sessions for delete
  to authenticated
  using (auth.uid() = host_id or auth.uid() = guest_id);
