# 猫耳律动 · 云端表（Supabase → SQL → New query → 整段 Run）
# 包含：歌曲评论 + 用户资料 + 私聊消息

create extension if not exists "pgcrypto";

-- ========== 歌曲评论 ==========
create table if not exists public.song_comments (
  id uuid primary key default gen_random_uuid(),
  song_key text not null,
  song_title text not null default '',
  song_artist text not null default '',
  author_name text not null default '用户',
  body text not null check (char_length(body) between 1 and 500),
  likes int not null default 0 check (likes >= 0),
  hearts int not null default 0 check (hearts >= 0),
  user_id uuid references auth.users (id) on delete set null,
  parent_id uuid references public.song_comments (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists song_comments_song_key_created_idx
  on public.song_comments (song_key, created_at desc);

create index if not exists song_comments_parent_created_idx
  on public.song_comments (parent_id, created_at asc);

alter table public.song_comments enable row level security;

drop policy if exists "song_comments_select_all" on public.song_comments;
create policy "song_comments_select_all"
  on public.song_comments for select
  using (true);

drop policy if exists "song_comments_insert_auth" on public.song_comments;
create policy "song_comments_insert_auth"
  on public.song_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "song_comments_update_auth" on public.song_comments;
create policy "song_comments_update_auth"
  on public.song_comments for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "song_comments_delete_own" on public.song_comments;
create policy "song_comments_delete_own"
  on public.song_comments for delete
  to authenticated
  using (auth.uid() = user_id);

-- ========== 用户资料（私聊通讯录） ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '用户',
  email text not null default '',
  avatar_url text not null default '',
  user_no integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 用户号从 0 起（显示为 000000），按注册先后递增
create sequence if not exists public.profile_user_no_seq;

do $$
begin
  -- 仅在序列从未用过时设为从 0 开始
  if (select last_value from public.profile_user_no_seq) = 1
     and not (select is_called from public.profile_user_no_seq) then
    perform setval('public.profile_user_no_seq', -1, true);
  end if;
end $$;

create or replace function public.profiles_assign_user_no()
returns trigger
language plpgsql
as $$
begin
  if new.user_no is null then
    new.user_no := nextval('public.profile_user_no_seq')::int;
  end if;
  if new.created_at is null then
    new.created_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_assign_user_no on public.profiles;
create trigger trg_profiles_assign_user_no
  before insert on public.profiles
  for each row
  execute function public.profiles_assign_user_no();

create unique index if not exists profiles_user_no_uidx
  on public.profiles (user_no);

create or replace function public.lookup_login_preview(p_email text)
returns table(display_name text, avatar_url text, user_no integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_email is null or length(trim(p_email)) < 5 then
    return;
  end if;
  return query
    select p.display_name, p.avatar_url, p.user_no
    from public.profiles p
    where lower(p.email) = lower(trim(p_email))
    limit 1;
end;
$$;

revoke all on function public.lookup_login_preview(text) from public;
grant execute on function public.lookup_login_preview(text) to anon, authenticated;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_auth" on public.profiles;
create policy "profiles_select_auth"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ========== 私聊消息 ==========
create table if not exists public.dm_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  msg_type text not null default 'text'
    check (msg_type in ('text', 'sticker', 'kaomoji')),
  media_url text not null default '',
  created_at timestamptz not null default now(),
  read_at timestamptz,
  recalled_at timestamptz
);

create index if not exists dm_messages_pair_created_idx
  on public.dm_messages (sender_id, receiver_id, created_at desc);

create index if not exists dm_messages_receiver_created_idx
  on public.dm_messages (receiver_id, created_at desc);

alter table public.dm_messages enable row level security;

drop policy if exists "dm_select_participants" on public.dm_messages;
create policy "dm_select_participants"
  on public.dm_messages for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "dm_insert_own" on public.dm_messages;
create policy "dm_insert_own"
  on public.dm_messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.friendships f
      where f.user_id = auth.uid() and f.friend_id = receiver_id
    )
  );

create index if not exists dm_messages_unread_idx
  on public.dm_messages (receiver_id, sender_id, created_at desc)
  where read_at is null;

drop policy if exists "dm_update_receiver_read" on public.dm_messages;
create policy "dm_update_receiver_read"
  on public.dm_messages for update
  to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

drop policy if exists "dm_update_sender_recall" on public.dm_messages;
create policy "dm_update_sender_recall"
  on public.dm_messages for update
  to authenticated
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);

-- ========== 好友申请 ==========
create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles (id) on delete cascade,
  to_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_id <> to_id),
  unique (from_id, to_id)
);

create index if not exists friend_requests_to_pending_idx
  on public.friend_requests (to_id, status, created_at desc);

create index if not exists friend_requests_from_idx
  on public.friend_requests (from_id, status, created_at desc);

alter table public.friend_requests enable row level security;

drop policy if exists "friend_requests_select_mine" on public.friend_requests;
create policy "friend_requests_select_mine"
  on public.friend_requests for select
  to authenticated
  using (auth.uid() = from_id or auth.uid() = to_id);

drop policy if exists "friend_requests_insert_own" on public.friend_requests;
create policy "friend_requests_insert_own"
  on public.friend_requests for insert
  to authenticated
  with check (auth.uid() = from_id and status = 'pending');

drop policy if exists "friend_requests_update_party" on public.friend_requests;
create policy "friend_requests_update_party"
  on public.friend_requests for update
  to authenticated
  using (auth.uid() = from_id or auth.uid() = to_id)
  with check (auth.uid() = from_id or auth.uid() = to_id);

drop policy if exists "friend_requests_delete_mine" on public.friend_requests;
create policy "friend_requests_delete_mine"
  on public.friend_requests for delete
  to authenticated
  using (auth.uid() = from_id or auth.uid() = to_id);

-- ========== 好友关系 ==========
create table if not exists public.friendships (
  user_id uuid not null references public.profiles (id) on delete cascade,
  friend_id uuid not null references public.profiles (id) on delete cascade,
  remark text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

create index if not exists friendships_user_idx
  on public.friendships (user_id, created_at desc);

alter table public.friendships enable row level security;

drop policy if exists "friendships_select_mine" on public.friendships;
create policy "friendships_select_mine"
  on public.friendships for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "friendships_insert_mine" on public.friendships;
create policy "friendships_insert_mine"
  on public.friendships for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "friendships_delete_mine" on public.friendships;
create policy "friendships_delete_mine"
  on public.friendships for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "friendships_update_mine" on public.friendships;
create policy "friendships_update_mine"
  on public.friendships for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.on_friend_request_accepted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted'
     and (tg_op = 'INSERT' or old.status is distinct from 'accepted') then
    insert into public.friendships (user_id, friend_id)
    values (new.from_id, new.to_id)
    on conflict do nothing;
    insert into public.friendships (user_id, friend_id)
    values (new.to_id, new.from_id)
    on conflict do nothing;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_friend_request_accepted on public.friend_requests;
create trigger trg_friend_request_accepted
  before update on public.friend_requests
  for each row
  execute function public.on_friend_request_accepted();

create index if not exists profiles_display_name_idx
  on public.profiles (display_name);

create index if not exists profiles_email_idx
  on public.profiles (email);
