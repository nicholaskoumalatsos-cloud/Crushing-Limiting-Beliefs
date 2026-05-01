function required(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

export const env = {
  supabaseUrl: required('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: required('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  adminEmails: (import.meta.env.VITE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  agogeApplyUrl: import.meta.env.VITE_AGOGE_APPLY_URL ?? 'https://theagoge.com/apply',
  isDev: import.meta.env.DEV,
}
