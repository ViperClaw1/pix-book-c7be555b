import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";
import { AppInput } from "@/pixap-web/shared/ui/AppInput";
import { mapAuthError } from "@/pixap-web/shared/lib/authRedirect";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/pixap/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(mapAuthError(error.message));
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <main className="pixap-shell px-4 py-10 flex flex-col gap-4 text-center items-center">
        <h1 className="text-[22px] font-bold text-[var(--pixap-text)]">
          Check your email
        </h1>
        <p className="text-[14px] text-[var(--pixap-text-muted)] max-w-xs">
          If an account exists for {email}, we sent a password reset link.
        </p>
        <Link to="/pixap/auth" className="text-[var(--pixap-link)] text-[14px]">
          Back to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="pixap-shell px-4 py-6 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-bold text-[var(--pixap-text)]">
          Reset password
        </h1>
        <p className="text-[14px] text-[var(--pixap-text-muted)] mt-1">
          Enter your email and we'll send you a reset link.
        </p>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <AppInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Send reset link
        </AppButton>
        <Link
          to="/pixap/auth"
          className="text-center text-[13px] text-[var(--pixap-link)] py-1"
        >
          Back to sign in
        </Link>
      </form>
    </main>
  );
}
