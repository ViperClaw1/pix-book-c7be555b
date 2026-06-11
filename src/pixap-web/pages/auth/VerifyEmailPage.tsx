import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";
import { AppInput } from "@/pixap-web/shared/ui/AppInput";
import { OtpInput } from "@/pixap-web/features/email-verification-otp/OtpInput";
import { mapAuthError, postAuthRoute } from "@/pixap-web/shared/lib/authRedirect";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState<"ok" | "err" | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(mapAuthError(error.message));
      return;
    }
    navigate(postAuthRoute(data.user ?? null), { replace: true });
  };

  const resend = async () => {
    if (!email) return;
    setResending(true);
    setResent(null);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/pixap/auth/callback`,
      },
    });
    setResending(false);
    setResent(error ? "err" : "ok");
  };

  return (
    <main className="pixap-shell px-4 py-6 flex flex-col gap-5">
      <header>
        <h1 className="text-[22px] font-bold text-[var(--pixap-text)]">
          Verify your email
        </h1>
        <p className="text-[14px] text-[var(--pixap-text-muted)] mt-1">
          Enter the 6-digit code we sent you.
        </p>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <AppInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-[var(--pixap-text)]">
            Verification code
          </span>
          <OtpInput value={code} onChange={setCode} error={error} />
        </div>
        <AppButton type="submit" variant="accent" size="lg" fullWidth loading={loading}>
          Verify
        </AppButton>
        <div className="flex items-center justify-between">
          <AppButton
            type="button"
            variant="ghost"
            size="sm"
            loading={resending}
            onClick={resend}
            disabled={!email}
          >
            Resend code
          </AppButton>
          <Link to="/pixap/auth" className="text-[13px] text-[var(--pixap-link)]">
            Back to sign in
          </Link>
        </div>
        {resent === "ok" ? (
          <p className="text-[12px] text-[var(--pixap-text-muted)]">Code resent.</p>
        ) : resent === "err" ? (
          <p className="text-[12px] text-[var(--pixap-danger)]">
            Could not resend. Try again shortly.
          </p>
        ) : null}
      </form>
    </main>
  );
}
