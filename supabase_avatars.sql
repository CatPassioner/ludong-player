# 猫耳律动 · 头像存储桶（可选，推荐）
# 若 SQL 执行后 Storage 里仍没有桶，请改用 Dashboard 手动创建：
#   Storage → New bucket → 名称 ludong-avatars → Public bucket 打开 → Create
#   然后对本桶添加政策：Public read；Authenticated 可上传/更新/删除自己的文件夹

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ludong-avatars',
  'ludong-avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ludong_avatars_public_read" on storage.objects;
create policy "ludong_avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'ludong-avatars');

drop policy if exists "ludong_avatars_auth_insert" on storage.objects;
create policy "ludong_avatars_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'ludong-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ludong_avatars_auth_update" on storage.objects;
create policy "ludong_avatars_auth_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'ludong-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'ludong-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ludong_avatars_auth_delete" on storage.objects;
create policy "ludong_avatars_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'ludong-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 清掉历史上过大的 base64 头像（客户端会引导用户重新保存）
update public.profiles
set avatar_url = ''
where avatar_url like 'data:%'
  and char_length(avatar_url) > 20000;
