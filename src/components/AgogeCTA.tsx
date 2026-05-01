import { env } from '@/lib/env'

interface AgogeCTAProps {
  headline?: string
  body?: string
  buttonText?: string
  buttonHref?: string
}

const DEFAULT_HEADLINE = 'Ready to do this work alongside other men?'
const DEFAULT_BODY =
  'The Agoge is where boys become men. Twelve months. Real brothers. No spectators.'
const DEFAULT_BUTTON = 'Apply now'

export function AgogeCTA({
  headline = DEFAULT_HEADLINE,
  body = DEFAULT_BODY,
  buttonText = DEFAULT_BUTTON,
  buttonHref = env.agogeApplyUrl,
}: AgogeCTAProps) {
  return (
    <aside className="my-12 border border-accent/40 bg-ink-900 px-6 py-8 md:px-10 md:py-10">
      <p className="font-display text-accent text-xs tracking-widest uppercase mb-4">
        The Agoge
      </p>
      <h3 className="font-display text-2xl md:text-3xl tracking-wider uppercase mb-4 leading-tight">
        {headline}
      </h3>
      <p className="text-bone-muted text-base md:text-lg leading-relaxed mb-6 max-w-xl">
        {body}
      </p>
      <a
        href={buttonHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        {buttonText}
      </a>
    </aside>
  )
}
