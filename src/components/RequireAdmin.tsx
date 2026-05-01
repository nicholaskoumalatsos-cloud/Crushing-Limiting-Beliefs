import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { env } from '@/lib/env'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="font-display text-bone-muted text-sm tracking-widest uppercase">
          Loading
        </p>
      </main>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  const email = session.user.email?.toLowerCase() ?? ''
  if (!env.adminEmails.includes(email)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
