import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

const COURSE_SLUG = 'crushing-limiting-beliefs'
const DAY_MS = 24 * 60 * 60 * 1000

export type LessonStatus = 'completed' | 'available' | 'locked'

export interface LessonView {
  id: string
  slug: string
  title: string
  description: string | null
  unlockDay: number
  status: LessonStatus
}

export interface ModuleView {
  id: string
  title: string
  sortOrder: number
  lessons: LessonView[]
}

export interface DashboardView {
  courseTitle: string
  courseDescription: string | null
  enrolledAt: string | null
  daysIn: number
  modules: ModuleView[]
  lessonCount: number
  completedCount: number
  unlockedCount: number
}

async function fetchDashboard(userId: string): Promise<DashboardView> {
  const [courseResult, enrollmentResult, progressResult] = await Promise.all([
    supabase
      .from('courses')
      .select(
        `
        id,
        title,
        description,
        modules (
          id,
          title,
          sort_order,
          lessons (
            id,
            slug,
            title,
            description,
            sort_order,
            unlock_day
          )
        )
      `,
      )
      .eq('slug', COURSE_SLUG)
      .single(),
    supabase
      .from('course_enrollments')
      .select('enrolled_at')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('lesson_progress')
      .select('lesson_id, completed_at')
      .eq('user_id', userId),
  ])

  if (courseResult.error) throw courseResult.error
  if (enrollmentResult.error) throw enrollmentResult.error
  if (progressResult.error) throw progressResult.error

  const course = courseResult.data
  if (!course) throw new Error('course_not_found')

  const enrolledAt = enrollmentResult.data?.enrolled_at ?? null
  const daysIn = enrolledAt
    ? Math.floor((Date.now() - new Date(enrolledAt).getTime()) / DAY_MS)
    : 0

  const completedSet = new Set(
    (progressResult.data ?? []).filter((p) => p.completed_at).map((p) => p.lesson_id),
  )

  const modules: ModuleView[] = (course.modules ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      id: m.id,
      title: m.title,
      sortOrder: m.sort_order,
      lessons: (m.lessons ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((l): LessonView => {
          let status: LessonStatus
          if (completedSet.has(l.id)) status = 'completed'
          else if (enrolledAt && daysIn >= l.unlock_day) status = 'available'
          else status = 'locked'
          return {
            id: l.id,
            slug: l.slug,
            title: l.title,
            description: l.description,
            unlockDay: l.unlock_day,
            status,
          }
        }),
    }))

  const lessonCount = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedCount = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.status === 'completed').length,
    0,
  )
  const unlockedCount = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.status !== 'locked').length,
    0,
  )

  return {
    courseTitle: course.title,
    courseDescription: course.description,
    enrolledAt,
    daysIn,
    modules,
    lessonCount,
    completedCount,
    unlockedCount,
  }
}

export function useDashboard(): UseQueryResult<DashboardView, Error> {
  const { session } = useAuth()
  const userId = session?.user.id
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => fetchDashboard(userId!),
    enabled: Boolean(userId),
    staleTime: 60_000,
  })
}
