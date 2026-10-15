# 猫耳律动 · 共同曲库支持 MV / SRT（已有库只跑本文件一次）
# Supabase → SQL → New query → 整段 Run

alter table public.cloud_songs
  add column if not exists video_path text not null default '';

-- 放宽桶体积与 MIME：允许 mp4/webm 与字幕
update storage.buckets
set
  file_size_limit = 209715200,
  allowed_mime_types = array[
    'audio/mpeg',
    'audio/mp3',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'application/octet-stream',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/x-subrip'
  ]
where id = 'ludong-music';
