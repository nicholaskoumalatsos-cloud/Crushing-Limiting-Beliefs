import { env } from '@/lib/env'

const FUNCTIONS_BASE = `${env.supabaseUrl.replace(/\/$/, '')}/functions/v1`

export class EdgeFunctionError extends Error {
  status: number
  details?: string

  constructor(code: string, status: number, details?: string) {
    super(code)
    this.name = 'EdgeFunctionError'
    this.status = status
    this.details = details
  }
}

export interface RedeemResponse {
  token_hash: string
  type: 'magiclink'
  email: string
}

export interface GenerateResponse {
  magic_link: string
  expires_at: string
}

export interface GenerateInput {
  email: string
  first_name?: string
  last_name?: string
  klaviyo_profile_id?: string
  source?: string
}

interface ApiErrorPayload {
  error?: string
  details?: string
}

async function postJson<T>(
  path: string,
  body: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${FUNCTIONS_BASE}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.supabaseAnonKey,
        ...extraHeaders,
      },
      body: JSON.stringify(body),
    })
  } catch (cause) {
    throw new EdgeFunctionError('network_error', 0, cause instanceof Error ? cause.message : undefined)
  }

  if (!res.ok) {
    let payload: ApiErrorPayload | null = null
    try {
      payload = (await res.json()) as ApiErrorPayload
    } catch {
      payload = null
    }
    throw new EdgeFunctionError(payload?.error ?? 'request_failed', res.status, payload?.details)
  }

  return res.json() as Promise<T>
}

export function redeemMagicLink(token: string): Promise<RedeemResponse> {
  return postJson<RedeemResponse>('redeem-magic-link', { token })
}

export function generateMagicLink(
  input: GenerateInput,
  webhookSecret: string,
): Promise<GenerateResponse> {
  return postJson<GenerateResponse>(
    'generate-magic-link',
    { source: 'dev_login', ...input },
    { 'x-webhook-secret': webhookSecret },
  )
}
