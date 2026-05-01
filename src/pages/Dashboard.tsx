import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Placeholder. Real dashboard ships in step 6 of the build.
export function Dashboard() {
  const [email, setEmail] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return
      setEmail(data.user?.email ?? null)
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-accent text-xs tracking-widest uppercase mb-4">
          Crushing Limiting Beliefs
        </p>
        <h1 className="text-4xl md:text-5xl mb-6">
          {loaded && email ? 'You are in.' : 'Welcome.'}
        </h1>
        {loaded && email && (
          <p className="text-bone-muted mb-8">
            Signed in as <span className="text-bone">{email}</span>.
          </p>
        )}
        {loaded && !email && (
          <p className="text-bone-muted mb-8">
            You are not signed in yet. Open the link from your welcome email.
          </p>
        )}
        <p className="text-bone-muted leading-relaxed mb-10">
          The full dashboard, with your modules and lessons, lands in the next build step.
          For now this page just confirms your session is real.
        </p>
        {loaded && email && (
          <button type="button" className="btn-ghost" onClick={signOut}>
            Sign out
          </button>
        )}
      </div>
    </main>
  )
}
