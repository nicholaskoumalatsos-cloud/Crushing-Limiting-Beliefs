// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { jsonResponse, preflight } from '../_shared/cors.ts'
import { generateMagicToken, normalizeEmail } from '../_shared/token.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://course.crushyourlimitingbeliefs.com').replace(/\/$/, '')
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') ?? ''

const TOKEN_TTL_DAYS = 7

interface RequestBody {
  email?: unknown
  klaviyo_profile_id?: unknown
  first_name?: unknown
  last_name?: unknown
  source?: unknown
}

function asOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return preflight()
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405)

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'server_misconfigured' }, 500)
  }

  if (WEBHOOK_SECRET) {
    const provided = req.headers.get('x-webhook-secret')
    if (provided !== WEBHOOK_SECRET) {
      return jsonResponse({ error: 'unauthorized' }, 401)
    }
  }

  let body: RequestBody
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400)
  }

  const email = normalizeEmail(body.email)
  if (!email) return jsonResponse({ error: 'invalid_email' }, 400)

  const klaviyoProfileId = asOptionalString(body.klaviyo_profile_id)
  const firstName = asOptionalString(body.first_name)
  const lastName = asOptionalString(body.last_name)
  const source = asOptionalString(body.source) ?? 'klaviyo'

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const userId = await ensureUser(admin, {
    email,
    firstName,
    lastName,
    klaviyoProfileId,
    source,
  })
  if (!userId) {
    return jsonResponse({ error: 'user_provisioning_failed' }, 500)
  }

  const token = generateMagicToken(32)
  const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { error: insertError } = await admin.from('magic_tokens').insert({
    email,
    token,
    expires_at: expiresAt,
  })

  if (insertError) {
    console.error('magic_tokens insert failed', insertError)
    return jsonResponse({ error: 'token_create_failed' }, 500)
  }

  const magicLink =
    `${SITE_URL}/start?token=${token}&email=${encodeURIComponent(email)}`

  return jsonResponse({ magic_link: magicLink, expires_at: expiresAt }, 200)
})

interface ProvisionInput {
  email: string
  firstName: string | null
  lastName: string | null
  klaviyoProfileId: string | null
  source: string
}

async function ensureUser(admin: ReturnType<typeof createClient>, p: ProvisionInput): Promise<string | null> {
  const { data: existingProfile, error: lookupErr } = await admin
    .from('profiles')
    .select('id')
    .eq('email', p.email)
    .maybeSingle()

  if (lookupErr) {
    console.error('profile lookup failed', lookupErr)
    return null
  }

  if (existingProfile?.id) {
    await applyProfileMetadata(admin, existingProfile.id, p)
    return existingProfile.id
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: p.email,
    email_confirm: true,
    user_metadata: stripNulls({
      first_name: p.firstName,
      last_name: p.lastName,
      klaviyo_profile_id: p.klaviyoProfileId,
      source: p.source,
    }),
  })

  if (createErr || !created.user) {
    if (createErr && /already registered/i.test(createErr.message)) {
      const { data: again } = await admin
        .from('profiles')
        .select('id')
        .eq('email', p.email)
        .maybeSingle()
      if (again?.id) {
        await applyProfileMetadata(admin, again.id, p)
        return again.id
      }
    }
    console.error('createUser failed', createErr)
    return null
  }

  await applyProfileMetadata(admin, created.user.id, p)
  return created.user.id
}

async function applyProfileMetadata(
  admin: ReturnType<typeof createClient>,
  userId: string,
  p: ProvisionInput,
): Promise<void> {
  const patch = stripNulls({
    first_name: p.firstName,
    last_name: p.lastName,
    klaviyo_profile_id: p.klaviyoProfileId,
    source: p.source,
  })
  if (Object.keys(patch).length === 0) return
  const { error } = await admin.from('profiles').update(patch).eq('id', userId)
  if (error) console.error('profile metadata update failed', error)
}

function stripNulls<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v
  }
  return out
}
