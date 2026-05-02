import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RequireAuth } from '@/components/RequireAuth'
import { RequireAdmin } from '@/components/RequireAdmin'
import { AuthProvider } from '@/lib/auth'
import { Landing } from '@/pages/Landing'
import { Start } from '@/pages/Start'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'

// Heavy routes (markdown renderer + quiz state, admin tables) load on demand.
const Lesson = lazy(() => import('@/pages/Lesson').then((m) => ({ default: m.Lesson })))
const Admin = lazy(() => import('@/pages/Admin').then((m) => ({ default: m.Admin })))

function RouteFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="font-display text-bone-muted text-sm tracking-widest uppercase">
        Loading
      </p>
    </main>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/start" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/lessons/:slug"
              element={
                <RequireAuth>
                  <Lesson />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <Admin />
                </RequireAdmin>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  )
}
