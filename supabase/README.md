# Supabase

Schema migrations, Edge Functions, and config for the Crushing Limiting Beliefs LMS.

## Edge Functions

```
supabase/functions/
  _shared/             helpers used by multiple functions
  generate-magic-link/ creates auth user (if needed) and a one-time token
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
  WEBHOOK_SECRET=<random-shared-secret-for-klaviyo>

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

Error codes (HTTP status, `error` field):
- 400 `invalid_json`, `invalid_email`
- 401 `unauthorized` (bad or missing `x-webhook-secret`)
- 405 `method_not_allowed`
- 500 `server_misconfigured`, `user_provisioning_failed`, `token_create_failed`
