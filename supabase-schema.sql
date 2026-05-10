create extension if not exists pgcrypto;

create table public.settings (
  id uuid primary key default gen_random_uuid(),

  type text not null check (type in ('solo', 'party')),

  title text not null,
  description text not null,
  nickname text not null default '임시 작성자',

  main_operator_slug text not null,
  main_weapon_slug text not null,

  views integer not null default 0,
  likes integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.setting_slots (
  id uuid primary key default gen_random_uuid(),

  setting_id uuid not null references public.settings(id) on delete cascade,

  slot_key text not null check (
    slot_key in ('main', 'member2', 'member3', 'member4')
  ),

  operator_slug text not null,
  weapon_slug text not null,

  armor_slug text not null,
  gloves_slug text not null,
  kit1_slug text not null,
  kit2_slug text not null,

  form_json jsonb not null,

  created_at timestamptz not null default now(),

  unique(setting_id, slot_key)
);

create index settings_type_idx on public.settings(type);
create index settings_main_operator_idx on public.settings(main_operator_slug);
create index settings_main_weapon_idx on public.settings(main_weapon_slug);
create index settings_created_at_idx on public.settings(created_at desc);

create index setting_slots_setting_id_idx on public.setting_slots(setting_id);
create index setting_slots_operator_idx on public.setting_slots(operator_slug);
create index setting_slots_weapon_idx on public.setting_slots(weapon_slug);
create index setting_slots_form_json_idx on public.setting_slots using gin(form_json);
