// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { jsonResponse, preflight } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const COURSE_SLUG = 'crushing-limiting-beliefs'

interface RequestBody {
  token?: unknown
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return preflight()
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405)

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'server_misconfigured' }, 500)
  }

  let body: RequestBody
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400)
  }

  if (typeof body.token !== 'string' || body.token.trim().length < 16) {
    return jsonResponse({ error: 'invalid_token' }, 400)
  }
  const submittedToken = body.token.trim()

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const nowIso = new Date().toISOString()

  // Atomic claim: only succeed if the token is unused and unexpired.
  // The single UPDATE prevents double-redemption races.
  const { data: claimed, error: claimErr } = await admin
    .from('magic_tokens')
    .update({ used_at: nowIso })
    .eq('token', submittedToken)
    .is('used_at', null)
    .gt('expires_at', nowIso)
    .select('email')
    .maybeSingle()

  if (claimErr) {
    console.error('claim failed', claimErr)
    return jsonResponse({ error: 'redemption_failed' }, 500)
  }
  if (!claimed) {
    return jsonResponse({ error: 'token_invalid_or_expired' }, 400)
  }

  const email = claimed.email

  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (profileErr || !profile) {
    console.error('profile lookup failed', profileErr)
    return jsonResponse({ error: 'profile_missing' }, 500)
  }

  await ensureEnrollment(admin, profile.id)

  // Mint a Supabase magic-link verifyOtp token. The browser calls
  // supabase.auth.verifyOtp({ type: 'magiclink', token_hash }) to land a session.
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (linkErr || !linkData?.properties?.hashed_token) {
    console.error('generateLink failed', linkErr)
    return jsonResponse({ error: 'session_create_failed' }, 500)
  }

  return jsonResponse({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
    email,
  })
})

async function ensureEnrollment(
  admin: ReturnType<typeof createClient>,
  userId: string,
): Promise<void> {
  const { data: course, error: courseErr } = await admin
    .from('courses')
    .select('id')
    .eq('slug', COURSE_SLUG)
    .maybeSingle()

  if (courseErr || !course) {
    console.warn('course lookup failed', courseErr)
    return
  }

  const { error: enrollErr } = await admin
    .from('course_enrollments')
    .upsert(
      { user_id: userId, course_id: course.id },
      { onConflict: 'user_id,course_id', ignoreDuplicates: true },
    )

  if (enrollErr) {
    console.warn('enrollment upsert failed', enrollErr)
  }
}
