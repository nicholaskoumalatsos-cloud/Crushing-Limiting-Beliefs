import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

const COURSE_SLUG = 'crushing-limiting-beliefs'

export interface LessonFunnelRow {
  lessonId: string
  globalIndex: number
  moduleIndex: number
  lessonIndexInModule: number
  moduleTitle: string
  lessonTitle: string
  unlockDay: number
  completions: number
  pctOfEnrolled: number
  dropFromPrev: number | null
}

export interface AdminStats {
  totalSignups: number
  totalEnrollments: number
  totalCompletions: number
  averageLessonsPerUser: number
  lessonCount: number
  funnel: LessonFunnelRow[]
}

async function fetchAdminStats(): Promise<AdminStats> {
  const [profilesRes, enrollmentsRes, progressRes, courseRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase
      .from('course_enrollments')
      .select('id, course_id', { count: 'exact' })
      .eq(
        'course_id',
        (
          await supabase.from('courses').select('id').eq('slug', COURSE_SLUG).single()
        ).data?.id ?? '',
      ),
    supabase.from('lesson_progress').select('lesson_id, completed_at'),
    supabase
      .from('courses')
      .select(
        `
        id, title,
        modules (
          id, title, sort_order,
          lessons (id, title, sort_order, unlock_day)
        )
      `,
      )
      .eq('slug', COURSE_SLUG)
      .single(),
  ])

  if (profilesRes.error) throw profilesRes.error
  if (enrollmentsRes.error) throw enrollmentsRes.error
  if (progressRes.error) throw progressRes.error
  if (courseRes.error) throw courseRes.error

  const totalSignups = profilesRes.count ?? 0
  const totalEnrollments = enrollmentsRes.count ?? 0

  const completionsByLesson = new Map<string, number>()
  let totalCompletions = 0
  for (const row of progressRes.data ?? []) {
    if (!row.completed_at) continue
    completionsByLesson.set(row.lesson_id, (completionsByLesson.get(row.lesson_id) ?? 0) + 1)
    totalCompletions += 1
  }

  const course = courseRes.data
  const orderedLessons: Array<{
    id: string
    title: string
    moduleTitle: string
    moduleIndex: number
    lessonIndexInModule: number
    unlockDay: number
  }> = []

  const sortedModules = (course?.modules ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)

  sortedModules.forEach((m, mi) => {
    const sortedLessons = (m.lessons ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
    sortedLessons.forEach((l, li) => {
      orderedLessons.push({
        id: l.id,
        title: l.title,
        moduleTitle: m.title,
        moduleIndex: mi + 1,
        lessonIndexInModule: li + 1,
        unlockDay: l.unlock_day,
      })
    })
  })

  const funnel: LessonFunnelRow[] = orderedLessons.map((l, idx) => {
    const completions = completionsByLesson.get(l.id) ?? 0
    const pct = totalEnrollments > 0 ? completions / totalEnrollments : 0
    const prev = idx > 0 ? completionsByLesson.get(orderedLessons[idx - 1].id) ?? 0 : null
    const drop = prev !== null ? completions - prev : null
    return {
      lessonId: l.id,
      globalIndex: idx + 1,
      moduleIndex: l.moduleIndex,
      lessonIndexInModule: l.lessonIndexInModule,
      moduleTitle: l.moduleTitle,
      lessonTitle: l.title,
      unlockDay: l.unlockDay,
      completions,
      pctOfEnrolled: pct,
      dropFromPrev: drop,
    }
  })

  const averageLessonsPerUser =
    totalEnrollments > 0 ? totalCompletions / totalEnrollments : 0

  return {
    totalSignups,
    totalEnrollments,
    totalCompletions,
    averageLessonsPerUser,
    lessonCount: orderedLessons.length,
    funnel,
  }
}

export function useAdminStats(): UseQueryResult<AdminStats, Error> {
  const { session } = useAuth()
  const userId = session?.user.id
  return useQuery({
    queryKey: ['admin-stats', userId],
    queryFn: fetchAdminStats,
    enabled: Boolean(userId),
    staleTime: 0,
    refetchOnMount: 'always',
  })
}
