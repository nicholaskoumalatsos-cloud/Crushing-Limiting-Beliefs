// Placeholder types. Regenerate from the live schema with:
//   supabase gen types typescript --project-id <id> --schema public > src/types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          klaviyo_profile_id: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          klaviyo_profile_id?: string | null
          source?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      magic_tokens: {
        Row: {
          id: string
          email: string
          token: string
          expires_at: string
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          token: string
          expires_at: string
          used_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['magic_tokens']['Insert']>
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
        Relationships: []
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          sort_order: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['modules']['Insert']>
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          slug: string
          title: string
          description: string | null
          video_url: string | null
          body_content: string | null
          sort_order: number
          unlock_day: number
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          slug: string
          title: string
          description?: string | null
          video_url?: string | null
          body_content?: string | null
          sort_order: number
          unlock_day?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
        Relationships: []
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
        }
        Update: Partial<Database['public']['Tables']['course_enrollments']['Insert']>
        Relationships: []
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at?: string | null
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
