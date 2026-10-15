# 猫耳律动 · 好友申请升级（已跑过 supabase_setup.sql 的用户：只跑本文件）
# Supabase → SQL → New query → 整段 Run

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

-- ========== 好友关系（双向各一行，列表只查自己的） ==========
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

-- 同意申请时自动写双向好友（security definer，绕过双向 insert 限制）
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

-- 私聊：仅好友可发（保留双方已有消息可读）
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

-- 资料搜索索引
create index if not exists profiles_display_name_idx
  on public.profiles (display_name);

create index if not exists profiles_email_idx
  on public.profiles (email);
