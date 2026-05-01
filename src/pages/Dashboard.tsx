import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import {
  useDashboard,
  type LessonView,
  type ModuleView,
} from '@/hooks/useDashboard'
import { ArrowRightIcon, CheckIcon, CircleIcon, LockIcon } from '@/components/icons'

export function Dashboard() {
  const { session } = useAuth()
  const { data, isLoading, isError, error } = useDashboard()

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (isLoading || !data) return <DashboardLoading />
  if (isError) return <DashboardError message={error?.message} />

  const { courseTitle, courseDescription, daysIn, modules, lessonCount, completedCount } = data

  return (
    <main className="min-h-screen px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Header email={session?.user.email ?? ''} onSignOut={signOut} />

        <section className="mt-12 md:mt-16">
          <p className="font-display text-bone-muted text-sm md:text-base tracking-widest uppercase mb-4">
            Day {daysIn + 1} of your training
          </p>
          <h1 className="text-4xl md:text-6xl mb-6 leading-tight">{courseTitle}</h1>
          {courseDescription && (
            <p className="text-bone-muted text-lg leading-relaxed mb-6 max-w-2xl">
              {courseDescription}
            </p>
          )}
          <ProgressLine completed={completedCount} total={lessonCount} />
        </section>

        <div className="mt-14 space-y-14 md:space-y-16">
          {modules.map((m, i) => (
            <ModuleSection key={m.id} module={m} index={i} />
          ))}
        </div>
      </div>
    </main>
  )
}

function Header({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <header className="flex items-center justify-between">
      <p className="font-display text-accent text-sm md:text-base tracking-widest uppercase">
        Crushing Limiting Beliefs
      </p>
      <div className="flex items-center gap-4 text-sm">
        {email && <span className="text-bone-muted hidden sm:inline">{email}</span>}
        <button
          type="button"
          onClick={onSignOut}
          className="font-display text-bone-muted hover:text-bone tracking-widest uppercase transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

function ProgressLine({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between font-display text-bone-muted text-sm tracking-widest uppercase mb-2">
        <span>Progress</span>
        <span>
          {completed} / {total}
        </span>
      </div>
      <div className="h-1 bg-ink-800 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ModuleSection({ module, index }: { module: ModuleView; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-6 pb-4 border-b border-ink-800">
        <span className="font-display text-bone-muted text-2xl tracking-wider">
          {num}
        </span>
        <h2 className="font-display text-2xl md:text-3xl tracking-wider uppercase">
          {module.title}
        </h2>
      </div>
      <ul className="space-y-1">
        {module.lessons.map((l) => (
          <li key={l.id}>
            <LessonRow lesson={l} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function LessonRow({ lesson }: { lesson: LessonView }) {
  const isLocked = lesson.status === 'locked'
  const isComplete = lesson.status === 'completed'

  const inner = (
    <div
      className={`group flex items-start gap-5 py-5 border-b border-ink-900 transition-colors ${
        isLocked ? '' : 'hover:bg-ink-900 hover:border-ink-800 -mx-3 px-3'
      }`}
    >
      <StatusIcon status={lesson.status} />
      <div className="flex-1 min-w-0">
        <h3
          className={`font-display text-lg md:text-xl tracking-wider uppercase mb-1 ${
            isLocked ? 'text-bone-muted' : isComplete ? 'text-bone-muted' : 'text-bone'
          }`}
        >
          {lesson.title}
        </h3>
        {lesson.description && (
          <p
            className={`text-sm md:text-base leading-relaxed ${
              isLocked ? 'text-bone-muted/60' : 'text-bone-muted'
            }`}
          >
            {lesson.description}
          </p>
        )}
        {isLocked && (
          <p className="font-display text-accent/70 text-sm tracking-widest uppercase mt-2">
            Unlocks day {lesson.unlockDay + 1}
          </p>
        )}
      </div>
      {!isLocked && (
        <ArrowRightIcon className="w-5 h-5 text-bone-muted group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      )}
    </div>
  )

  if (isLocked) {
    return <div aria-disabled="true">{inner}</div>
  }
  return <Link to={`/lessons/${lesson.slug}`}>{inner}</Link>
}

function StatusIcon({ status }: { status: LessonView['status'] }) {
  const base = 'w-7 h-7 flex-shrink-0 mt-0.5'
  if (status === 'completed') {
    return <CheckIcon className={`${base} text-accent`} />
  }
  if (status === 'locked') {
    return <LockIcon className={`${base} text-bone-muted/50`} />
  }
  return <CircleIcon className={`${base} text-bone-muted group-hover:text-accent transition-colors`} />
}

function DashboardLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="font-display text-bone-muted text-sm tracking-widest uppercase">
        Loading
      </p>
    </main>
  )
}

function DashboardError({ message }: { message?: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-accent text-sm md:text-base tracking-widest uppercase mb-4">
          Error
        </p>
        <h1 className="text-3xl mb-4">Could not load your course.</h1>
        <p className="text-bone-muted mb-8 leading-relaxed">
          {message ?? 'Something went wrong. Reload the page or sign in again.'}
        </p>
        <Link to="/login" className="btn-ghost">
          Back to login
        </Link>
      </div>
    </main>
  )
}
