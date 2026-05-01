import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

// Placeholder. Real dashboard ships in step 6 of the build.
export function Dashboard() {
  const { session } = useAuth()
  const email = session?.user.email ?? null

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="font-display text-accent text-2xl md:text-3xl tracking-wider uppercase mb-6">
          Crushing Limiting Beliefs
        </p>
        <h1 className="text-4xl md:text-5xl mb-6">You are in.</h1>
        {email && (
          <p className="text-bone-muted mb-8">
            Signed in as <span className="text-bone">{email}</span>.
          </p>
        )}
        <p className="text-bone-muted leading-relaxed mb-10">
          The full dashboard with your modules and lessons lands in the next build step.
          For now this page just confirms your session is real.
        </p>
        <button type="button" className="btn-ghost" onClick={signOut}>
          Sign out
        </button>
      </div>
    </main>
  )
}
