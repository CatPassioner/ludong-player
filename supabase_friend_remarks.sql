# 猫耳律动 · 好友备注（已有库只跑本文件）
# Supabase → SQL → New query → 整段 Run

alter table public.friendships
  add column if not exists remark text not null default '';

-- 允许本人更新自己的好友行（用于改备注）
drop policy if exists "friendships_update_mine" on public.friendships;
create policy "friendships_update_mine"
  on public.friendships for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
