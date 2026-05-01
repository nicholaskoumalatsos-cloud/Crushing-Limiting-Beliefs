import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { EdgeFunctionError, redeemMagicLink } from '@/lib/edgeFunctions'
import { logger } from '@/lib/logger'

type Phase =
  | { kind: 'idle' }
  | { kind: 'redeeming' }
  | { kind: 'verifying' }
  | { kind: 'done' }
  | { kind: 'error'; code: string }

export function Start() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const ranOnce = useRef(false)

  useEffect(() => {
    if (ranOnce.current) return
    ranOnce.current = true

    const token = params.get('token')?.trim()
    if (!token) {
      setPhase({ kind: 'error', code: 'missing_token' })
      return
    }

    let cancelled = false

    async function run(t: string) {
      setPhase({ kind: 'redeeming' })
      try {
        const { token_hash } = await redeemMagicLink(t)
        if (cancelled) return

        setPhase({ kind: 'verifying' })
        const { error } = await supabase.auth.verifyOtp({
          type: 'magiclink',
          token_hash,
        })
        if (cancelled) return
        if (error) {
          logger.error('verifyOtp failed', error)
          setPhase({ kind: 'error', code: 'verify_failed' })
          return
        }

        setPhase({ kind: 'done' })
        navigate('/dashboard', { replace: true })
      } catch (err) {
        if (cancelled) return
        const code = err instanceof EdgeFunctionError ? err.message : 'network_error'
        logger.error('redeem failed', err)
        setPhase({ kind: 'error', code })
      }
    }

    void run(token)

    return () => {
      cancelled = true
    }
  }, [params, navigate])

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {phase.kind === 'idle' && <Loading label="Preparing" />}
        {phase.kind === 'redeeming' && <Loading label="Verifying your link" />}
        {phase.kind === 'verifying' && <Loading label="Authenticating" />}
        {phase.kind === 'done' && <Loading label="Taking you in" />}
        {phase.kind === 'error' && <ErrorView code={phase.code} />}
      </div>
    </main>
  )
}

function Loading({ label }: { label: string }) {
  return (
    <div>
      <p className="text-accent text-xs tracking-widest uppercase mb-6">
        Crushing Limiting Beliefs
      </p>
      <h1 className="text-3xl mb-8">{label}</h1>
      <div className="flex justify-center" aria-hidden="true">
        <span className="block h-1 w-32 bg-ink-800 overflow-hidden">
          <span className="block h-full w-1/2 bg-accent animate-pulse" />
        </span>
      </div>
      <p className="sr-only">Loading.</p>
    </div>
  )
}

const ERROR_COPY: Record<string, { title: string; body: string }> = {
  missing_token: {
    title: 'No link found.',
    body: 'This page only works from the link in your welcome email. Open that email and click through.',
  },
  invalid_token: {
    title: 'This link is no good.',
    body: 'The token in your URL looks malformed. Open the most recent welcome email and click that link instead.',
  },
  token_invalid_or_expired: {
    title: 'This link is no good.',
    body: 'It was already used, or it expired. Each link works once and lasts seven days.',
  },
  verify_failed: {
    title: 'Could not authenticate.',
    body: 'Something went wrong creating your session. Try again, or request a fresh link.',
  },
  network_error: {
    title: 'Connection problem.',
    body: 'Could not reach the server. Check your connection and reload.',
  },
}

function ErrorView({ code }: { code: string }) {
  const copy = ERROR_COPY[code] ?? {
    title: 'Something went wrong.',
    body: 'Try requesting a fresh link from your welcome email.',
  }
  return (
    <div>
      <p className="text-accent text-xs tracking-widest uppercase mb-6">Error</p>
      <h1 className="text-3xl mb-4">{copy.title}</h1>
      <p className="text-bone-muted mb-8 leading-relaxed">{copy.body}</p>
      <p className="text-bone-muted text-sm">
        Need a new link? Open the welcome email or{' '}
        <a
          href="https://shop.nickkoumalatsos.com/pages/crushing-limiting-beliefs"
          className="text-accent hover:underline"
        >
          submit the form again
        </a>
        .
      </p>
    </div>
  )
}
