
Goal: stop the broken Google/Apple sign-in loop and make social login return to `pixapp.kz/~oauth/callback` or `www.pixapp.kz/~oauth/callback` reliably.

What I found:
- `src/pages/AuthPage.tsx` currently starts social auth with `supabase.auth.signInWithOAuth(...)`.
- `src/integrations/lovable/index.ts` still exists, but it is not being used.
- `src/App.tsx` already has a public `"/~oauth/callback"` route, and `src/pages/OAuthCallbackPage.tsx` already handles token/hash callbacks.
- Official Lovable docs say Google/Apple sign-in in Lovable Cloud must use `lovable.auth.signInWithOAuth(...)`, not direct `supabase.auth.signInWithOAuth(...)`.
- Official docs also indicate that `oauth.lovable.app` is part of the managed social-auth flow. Even with your own Google credentials, Lovable still brokers the callback. So we cannot fully remove that URL from the provider handoff if we stay on Lovable Cloud social auth.

Root cause:
- The app is mixing two different auth models:
  1. Lovable Cloud managed social auth
  2. Direct Supabase OAuth initiation
- That mismatch is the most likely reason you keep getting stuck at `oauth.lovable.app/callback` or ending up with `bad_oauth_state`.

What we can and cannot fix:
- We can fix the broken flow so users end up back in your app at `https://pixapp.kz/~oauth/callback` or `https://www.pixapp.kz/~oauth/callback`.
- We cannot guarantee that Google/Apple will never pass through `oauth.lovable.app` at all, because that is part of Lovable Cloud’s managed social-auth flow.

Implementation plan:
1. Normalize the frontend to the supported Lovable Cloud flow
   - In `src/pages/AuthPage.tsx`, replace direct `supabase.auth.signInWithOAuth(...)` with `lovable.auth.signInWithOAuth(...)`.
   - Keep `redirect_uri` pointed at the app callback route on the current/canonical domain.
   - Remove the current direct-Supabase social-auth initiation logic so there is only one OAuth path.

2. Keep the app callback route as the post-login landing page
   - Keep `"/~oauth/callback"` in `src/App.tsx`.
   - Keep `src/pages/OAuthCallbackPage.tsx` as the frontend handoff page that finishes sign-in and redirects into the app.
   - Only harden it if needed for broker-return token/hash handling; no second auth model.

3. Align backend/provider configuration with the managed Lovable flow
   - In Lovable Cloud auth settings, use the Google/Apple provider setup shown there.
   - In Google/Apple consoles, whitelist every redirect URI Lovable shows for this project.
   - This likely includes the Lovable broker callback plus your allowed app return URLs.
   - Do not try to register only `pixapp.kz/~oauth/callback` as the provider callback; that is the app return URL, not necessarily the provider-facing callback.

4. Standardize domains to avoid state loss
   - Choose one canonical production host for sign-in (`pixapp.kz` or `www.pixapp.kz`).
   - Keep both allowed if needed, but make the frontend consistently start and finish on the same host to avoid state/localStorage mismatches.

5. Regenerate or re-sync the social auth integration if needed
   - Because this looks like an older or partially migrated setup, I would re-sync the managed Google/Apple auth integration so the frontend and backend use the same path again.
   - Important: `src/integrations/lovable/*` should stay auto-generated, not hand-edited.

6. Test the exact broken chain again after re-alignment
   - Fresh tab
   - Google sign-in
   - Apple sign-in
   - Browser Back then retry
   - Both `pixapp.kz` and `www.pixapp.kz`
   - Confirm the user is not stranded on the Lovable broker page and finishes at your app callback route.

Technical notes:
- The biggest correction to the previous approach is this: trying to “bypass” the Lovable broker with direct `supabase.auth.signInWithOAuth(...)` is not the supported setup for Lovable Cloud Google/Apple auth.
- So if your hard requirement is “never touch `oauth.lovable.app` at all”, the answer is likely no within Lovable Cloud managed social auth.
- If your real requirement is “don’t get stuck there; always come back to my app callback and finish sign-in”, then yes, that is the fix I would implement.

Expected outcome:
- Social login uses one consistent auth flow.
- The user may still pass through Lovable’s managed callback internally, but they should no longer get stuck there.
- The final visible callback/handoff in your app is `https://pixapp.kz/~oauth/callback` or `https://www.pixapp.kz/~oauth/callback`, followed by a successful redirect into the app.
