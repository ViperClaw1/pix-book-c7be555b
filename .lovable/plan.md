

## Plan: Update Google SSO Redirect URI for Native App

### Context
The app is wrapped in a native mobile shell and needs OAuth callbacks to redirect to `https://pixapp.kz/~oauth/callback` instead of the current `window.location.origin`, so the native app can intercept the redirect via deep linking (configured in the `.well-known/assetlinks.json` and `apple-app-site-association.json` files already in place).

### Changes

**File: `src/pages/AuthPage.tsx`**

Update the `redirect_uri` in both OAuth calls (Google on line 551 and Apple on line 582) from `window.location.origin` to `https://pixapp.kz/~oauth/callback`:

```typescript
// Google (line 551)
redirect_uri: "https://pixapp.kz/~oauth/callback",

// Apple (line 582)
redirect_uri: "https://pixapp.kz/~oauth/callback",
```

### Important Note
For this to work, `https://pixapp.kz` must be added as an allowed redirect URL in the Cloud authentication settings. The managed OAuth provider must recognize this domain. You may need to update the redirect URL allowlist in your Cloud dashboard under Authentication Settings → Redirect URLs.

