-- Wipes the placeholder modules + lessons (cascades into lesson_progress)
-- and loads the real Crushing Limiting Beliefs course: 6 modules, 16 lessons
-- (Welcome, 14 belief-flipping lessons, Summary), 15-day drip schedule,
-- with full markdown bodies and YouTube video URLs.

delete from public.modules
where course_id = (select id from public.courses where slug = 'crushing-limiting-beliefs');

do $$
declare
  v_course uuid;
  v_m1 uuid; v_m2 uuid; v_m3 uuid; v_m4 uuid; v_m5 uuid; v_m6 uuid;
begin
  select id into v_course from public.courses where slug = 'crushing-limiting-beliefs';
  if v_course is null then
    raise exception 'Course "crushing-limiting-beliefs" not found.';
  end if;

  insert into public.modules (course_id, title, sort_order) values
    (v_course, 'Start Here', 1) returning id into v_m1;
  insert into public.modules (course_id, title, sort_order) values
    (v_course, 'Time, Age, and the Past', 2) returning id into v_m2;
  insert into public.modules (course_id, title, sort_order) values
    (v_course, 'What You Have, What You Compare', 3) returning id into v_m3;
  insert into public.modules (course_id, title, sort_order) values
    (v_course, 'Who You Think You Are', 4) returning id into v_m4;
  insert into public.modules (course_id, title, sort_order) values
    (v_course, 'Get Moving', 5) returning id into v_m5;
  insert into public.modules (course_id, title, sort_order) values
    (v_course, 'The Final Word', 6) returning id into v_m6;

  -- =================================================================
  -- Module 1: Start Here
  -- =================================================================
  insert into public.lessons
    (module_id, slug, title, description, video_url, body_content, sort_order, unlock_day)
  values (
    v_m1,
    'welcome',
    'Welcome',
    'An orientation to the work you are about to do.',
    'https://youtu.be/73GMe1M0ArU',
    $body$
Welcome to the course on limiting beliefs. This course has the potential to change your life in many ways. By the end, you will be a different person.

**Limiting beliefs are conscious or subconscious beliefs that hold you back.** They are ideas that limit you. Thoughts that keep you from reaching your full potential. These beliefs are often burned deeply into us and they restrict us from blooming into who we were meant to be.

All of us have limiting beliefs. Sometimes they originate in childhood, instilled by parents or friends. Other times they are the result of trauma. Sometimes there is no obvious explanation for where they come from.

Whatever the case, **these beliefs are damaging.** They keep us from achieving our hopes, dreams, and goals. They make us fearful and hesitant. They stop us from taking action. They affect our relationships with others.

**If we want to achieve our true potential, we must destroy the limiting beliefs that are holding us back.**

Brian Tracy said, "You begin to fly when you let go of self-limiting beliefs and allow your mind and aspirations to rise to greater heights."

In this course, you will discover 14 common destructive limiting beliefs that keep us from achieving all that we want to achieve. We will name each one, rewrite it into one that empowers you, lay out specific action steps, and give you affirmations that destroy the old belief and instill the new one.

Each lesson contains action tips. Go through them with an open mind and try the techniques. Nothing happens until you take action.

Ready? Let's go.
$body$,
    1, 0
  );

  -- =================================================================
  -- Module 2: Time, Age, and the Past
  -- =================================================================
  insert into public.lessons
    (module_id, slug, title, description, video_url, body_content, sort_order, unlock_day)
  values (
    v_m2,
    'i-dont-have-enough-time',
    'I Don''t Have Enough Time',
    'Stop running. Slay the most important thing first.',
    'https://youtu.be/qba1x-Pfx_A',
    $body$
If you are like most people, you are extremely busy. Projects, things around the house, people to spend time with, bills to pay, a thousand emails to answer.

You are so busy that you feel you do not have enough time for the things that really matter. For your dreams. For the goals that count.

You feel like you are running in a thousand directions without making real progress on anything. You think, "If only I had more time, then I could do what I really wanted. If I had more hours in the day, I could get things done."

When you look around, your friends and coworkers are just as busy. So you accept extreme busyness as normal.

**Your limiting belief is that there isn't enough time in the day to get things done.**

It does not have to be normal.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I don't have enough time."

**Empowering beliefs:**
- "I have time for my most important tasks."
- "My schedule gives me freedom from time pressure."
- "I refuse to let time rule my life."
- "I get things done without worrying about time."
- "I am productive and make the best out of the time I have been given."

The best way to make these new beliefs work is to **work on the thing that matters most FIRST thing in the day.** By making quick progress on the tasks that matter most, you slash the limiting belief.

This principle is often called **slaying your dragons.** You slay your most important task, your dragon, first thing in the morning. Before the thousand other tasks that compete for your attention. Full focus on the one thing that will move you forward the most.

By doing your most important thing first, you rewrite the belief that there is not enough time. **Your new belief becomes: "There is plenty of time to do what matters because I work on what matters first."**

## Action Steps

- Write down all the tasks you need to perform in a given day.
- Organize those tasks by importance.
- Determine your *most* important task for the day.
- Give all your attention to that task until it is done.
- Repeat this process each day.

## Affirmation

> There is more than enough time in each day for me to accomplish the tasks that matter most. I am dedicated to and focused on getting the most important things done each day.
>
> I refuse to be easily distracted. I slay my dragons first thing each morning. I do less important things later, after I finish the task that matters most.
>
> I am passionate about getting things done that are important to me.
$body$,
    1, 0
  ),
  (
    v_m2,
    'im-too-old-to-start-something-new',
    'I''m Too Old To Start Something New',
    'Age is leverage. Use what you have learned.',
    'https://youtu.be/KTAclsi7dxU',
    $body$
With this limiting belief, you assume that to be successful you have to start young. That the only way to achieve great things is to begin early and grind until you finally make it later in life. That you are too old to start new things, reset your career, take up a new hobby, or chase new goals.

**Your limiting belief is that you can't teach an old dog new tricks.**

You feel like if you tried to start something new at this point, you would fail. Maybe you want to write a book. Take up skiing. Change your career. Run a marathon. As you consider these things, you think, "Only young people do these things. I am too old to start something this big."

It is not true. It needs to be rewritten.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I'm too old to accomplish anything new."

**Empowering beliefs:**
- "My age gives me wisdom."
- "I have more experience than those who are younger."
- "I can avoid mistakes that younger people make."
- "My experience will allow me to get going faster."
- "I'm never too old to start something new."

There are thousands of people who have achieved huge success later in life. Sam Walton founded Walmart at 44. Vera Wang started designing clothing at 40. Harland Sanders, the founder of KFC, was broke until age 65. Charles Darwin published *The Origin of Species* at 50.

If they could do it, you can. To rewrite this belief you have to see that being older gives you more wisdom. You have more to offer, a broader skill set, more experience. **That is a distinct advantage over people who are younger.**

Younger people make more mistakes because they do not have your experience. That keeps them from achieving success as quickly. Because you have so much experience, you can move faster by avoiding the mistakes you have already paid for.

**Your new belief is: "I can start something new at any age. I have the experience and wisdom to achieve anything I want, regardless of my age."**

## Action Steps

- Write down all the things you want to achieve.
- Write down the distinct advantages you have because you're older. Include experiences and lessons learned.
- Look back on the things you have already achieved. Use those wins as fuel.
- Affirm each day that you are enough and that you can achieve whatever you set your mind to.
- Read the stories of others who achieved great things later in life.

## Affirmation

> I can start something new at any age. My age gives me a distinct advantage over those who are younger. I relish the experience and wisdom that age has provided me.
>
> I am confident that I can achieve whatever I put my mind to. I refuse to believe the lie that my age limits me.
>
> As I look back on my life, I see all the things I have already achieved, and this gives me confidence that I can achieve new things as well.
$body$,
    2, 1
  ),
  (
    v_m2,
    'past-failure-means-future-failure',
    'Past Failure Means Future Failure',
    'Past failures are not predictions. They are reps.',
    'https://youtu.be/SW8tZ5Cfe50',
    $body$
If you have ever tried and failed in the past, it is easy to assume past failure means future failure. That past outcomes guarantee future outcomes. That you are doomed to fail at whatever you attempt.

You may be tempted to think, "I always fail at this so why should this time be any different? I am just a failure overall."

**Your limiting belief is that your past failure means future failure.** You assume that the past governs the future. That if something did not work before, it will not work next time.

## Rewriting the Limiting Belief

**Limiting belief:**
- "Past failure means future failure."

**Empowering beliefs:**
- "My past failures have no bearing on my future."
- "Past failures help me avoid future mistakes."
- "I've simply discovered a way that doesn't work."
- "Each failure brings me one step closer to success."

Your past failures have no bearing on your current attempts. Failing in the past does not mean you will fail next time. **In fact, failure in the past is an advantage.** You discovered one way that does not work, which means you can avoid that way moving forward.

Thomas Edison struggled for years to invent a working lightbulb. When asked how he kept going through so much "failure," he said, "I have not failed. I've just found 10,000 ways that won't work."

Adopt that posture. You have not failed in the past. You have discovered one particular way that does not work. That gets you one step closer to your success.

Or as Winston Churchill said, "Success consists of going from failure to failure without loss of enthusiasm."

If you want to succeed, understand that failure in the past has no bearing on your future. Every "failure" brings you one step closer.

## Action Steps

- Write down the ways you think you have "failed" in the past.
- For each one, identify how the failure actually brought you closer to success.
- Resolve that you will not let past failures keep you from pursuing what really matters to you.

## Affirmation

> I refuse to think that my past failures could ever cause me to fail now or in the future. Every past failure has actually brought me one step closer to success. I am closer to success now than I have ever been.
>
> I refuse to let my past failures keep me from pursuing what really matters to me.
>
> I am committed to my success, regardless of the past.
$body$,
    3, 2
  ),
  (
    v_m2,
    'my-past-will-always-negatively-influence-my-future',
    'My Past Will Always Negatively Influence My Future',
    'Your past does not write your future. You do.',
    'https://youtu.be/jqJ9BCbxEuM',
    $body$
This belief is closely related to the last one and just as pernicious. It is the assumption that past events will influence future events in a negative way. That your past actions hold too much sway over your future.

Maybe you have made mistakes you are convinced will keep you from succeeding. Maybe you have tried things that did not work. Maybe you do not have a good track record in a particular area.

**Your limiting belief is that your past holds sway over your future.** You believe past actions restrict future options, or that past efforts will hamper future efforts. So you do not try anything new. You feel like your past is holding you back, keeping you from your true potential, standing in the way of your success.

## Rewriting the Limiting Belief

**Limiting belief:**
- "My past will always keep me from creating a bright future."

**Empowering beliefs:**
- "My past can't determine what I achieve in the future."
- "My past is one of my greatest assets."
- "Lessons from the past make me wiser."
- "I can avoid mistakes in the future by looking to the past."
- "I can learn from my past and adapt and change."

Your past actions have no determinative power over your future. This is not to say the past does not matter. **But it cannot decide what you will or will not achieve.**

Failure in the past does not automatically mean failure in the future. Struggle in the past does not automatically mean struggle in the future. Your past is one of your greatest assets. Lessons from the past make you wiser. You have more knowledge, more skill, more experience. You can avoid the mistakes you already paid for and succeed faster.

**In some ways, the past does influence the future, and it can influence the future for the better.** Your past lets you adapt, change, and become more effective.

## Action Steps

- Identify any areas of your past that you feel will negatively influence your future.
- Ask yourself: "How will these elements of my past actually *help* me as I move forward?"
- Write down every advantage your past gives you.

## Affirmation

> My past does not determine my future. In fact, it gives me great advantages. I alone determine my future.
>
> I adapt, change, and evolve in positive ways because of my past. I am becoming a wiser person, and I know that the future holds many good things for me.
>
> I am grateful for the lessons of my past. I am ready to move on toward the future that awaits me.
$body$,
    4, 3
  );

  -- =================================================================
  -- Module 3: What You Have, What You Compare
  -- =================================================================
  insert into public.lessons
    (module_id, slug, title, description, video_url, body_content, sort_order, unlock_day)
  values (
    v_m3,
    'my-resources-are-limited',
    'My Resources Are Limited',
    'There is more than enough. Start asking.',
    'https://youtu.be/aR59A9q7tOE',
    $body$
This mentality assumes there are only a limited number of resources and options in the world. **It operates out of a scarcity mindset:** the belief that there are only so many resources and that most have been taken by others.

You assume there are not enough resources for you to do what you want to do. You think, "I don't have enough time, money, or connections to achieve what I want to achieve."

**Because you assume that you don't have enough, you fail to take action.** Instead of moving forward, you spin your wheels. You think that to take action you need more options at your disposal: more time, money, or help.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I don't have enough resources."

**Empowering beliefs:**
- "The universe is full of abundant resources."
- "There is more than enough to go around."
- "I can get whatever I need to accomplish my wildest dreams."
- "The universe has my back."
- "I create more of what I focus on."

**The reality is that we live in an abundant universe with more than enough for everyone.** There is no limit to the resources available if you start looking and open yourself to receive them.

**This mindset is called an abundance mindset.** Instead of believing there are very few resources available, you believe there is more than enough to go around. You can get whatever you need to accomplish your dreams. Instead of dreaming small and limited dreams, you dream big because you know that all you need is available.

You simply have to be open to it. Focus on what you want to receive. We create more of what we focus on. **Faith is the key.** You must believe the universe has your back.

## Action Steps

- Daily, repeat the affirmation: "The universe has my back and gives me everything I need to achieve my goals and dreams."
- Make a list of all the specific things you need to receive in order to achieve your biggest hopes and dreams.
- Stop focusing on what you do not have. Fix all your attention on what you want to receive.

## Affirmation

> The universe is abundant and has my back in every way. There is more than enough for me. Resources are plentiful.
>
> Everything I need to achieve my goals comes my way when I need it, and I open myself fully to receive it.
>
> I dream big, abundant dreams, knowing that big, abundant things are coming my way.
$body$,
    1, 4
  ),
  (
    v_m3,
    'lack-of-major-progress-means-failure',
    'Lack Of Major Progress Means Failure',
    'Small reps every day add up. Trust the process.',
    'https://youtu.be/1rvcl_L33XY',
    $body$
It is easy to criticize yourself for a lack of major progress on your goals. You feel that if you are not making significant progress every day, you are a failure. Maybe you have a list of goals that haunts you. A reminder of all you have not achieved.

Each day you feel like a failure. You feel like truly productive people make leaps and bounds of progress on a consistent basis.

**Your limiting belief is that lack of major progress means failure.** You constantly criticize and berate yourself for not achieving more. There are days when you are frustrated enough to give up.

## Rewriting the Limiting Belief

**Limiting belief:**
- "Lack of major progress means failure."

**Empowering beliefs:**
- "Small progress equals a big win."
- "Small successes add up to big progress over time."
- "I celebrate my victories no matter what size they are."
- "Consistency is what matters most."

To rewrite this belief, you must understand that even the smallest progress on your goals is a big win. **Small bits of progress on a consistent basis add up to big successes over time.** You may not be making huge amounts of progress on a daily basis, *and that is okay.*

**Your new belief becomes: "Any progress is a win."** Did you take one small step today? That is a win. Even if you only do one thing per day or per week toward your goals, that is progress and should be celebrated.

Stop judging your success by whether you are making big jumps forward. Judge it by your consistency.

If you are having trouble being consistent, go back to lesson one. Slay your most important task first thing each day, even if it is just a small piece.

## Action Steps

- Break your big goals into very small, manageable pieces.
- Each day, get one small element of your goal done.
- Stop evaluating how much progress you are making. Trust the process of doing one small thing every day.

## Affirmation

> I am making progress on my goals, even if that progress seems small.
>
> I celebrate my small wins, knowing that each small win brings me one step closer to my overall goal.
>
> I refuse to criticize myself for what I perceive as a lack of progress. I focus on the small steps forward I am taking, because each small step is a victory.
$body$,
    2, 5
  ),
  (
    v_m3,
    'i-compare-myself-to-others',
    'I Compare Myself To Others',
    'What others achieve does not measure your worth.',
    'https://youtu.be/ZFFbu7mH1yU',
    $body$
It is incredibly easy and common to compare yourself to others. You look at someone else's success and compare it to yours. You judge yourself by what others are achieving.

**If someone else seems to be accomplishing more than you, you feel like a failure.** You feel like you should be accomplishing at least as much, if not more. You feel terrible about yourself. As if you do not have much to offer the world.

Theodore Roosevelt famously said, "Comparison is the thief of joy." When you compare yourself to others, you let their achievements determine how much joy you experience.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I compare myself to others."

**Empowering beliefs:**
- "The achievements of others don't determine my value."
- "I am valuable simply because of who I am."
- "I refuse to compare myself to others."
- "What matters most is what I achieve, not what others achieve."
- "I am more than my accomplishments."

**The achievements of others simply do not matter for you.** It is not that they are not important. They just do not determine your worth, success, or value.

**You are valuable simply because of who you are. You are inherently valuable and worthy.** Your wins should be celebrated, not compared. It does not matter how much someone else succeeds. What matters is what you achieve.

**Your new belief is: "I am worthy, and I refuse to compare myself to others. Whether I achieve a lot or a little, I am still valuable and worthy."**

In a performance-driven culture, it is easy to believe we are nothing more than our accomplishments. Nothing could be further from the truth. Your value comes from who you are.

## Action Steps

- Regularly remind yourself that your value is not tied to your achievements.
- Daily, affirm that you are enough and that you are worthy.
- Refuse to compare yourself to others.

## Affirmation

> My value is not tied to my achievements. I am valuable and worthy because of who I am.
>
> Whether I achieve a lot or a little, I am still enough. I refuse to compare myself to others. The achievements of others have no bearing on my value.
>
> I celebrate my successes without worrying about the accomplishments of others.
>
> I. Am. Enough.
$body$,
    3, 6
  );

  -- =================================================================
  -- Module 4: Who You Think You Are
  -- =================================================================
  insert into public.lessons
    (module_id, slug, title, description, video_url, body_content, sort_order, unlock_day)
  values (
    v_m4,
    'i-am-not-responsible-for-my-current-situation',
    'I Am Not Responsible For My Current Situation',
    'Take ownership. That is the only door out.',
    'https://youtu.be/PGoFkNzaOIY',
    $body$
It is easy to play the blame game. To believe someone else is responsible for your situation. To assume your circumstances are the products of other people's actions.

**When you do not hold yourself responsible for your current circumstances, you stay stuck in those circumstances.** If you did not create them, surely you cannot be responsible for changing them. So you do not move forward. You think, "I can't believe they put me in this position. This is not my fault. I am not responsible for where I am."

**Your limiting belief is that you are not responsible for where you currently are in life.**

**This belief lets you play the victim.** When something goes wrong, you blame others and the circumstances they put you in. You refuse to take ownership of your situation.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I'm not responsible for where I am in life."

**Empowering beliefs:**
- "I am 100% responsible for my life."
- "I take ownership of all my circumstances."
- "I refuse to play the victim game."
- "I can create whatever circumstances I want."
- "I am in complete charge of my life and determine what it looks like."

If you are going to make forward progress, it is essential that you take 100% responsibility for the circumstances you find yourself in. Yes, other people play a role. But ultimately, you are responsible for what you accept and what you refuse.

If you find yourself in a particular set of circumstances, it is because you accepted them. You decided you were okay with them. You did not make significant efforts to change them.

**Your new belief is: "I am 100% responsible for every area of my life."**

This is actually an incredibly freeing belief. **Once you realize you created your current circumstances, you can change them.** You can take the actions necessary to change your life. You do not have to stay stuck. You do not have to play the victim. You are in charge of your life, and you can shape it.

## Action Steps

- Write down any circumstances you are unhappy about.
- Take 100% ownership of those circumstances, even if others played a part.
- Identify specific action steps you must take to change them.
- Daily affirm that you are completely in control of your life.

## Affirmation

> I am the captain of my fate. I am responsible for everything positive and negative that comes into my life.
>
> I take 100% ownership for the current state of my life. I do what is necessary to create the life I desire.
>
> I refuse to play the victim of circumstances beyond my control or to feel that I am at the mercy of others. I take action. This is my life and I can build it how I please.
$body$,
    1, 7
  ),
  (
    v_m4,
    'i-dont-deserve-success',
    'I Don''t Deserve Success',
    'You are worthy. Stop arguing with that.',
    'https://youtu.be/VP8tgFvTz0U',
    $body$
With this limiting belief, no matter how much progress you make, you always fall short. Deep down, for whatever reason, you do not believe you deserve success. You feel you are not good enough, smart enough, or lovable enough to be worthy of it.

**This is a very devious, insidious limiting belief.** You believe others are worthy of success, but when you look at your own life, you refuse to believe you should experience it.

**This can lead to self-sabotage.** When you start to get close to success, you begin to do things that limit you. Maybe you are even afraid of succeeding. The closer you get, the more scared you get.

**Your limiting belief is that you are unworthy of success.** This seriously limits the progress you can make. You cannot achieve big things if you do not think you deserve them. You will not have the motivation to keep going if you feel unworthy. You absolutely must rewrite this belief.

## Rewriting the Belief

**Limiting belief:**
- "I am unworthy of success."

**Empowering beliefs:**
- "I am inherently worthy of success."
- "I am valuable simply because of who I am."
- "I deserve success and all the benefits that come with it."

Ask yourself this question: **Who is worthy of success?** The answer is everyone, including you. There is no reason you should not experience it.

Remember, **you are worthy and valuable simply because of who you are.** You do not have to do anything to make yourself worthy. You are worthy of succeeding because you are you.

**Your new belief becomes: "I am worthy of all the success in the world."** No matter what anyone has told you, you deserve success and all the benefits that come with it. You deserve to achieve big things and make your dreams come true. If you work hard, you are worthy of the reward.

## Action Steps

- Write down every reason you think you are *not* worthy of success.
- Cross out all those reasons.
- Replace that list with a list of reasons you truly *are* worthy of success.
- Review that list every day.

## Affirmation

> I am worthy of all the success in the world.
>
> Regardless of what anyone has said to me, regardless of what I have thought in the past, I choose now to believe that I am worthy of success.
>
> I deserve to achieve all my biggest dreams and accomplish my most worthy goals. I refuse to think small, unworthy thoughts about myself. I embrace my greatness, knowing that I am worthy simply because of who I am.
$body$,
    2, 8
  ),
  (
    v_m4,
    'i-worry-about-what-others-think-about-me',
    'I Worry About What Others Think About Me',
    'Their opinion is not the one that matters.',
    'https://youtu.be/sQjHvstUkn0',
    $body$
This is one of the most common limiting beliefs. You worry, and even obsess, over what others think about you.

You worry that if you are too successful, people will think you are stuck up. You worry that if you are not successful enough, people will look down on you. If you stand up for yourself, you worry people will think you are too assertive. If you try to be a peacemaker, you worry you will come across as a doormat.

Worrying about what others think can be incredibly consuming. **It saps your time, energy, and joy.** It keeps you from being productive and often causes you to second-guess yourself.

**Your limiting belief is that if you do (or do not do) certain actions, others will think less of you.** If unchecked, it can become an obsession. It can keep you from pursuing your dreams. The fear of what others think can be like a great weight hanging around your neck.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I worry about what others will think about me."

**Empowering beliefs:**
- "What others think of me doesn't matter."
- "What truly matters is what I think of myself."
- "My opinion of myself is the one that counts."
- "I am secure in who I am."
- "I avoid striving to make everyone happy."

**The key is to realize that what others think of you simply does not matter.** In the long run, does it matter if others think more or less of you? No.

**What truly matters is what you think of yourself.** Your opinion of yourself is the one that counts. And you are worthy and valuable. That is the opinion you should have. Do not let the opinions of others drag you down. Their opinions hold no weight compared to your own.

**Your new belief is that the opinions of others do not affect you one way or the other.** You are free from caring what others think. You are secure in yourself. You no longer strive to make everyone happy. You focus on making yourself happy and pursuing your dreams.

## Action Steps

- Regularly look in the mirror and say, "I don't have to make everyone else happy. My opinion of myself is all that matters."
- Create a list titled "People I Must Please" at the top. Leave it blank.

## Affirmation

> I refuse to play the people-pleasing game. The opinions of others have no sway over me. My opinion of myself is all that matters.
>
> I strive to achieve my dreams and accomplish my goals without worrying what others think about me.
>
> I choose to believe the best about myself at all times. I refuse to let the opinions of others drag me down or pull me off course.
$body$,
    3, 9
  ),
  (
    v_m4,
    'i-dont-give-myself-the-love-i-give-others',
    'I Don''t Give Myself The Love, Compassion, And Understanding I Give To Others',
    'Treat yourself the way you treat others.',
    'https://youtu.be/syHslclby9A',
    $body$
You are a compassionate, kind, and loving person. When someone makes a mistake, you are gracious. You are patient with others. You give them grace.

**But you do not treat yourself the same way.**

For some reason, you do not believe you deserve the same compassion and understanding you give to others. Maybe you were told from a young age that you needed to be perfect. Maybe you absorbed the idea that you should not make the same mistakes others make.

Whatever the case, you are hard on yourself.

**Your limiting belief is that you should be perfect, and if you are not perfect you need to punish yourself.**

When you make a mistake, you berate yourself endlessly. You are not gracious toward yourself. You do not love yourself very much. You hold yourself to an impossible standard.

**This belief makes you feel like you are never enough.** Like you are never worthy, never acceptable, never doing enough. It is a very unhappy place to live.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I don't give myself the love, compassion, and understanding I give to others."

**Empowering beliefs:**
- "I'm human and it's okay to make mistakes."
- "I deserve the same grace, compassion, and understanding that I give to others."
- "I am patient and loving toward myself."
- "I treat myself the same way that I treat others."

You are human. You make mistakes, and that is okay. You have off days. There are times when you are not as productive, and there is nothing wrong with that.

In other words, you are not perfect, and you are not supposed to be.

**Your new belief is that you deserve the same grace, compassion, love, and patience that you extend to others.** You are patient with others. Be patient with yourself. You are loving toward others. Be loving toward yourself. You have compassion for others. Have compassion for yourself.

Stop being so hard on yourself. You are human. You deserve kind treatment, especially from yourself.

## Action Steps

- Next time you are being hard on yourself, ask: "How would I treat someone else who is in my shoes?"
- Extend that same loving, gracious treatment toward yourself.
- Apply the Golden Rule to yourself.

## Affirmation

> I am human, just like everyone else. It is okay for me to struggle and make mistakes. When that happens, I deserve the same compassion and grace that I give to others.
>
> I refuse to hold myself to a standard I do not hold others to. I love myself, even when things turn out imperfectly.
>
> I treat myself as I treat others, with love, compassion, and patience.
$body$,
    4, 10
  );

  -- =================================================================
  -- Module 5: Get Moving
  -- =================================================================
  insert into public.lessons
    (module_id, slug, title, description, video_url, body_content, sort_order, unlock_day)
  values (
    v_m5,
    'i-can-do-everything-myself',
    'I Can Do Everything Myself',
    'Asking for help is not weakness. It is multiplication.',
    'https://youtu.be/NMcpSAPav70',
    $body$
In our culture, it is easy to feel like you have to do everything yourself. To feel like you cannot ask for help. To feel like asking for help is a sign of weakness. If you are especially competent, maybe you can do many things without the help of others.

So you never ask for assistance. You try to do everything on your own, thinking that getting by alone is a sign of strength.

In reality, the inability to ask for help is the weakness. None of us can do everything alone. We all have limitations, blind spots, areas where we are weak.

**Your limiting belief is that you can do everything yourself without any help.**

We need other people. Refusing to ask for help keeps you from accomplishing as much as you could. **If you teamed up with others, your combined strengths would let you achieve far more than you could alone.**

## Rewriting the Limiting Belief

**Limiting belief:**
- "I can do everything without help."

**Empowering beliefs:**
- "I can benefit from the help and assistance of others."
- "Others have strengths and talents that I don't have."
- "I can better reach my full potential with the help of others."
- "I can't do everything by myself."

You may be able to accomplish a lot. But others have strengths and gifts you do not have. You can tap into those.

The more you tap into the strengths of others, the more you get done and the closer you get to actually achieving your goals. If you try to do everything alone, you simply will not get as far.

**Your new belief is that you need the help of others in order to reach your true potential.**

Do not try to be a Lone Ranger. You have potential, but you need others to fully realize it. Ask for help. Use the gifts of others.

## Action Steps

- Write down the names of five people you work closely with.
- For each person, write down their unique strengths.
- Seek out at least one person on your list to help you with a current project or task.

## Affirmation

> I am skilled, talented, and capable. I also need the help and assistance of others. They supplement my talents so that, together, we can excel at any task and even get the job done quicker than I could on my own.
>
> I seek out others to help me at each step of my journey. I avoid trying to do everything myself. I depend on other people to help me reach my full potential.
$body$,
    1, 11
  ),
  (
    v_m5,
    'im-not-smart-enough',
    'I''m Not Smart Enough',
    'Your brain is a sponge. Stop selling yourself short.',
    'https://youtu.be/RxxYj4q5T9A',
    $body$
This belief has the power to keep you from trying many new things. You feel like you are not smart enough to achieve a particular task or goal. Like you do not have the necessary intelligence to accomplish what you really want. Like you are missing the knowledge to get something done.

Maybe this belief was instilled by an unkind adult when you were young. Maybe you struggled with school which made you assume you were just not smart. Maybe you heard your parents say it about themselves.

**Your limiting belief is that you are not smart enough to do what you really want to do.**

This belief can keep you from even trying. You can feel so intimidated at the thought of learning something new that you will not even start. You feel like your supposed lack of knowledge is a handicap.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I'm not smart enough."

**Empowering beliefs:**
- "I've accomplished so much already in my life."
- "If I wasn't smart, I wouldn't have gotten this far in life."
- "I have an incredible ability to learn."
- "I can do anything I set my mind to."

This belief is false on so many levels. **First and foremost, you are much smarter than you realize.** Think of all you have already accomplished. If you were not smart, you would not have made it this far. Your past wins prove you are smarter than you give yourself credit for.

**Second, you have an incredible ability to learn.** Consider all the things you have learned to do over your life. Your brain is a sponge. You can learn almost anything you set your mind to. Even if you do not currently have the knowledge, that does not mean you cannot acquire it.

**Your new belief is that you are incredibly smart and able to learn anything you set your mind to.** This changes the way you approach new tasks. Instead of fearing the learning, you anticipate the challenge. Instead of doubting yourself, you are confident.

## Action Steps

- Make a big list of things you have accomplished in your life. Include little ones (learning to ride a bike) and big ones (your current job).
- Any time you doubt your intelligence, go back to that list. Remind yourself how smart you really are.

## Affirmation

> I am highly intelligent and accomplished. I have already achieved many things in my life, which proves my intelligence.
>
> Whenever I need a clearer understanding of something, I quickly learn it, grasping all the nuances of the subject.
>
> I refuse to doubt my intelligence. I am smart enough. I am naturally smart and able to accomplish anything I set my mind to.
$body$,
    2, 12
  ),
  (
    v_m5,
    'im-not-ready-to-start',
    'I''m Not Ready To Start',
    'Done is the standard. Perfect is the trap.',
    'https://youtu.be/OJjbZgoBc-Y',
    $body$
You have something big and exciting that you want to do. But you do not feel ready to launch. You do not feel like you have enough of the pieces in place. So you wait. And wait. And wait.

You keep trying to get everything just perfect.

With this mentality, you will never actually get started. If you wait until everything is perfect, you will never launch. Because nothing will ever be perfect. You will never get every single duck in a row. You will never be fully ready.

The reality is that, eventually, you just have to get going.

**Your limiting belief is that you are not ready to start until everything is perfect.**

This belief keeps you from achieving what you could achieve. Instead of starting and adjusting as needed, you never start. Your ideas never make it out of the idea stage. You do not take action.

## Rewriting the Limiting Belief

**Limiting belief:**
- "I'm not ready to start."

**Empowering beliefs:**
- **"Progress matters more than perfection."**
- "I can always make changes as I go."
- "If I wait until everything is perfect, I'll never get started."
- "I should start sooner rather than later."
- "I can't wait around for my dreams to come true."

**Progress matters more than perfection.** Getting started matters more than getting everything perfect. There comes a time when you simply have to hit the Go button.

Once you start, you can make corrections. You can adjust as needed. But if you wait until you feel perfectly ready, you will never launch. If you wait until everything is just so, your dreams will die before they ever see the light of day.

**Your new belief is that you will start now and make changes as necessary.** It is better to start and make mistakes than to never start. You can fix things along the way.

You absolutely must not wait until the time is "perfect." There will never be a perfect time.

## Action Steps

- Make a list of the *minimum* number of things necessary to launch your idea.
- Each day, work on one of those things.
- Once the list is done, launch.
- Make corrections as time goes on.

## Affirmation

> I get started now. I refuse to wait until all things are perfect. I do my best to get things in order, but I refuse to believe the lie that everything can be perfect. Nothing can be perfect.
>
> So instead of waiting, I take action.
>
> I get started and then make corrections as necessary. Fear and perfectionism do not have the power to hold me back. I move forward with confidence to achieve my dreams and create the life I desire.
$body$,
    3, 13
  );

  -- =================================================================
  -- Module 6: The Final Word
  -- =================================================================
  insert into public.lessons
    (module_id, slug, title, description, video_url, body_content, sort_order, unlock_day)
  values (
    v_m6,
    'summary-and-reflection',
    'Summary And Reflection',
    'What you took. What you take next.',
    'https://youtu.be/4ZYHJrHHWwI',
    $body$
Limiting beliefs are beliefs you hold consciously or subconsciously that keep you from achieving your goals and creating the good life you deserve.

You discovered many of the most common ones. Beliefs that may have been keeping you stuck in routines of frustration, worry, and despair. You learned techniques to conquer them and instill new, positive beliefs in their place.

## The Limiting Beliefs You Crushed

1. I don't have enough time.
2. I'm too old to start something new.
3. Past failure means future failure.
4. My past will always negatively influence my future.
5. My resources are limited.
6. Lack of major progress means failure.
7. I compare myself to others.
8. I am not responsible for my current situation.
9. I don't deserve success.
10. I worry about what others think about me.
11. I don't give myself the love, compassion, and understanding I give to others.
12. I can do everything myself.
13. I'm not smart enough.
14. I'm not ready to start.

The same strategies you used here apply to any other limiting beliefs you find stopping you.

**For best results, focus on changing only one or two at a time.**

## Self-Reflection

Use these questions to lock in what you learned and to push you toward your goals.

- How are limiting beliefs affecting your life right now?
- Which limiting beliefs have the most negative impact on you?
- Can you think of additional beliefs that may be stopping you? For each one, write a new, empowering belief that you can replace it with.
- Choose one limiting belief to focus on changing immediately and take action today to start replacing it. Affirm this new belief in writing. Keep your affirmation where you can see it. Repeat it throughout each day.

## Go Forth And Conquer

You now know how to overcome some of the most powerful limiting beliefs that hold you back. You have a firm strategy in place for identifying them and replacing them with empowering beliefs.

**Most people are unaware of these limiting beliefs. You are not most people.** You will no longer be held captive by them. You will no longer let them keep you from your full potential. You have the truth, and the truth will set you free.

**Start crushing your limiting beliefs today.** Do not let them hold you back any longer. They keep you from being the man you were meant to be. They keep you from accomplishing all the things you could accomplish.

Conquer them. You will be glad you did.
$body$,
    1, 14
  );

end $$;
