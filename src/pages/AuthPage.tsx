import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup" | "forgot" | "verify-notice";

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OAUTH_CALLBACK_PATH = "/~oauth/callback";
const DEFAULT_PROD_OAUTH_ORIGINS = ["https://pixapp.kz", "https://www.pixapp.kz"] as const;

const passwordChecks = (pw: string) => ({
  minLength: pw.length >= 8,
  hasDigit: /\d/.test(pw),
  hasSpecial: /[^A-Za-z0-9]/.test(pw),
});

const allPasswordChecksPassed = (pw: string) => {
  const checks = passwordChecks(pw);
  return checks.minLength && checks.hasDigit && checks.hasSpecial;
};

const parseAllowedOrigins = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const getAllowedOAuthOrigins = () => {
  const fromEnv = parseAllowedOrigins(import.meta.env.VITE_OAUTH_ALLOWED_ORIGINS);
  return fromEnv.length > 0 ? fromEnv : [...DEFAULT_PROD_OAUTH_ORIGINS];
};

const isLocalDevOrigin = (origin: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

const getOAuthRedirectUrl = () => {
  const currentOrigin = window.location.origin;

  if (isLocalDevOrigin(currentOrigin)) {
    return `${currentOrigin}${OAUTH_CALLBACK_PATH}`;
  }

  const allowedOrigins = getAllowedOAuthOrigins();
  const redirectOrigin = allowedOrigins.includes(currentOrigin) ? currentOrigin : allowedOrigins[0];
  return `${redirectOrigin}${OAUTH_CALLBACK_PATH}`;
};

const mapAuthError = (raw: string, mode: Mode): string => {
  const lower = raw.toLowerCase();

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Incorrect email or password. Please try again.";
  }

  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (lower.includes("email not confirmed")) {
    return "Please verify your email before signing in.";
  }

  if (lower.includes("email rate limit") || lower.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (lower.includes("network") || lower.includes("fetch") || lower.includes("failed to fetch")) {
    return "Something went wrong. Please check your connection and try again.";
  }

  if (lower.includes("weak password") || lower.includes("password")) {
    return raw;
  }

  return mode === "forgot"
    ? "Unable to send reset link. Please try again."
    : "An unexpected error occurred. Please try again.";
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, resendVerification } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const touchedRef = useRef<Record<string, boolean>>({});
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const id = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [resendCooldown]);

  useEffect(() => {
    setFormError(null);
    setFieldErrors({});
    touchedRef.current = {};
  }, [mode]);

  const validateField = useCallback(
    (field: string, value: string) => {
      let error: string | undefined;

      switch (field) {
        case "firstName":
        case "lastName": {
          const label = field === "firstName" ? "First name" : "Last name";
          if (!value.trim()) error = `${label} is required`;
          else if (value.trim().length > 50) error = `${label} must be under 50 characters`;
          break;
        }
        case "email":
          if (!value.trim()) error = "Email is required";
          else if (!EMAIL_RE.test(value)) error = "Please enter a valid email address";
          break;
        case "password":
          if (!value) error = "Password is required";
          else if (!allPasswordChecksPassed(value)) error = "Password does not meet all requirements";
          break;
        case "confirmPassword":
          if (!value) error = "Please confirm your password";
          else if (value !== password) error = "Passwords do not match";
          break;
      }

      setFieldErrors((prev) => ({ ...prev, [field]: error }));
      return !error;
    },
    [password],
  );

  const handleBlur = (field: string, value: string) => {
    touchedRef.current[field] = true;
    validateField(field, value);
  };

  const handleFieldChange = (field: string, value: string, setter: (value: string) => void) => {
    setter(value);
    if (touchedRef.current[field]) validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (mode === "signup") {
      const validations = [
        validateField("firstName", firstName),
        validateField("lastName", lastName),
        validateField("email", email),
        validateField("password", password),
        validateField("confirmPassword", confirmPassword),
      ];

      ["firstName", "lastName", "email", "password", "confirmPassword"].forEach((field) => {
        touchedRef.current[field] = true;
      });

      if (validations.some((isValid) => !isValid)) return;
    }

    if (mode === "login") {
      touchedRef.current.email = true;
      if (!validateField("email", email)) return;
    }

    if (mode === "forgot") {
      touchedRef.current.email = true;
      if (!validateField("email", email)) return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error, isUnverified } = await signIn(email, password);

        if (isUnverified) {
          setMode("verify-notice");
          return;
        }

        if (error) {
          setFormError(mapAuthError(error, mode));
          return;
        }

        navigate("/");
        return;
      }

      if (mode === "signup") {
        const { error } = await signUp(email, password, firstName, lastName);

        if (error) {
          setFormError(mapAuthError(error, mode));
          return;
        }

        setMode("verify-notice");
        return;
      }

      const { error } = await resetPassword(email);
      if (error) {
        setFormError(mapAuthError(error, mode));
        return;
      }

      setFormError("__success__Password reset link sent to your email!");
      setMode("login");
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;

    setLoading(true);
    setFormError(null);

    try {
      const { error } = await resendVerification(email);

      if (error) {
        setFormError(mapAuthError(error, mode));
        return;
      }

      setFormError("__success__Verification email sent! Check your inbox.");
      setResendCooldown(60);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setLoading(true);
    setFormError(null);
    const redirectTo = getOAuthRedirectUrl();

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: provider === "google" ? { prompt: "select_account" } : undefined,
        },
      });

      if (error) {
        setFormError(mapAuthError(error.message ?? String(error), mode));
        setLoading(false);
        return;
      }

      if (!data?.url) {
        setFormError("Unable to start sign in. Please try again.");
        setLoading(false);
        return;
      }

      window.location.replace(data.url);
    } catch (error) {
      setFormError(mapAuthError(error instanceof Error ? error.message : String(error), mode));
      setLoading(false);
    }
  };

  const isSuccess = formError?.startsWith("__success__");
  const displayError = formError && !isSuccess ? formError : null;
  const displaySuccess = isSuccess ? formError.replace("__success__", "") : null;
  const checks = passwordChecks(password);

  const renderFieldError = (field: keyof FieldErrors) => {
    const error = fieldErrors[field];
    if (!error) return null;

    return (
      <p id={`${field}-error`} role="alert" className="text-xs text-destructive mt-1 ml-1">
        {error}
      </p>
    );
  };

  const renderPasswordPolicy = () => (
    <ul className="mt-2 ml-1 space-y-1">
      {[
        { met: checks.minLength, label: "At least 8 characters" },
        { met: checks.hasDigit, label: "At least 1 number" },
        { met: checks.hasSpecial, label: "At least 1 special character (!@#$%…)" },
      ].map(({ met, label }) => (
        <li
          key={label}
          className={`flex items-center gap-2 text-xs transition-colors ${
            met ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
          }`}
        >
          <CheckCircle2
            className={`w-3.5 h-3.5 shrink-0 ${
              met ? "text-green-600 dark:text-green-400" : "text-muted-foreground/40"
            }`}
          />
          {label}
        </li>
      ))}
    </ul>
  );

  if (mode === "verify-notice") {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-hidden">
        <header className="px-4 pt-4 safe-top">
          <button
            onClick={() => {
              setMode("login");
              setFormError(null);
            }}
            className="p-2 -ml-2"
            aria-label="Back to sign in"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground max-w-xs mb-2">
            We sent a verification link to <span className="font-medium text-foreground">{email}</span>.
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mb-8">
            You must verify your email before you can sign in.
          </p>

          {displayError && (
            <Alert variant="destructive" className="mb-4 max-w-xs text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}
          {displaySuccess && (
            <Alert className="mb-4 max-w-xs text-left border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-400">{displaySuccess}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleResend}
            disabled={loading || resendCooldown > 0}
            variant="outline"
            className="w-full max-w-xs h-12 rounded-xl text-base font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend verification email"}
          </Button>

          <button
            onClick={() => {
              setMode("login");
              setFormError(null);
            }}
            className="mt-4 text-sm text-primary font-semibold"
          >
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <header className="px-4 pt-4 safe-top">
        {mode !== "login" && (
          <button onClick={() => setMode("login")} className="p-2 -ml-2" aria-label="Back to sign in">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center px-6 pb-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "login"
              ? "Sign in to continue"
              : mode === "signup"
                ? "Sign up to get started"
                : "Enter your email to receive a reset link"}
          </p>
        </div>

        {displayError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}
        {displaySuccess && (
          <Alert className="mb-4 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">{displaySuccess}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => handleFieldChange("firstName", e.target.value, setFirstName)}
                    onBlur={() => handleBlur("firstName", firstName)}
                    disabled={loading}
                    aria-label="First name"
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                    className="pl-10 h-12 rounded-xl bg-secondary border-0"
                  />
                </div>
                {renderFieldError("firstName")}
              </div>
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => handleFieldChange("lastName", e.target.value, setLastName)}
                    onBlur={() => handleBlur("lastName", lastName)}
                    disabled={loading}
                    aria-label="Last name"
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                    className="pl-10 h-12 rounded-xl bg-secondary border-0"
                  />
                </div>
                {renderFieldError("lastName")}
              </div>
            </div>
          )}

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value, setEmail)}
                onBlur={() => handleBlur("email", email)}
                disabled={loading}
                aria-label="Email address"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className="pl-10 h-12 rounded-xl bg-secondary border-0"
              />
            </div>
            {renderFieldError("email")}
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => handleFieldChange("password", e.target.value, setPassword)}
                  onBlur={() => handleBlur("password", password)}
                  disabled={loading}
                  aria-label="Password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className="pl-10 pr-10 h-12 rounded-xl bg-secondary border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {mode === "signup" && password.length > 0 && renderPasswordPolicy()}
              {renderFieldError("password")}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange("confirmPassword", e.target.value, setConfirmPassword)}
                  onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                  disabled={loading}
                  aria-label="Confirm password"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                  className="pl-10 h-12 rounded-xl bg-secondary border-0"
                />
              </div>
              {renderFieldError("confirmPassword")}
            </div>
          )}

          {mode === "login" && (
            <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary font-medium">
              Forgot password?
            </button>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base font-semibold">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </Button>
        </form>

        {(mode === "login" || mode === "signup") && (
          <>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold gap-3"
              onClick={() => void handleSocialSignIn("google")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold gap-3 mt-3"
              onClick={() => void handleSocialSignIn("apple")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </Button>
          </>
        )}

        <div className="mt-6 text-center">
          {mode === "login" ? (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-primary font-semibold">
                Sign Up
              </button>
            </p>
          ) : mode === "signup" ? (
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-primary font-semibold">
                Sign In
              </button>
            </p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
