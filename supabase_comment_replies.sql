# 猫耳律动 · 评论楼中楼（已有 song_comments 表时：只跑本文件）
# Supabase → SQL → New query → 整段 Run

alter table public.song_comments
  add column if not exists parent_id uuid references public.song_comments (id) on delete cascade;

create index if not exists song_comments_parent_created_idx
  on public.song_comments (parent_id, created_at asc);

create index if not exists song_comments_song_parent_idx
  on public.song_comments (song_key, parent_id, created_at desc);
