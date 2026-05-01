import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { EdgeFunctionError, generateMagicLink } from '@/lib/edgeFunctions'
import { logger } from '@/lib/logger'

const DEV_LOGIN_SECRET = (import.meta.env.VITE_DEV_LOGIN_SECRET ?? '').trim()
const DEV_LOGIN_ENABLED = DEV_LOGIN_SECRET.length > 0

export function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full text-center">
        <p className="font-display text-accent text-2xl md:text-3xl tracking-wider uppercase mb-10">
          Crushing Limiting Beliefs
        </p>
        <h1 className="text-4xl md:text-5xl mb-8 leading-tight">
          Use your email link.
        </h1>
        <p className="text-bone-muted text-lg leading-relaxed mb-8">
          This site has no passwords. Your access lives in the welcome email we sent
          when you signed up. Open that email and click the link, you are in.
        </p>
        <p className="text-bone-muted leading-relaxed">
          Cannot find it? Check your spam folder. Still nothing? Request a new link by{' '}
          <a
            className="text-accent hover:underline"
            href="https://shop.nickkoumalatsos.com/pages/crushing-limiting-beliefs"
          >
            re-submitting the form here
          </a>
          . A fresh link will arrive in a few minutes.
        </p>
        {DEV_LOGIN_ENABLED && <DevLogin secret={DEV_LOGIN_SECRET} />}
      </div>
    </main>
  )
}

function DevLogin({ secret }: { secret: string }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const cleaned = email.trim().toLowerCase()
    if (!cleaned) return
    setLoading(true)
    setError(null)
    try {
      const { magic_link } = await generateMagicLink({ email: cleaned }, secret)
      const url = new URL(magic_link)
      const token = url.searchParams.get('token')
      if (!token) throw new EdgeFunctionError('no_token_in_response', 0)
      const params = new URLSearchParams({ token, email: cleaned })
      navigate(`/start?${params.toString()}`, { replace: true })
    } catch (err) {
      const code = err instanceof EdgeFunctionError ? err.message : 'unknown_error'
      logger.error('dev login failed', err)
      setError(code)
      setLoading(false)
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-ink-800">
      <p className="font-display text-bone-muted text-sm md:text-base tracking-widest uppercase mb-4">
        Dev login
      </p>
      <p className="text-bone-muted text-sm mb-6">
        Bypasses Klaviyo. Generates a token, redeems it, lands you in. Visible
        only when VITE_DEV_LOGIN_SECRET is set.
      </p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 max-w-sm mx-auto"
        autoComplete="off"
      >
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="bg-ink-900 border border-ink-700 px-4 py-3 text-bone placeholder:text-bone-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        />
        <button type="submit" disabled={loading || !email.trim()} className="btn-primary">
          {loading ? 'Generating link' : 'Log me in'}
        </button>
        {error && (
          <p className="text-accent text-sm text-left">
            {errorCopy(error)}
          </p>
        )}
      </form>
    </div>
  )
}

function errorCopy(code: string): string {
  switch (code) {
    case 'unauthorized':
      return 'Bad VITE_DEV_LOGIN_SECRET. It must match the WEBHOOK_SECRET set on the Edge Function.'
    case 'invalid_email':
      return 'That email looks malformed.'
    case 'network_error':
      return 'Could not reach the server. Check your connection.'
    default:
      return `Error: ${code}`
  }
}
