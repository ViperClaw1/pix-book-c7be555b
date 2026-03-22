
## Current State

Social auth now uses the managed Lovable Cloud flow via `lovable.auth.signInWithOAuth()` from `@lovable.dev/cloud-auth-js`. This is the officially supported method.

### How it works
1. User clicks "Continue with Google/Apple"
2. `lovable.auth.signInWithOAuth(provider, { redirect_uri })` is called
3. The managed broker handles the OAuth exchange (may pass through `oauth.lovable.app` internally)
4. User returns to `redirect_uri` (`pixapp.kz/~oauth/callback` or `www.pixapp.kz/~oauth/callback`)
5. `OAuthCallbackPage` picks up the session and navigates to `/`

### Key files
- `src/pages/AuthPage.tsx` — initiates social login via `lovable.auth.signInWithOAuth`
- `src/integrations/lovable/index.ts` — auto-generated, do NOT edit
- `src/pages/OAuthCallbackPage.tsx` — handles callback, session establishment
- `src/App.tsx` — routes `/~oauth/callback` to OAuthCallbackPage

### Configuration (external)
- Google/Apple credentials can be customized in Cloud → Auth Settings → Sign In Methods
- Site URL should be `https://pixapp.kz`
- Redirect URLs should include both `https://pixapp.kz/~oauth/callback` and `https://www.pixapp.kz/~oauth/callback`
