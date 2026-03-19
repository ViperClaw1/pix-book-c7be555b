
Do I know what the issue is? Yes — the most likely problem is that the app is now using the wrong OAuth client path for this project.

What I found:
- `src/pages/AuthPage.tsx` currently uses `supabase.auth.signInWithOAuth(...)` with `redirectTo: "https://pixapp.kz/~oauth/callback"`.
- This project still has Lovable Cloud social auth installed (`src/integrations/lovable/index.ts` exists).
- There is no frontend route/handler for `/~oauth/callback`.
- Auth logs show `/authorize` requests are being made with referer `https://pixapp.kz/~oauth/callback`, so that callback URL is part of the active flow.
- Google’s `redirect_uri_mismatch` happens before the user comes back, which means the exact redirect URI being sent to Google does not match the one registered for that Google client.

Most likely root cause:
1. The previous change switched the app from Lovable Cloud OAuth to direct `supabase.auth.signInWithOAuth`, but your Google client was configured in Cloud authentication settings.
2. In this setup, Google must trust the exact backend callback URI used by Cloud auth — not the app return URL (`https://pixapp.kz/~oauth/callback`).
3. The current code/config likely mixes two different OAuth flows:
   - app return URL: `https://pixapp.kz/~oauth/callback`
   - backend/provider callback URL: the exact callback shown in Cloud Authentication Settings for Google
4. Separately, even once Google auth succeeds, `/~oauth/callback` still needs a real route in the app.

Implementation plan:
1. Revert the Google and Apple buttons in `src/pages/AuthPage.tsx` back to the supported Lovable Cloud call:
   - use `lovable.auth.signInWithOAuth("google", { redirect_uri: "https://pixapp.kz/~oauth/callback" })`
   - same for Apple
   This aligns the frontend with Cloud auth settings and avoids mixing auth stacks.

2. Verify the Google Console redirect configuration against the exact callback shown in Cloud auth settings:
   - keep `https://pixapp.kz/~oauth/callback` as the app return URL
   - register the exact backend Google callback URI shown in Cloud Authentication Settings as an Authorized redirect URI
   - do not guess this value or substitute it with only the raw app callback
   - keep one canonical host if possible (`pixapp.kz` or `www.pixapp.kz`, not both as active auth origins)

3. Add a dedicated OAuth callback page and route:
   - new page for `/~oauth/callback`
   - wait for the auth session to be available
   - handle success/error state cleanly
   - then redirect into the correct native deep-link or in-app destination

4. Update routing in `src/App.tsx`:
   - add a public route for `/~oauth/callback`
   - ensure it is outside protected routes
   - avoid falling through to `NotFound`

5. Add temporary OAuth debug instrumentation:
   - log which provider flow is started
   - log returned OAuth errors cleanly
   - if needed, capture the generated auth URL before redirect for one debugging cycle
   This will confirm whether the browser is being sent to the expected backend callback URI.

Technical details:
- `redirect_uri_mismatch` is a Google-provider configuration error, not a database or RLS issue.
- `redirectTo` / `redirect_uri` is your app return destination after the backend finishes auth.
- Google validates the backend callback URI used by the auth provider, and that must exactly match the URI registered in Google Cloud.
- The current direct `supabase.auth.signInWithOAuth` implementation is the wrong fit for this Lovable Cloud project and is the first thing I would change.
- Missing `/~oauth/callback` route is not the cause of the 400 from Google, but it will break the post-login native handoff once the mismatch is fixed.

Files to update:
- `src/pages/AuthPage.tsx`
- `src/App.tsx`
- add new callback page, e.g. `src/pages/OAuthCallbackPage.tsx`
