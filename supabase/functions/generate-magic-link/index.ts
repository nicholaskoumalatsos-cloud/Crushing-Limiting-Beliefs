// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { jsonResponse, preflight } from '../_shared/cors.ts'
import { generateMagicToken, normalizeEmail } from '../_shared/token.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://course.crushyourlimitingbeliefs.com').replace(/\/$/, '')
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') ?? ''
const KLAVIYO_API_KEY = Deno.env.get('KLAVIYO_PRIVATE_API_KEY') ?? ''
const KLAVIYO_REVISION = '2024-10-15'

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

// Stricter parser for Klaviyo profile IDs. Klaviyo's flow templating can send
// the literal string "None", "null", an empty string, or an unresolved
// template like "{{ person.id }}" when the property is missing. Any of those
// must be treated as absent or the downstream API call will fail.
function asKlaviyoProfileId(value: unknown): string | null {
  const s = asOptionalString(value)
  if (!s) return null
  const lower = s.toLowerCase()
  if (lower === 'none' || lower === 'null' || lower === 'undefined') return null
  if (/^\{\{.*\}\}$/.test(s)) return null
  return s
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

  console.log('Webhook body received:', JSON.stringify(body))

  const email = normalizeEmail(body.email)
  if (!email) return jsonResponse({ error: 'invalid_email' }, 400)

  const klaviyoProfileId = asKlaviyoProfileId(body.klaviyo_profile_id)
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

  // Push the link onto the Klaviyo profile so the welcome email can render
  // {{ person.magic_link }}. We await it so the email step in the Klaviyo
  // flow does not race with this update. Failures here do not fail the
  // overall response: the link is already persisted on our side and a
  // manual recovery is possible.
  if (klaviyoProfileId) {
    try {
      await pushToKlaviyo(klaviyoProfileId, magicLink, expiresAt)
      console.log('klaviyo profile update succeeded for id', klaviyoProfileId)
    } catch (err) {
      console.error('klaviyo profile update failed', err)
    }
  } else {
    console.warn(
      'Missing klaviyo_profile_id, skipping Klaviyo profile update. Raw value was:',
      JSON.stringify(body.klaviyo_profile_id),
    )
  }

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

async function pushToKlaviyo(profileId: string, magicLink: string, expiresAt: string): Promise<void> {
  if (!KLAVIYO_API_KEY) {
    throw new Error('KLAVIYO_PRIVATE_API_KEY not set')
  }

  const res = await fetch(`https://a.klaviyo.com/api/profiles/${profileId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'revision': KLAVIYO_REVISION,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        id: profileId,
        attributes: {
          properties: {
            magic_link: magicLink,
            magic_link_expires_at: expiresAt,
          },
        },
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`klaviyo_api_${res.status}: ${text.slice(0, 500)}`)
  }
}
