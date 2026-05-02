import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useDashboard, type DashboardView, type LessonStatus } from '@/hooks/useDashboard'

export interface LessonDetail {
  id: string
  slug: string
  title: string
  description: string | null
  videoUrl: string | null
  bodyContent: string | null
  unlockDay: number
  moduleTitle: string
  status: LessonStatus
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

interface FlatLesson {
  id: string
  slug: string
  title: string
  unlockDay: number
  status: LessonStatus
  moduleTitle: string
}

function flatten(dashboard: DashboardView): FlatLesson[] {
  const out: FlatLesson[] = []
  for (const m of dashboard.modules) {
    for (const l of m.lessons) {
      out.push({
        id: l.id,
        slug: l.slug,
        title: l.title,
        unlockDay: l.unlockDay,
        status: l.status,
        moduleTitle: m.title,
      })
    }
  }
  return out
}

async function fetchLessonBody(slug: string): Promise<{
  body_content: string | null
  video_url: string | null
}> {
  const { data, error } = await supabase
    .from('lessons')
    .select('body_content, video_url')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('lesson_not_found')
  return data
}

export function useLesson(slug: string | undefined): UseQueryResult<LessonDetail, Error> {
  const { session } = useAuth()
  const dashboardQuery = useDashboard()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['lesson', userId, slug, dashboardQuery.dataUpdatedAt],
    enabled: Boolean(slug) && Boolean(userId) && Boolean(dashboardQuery.data),
    queryFn: async (): Promise<LessonDetail> => {
      if (!slug) throw new Error('missing_slug')
      const dashboard = dashboardQuery.data
      if (!dashboard) throw new Error('dashboard_not_loaded')

      const flat = flatten(dashboard)
      const idx = flat.findIndex((l) => l.slug === slug)
      if (idx < 0) throw new Error('lesson_not_found')
      const current = flat[idx]
      const prev = idx > 0 ? flat[idx - 1] : null
      const next = idx < flat.length - 1 ? flat[idx + 1] : null

      const body = await fetchLessonBody(slug)

      return {
        id: current.id,
        slug: current.slug,
        title: current.title,
        description: dashboard.modules
          .flatMap((m) => m.lessons)
          .find((l) => l.slug === slug)?.description ?? null,
        videoUrl: body.video_url,
        bodyContent: body.body_content,
        unlockDay: current.unlockDay,
        moduleTitle: current.moduleTitle,
        status: current.status,
        prev: prev ? { slug: prev.slug, title: prev.title } : null,
        next: next ? { slug: next.slug, title: next.title } : null,
      }
    },
    staleTime: 0,
    refetchOnMount: 'always',
  })
}
