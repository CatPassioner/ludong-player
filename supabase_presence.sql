# 猫耳律动 · 好友在线状态（在 Supabase SQL Editor 执行一次）
# 依赖：已有 public.profiles

alter table public.profiles
  add column if not exists last_seen_at timestamptz;

create index if not exists profiles_last_seen_at_idx
  on public.profiles (last_seen_at desc nulls last);

-- 仅更新自己的心跳，避免误改昵称/头像
create or replace function public.touch_presence()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles
  set last_seen_at = now()
  where id = auth.uid();
end;
$$;

revoke all on function public.touch_presence() from public;
grant execute on function public.touch_presence() to authenticated;
