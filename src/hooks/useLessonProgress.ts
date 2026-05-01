import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

interface MarkInput {
  lessonId: string
  complete: boolean
}

export function useMarkLesson() {
  const { session } = useAuth()
  const userId = session?.user.id
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ lessonId, complete }: MarkInput) => {
      if (!userId) throw new Error('not_authenticated')
      const completedAt = complete ? new Date().toISOString() : null
      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            completed_at: completedAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' },
        )
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', userId] })
      qc.invalidateQueries({ queryKey: ['lesson'] })
    },
  })
}
