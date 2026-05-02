# Supabase

Schema migrations, Edge Functions, and config for the Crushing Limiting Beliefs LMS.

## Edge Functions

```
supabase/functions/
  _shared/             helpers used by multiple functions
  generate-magic-link/ creates auth user (if needed) and a one-time token
  redeem-magic-link/   validates a token and mints a Supabase session
  deno.json            Deno fmt/lint config for the functions folder
```

### Deploying

```bash
# Auth once
supabase login
supabase link --project-ref <your-project-ref>

# Set secrets (one time, or whenever they change)
supabase secrets set \
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
  SITE_URL=https://course.crushyourlimitingbeliefs.com \
  WEBHOOK_SECRET=<random-shared-secret-for-klaviyo> \
  KLAVIYO_PRIVATE_API_KEY=<klaviyo-private-key>

# Deploy a function
supabase functions deploy generate-magic-link --no-verify-jwt
```

`--no-verify-jwt` is used because the function is called by Klaviyo
(no Supabase user session). Auth is enforced via the `WEBHOOK_SECRET`
header check inside the function.

### generate-magic-link

`POST <project>.supabase.co/functions/v1/generate-magic-link`

Headers:
- `Content-Type: application/json`
- `x-webhook-secret: <secret>` (required if `WEBHOOK_SECRET` is set)

Body:
```json
{
  "email": "user@example.com",
  "klaviyo_profile_id": "abc123",
  "first_name": "Nick",
  "last_name": "K",
  "source": "klaviyo"
}
```

Response:
```json
{
  "magic_link": "https://course.crushyourlimitingbeliefs.com/start?token=...&email=...",
  "expires_at": "2026-05-08T14:23:00.000Z"
}
```

Behavior:
- If the user does not yet exist, creates an auth user (email confirmed) and patches the profile.
- If the user already exists, updates the profile metadata in place.
- Always inserts a fresh one-time token with a 7 day TTL.
- Tokens are 32 bytes of crypto randomness, base64url encoded.
- If `klaviyo_profile_id` is provided AND `KLAVIYO_PRIVATE_API_KEY` is set,
  the function PATCHes the Klaviyo profile to set
  `properties.magic_link` and `properties.magic_link_expires_at` so the
  email template can render `{{ person.magic_link }}`. The PATCH is awaited
  so downstream Klaviyo flow steps do not race the property update.
- Klaviyo PATCH failures are logged but do not fail the response, since
  the link is already persisted on our side and is recoverable manually.
- If `klaviyo_profile_id` is missing, the Klaviyo PATCH is skipped (warning).

Error codes (HTTP status, `error` field):
- 400 `invalid_json`, `invalid_email`
- 401 `unauthorized` (bad or missing `x-webhook-secret`)
- 405 `method_not_allowed`
- 500 `server_misconfigured`, `user_provisioning_failed`, `token_create_failed`

### redeem-magic-link

`POST <project>.supabase.co/functions/v1/redeem-magic-link`

Called by the browser on `/start`. No webhook secret (the token itself is
the credential, single-use, 7 day expiry).

Body:
```json
{ "token": "<base64url token from the magic link>" }
```

Response (success):
```json
{
  "token_hash": "<supabase verifyOtp token>",
  "type": "magiclink",
  "email": "user@example.com"
}
```

The frontend then runs:
```ts
await supabase.auth.verifyOtp({ type: 'magiclink', token_hash })
```
which lands an authenticated session in the browser.

Behavior:
- Atomically claims the token by setting `used_at` only if the row is unused and unexpired.
- Auto-enrolls the user in the seeded `crushing-limiting-beliefs` course on first redemption (idempotent).
- Mints a Supabase magic-link `token_hash` via the Auth Admin API.

Error codes:
- 400 `invalid_json`, `invalid_token`, `token_invalid_or_expired`
- 405 `method_not_allowed`
- 500 `server_misconfigured`, `redemption_failed`, `profile_missing`, `session_create_failed`
