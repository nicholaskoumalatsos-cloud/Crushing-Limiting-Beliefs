import { useLocation } from 'react-router-dom'
import { env } from '@/lib/env'

interface CTAVariant {
  headline: string
  body: string
  buttonText: string
}

const VARIANTS: CTAVariant[] = [
  {
    headline: 'Reading is not the work.',
    body: 'The Agoge is. Twelve months of guided reps inside a brotherhood that will not let you slip. No fluff. No spectators.',
    buttonText: 'Apply now',
  },
  {
    headline: 'Solo work has a ceiling.',
    body: 'The Agoge is what comes after. Twelve months, real brothers, accountability you cannot fake.',
    buttonText: 'Apply to The Agoge',
  },
  {
    headline: 'If this is landing, you already know.',
    body: 'The Agoge is twelve months of direct work alongside men who refuse to coast. Limited seats. Apply when you are done negotiating with yourself.',
    buttonText: 'Submit application',
  },
  {
    headline: 'The course shows you the door.',
    body: 'The Agoge walks through it with you. Twelve months, no exits, other men who showed up the same way.',
    buttonText: 'Apply now',
  },
  {
    headline: 'What men do shoulder to shoulder, they finish.',
    body: 'The Agoge is twelve months of that. Apply if you are tired of being the strongest man in the wrong room.',
    buttonText: 'Apply to The Agoge',
  },
  {
    headline: 'The body changes through reps. So does the man.',
    body: 'The Agoge is twelve months of structured reps inside a brotherhood. No app does this. No course does this. Men do.',
    buttonText: 'Apply now',
  },
  {
    headline: 'Stop reading about it.',
    body: 'The Agoge is a year inside a brotherhood that does the work in front of each other. Bring something to fight for.',
    buttonText: 'Apply to The Agoge',
  },
]

interface AgogeCTAProps {
  seed?: string
  headline?: string
  body?: string
  buttonText?: string
  buttonHref?: string
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function pickVariant(seed: string): CTAVariant {
  return VARIANTS[hashString(seed) % VARIANTS.length]
}

export function AgogeCTA({
  seed,
  headline,
  body,
  buttonText,
  buttonHref = env.agogeApplyUrl,
}: AgogeCTAProps) {
  const location = useLocation()
  const effectiveSeed = seed ?? location.pathname
  const variant = pickVariant(effectiveSeed)

  return (
    <aside className="not-prose my-14 relative bg-ink-900 border-l-4 border-accent px-6 py-10 md:px-12 md:py-12 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-px bg-ink-800"
      />
      <p className="font-display text-accent text-sm md:text-base tracking-widest uppercase mb-5">
        The Agoge
      </p>
      <h3 className="font-display text-3xl md:text-4xl tracking-wider uppercase mb-5 leading-[1.15]">
        {headline ?? variant.headline}
      </h3>
      <p className="text-bone text-base md:text-lg leading-relaxed mb-7 max-w-xl">
        {body ?? variant.body}
      </p>
      <a
        href={buttonHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        {buttonText ?? variant.buttonText}
      </a>
    </aside>
  )
}
