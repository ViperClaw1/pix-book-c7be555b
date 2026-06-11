import type { User } from "@supabase/supabase-js";

/**
 * Decide where to send a freshly-authenticated user.
 * "New" = onboarding has never been marked complete on user metadata.
 * Onboarding step (Phase 2) will set `pixap_onboarded: true`.
 */
export function postAuthRoute(user: User | null): string {
  if (!user) return "/pixap/auth";
  const onboarded = (user.user_metadata as Record<string, unknown> | undefined)
    ?.pixap_onboarded;
  return onboarded === true ? "/pixap" : "/pixap/onboarding";
}

/** Maps Supabase auth errors to user-friendly copy. */
export function mapAuthError(message: string | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Wrong email or password.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Sign in instead.";
  if (m.includes("password should be")) return message;
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment.";
  if (m.includes("network")) return "Network error. Check your connection.";
  return message;
}
