-- Crushing Limiting Beliefs LMS schema
-- Applied as Supabase migration: 0001_init_lms_schema

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  klaviyo_profile_id text,
  source text,
  created_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (lower(email));

-- Auto-create a profile row whenever a new auth user is provisioned
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Magic tokens (passwordless login, one-time use)
-- ============================================================
create table public.magic_tokens (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index magic_tokens_email_idx on public.magic_tokens (lower(email));
create index magic_tokens_expires_idx on public.magic_tokens (expires_at);

-- ============================================================
-- Courses
-- ============================================================
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Modules
-- ============================================================
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index modules_course_idx on public.modules (course_id, sort_order);

-- ============================================================
-- Lessons
-- ============================================================
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  video_url text,
  body_content text,
  sort_order integer not null default 0,
  unlock_day integer not null default 0,
  created_at timestamptz not null default now()
);

create index lessons_module_idx on public.lessons (module_id, sort_order);

-- ============================================================
-- Course enrollments (drives drip schedule)
-- ============================================================
create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index course_enrollments_user_idx on public.course_enrollments (user_id);

-- ============================================================
-- Lesson progress (the conversion data)
-- ============================================================
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index lesson_progress_user_idx on public.lesson_progress (user_id);
create index lesson_progress_lesson_idx on public.lesson_progress (lesson_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.magic_tokens enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- profiles: users see and update their own row
create policy profiles_self_read on public.profiles
  for select to authenticated using (id = auth.uid());

create policy profiles_self_update on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- magic_tokens: no client-side access. Service role bypasses RLS.

-- courses, modules, lessons: any authenticated user can read
create policy courses_read_all on public.courses
  for select to authenticated using (true);

create policy modules_read_all on public.modules
  for select to authenticated using (true);

create policy lessons_read_all on public.lessons
  for select to authenticated using (true);

-- course_enrollments: users see their own enrollment
create policy enrollments_self_read on public.course_enrollments
  for select to authenticated using (user_id = auth.uid());

-- lesson_progress: users read, insert, and update their own progress
create policy progress_self_read on public.lesson_progress
  for select to authenticated using (user_id = auth.uid());

create policy progress_self_insert on public.lesson_progress
  for insert to authenticated with check (user_id = auth.uid());

create policy progress_self_update on public.lesson_progress
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
-- Seed: the one course this site exists for
-- ============================================================
insert into public.courses (slug, title, description) values (
  'crushing-limiting-beliefs',
  'Crushing Limiting Beliefs',
  'Direct work for men ready to confront the stories holding them back.'
) on conflict (slug) do nothing;
