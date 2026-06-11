import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";
import { AppInput } from "@/pixap-web/shared/ui/AppInput";
import { TermsAcceptance } from "@/pixap-web/features/terms-acceptance/TermsAcceptance";
import { mapAuthError, postAuthRoute } from "@/pixap-web/shared/lib/authRedirect";

type Tab = "signin" | "signup";

export default function AuthPage() {
  const [params] = useSearchParams();
  const initialTab: Tab = params.get("mode") === "signup" ? "signup" : "signin";
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const isSignup = tab === "signup";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setTermsError(undefined);

    if (isSignup && !terms) {
      setTermsError("Please accept the Terms and Privacy Policy.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/pixap/auth/callback`,
          },
        });
        if (error) {
          setError(mapAuthError(error.message));
          return;
        }
        navigate(`/pixap/auth/email-sent?email=${encodeURIComponent(email)}`);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(mapAuthError(error.message));
          return;
        }
        navigate(postAuthRoute(data.user), { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    if (isSignup && !terms) {
      setTermsError("Please accept the Terms and Privacy Policy.");
      return;
    }
    setError(undefined);
    const setBusy = provider === "google" ? setGoogleLoading : setAppleLoading;
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: `${window.location.origin}/pixap/auth/callback`,
      });
      if ((result as { error?: Error }).error) {
        setError(mapAuthError((result as { error?: Error }).error?.message));
        setBusy(false);
      }
    } catch (err) {
      setError(mapAuthError(err instanceof Error ? err.message : String(err)));
      setBusy(false);
    }
  };

  return (
    <main className="pixap-shell px-4 py-6 flex flex-col gap-6 min-h-[100dvh] justify-center">
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold leading-[34px] text-[var(--pixap-text)]">
          Pixap
        </h1>
        <p className="text-[14px] text-[var(--pixap-text-muted)]">
          {isSignup
            ? "Create your account to get started."
            : "Welcome back. Sign in to continue."}
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Auth mode"
        className="grid grid-cols-2 p-1 rounded-[var(--pixap-radius-pill)] bg-[var(--pixap-tag-muted)]"
      >
        {(["signin", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={
              "h-9 text-[13px] font-semibold rounded-[var(--pixap-radius-pill)] transition-colors " +
              (tab === t
                ? "bg-[var(--pixap-surface)] text-[var(--pixap-text)] shadow-sm"
                : "text-[var(--pixap-text-muted)]")
            }
          >
            {t === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <AppInput
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <AppInput
          label="Password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        {!isSignup ? (
          <div className="flex justify-end">
            <Link
              to="/pixap/auth/forgot-password"
              className="text-[13px] text-[var(--pixap-link)]"
            >
              Forgot password?
            </Link>
          </div>
        ) : (
          <TermsAcceptance
            checked={terms}
            onChange={setTerms}
            error={termsError}
          />
        )}

        {error ? (
          <div
            role="alert"
            className="text-[13px] text-[var(--pixap-danger)] bg-[var(--pixap-danger-surface)] px-3 py-2 rounded-[var(--pixap-radius-button)]"
          >
            {error}
          </div>
        ) : null}

        <AppButton type="submit" variant="accent" size="lg" fullWidth loading={loading}>
          {isSignup ? "Create account" : "Sign in"}
        </AppButton>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--pixap-border)]" />
        <span className="text-[12px] text-[var(--pixap-text-muted)]">or continue with</span>
        <div className="flex-1 h-px bg-[var(--pixap-border)]" />
      </div>

      <div className="flex flex-col gap-2">
        <AppButton
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          loading={googleLoading}
          onClick={() => handleOAuth("google")}
        >
          <GoogleGlyph />
          Continue with Google
        </AppButton>

        <AppButton
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          loading={appleLoading}
          onClick={() => handleOAuth("apple")}
        >
          <AppleGlyph />
          Continue with Apple
        </AppButton>
      </div>
    </main>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.05l3.02-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
