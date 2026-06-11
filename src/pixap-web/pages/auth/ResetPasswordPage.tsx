import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";
import { AppInput } from "@/pixap-web/shared/ui/AppInput";
import { AppSpinner } from "@/pixap-web/shared/ui/AppSpinner";
import { mapAuthError } from "@/pixap-web/shared/lib/authRedirect";

/**
 * Public route. Reached via the recovery link Supabase sends to email.
 * The SDK consumes the token in the URL hash and emits a PASSWORD_RECOVERY
 * event — at that point we let the user set a new password.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout: number | undefined;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setReady(true);
      }
    });

    // If user already has a session (e.g. link consumed before listener mounted)
    // still allow them to update.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else {
        timeout = window.setTimeout(() => {
          if (!ready) setTokenError("This reset link is invalid or has expired.");
        }, 3000);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
      if (timeout) window.clearTimeout(timeout);
    };
    // ready intentionally omitted — we only set the timeout once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(mapAuthError(error.message));
      return;
    }
    // Sign out so the user logs in fresh with the new password.
    await supabase.auth.signOut();
    navigate("/pixap/auth?reset=ok", { replace: true });
  };

  if (tokenError) {
    return (
      <main className="pixap-shell px-4 py-10 flex flex-col gap-3 text-center items-center">
        <p className="text-[15px] text-[var(--pixap-danger)]">{tokenError}</p>
        <a href="/pixap/auth/forgot-password" className="text-[var(--pixap-link)] text-[14px]">
          Request a new link
        </a>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="pixap-shell px-4 py-16 flex flex-col items-center gap-3">
        <AppSpinner size={26} />
        <p className="text-[13px] text-[var(--pixap-text-muted)]">
          Validating reset link…
        </p>
      </main>
    );
  }

  return (
    <main className="pixap-shell px-4 py-6 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-bold text-[var(--pixap-text)]">
          Set a new password
        </h1>
        <p className="text-[14px] text-[var(--pixap-text-muted)] mt-1">
          Choose a password of at least 8 characters.
        </p>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <AppInput
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AppInput
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error ? (
          <div
            role="alert"
            className="text-[13px] text-[var(--pixap-danger)] bg-[var(--pixap-danger-surface)] px-3 py-2 rounded-[var(--pixap-radius-button)]"
          >
            {error}
          </div>
        ) : null}
        <AppButton type="submit" variant="accent" size="lg" fullWidth loading={loading}>
          Update password
        </AppButton>
      </form>
    </main>
  );
}
