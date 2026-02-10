

## Fix: "User Already Registered" Detection in Signup

### Root Cause

Supabase's `signUp()` does **not** return an error when signing up with an already-used email. Instead:

- **Email exists + verified**: Returns status 200 with a `user` object where `user.identities` is an empty array `[]`. No error is thrown.
- **Email exists + unverified**: Returns status 200 and re-triggers the signup flow (a "repeated signup"). Again, no error.

The current `signUp` method in `AuthContext.tsx` only checks for `error` and treats no-error as success, which is why the duplicate goes through silently.

### Solution

Modify the `signUp` function in `src/contexts/AuthContext.tsx` to inspect the response data after a successful call:

1. If `data.user.identities` is an empty array -- the email belongs to an already-verified account. Return a "User already registered" error.
2. If `data.user` exists and `data.session` is null but identities are present -- this is either a fresh signup or a repeated signup for an unverified user. For the repeated-signup case, we still want to show the verify-notice screen (which already happens since no error is returned).

### Files Changed

**`src/contexts/AuthContext.tsx`** (only file changed)

Update the `signUp` method:

```typescript
const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) return { error: error.message };

  // Supabase returns a user with an empty identities array when
  // the email is already registered and verified -- no error is thrown.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "User already registered" };
  }

  return { error: null };
};
```

This is the only change needed. The existing `mapAuthError` function in `AuthPage.tsx` already maps `"User already registered"` to the friendly message: *"An account with this email already exists. Try signing in instead."*

### Why This Works

- **Verified duplicate**: Caught by the empty `identities` check -- user sees "An account with this email already exists."
- **Unverified duplicate (repeated signup)**: Supabase re-sends the verification email and returns a user with non-empty identities. The flow proceeds to the verify-notice screen as intended, which is correct behavior.
- **Fresh signup**: Normal path, identities array has one entry, no error returned.

### No Other Files Affected

`AuthPage.tsx` already has the error mapping and verify-notice mode. This is purely a data-inspection fix in the context layer.

