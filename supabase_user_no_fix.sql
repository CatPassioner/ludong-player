# 猫耳律动 · 全部用户号按注册顺序重排（从 000000 起，一直往后）
# Supabase → SQL → New query → 整段 Run
# 会改写所有 profiles.user_no

drop index if exists public.profiles_user_no_uidx;

-- 全员按注册时间编号：auth.users.created_at 优先
with numbered as (
  select
    p.id,
    (row_number() over (
      order by coalesce(u.created_at, p.created_at) asc nulls last, p.id asc
    ) - 1)::int as n
  from public.profiles p
  left join auth.users u on u.id = p.id
)
update public.profiles p
set user_no = numbered.n
from numbered
where p.id = numbered.id;

create unique index if not exists profiles_user_no_uidx
  on public.profiles (user_no);

-- 新注册从最大号 +1 继续
select setval(
  'public.profile_user_no_seq',
  coalesce((select max(user_no) from public.profiles), -1),
  true
);

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
