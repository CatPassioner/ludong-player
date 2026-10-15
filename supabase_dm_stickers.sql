# 猫耳律动 · 私聊表情包 / 撤回（已有库只跑本文件）
# Supabase → SQL → New query → 整段 Run

alter table public.dm_messages
  add column if not exists msg_type text not null default 'text';

alter table public.dm_messages
  add column if not exists media_url text not null default '';

alter table public.dm_messages
  add column if not exists recalled_at timestamptz;

-- 放宽正文长度（颜文字 / 说明文字）
alter table public.dm_messages drop constraint if exists dm_messages_body_check;
alter table public.dm_messages
  add constraint dm_messages_body_check
  check (char_length(body) between 1 and 2000);

alter table public.dm_messages drop constraint if exists dm_messages_msg_type_check;
alter table public.dm_messages
  add constraint dm_messages_msg_type_check
  check (msg_type in ('text', 'sticker', 'kaomoji'));

-- 发送方可撤回（更新 recalled_at）；接收方已有已读更新策略，两者 OR
drop policy if exists "dm_update_sender_recall" on public.dm_messages;
create policy "dm_update_sender_recall"
  on public.dm_messages for update
  to authenticated
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);
