import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useAdminStats, type LessonFunnelRow } from '@/hooks/useAdminStats'

export function Admin() {
  const { session } = useAuth()
  const { data, isLoading, isError, error } = useAdminStats()

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen px-6 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <Header email={session?.user.email ?? ''} onSignOut={signOut} />

        <div className="mt-12 md:mt-16">
          <p className="font-display text-accent text-sm md:text-base tracking-widest uppercase mb-4">
            Admin
          </p>
          <h1 className="text-4xl md:text-5xl mb-4 leading-tight">The Funnel</h1>
          <p className="text-bone-muted text-lg leading-relaxed max-w-2xl">
            Where they sign up, where they enroll, where they drop. Use it to find
            the lesson that bleeds and fix it.
          </p>
        </div>

        {isLoading && (
          <p className="font-display text-bone-muted text-sm tracking-widest uppercase mt-12">
            Loading
          </p>
        )}

        {isError && (
          <div className="mt-12 border border-accent/40 bg-ink-900 px-6 py-6">
            <p className="font-display text-accent text-sm md:text-base tracking-widest uppercase mb-2">
              Error
            </p>
            <p className="text-bone-muted leading-relaxed">
              {error?.message ?? 'Could not load stats. Reload the page.'}
            </p>
          </div>
        )}

        {data && (
          <>
            <StatGrid
              signups={data.totalSignups}
              enrollments={data.totalEnrollments}
              completions={data.totalCompletions}
              avg={data.averageLessonsPerUser}
              lessonCount={data.lessonCount}
            />
            <FunnelTable rows={data.funnel} totalEnrolled={data.totalEnrollments} />
          </>
        )}
      </div>
    </main>
  )
}

function Header({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <header className="flex items-center justify-between">
      <Link
        to="/dashboard"
        className="font-display text-accent text-sm md:text-base tracking-widest uppercase hover:text-accent-hover transition-colors"
      >
        Crushing Limiting Beliefs
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {email && <span className="text-bone-muted hidden sm:inline">{email}</span>}
        <Link
          to="/dashboard"
          className="font-display text-bone-muted hover:text-bone tracking-widest uppercase transition-colors"
        >
          Dashboard
        </Link>
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

function StatGrid({
  signups,
  enrollments,
  completions,
  avg,
  lessonCount,
}: {
  signups: number
  enrollments: number
  completions: number
  avg: number
  lessonCount: number
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-12 bg-ink-800">
      <Stat label="Signups" value={signups.toLocaleString()} />
      <Stat label="Enrollments" value={enrollments.toLocaleString()} />
      <Stat label="Lesson completions" value={completions.toLocaleString()} />
      <Stat
        label="Avg per user"
        value={`${avg.toFixed(1)} / ${lessonCount}`}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-900 px-6 py-8">
      <p className="font-display text-bone-muted text-sm md:text-base tracking-widest uppercase mb-3">
        {label}
      </p>
      <p className="font-display text-3xl md:text-4xl tracking-wider">{value}</p>
    </div>
  )
}

function FunnelTable({
  rows,
  totalEnrolled,
}: {
  rows: LessonFunnelRow[]
  totalEnrolled: number
}) {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl md:text-3xl tracking-wider uppercase mb-6">
        Lesson Funnel
      </h2>
      <div className="overflow-x-auto border border-ink-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink-900 border-b border-ink-800">
              <Th className="w-16">#</Th>
              <Th>Lesson</Th>
              <Th className="hidden md:table-cell">Module</Th>
              <Th className="text-right w-28">Completed</Th>
              <Th className="text-right w-24">% enrolled</Th>
              <Th className="text-right w-24">Drop</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <FunnelRow key={row.lessonId} row={row} totalEnrolled={totalEnrolled} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-bone-muted">
                  No lessons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={`font-display text-bone-muted text-sm tracking-widest uppercase text-left px-4 py-3 ${className}`}
    >
      {children}
    </th>
  )
}

function FunnelRow({
  row,
  totalEnrolled,
}: {
  row: LessonFunnelRow
  totalEnrolled: number
}) {
  const pctText =
    totalEnrolled > 0 ? `${Math.round(row.pctOfEnrolled * 100)}%` : '—'
  const dropText =
    row.dropFromPrev === null
      ? '—'
      : row.dropFromPrev === 0
        ? '0'
        : row.dropFromPrev > 0
          ? `+${row.dropFromPrev}`
          : `${row.dropFromPrev}`
  const dropTone =
    row.dropFromPrev !== null && row.dropFromPrev < 0 ? 'text-accent' : 'text-bone'

  return (
    <tr className="border-b border-ink-800 last:border-b-0 hover:bg-ink-900 transition-colors">
      <td className="px-4 py-3 font-display text-bone-muted text-sm tracking-widest">
        {String(row.moduleIndex).padStart(2, '0')}.{row.lessonIndexInModule}
      </td>
      <td className="px-4 py-3 text-bone">{row.lessonTitle}</td>
      <td className="px-4 py-3 text-bone-muted hidden md:table-cell">{row.moduleTitle}</td>
      <td className="px-4 py-3 text-right text-bone tabular-nums">{row.completions}</td>
      <td className="px-4 py-3 text-right text-bone-muted tabular-nums">{pctText}</td>
      <td className={`px-4 py-3 text-right tabular-nums ${dropTone}`}>{dropText}</td>
    </tr>
  )
}
