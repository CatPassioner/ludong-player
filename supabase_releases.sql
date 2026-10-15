# 猫耳律动 · 软件更新发布桶（已有库只跑本文件）
# Supabase → SQL → New query → 整段 Run
# 上传：
#   ludong-releases/update.json
#   ludong-releases/ludong-patch.zip   （小补丁，推荐）
#   ludong-releases/ludong-setup.exe   （完整包，免费版常超 50MB）

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ludong-releases',
  'ludong-releases',
  true,
  524288000,
  array[
    'application/json',
    'application/octet-stream',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-msdownload',
    'application/vnd.microsoft.portable-executable'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ludong_releases_public_read" on storage.objects;
create policy "ludong_releases_public_read"
  on storage.objects for select
  using (bucket_id = 'ludong-releases');

-- 上传发布包请用 Dashboard（或 service role），不要用 anon 写
