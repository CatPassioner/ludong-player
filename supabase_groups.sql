# 猫耳律动 · 群聊（新建群 / 拉好友 / 改群名 / 群消息）
# Supabase → SQL → New query → 整段 Run
# 依赖：已有 profiles、friendships

create extension if not exists "pgcrypto";

-- ========== 群 ==========
create table if not exists public.chat_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null default '群聊',
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_groups_owner_idx
  on public.chat_groups (owner_id);

-- ========== 成员 ==========
create table if not exists public.chat_group_members (
  group_id uuid not null references public.chat_groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (group_id, user_id)
);

create index if not exists chat_group_members_user_idx
  on public.chat_group_members (user_id);

-- ========== 群消息 ==========
create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.chat_groups (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null default '',
  msg_type text not null default 'text'
    check (msg_type in ('text', 'sticker', 'kaomoji')),
  media_url text not null default '',
  created_at timestamptz not null default now(),
  recalled_at timestamptz
);

create index if not exists group_messages_group_created_idx
  on public.group_messages (group_id, created_at);

create index if not exists group_messages_recall_idx
  on public.group_messages (group_id, recalled_at)
  where recalled_at is not null;

-- ========== 助手：是否群成员（security definer，避免 RLS 递归） ==========
create or replace function public.is_chat_group_member(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_group_members m
    where m.group_id = gid
      and m.user_id = auth.uid()
  );
$$;

revoke all on function public.is_chat_group_member(uuid) from public;
grant execute on function public.is_chat_group_member(uuid) to authenticated;

create or replace function public.is_chat_group_owner(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_groups g
    where g.id = gid
      and g.owner_id = auth.uid()
  );
$$;

revoke all on function public.is_chat_group_owner(uuid) from public;
grant execute on function public.is_chat_group_owner(uuid) to authenticated;

-- ========== RLS ==========
alter table public.chat_groups enable row level security;
alter table public.chat_group_members enable row level security;
alter table public.group_messages enable row level security;

drop policy if exists "chat_groups_select_member" on public.chat_groups;
create policy "chat_groups_select_member"
  on public.chat_groups for select
  to authenticated
  using (public.is_chat_group_member(id) or owner_id = auth.uid());

drop policy if exists "chat_groups_insert_own" on public.chat_groups;
create policy "chat_groups_insert_own"
  on public.chat_groups for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "chat_groups_update_member" on public.chat_groups;
create policy "chat_groups_update_member"
  on public.chat_groups for update
  to authenticated
  using (public.is_chat_group_member(id))
  with check (public.is_chat_group_member(id));

drop policy if exists "chat_groups_delete_owner" on public.chat_groups;
create policy "chat_groups_delete_owner"
  on public.chat_groups for delete
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "chat_group_members_select" on public.chat_group_members;
create policy "chat_group_members_select"
  on public.chat_group_members for select
  to authenticated
  using (public.is_chat_group_member(group_id) or user_id = auth.uid());

drop policy if exists "chat_group_members_insert" on public.chat_group_members;
create policy "chat_group_members_insert"
  on public.chat_group_members for insert
  to authenticated
  with check (
    user_id = auth.uid()
    or public.is_chat_group_owner(group_id)
    or public.is_chat_group_member(group_id)
  );

drop policy if exists "chat_group_members_update_own" on public.chat_group_members;
create policy "chat_group_members_update_own"
  on public.chat_group_members for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "chat_group_members_delete" on public.chat_group_members;
create policy "chat_group_members_delete"
  on public.chat_group_members for delete
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_chat_group_owner(group_id)
  );

drop policy if exists "group_messages_select" on public.group_messages;
create policy "group_messages_select"
  on public.group_messages for select
  to authenticated
  using (public.is_chat_group_member(group_id));

drop policy if exists "group_messages_insert" on public.group_messages;
create policy "group_messages_insert"
  on public.group_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_chat_group_member(group_id)
  );

drop policy if exists "group_messages_update_recall" on public.group_messages;
create policy "group_messages_update_recall"
  on public.group_messages for update
  to authenticated
  using (sender_id = auth.uid() and public.is_chat_group_member(group_id))
  with check (sender_id = auth.uid());
