import { useMemo, useState } from 'react'
import { CheckIcon } from '@/components/icons'

type Letter = 'A' | 'B' | 'C' | 'D'

interface Option {
  letter: Letter
  text: string
}

interface Question {
  q: string
  options: Option[]
  answer: Letter
}

const QUESTIONS: Question[] = [
  {
    q: 'Limiting beliefs can be:',
    options: [
      { letter: 'A', text: 'Insidious and pervasive, wreaking havoc in every area of your life' },
      { letter: 'B', text: 'Conscious beliefs' },
      { letter: 'C', text: 'Subconscious beliefs' },
      { letter: 'D', text: 'All of the above' },
    ],
    answer: 'D',
  },
  {
    q: 'We all have limiting beliefs.',
    options: [
      { letter: 'A', text: 'True' },
      { letter: 'B', text: 'False' },
    ],
    answer: 'A',
  },
  {
    q: 'Where do limiting beliefs come from?',
    options: [
      { letter: 'A', text: 'Observations, processed in our mind from our own perspective' },
      { letter: 'B', text: 'Experiences' },
      { letter: 'C', text: 'Input from family, friends, and acquaintances, often from childhood and the way you were raised' },
      { letter: 'D', text: 'All of the above' },
    ],
    answer: 'D',
  },
  {
    q: 'How can you keep a limiting belief from negatively affecting you?',
    options: [
      { letter: 'A', text: 'Ignore it.' },
      { letter: 'B', text: 'Worry about it.' },
      { letter: 'C', text: 'Transform it into a new, empowering belief.' },
      { letter: 'D', text: 'There is nothing you can do about it.' },
    ],
    answer: 'C',
  },
  {
    q: 'If you believe that you are too old to start something new, which of the beliefs below can empower you to change the negative belief?',
    options: [
      { letter: 'A', text: 'My age gives me wisdom.' },
      { letter: 'B', text: 'My experience can give me an advantage with new projects.' },
      { letter: 'C', text: 'Both A and B' },
      { letter: 'D', text: 'There is nothing you can do. Any successful project needs to be started at a young age.' },
    ],
    answer: 'C',
  },
  {
    q: 'Which belief helps you change a scarcity mindset into an abundance mindset?',
    options: [
      { letter: 'A', text: 'Every resource I need is available to me.' },
      { letter: 'B', text: 'My resources are limited.' },
      { letter: 'C', text: 'There is only so much to go around, so I better get my share while I can.' },
      { letter: 'D', text: 'I do not have the money, time, or contacts to create a joyful life.' },
    ],
    answer: 'A',
  },
  {
    q: 'Which belief below is an empowering belief?',
    options: [
      { letter: 'A', text: 'As soon as I get a raise, others will think more highly of me.' },
      { letter: 'B', text: 'I am enough.' },
      { letter: 'C', text: 'I can impress the neighbors with this new car.' },
      { letter: 'D', text: 'If only I were better looking, I could get more dates.' },
    ],
    answer: 'B',
  },
  {
    q: 'Which results are you most likely to experience if you believe that you do not deserve success?',
    options: [
      { letter: 'A', text: 'Achieving goals quickly, before others find out that you are unworthy' },
      { letter: 'B', text: 'Joyful relationships' },
      { letter: 'C', text: 'Lots of pets' },
      { letter: 'D', text: 'Self-sabotage, so that you usually fall short of your goal' },
    ],
    answer: 'D',
  },
  {
    q: 'Consider this belief: "I can do everything myself." Which option below is true?',
    options: [
      { letter: 'A', text: 'This belief is a strength. Asking for help just shows how weak you are.' },
      { letter: 'B', text: 'If you want something done right, you have to do it yourself.' },
      { letter: 'C', text: 'This belief is a weakness and limits you.' },
      { letter: 'D', text: 'If you accept the assistance of others in reaching your goal, then you did not really achieve your goal at all.' },
    ],
    answer: 'C',
  },
  {
    q: 'You can change your beliefs.',
    options: [
      { letter: 'A', text: 'True' },
      { letter: 'B', text: 'False' },
    ],
    answer: 'A',
  },
]

function scoreCopy(score: number, total: number): string {
  const pct = score / total
  if (score === total) return 'Perfect. Now let us see if you can apply it.'
  if (pct >= 0.8) return 'Solid. Now let us go to work.'
  if (pct >= 0.5) return 'Halfway. The course will tighten the rest.'
  return 'That is exactly why this course exists. Let us go.'
}

export function Quiz() {
  const [answers, setAnswers] = useState<Record<number, Letter>>({})
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = Object.keys(answers).length === QUESTIONS.length
  const score = useMemo(
    () => QUESTIONS.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0),
    [answers],
  )

  function pick(qIdx: number, letter: Letter) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qIdx]: letter }))
  }

  function submit() {
    if (!allAnswered) return
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="not-prose">
      {submitted && (
        <div className="mb-12 border-l-4 border-accent bg-ink-900 px-6 py-8 md:px-10 md:py-10">
          <p className="font-display text-accent text-xs tracking-widest uppercase mb-3">
            Score
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-4 leading-tight">
            {score} of {QUESTIONS.length}
          </h2>
          <p className="text-bone text-base md:text-lg leading-relaxed">
            {scoreCopy(score, QUESTIONS.length)}
          </p>
        </div>
      )}

      <ol className="space-y-10">
        {QUESTIONS.map((q, i) => {
          const userPick = answers[i]
          return (
            <li key={i}>
              <p className="font-display text-bone-muted text-xs tracking-widest uppercase mb-2">
                Question {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display text-xl md:text-2xl tracking-wider uppercase mb-5 leading-snug">
                {q.q}
              </h3>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isPicked = userPick === opt.letter
                  const isCorrect = opt.letter === q.answer
                  let stateClass =
                    'border-ink-800 bg-ink-900 hover:border-ink-700 hover:bg-ink-800'
                  if (submitted) {
                    if (isCorrect) {
                      stateClass = 'border-accent bg-accent/10'
                    } else if (isPicked) {
                      stateClass = 'border-ink-700 bg-ink-900 opacity-50 line-through'
                    } else {
                      stateClass = 'border-ink-800 bg-ink-900 opacity-40'
                    }
                  } else if (isPicked) {
                    stateClass = 'border-accent bg-ink-800'
                  }
                  return (
                    <button
                      key={opt.letter}
                      type="button"
                      onClick={() => pick(i, opt.letter)}
                      disabled={submitted}
                      className={`w-full text-left flex items-start gap-4 px-5 py-4 border transition-colors ${stateClass} ${
                        submitted ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <span className="font-display text-bone-muted text-sm tracking-widest uppercase mt-0.5 w-5 flex-shrink-0">
                        {opt.letter}
                      </span>
                      <span className="text-bone text-sm md:text-base leading-relaxed flex-1">
                        {opt.text}
                      </span>
                      {submitted && isCorrect && (
                        <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  )
                })}
              </div>
              {submitted && userPick !== q.answer && (
                <p className="font-display text-accent/80 text-xs tracking-widest uppercase mt-3">
                  Correct answer: {q.answer}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-12 pt-10 border-t border-ink-800 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        {!submitted ? (
          <>
            <button
              type="button"
              onClick={submit}
              disabled={!allAnswered}
              className="btn-primary"
            >
              Submit answers
            </button>
            <p className="font-display text-bone-muted text-xs tracking-widest uppercase">
              {Object.keys(answers).length} of {QUESTIONS.length} answered
            </p>
          </>
        ) : (
          <button type="button" onClick={reset} className="btn-ghost">
            Take it again
          </button>
        )}
      </div>
    </section>
  )
}
