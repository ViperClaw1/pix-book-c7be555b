

## Auth Flow Hardening Plan

### Weaknesses Identified

1. **No unverified email detection** -- Login returns raw backend error ("Invalid login credentials") for unverified users; no differentiation or guidance.
2. **No password policy** beyond 6-char minimum -- no digit/special-char requirements, no inline feedback.
3. **Validation only on submit** -- password mismatch and weak password only shown as toasts after clicking, not inline.
4. **No post-signup confirmation state** -- after signup, user is switched to login mode with a toast; easy to miss the "check your email" message.
5. **No resend verification email** capability.
6. **Raw backend errors** passed directly to users (e.g., "User already registered").
7. **No field-level error messages** -- all errors are toasts only.
8. **No aria-labels** on icon-only buttons (eye toggle, back arrow).

### What Will Change

Only 2 files will be modified:

- **`src/contexts/AuthContext.tsx`** -- enhance `signIn` to detect unverified users and add a `resendVerification` method.
- **`src/pages/AuthPage.tsx`** -- the bulk of the work: inline validation, password policy, post-signup confirmation screen, resend flow, human-readable error mapping, accessibility.

No other files or auth mechanics will be touched.

---

### Detailed Changes

#### A. `src/contexts/AuthContext.tsx`

1. **Detect unverified email on login failure**
   - After `signInWithPassword` fails, check if the error message indicates invalid credentials.
   - Attempt a "shadow" signup with the same email to see if backend returns "User already registered" -- if so, the user exists but is unverified.
   - Return a structured result: `{ error, isUnverified }` instead of just `{ error }`.

2. **Add `resendVerification(email)` method**
   - Calls `supabase.auth.resend({ type: 'signup', email })`.
   - Returns `{ error }`.
   - Expose via context.

3. **Update `AuthContextType` interface** to include the new method and updated return types.

#### B. `src/pages/AuthPage.tsx`

1. **Add a new mode: `"verify-notice"`**
   - Shown after successful signup OR when an unverified user tries to log in.
   - Displays a card with a mail icon, title "Check your email", explanatory text ("We sent a verification link to {email}. You must verify before signing in."), and a "Resend verification email" button.
   - Resend button has a 60-second cooldown timer to prevent spam.

2. **Inline field-level validation (signup mode)**
   - Track per-field error strings in state: `fieldErrors: { email, password, confirmPassword, firstName, lastName }`.
   - Validate on blur and on change (after first blur):
     - **Email**: regex check, show "Please enter a valid email address".
     - **First/Last name**: non-empty, max 50 chars.
     - **Password policy**: min 8 chars, at least 1 digit, at least 1 special character. Show specific missing requirement.
     - **Confirm password**: must match password.
   - Display errors as small red text below each field.
   - Also add a **password strength indicator** (a row of requirement chips: "8+ characters", "1 digit", "1 special char" -- each turns green when met).

3. **Human-readable error mapping**
   - Create a `mapAuthError(rawError: string, mode: Mode)` helper that translates known backend strings:
     - `"Invalid login credentials"` -> `"Incorrect email or password. Please try again."`
     - `"User already registered"` -> `"An account with this email already exists. Try signing in instead."`
     - `"Email not confirmed"` -> `"Please verify your email before signing in."`
     - Network/timeout -> `"Something went wrong. Please check your connection and try again."`
     - Fallback: `"An unexpected error occurred. Please try again."`
   - Show these as a form-level alert (using the existing Alert component) above the submit button, not just toasts.

4. **Login: unverified email handling**
   - If `signIn` returns `isUnverified: true`, switch to `"verify-notice"` mode with the email pre-filled, instead of showing a generic error.

5. **Improved loading/disabled states**
   - Disable all form inputs (not just the button) during submission.
   - Show spinner inside the button.

6. **Accessibility**
   - Add `aria-label` to the password visibility toggle buttons.
   - Add `aria-label` to the back arrow button.
   - Add proper `id` and `aria-describedby` linking for inline errors.
   - Add `role="alert"` on inline error messages.

### Files Touched

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | Add `resendVerification`, enhance `signIn` return type with `isUnverified` flag |
| `src/pages/AuthPage.tsx` | Inline validation, password policy UI, verify-notice mode, resend with cooldown, error mapping, accessibility |

### Technical Notes

- The unverified-user detection will use the approach of checking the Supabase error message string. Supabase returns `"Email not confirmed"` when a user exists but hasn't verified -- we'll check for that specific string from `signInWithPassword`.
- The resend cooldown is purely client-side (60s `setTimeout` with a countdown display).
- Password policy: minimum 8 characters, at least 1 digit (`\d`), at least 1 special character (`[^A-Za-z0-9]`). This is validated client-side only; no backend changes needed since Supabase accepts any password >= 6 chars.
- The `ResetPasswordPage` will also get the same password policy validation for consistency.

