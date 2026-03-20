

## Problem Root Cause

The redirect to `oauth.lovable.app/callback` is not caused by your frontend code. It is caused by the **managed Lovable Cloud OAuth credentials** configured in the backend. When Lovable Cloud manages Google/Apple sign-in, it uses its own OAuth client whose authorized redirect URI is `oauth.lovable.app/callback`. No frontend code change can override this — the OAuth provider (Google/Apple) always redirects to the URI registered with the OAuth client credentials.

Your frontend code (`supabase.auth.signInWithOAuth`) is already correct. The `redirectTo` parameter only controls where the user goes **after** the backend processes the callback — it does not control the OAuth provider's callback URI.

## Solution: Use Your Own OAuth Credentials (BYOK)

To completely eliminate `oauth.lovable.app` from the flow, you must replace the managed Lovable OAuth credentials with your own Google and Apple OAuth client credentials. This routes the OAuth callback through your Supabase project directly (`ceoqpgxbilpytvqtmebm.supabase.co/auth/v1/callback`), which then redirects to your app at `pixapp.kz/~oauth/callback`.

### Step 1: Set Up Google OAuth Credentials

In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
1. Create (or edit) an OAuth 2.0 Client ID (Web application type)
2. Under **Authorized redirect URIs**, add exactly:
   `https://ceoqpgxbilpytvqtmebm.supabase.co/auth/v1/callback`
3. Under **Authorized JavaScript origins**, add your domains (`https://pixapp.kz`, `https://www.pixapp.kz`)
4. Copy the **Client ID** and **Client Secret**

### Step 2: Set Up Apple OAuth Credentials

In [Apple Developer](https://developer.apple.com/account/resources/identifiers):
1. Configure a Services ID with Sign In with Apple enabled
2. Set the return URL to:
   `https://ceoqpgxbilpytvqtmebm.supabase.co/auth/v1/callback`
3. Generate a client secret (key file)

### Step 3: Configure Credentials in Lovable Cloud

Go to **Cloud → Authentication Settings → Sign In Methods**:
1. For **Google**: Enter your own Client ID and Client Secret
2. For **Apple**: Enter your own Services ID and secret
3. Save — this replaces the managed Lovable credentials

### Step 4: Update Redirect URLs in Backend Auth Settings

In Cloud Auth settings, ensure:
- **Site URL**: `https://pixapp.kz`
- **Redirect URLs** include:
  - `https://pixapp.kz/~oauth/callback`
  - `https://www.pixapp.kz/~oauth/callback`

### Step 5: Code Changes (Minor)

The frontend code is already mostly correct. Two small changes:

1. **`src/pages/AuthPage.tsx`** — Add an origin allowlist guard to the redirect URL builder to prevent callbacks to unexpected origins:

```typescript
const ALLOWED_ORIGINS = [
  "https://pixapp.kz",
  "https://www.pixapp.kz",
];

const getOAuthRedirectUrl = () => {
  const origin = window.location.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    return `${origin}/~oauth/callback`;
  }
  // Fallback for preview/dev environments
  return `${origin}/~oauth/callback`;
};
```

2. **`src/integrations/lovable/index.ts`** — No changes needed, but this file can remain unused. It is auto-generated and harmless.

### Expected Flow After Fix

```text
User clicks "Continue with Google"
  → supabase.auth.signInWithOAuth (skipBrowserRedirect: true)
  → Gets URL: accounts.google.com/o/oauth2/auth?redirect_uri=...supabase.co/auth/v1/callback
  → window.location.replace(url)
  → User authenticates with Google
  → Google redirects to: ceoqpgxbilpytvqtmebm.supabase.co/auth/v1/callback
  → Supabase processes PKCE, redirects to: pixapp.kz/~oauth/callback?code=...
  → OAuthCallbackPage detects session → navigates to "/"
```

No `oauth.lovable.app` involvement at any step.

### Step 6: Publish and Test

After configuring credentials and publishing, test Google and Apple sign-in on both `pixapp.kz` and `www.pixapp.kz`, including the browser back-button scenario.

