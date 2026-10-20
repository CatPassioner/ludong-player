-- 猫耳律动 · 允许登录用户补传/替换共同曲库资产（LRC / 封面 / MP3 / MP4）
-- Supabase → SQL → New query → 整段 Run
-- 说明：原策略仅上传者可 UPDATE；执行后任意登录用户可更新曲库行
-- （文件仍只能写到自己的 Storage 目录 {user_id}/...，公开读不变）

drop policy if exists "cloud_songs_update_own" on public.cloud_songs;
drop policy if exists "cloud_songs_update_authenticated" on public.cloud_songs;

create policy "cloud_songs_update_authenticated"
  on public.cloud_songs for update
  to authenticated
  using (true)
  with check (true);
