import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RequireAuth } from '@/components/RequireAuth'
import { AuthProvider } from '@/lib/auth'
import { Landing } from '@/pages/Landing'
import { Start } from '@/pages/Start'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Lesson } from '@/pages/Lesson'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}
