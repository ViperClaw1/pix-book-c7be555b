

## Fix: Password Reset "Auth session missing" Error

### Root Cause

When a user clicks the password reset link from their email, they land on `/reset-password#access_token=...&type=recovery`. The Supabase client automatically processes this hash fragment via `onAuthStateChange`, but there's a **race condition**: the page renders the form immediately, and the recovery session hasn't been established yet. If the user types quickly and submits, `updatePassword` fails because no session exists. Even without rushing, the initial render has no session, so errors can appear.

The page needs to **wait for the recovery session** to be established before showing the form.

### Changes to `src/pages/ResetPasswordPage.tsx`

1. **Add a `sessionReady` state** (default `false`) and a `useEffect` that listens to `onAuthStateChange` for the `PASSWORD_RECOVERY` event (or checks if a session already exists). Set `sessionReady = true` once detected.

2. **Show a loading spinner** while `sessionReady` is false — prevents the user from seeing the form before the session is ready.

3. **Handle the edge case** where the hash is missing or invalid (no recovery event fires within a timeout) — show an error message like "This reset link has expired or is invalid" with a link back to the auth page.

4. **Set `formError` to `null` initially** instead of showing "Auth session missing" before the session loads.

### Files Changed

| File | Action |
|------|--------|
| `src/pages/ResetPasswordPage.tsx` | Add session readiness check with loading state |

