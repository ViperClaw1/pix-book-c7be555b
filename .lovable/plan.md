

## Fix: Password Reset Link Shows "Expired" Immediately

### Root Cause

The Supabase JS client v2.95+ defaults to **PKCE flow**. In PKCE, the password reset link redirects to `/reset-password?code=XXXX` (query parameter), not with a hash fragment. The PKCE code verifier is stored in `localStorage` when `resetPasswordForEmail()` is called.

The Supabase client's `detectSessionInUrl` should auto-detect the `code` param and exchange it. However, this exchange can fail silently if:
- The code verifier in localStorage was cleared or is on a different origin
- The exchange happens asynchronously and the `PASSWORD_RECOVERY` event fires before the `ResetPasswordPage` effect subscribes

The current page waits 5 seconds for a session, then shows "Link expired." The session never appears because the code exchange either failed or the event was missed.

### Fix in `ResetPasswordPage.tsx`

1. **Explicitly handle the PKCE `code` parameter**: In the `useEffect`, check for a `code` query parameter in `window.location.search`. If found, call `supabase.auth.exchangeCodeForSession(code)` manually to establish the session.

2. **Increase timeout to 10 seconds**: Give more time for the async code exchange to complete.

3. **Handle both flows**: Keep the existing `onAuthStateChange` + `getSession()` logic for the implicit flow (hash fragments), and add the explicit PKCE code exchange as a fallback.

```typescript
// Inside useEffect, after setting up onAuthStateChange:
const url = new URL(window.location.href);
const code = url.searchParams.get('code');
if (code) {
  supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
    if (!error) setSessionReady(true);
  });
}
```

### Files Changed

| File | Action |
|------|--------|
| `src/pages/ResetPasswordPage.tsx` | Add explicit PKCE code exchange handling |

