

## Plan: Fix Google OAuth by bypassing managed proxy

### Root cause (confirmed)
The managed `lovable.auth.signInWithOAuth` always uses the **Lovable-managed Google client ID** (`360872745722-...`), not your custom credentials. Your custom Client ID and Secret entered in Cloud settings are not being applied. Since the managed client doesn't have your domain's callback URI registered, Google rejects it with `redirect_uri_mismatch`.

### Solution
Switch to **direct `supabase.auth.signInWithOAuth`** which will use the Google credentials configured in your Cloud Authentication Settings directly against Supabase (not through the proxy).

### Steps

1. **Update `src/pages/AuthPage.tsx`**
   - Replace `lovable.auth.signInWithOAuth("google", ...)` with `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/~oauth/callback" } })`
   - Same for Apple
   - Replace `import { lovable }` with `import { supabase }` (already imported via AuthContext, but add direct import)

2. **Verify Google Console configuration**
   - Authorized redirect URI must include exactly: `https://ceoqpgxbilpytvqtmebm.supabase.co/auth/v1/callback`
   - Authorized JavaScript origins: `https://pixapp.kz` and `https://www.pixapp.kz`

3. **No other file changes needed** — `OAuthCallbackPage.tsx` and the `/~oauth/callback` route already exist in `App.tsx`.

### Technical details
- `redirectTo` is your app's return URL after Supabase completes the OAuth exchange
- Google validates the **backend callback** (`*.supabase.co/auth/v1/callback`), not `redirectTo`
- The managed proxy (`oauth.lovable.app`) is permanently bypassed — it does not respect custom credentials

