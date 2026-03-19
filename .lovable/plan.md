

## Plan: Fix Google OAuth for Native App

### Problem
The managed OAuth proxy (`oauth.lovable.app`) always acts as an intermediary in the OAuth flow. In a native WebView, the state cookie/parameter gets lost during the redirect chain, causing "Missing state parameter / invalid_request" errors.

### Solution: Bypass the managed OAuth proxy

Switch from the managed `lovable.auth.signInWithOAuth()` to calling `supabase.auth.signInWithOAuth()` directly. This removes the `oauth.lovable.app` intermediary entirely, so the flow becomes: your app → Google → `https://pixapp.kz/~oauth/callback`.

**This requires setting up your own Google OAuth credentials.**

### Steps

1. **Set up Google OAuth credentials (you do this)**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Credentials
   - Create an OAuth 2.0 Client ID (Web application)
   - Add `https://ceoqpgxbilpytvqtmebm.supabase.co/auth/v1/callback` as an authorized redirect URI
   - Add `https://pixapp.kz` to authorized JavaScript origins
   - Note the Client ID and Client Secret

2. **Configure credentials in Cloud dashboard**
   - Open the Cloud dashboard and navigate to Users → Authentication Settings → Sign In Methods → Google
   - Enter your Client ID and Client Secret

3. **Update `src/pages/AuthPage.tsx`**
   - Replace `lovable.auth.signInWithOAuth("google", ...)` with direct Supabase call:
   ```typescript
   import { supabase } from "@/integrations/supabase/client";

   const { error } = await supabase.auth.signInWithOAuth({
     provider: "google",
     options: {
       redirectTo: "https://pixapp.kz/~oauth/callback",
     },
   });
   ```
   - Do the same for Apple if needed (Apple requires its own credentials too)
   - Remove the `lovable` import if no longer used elsewhere

### Why this works
By calling Supabase directly, the OAuth redirect goes straight from Google to your Supabase project's callback (`*.supabase.co/auth/v1/callback`), which then redirects to your `redirectTo` URL (`https://pixapp.kz/~oauth/callback`). No `oauth.lovable.app` intermediary, no lost state parameter.

### Technical details
- **File changed**: `src/pages/AuthPage.tsx`
- Uses `supabase.auth.signInWithOAuth` with `redirectTo` (not `redirect_uri`)
- The `lovable` import and Apple OAuth call should also be updated if Apple sign-in is needed with own credentials

