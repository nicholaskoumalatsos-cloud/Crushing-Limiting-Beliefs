-- Demo modules and lessons for the Crushing Limiting Beliefs course.
-- Replace the title / description / body_content via the Supabase dashboard
-- once real video URLs and copy are ready. Drip schedule (unlock_day) can be
-- adjusted independently from content.

do $$
declare
  v_course_id uuid;
  v_module_1 uuid;
  v_module_2 uuid;
  v_module_3 uuid;
  v_module_4 uuid;
begin
  select id into v_course_id from public.courses where slug = 'crushing-limiting-beliefs';
  if v_course_id is null then
    raise exception 'Course "crushing-limiting-beliefs" not found. Apply 0001_init_lms_schema first.';
  end if;

  -- Module 1
  insert into public.modules (course_id, title, sort_order)
  values (v_course_id, 'Recognize the Lie', 1)
  returning id into v_module_1;

  insert into public.lessons (module_id, slug, title, description, body_content, sort_order, unlock_day) values
    (v_module_1, 'the-stories-that-run-you', 'The Stories That Run You',
      'Most men live a script they did not write. The first move is to admit it.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      1, 0),
    (v_module_1, 'how-beliefs-get-installed', 'How Beliefs Get Installed',
      'Where they came from. How they took. Why they hold.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      2, 1),
    (v_module_1, 'what-you-inherited-without-asking', 'What You Inherited Without Asking',
      'Family stories, military stories, locker-room stories. Not all of them are yours to keep.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      3, 2),
    (v_module_1, 'naming-the-specific-belief', 'Naming the Specific Belief',
      'You cannot kill what you cannot see. Pin it down in plain words.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      4, 3);

  -- Module 2
  insert into public.modules (course_id, title, sort_order)
  values (v_course_id, 'Confront the Source', 2)
  returning id into v_module_2;

  insert into public.lessons (module_id, slug, title, description, body_content, sort_order, unlock_day) values
    (v_module_2, 'where-was-this-forged', 'Where Was This Forged?',
      'Trace the belief back to the moment it was useful.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      1, 4),
    (v_module_2, 'the-original-wound', 'The Original Wound',
      'Underneath the story is a hit you took. Look at it without flinching.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      2, 5),
    (v_module_2, 'why-you-kept-it', 'Why You Kept It',
      'A limiting belief survives because it pays out. Find what it is paying you.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      3, 6);

  -- Module 3
  insert into public.modules (course_id, title, sort_order)
  values (v_course_id, 'Break the Pattern', 3)
  returning id into v_module_3;

  insert into public.lessons (module_id, slug, title, description, body_content, sort_order, unlock_day) values
    (v_module_3, 'action-without-permission', 'Action Without Permission',
      'You will never feel ready. That is the whole point.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      1, 7),
    (v_module_3, 'failing-on-purpose', 'Failing on Purpose',
      'Engineered failure is the fastest way to retire a fear.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      2, 8),
    (v_module_3, 'the-identity-shift', 'The Identity Shift',
      'Stop trying to do it. Start being the kind of man who does it.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      3, 9);

  -- Module 4
  insert into public.modules (course_id, title, sort_order)
  values (v_course_id, 'Hold the Line', 4)
  returning id into v_module_4;

  insert into public.lessons (module_id, slug, title, description, body_content, sort_order, unlock_day) values
    (v_module_4, 'daily-reps', 'Daily Reps',
      'Belief change is reps. Same way the body changes.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      1, 10),
    (v_module_4, 'recovery-protocol', 'Recovery Protocol',
      'You will fall back. Have a way out before you need it.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      2, 11),
    (v_module_4, 'brotherhood-and-accountability', 'Brotherhood and Accountability',
      'Solo work has a ceiling. The Agoge is what comes next.',
      'PLACEHOLDER. Replace this body content via the Supabase dashboard with the real lesson copy.',
      3, 12);
end $$;
