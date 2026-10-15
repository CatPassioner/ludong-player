# 猫耳律动 · 私聊已读/未读（已跑过 setup / friends 的用户：只跑本文件）
# Supabase → SQL → New query → 整段 Run

alter table public.dm_messages
  add column if not exists read_at timestamptz;

-- 旧消息全部视为已读，避免升级后突然全是红点
update public.dm_messages
  set read_at = created_at
  where read_at is null;

create index if not exists dm_messages_unread_idx
  on public.dm_messages (receiver_id, sender_id, created_at desc)
  where read_at is null;

-- 只有接收方可以把消息标成已读
drop policy if exists "dm_update_receiver_read" on public.dm_messages;
create policy "dm_update_receiver_read"
  on public.dm_messages for update
  to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);
