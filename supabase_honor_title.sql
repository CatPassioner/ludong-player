# 猫耳律动 · 专属头衔（用户号 000000–000010）
# Supabase → SQL → New query → 整段 Run

alter table public.profiles
  add column if not exists honor_title text not null default '';

-- 创世神默认头衔
update public.profiles
set honor_title = '创世神'
where user_no = 0
  and trim(coalesce(honor_title, '')) = '';

create or replace function public.profiles_guard_honor_title()
returns trigger
language plpgsql
as $$
begin
  if new.honor_title is distinct from coalesce(old.honor_title, '') then
    if new.user_no is null or new.user_no < 0 or new.user_no > 10 then
      raise exception '仅用户号 000000–000010 可设置专属头衔';
    end if;
    new.honor_title := left(trim(coalesce(new.honor_title, '')), 12);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_guard_honor_title on public.profiles;
create trigger trg_profiles_guard_honor_title
  before update of honor_title on public.profiles
  for each row
  execute function public.profiles_guard_honor_title();
