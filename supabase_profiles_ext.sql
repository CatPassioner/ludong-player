# 猫耳律动 · 头像 / 用户号 / 登录预览（已有库只跑本文件）
# Supabase → SQL → New query → 整段 Run

alter table public.profiles
  add column if not exists avatar_url text not null default '';

alter table public.profiles
  add column if not exists user_no integer;

alter table public.profiles
  add column if not exists created_at timestamptz not null default now();

create sequence if not exists public.profile_user_no_seq;

-- 已有账号按注册先后编号，从 000001 起
with numbered as (
  select id, row_number() over (order by created_at asc, id asc) as n
  from public.profiles
  where user_no is null
)
update public.profiles p
set user_no = numbered.n
from numbered
where p.id = numbered.id;

select setval(
  'public.profile_user_no_seq',
  coalesce((select max(user_no) from public.profiles), 0),
  true
);

create unique index if not exists profiles_user_no_uidx
  on public.profiles (user_no);

create or replace function public.profiles_assign_user_no()
returns trigger
language plpgsql
as $$
begin
  if new.user_no is null then
    new.user_no := nextval('public.profile_user_no_seq')::int;
  end if;
  if new.created_at is null then
    new.created_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_assign_user_no on public.profiles;
create trigger trg_profiles_assign_user_no
  before insert on public.profiles
  for each row
  execute function public.profiles_assign_user_no();

-- 登录页按邮箱预览头像/昵称/用户号（不返回密码）
create or replace function public.lookup_login_preview(p_email text)
returns table(display_name text, avatar_url text, user_no integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_email is null or length(trim(p_email)) < 5 then
    return;
  end if;
  return query
    select p.display_name, p.avatar_url, p.user_no
    from public.profiles p
    where lower(p.email) = lower(trim(p_email))
    limit 1;
end;
$$;

revoke all on function public.lookup_login_preview(text) from public;
grant execute on function public.lookup_login_preview(text) to anon, authenticated;
