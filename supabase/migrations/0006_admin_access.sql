-- Server-side admin gate. The frontend route also checks VITE_ADMIN_EMAILS,
-- but the real security is here at the data layer.

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = any (array['nick@alexanderind.com']::text[]),
    false
  );
$$;

-- Additive RLS: admins can read everyone's rows, regular users still only
-- see their own (existing self-policies remain). To add an admin, alter
-- the array in is_admin().

create policy admin_read_all_profiles on public.profiles
  for select to authenticated using (public.is_admin());

create policy admin_read_all_enrollments on public.course_enrollments
  for select to authenticated using (public.is_admin());

create policy admin_read_all_progress on public.lesson_progress
  for select to authenticated using (public.is_admin());

create policy admin_read_all_magic_tokens on public.magic_tokens
  for select to authenticated using (public.is_admin());
