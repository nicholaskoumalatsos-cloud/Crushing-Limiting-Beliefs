-- Insert the pre-course quiz as the first lesson in Module 1 (Start Here)
-- and renumber Welcome (and any others) to follow it.

do $$
declare
  v_module_1 uuid;
begin
  select m.id into v_module_1
  from public.modules m
  join public.courses c on c.id = m.course_id
  where c.slug = 'crushing-limiting-beliefs' and m.title = 'Start Here';

  if v_module_1 is null then
    raise exception 'Module "Start Here" not found.';
  end if;

  update public.lessons set sort_order = sort_order + 1 where module_id = v_module_1;

  insert into public.lessons
    (module_id, slug, title, description, video_url, body_content, sort_order, unlock_day)
  values (
    v_module_1,
    'crushing-limiting-beliefs-quiz',
    'The Quiz',
    'A short pre-course assessment. Take it before you start.',
    null,
    $body$
Take this short quiz before you start. It frames the work you are about to do.

Read each question. Pick the best answer. Track your answers, then check them against the key at the bottom.

## 1. Limiting beliefs can be:

A. Insidious and pervasive, wreaking havoc in every area of your life
B. Conscious beliefs
C. Subconscious beliefs
D. All of the above

## 2. We all have limiting beliefs.

A. True
B. False

## 3. Where do limiting beliefs come from?

A. Observations, processed in our mind from our own perspective
B. Experiences
C. Input from family, friends, and acquaintances, often from childhood and the way you were raised
D. All of the above

## 4. How can you keep a limiting belief from negatively affecting you?

A. Ignore it.
B. Worry about it.
C. Transform it into a new, empowering belief.
D. There is nothing you can do about it.

## 5. If you believe that you are too old to start something new, which of the beliefs below can empower you to change the negative belief?

A. My age gives me wisdom.
B. My experience can give me an advantage with new projects.
C. Both A and B
D. There is nothing you can do. Any successful project needs to be started at a young age.

## 6. Which belief helps you change a scarcity mindset into an abundance mindset?

A. Every resource I need is available to me.
B. My resources are limited.
C. There is only so much to go around, so I better get my share while I can.
D. I do not have the money, time, or contacts to create a joyful life.

## 7. Which belief below is an empowering belief?

A. As soon as I get a raise, others will think more highly of me.
B. I am enough.
C. I can impress the neighbors with this new car.
D. If only I were better looking, I could get more dates.

## 8. Which results are you most likely to experience if you believe that you do not deserve success?

A. Achieving goals quickly, before others find out that you are unworthy
B. Joyful relationships
C. Lots of pets
D. Self-sabotage, so that you usually fall short of your goal

## 9. Consider this belief: "I can do everything myself." Which option below is true?

A. This belief is a strength. Asking for help just shows how weak you are.
B. If you want something done right, you have to do it yourself.
C. This belief is a weakness and limits you.
D. If you accept the assistance of others in reaching your goal, then you did not really achieve your goal at all.

## 10. You can change your beliefs.

A. True
B. False

## Answer Key

1. D
2. A
3. D
4. C
5. C
6. A
7. B
8. D
9. C
10. A

When you are done, hit Next to move on to the Welcome.
$body$,
    1, 0
  );
end $$;
