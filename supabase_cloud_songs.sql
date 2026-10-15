# 猫耳律动 · 云端共同曲库（已有库只跑本文件）
# Supabase → SQL → New query → 整段 Run
# 作用：全员可读的共享歌曲表 + Storage 桶 ludong-music

create extension if not exists "pgcrypto";

-- ========== 共同曲库元数据 ==========
create table if not exists public.cloud_songs (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  artist text not null default '未知歌手',
  song_key text not null,
  audio_path text not null,
  cover_path text not null default '',
  lrc_path text not null default '',
  video_path text not null default '',
  duration int not null default 0 check (duration >= 0),
  file_size bigint not null default 0 check (file_size >= 0),
  created_at timestamptz not null default now()
);

create unique index if not exists cloud_songs_song_key_uidx
  on public.cloud_songs (song_key);

create index if not exists cloud_songs_created_idx
  on public.cloud_songs (created_at desc);

create index if not exists cloud_songs_uploader_idx
  on public.cloud_songs (uploader_id);

alter table public.cloud_songs enable row level security;

drop policy if exists "cloud_songs_select_all" on public.cloud_songs;
create policy "cloud_songs_select_all"
  on public.cloud_songs for select
  using (true);

drop policy if exists "cloud_songs_insert_own" on public.cloud_songs;
create policy "cloud_songs_insert_own"
  on public.cloud_songs for insert
  to authenticated
  with check (auth.uid() = uploader_id);

drop policy if exists "cloud_songs_update_own" on public.cloud_songs;
create policy "cloud_songs_update_own"
  on public.cloud_songs for update
  to authenticated
  using (auth.uid() = uploader_id)
  with check (auth.uid() = uploader_id);

drop policy if exists "cloud_songs_delete_own" on public.cloud_songs;
create policy "cloud_songs_delete_own"
  on public.cloud_songs for delete
  to authenticated
  using (auth.uid() = uploader_id);

-- ========== Storage 桶 ==========
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ludong-music',
  'ludong-music',
  true,
  209715200,
  array[
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
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 公开读（播放 / 封面 / 歌词）
drop policy if exists "ludong_music_public_read" on storage.objects;
create policy "ludong_music_public_read"
  on storage.objects for select
  using (bucket_id = 'ludong-music');

-- 登录用户只能写到自己的目录：{user_id}/...
drop policy if exists "ludong_music_auth_insert" on storage.objects;
create policy "ludong_music_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'ludong-music'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ludong_music_auth_update" on storage.objects;
create policy "ludong_music_auth_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'ludong-music'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'ludong-music'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "ludong_music_auth_delete" on storage.objects;
create policy "ludong_music_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'ludong-music'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
