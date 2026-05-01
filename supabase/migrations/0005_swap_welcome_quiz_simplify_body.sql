-- Welcome first, Quiz second
update public.lessons set sort_order = 1 where slug = 'welcome';
update public.lessons set sort_order = 2 where slug = 'crushing-limiting-beliefs-quiz';

-- Strip the questions from the quiz body. The frontend Quiz component
-- renders them interactively. Body is now intro copy only.
update public.lessons
set body_content = $body$
This is a short pre-course assessment. Take it before you go any deeper.

Read each question. Pick your best answer. When you finish, submit to see your score and the answer key.
$body$
where slug = 'crushing-limiting-beliefs-quiz';
