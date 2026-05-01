import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useLesson, type LessonDetail } from '@/hooks/useLesson'
import { useMarkLesson } from '@/hooks/useLessonProgress'
import { AgogeCTA } from '@/components/AgogeCTA'
import { VideoPlayer } from '@/components/VideoPlayer'
import { ArrowRightIcon } from '@/components/icons'

export function Lesson() {
  const { slug } = useParams<{ slug: string }>()
  const { session } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useLesson(slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (isLoading || !data) return <LessonLoading />
  if (isError) return <LessonError message={error?.message} />
  if (data.status === 'locked') return <LessonLocked lesson={data} />

  return (
    <main className="min-h-screen px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Header email={session?.user.email ?? ''} onSignOut={signOut} />

        <div className="mt-10">
          <Link
            to="/dashboard"
            className="font-display text-bone-muted hover:text-bone text-xs tracking-widest uppercase transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        <article className="mt-8">
          <p className="font-display text-accent text-xs tracking-widest uppercase mb-4">
            {data.moduleTitle}
          </p>
          <h1 className="text-4xl md:text-5xl mb-6 leading-tight">{data.title}</h1>
          {data.description && (
            <p className="text-bone-muted text-lg leading-relaxed mb-10 max-w-2xl">
              {data.description}
            </p>
          )}

          <div className="mb-12">
            <VideoPlayer src={data.videoUrl} title={data.title} />
          </div>

          {data.bodyContent && (
            <div className="prose prose-manifesto max-w-none mb-12">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.bodyContent}
              </ReactMarkdown>
            </div>
          )}

          <AgogeCTA />

          <LessonActions
            lesson={data}
            onComplete={() => {
              if (data.next) navigate(`/lessons/${data.next.slug}`)
              else navigate('/dashboard')
            }}
          />
        </article>
      </div>
    </main>
  )
}

function LessonActions({
  lesson,
  onComplete,
}: {
  lesson: LessonDetail
  onComplete: () => void
}) {
  const markMut = useMarkLesson()
  const isComplete = lesson.status === 'completed'
  const nextLocked = false // next status check happens inside the hook; if next exists, it was unlocked at fetch time
  const hasNext = !!lesson.next

  async function toggleComplete() {
    await markMut.mutateAsync({ lessonId: lesson.id, complete: !isComplete })
    if (!isComplete) onComplete()
  }

  return (
    <div className="mt-10 pt-10 border-t border-ink-800 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={toggleComplete}
        disabled={markMut.isPending}
        className={isComplete ? 'btn-ghost' : 'btn-primary'}
      >
        {markMut.isPending
          ? 'Saving'
          : isComplete
            ? 'Mark incomplete'
            : 'Mark complete'}
      </button>

      {hasNext && lesson.next && (
        <Link
          to={`/lessons/${lesson.next.slug}`}
          className="group flex items-center gap-3 font-display text-bone hover:text-accent tracking-widest uppercase text-sm transition-colors"
        >
          <span className="text-bone-muted text-xs">Next</span>
          <span>{lesson.next.title}</span>
          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
      {!hasNext && (
        <Link
          to="/dashboard"
          className="font-display text-bone-muted hover:text-bone tracking-widest uppercase text-sm transition-colors"
        >
          Back to dashboard
        </Link>
      )}
      {nextLocked && null}
    </div>
  )
}

function Header({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <header className="flex items-center justify-between">
      <Link
        to="/dashboard"
        className="font-display text-accent text-xs md:text-sm tracking-widest uppercase hover:text-accent-hover transition-colors"
      >
        Crushing Limiting Beliefs
      </Link>
      <div className="flex items-center gap-4 text-xs">
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

function LessonLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="font-display text-bone-muted text-sm tracking-widest uppercase">
        Loading
      </p>
    </main>
  )
}

function LessonLocked({ lesson }: { lesson: LessonDetail }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-accent text-xs tracking-widest uppercase mb-6">
          Locked
        </p>
        <h1 className="text-3xl mb-4">{lesson.title}</h1>
        <p className="text-bone-muted leading-relaxed mb-2">
          This lesson is part of the drip schedule.
        </p>
        <p className="font-display text-bone text-sm tracking-widest uppercase mb-8">
          Unlocks day {lesson.unlockDay + 1}
        </p>
        <Link to="/dashboard" className="btn-ghost">
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}

function LessonError({ message }: { message?: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-accent text-xs tracking-widest uppercase mb-4">
          Error
        </p>
        <h1 className="text-3xl mb-4">Could not load this lesson.</h1>
        <p className="text-bone-muted mb-8 leading-relaxed">
          {message === 'lesson_not_found'
            ? 'That lesson does not exist.'
            : (message ?? 'Something went wrong. Reload the page.')}
        </p>
        <Link to="/dashboard" className="btn-ghost">
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}
