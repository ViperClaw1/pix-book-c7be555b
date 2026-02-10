import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Mode = "login" | "signup" | "forgot" | "verify-notice";

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side password policy */
const passwordChecks = (pw: string) => ({
  minLength: pw.length >= 8,
  hasDigit: /\d/.test(pw),
  hasSpecial: /[^A-Za-z0-9]/.test(pw),
});

const allPasswordChecksPassed = (pw: string) => {
  const c = passwordChecks(pw);
  return c.minLength && c.hasDigit && c.hasSpecial;
};

/** Map raw backend error strings to user-friendly messages */
const mapAuthError = (raw: string, mode: Mode): string => {
  const lower = raw.toLowerCase();

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials"))
    return "Incorrect email or password. Please try again.";

  if (lower.includes("user already registered") || lower.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";

  if (lower.includes("email not confirmed"))
    return "Please verify your email before signing in.";

  if (lower.includes("email rate limit") || lower.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";

  if (lower.includes("network") || lower.includes("fetch") || lower.includes("failed to fetch"))
    return "Something went wrong. Please check your connection and try again.";

  if (lower.includes("weak password") || lower.includes("password"))
    return raw; // pass through password-specific errors as-is

  // Fallback
  return "An unexpected error occurred. Please try again.";
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, resendVerification } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Inline field errors (shown after first blur)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const touchedRef = useRef<Record<string, boolean>>({});

  // Resend verification cooldown
  const [resendCooldown, setResendCooldown] = useState(0);

  // Tick down cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown > 0]);

  // Clear form error when switching modes
  useEffect(() => {
    setFormError(null);
    setFieldErrors({});
    touchedRef.current = {};
  }, [mode]);

  // ---- Validation helpers ----

  const validateField = useCallback(
    (field: string, value: string) => {
      let err: string | undefined;
      switch (field) {
        case "firstName":
        case "lastName": {
          const label = field === "firstName" ? "First name" : "Last name";
          if (!value.trim()) err = `${label} is required`;
          else if (value.trim().length > 50) err = `${label} must be under 50 characters`;
          break;
        }
        case "email":
          if (!value.trim()) err = "Email is required";
          else if (!EMAIL_RE.test(value)) err = "Please enter a valid email address";
          break;
        case "password":
          if (!value) err = "Password is required";
          else if (!allPasswordChecksPassed(value))
            err = "Password does not meet all requirements";
          break;
        case "confirmPassword":
          if (!value) err = "Please confirm your password";
          else if (value !== password) err = "Passwords do not match";
          break;
      }
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
      return !err;
    },
    [password],
  );

  const handleBlur = (field: string, value: string) => {
    touchedRef.current[field] = true;
    validateField(field, value);
  };

  const handleFieldChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (touchedRef.current[field]) validateField(field, value);
  };

  // ---- Submit ----

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Run validation for visible fields
    if (mode === "signup") {
      const validations = [
        validateField("firstName", firstName),
        validateField("lastName", lastName),
        validateField("email", email),
        validateField("password", password),
        validateField("confirmPassword", confirmPassword),
      ];
      // Mark all as touched
      ["firstName", "lastName", "email", "password", "confirmPassword"].forEach(
        (f) => (touchedRef.current[f] = true),
      );
      if (validations.some((v) => !v)) return;
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
      } else if (mode === "signup") {
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) {
          setFormError(mapAuthError(error, mode));
          return;
        }
        // Success → show verification notice
        setMode("verify-notice");
      } else if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) {
          setFormError(mapAuthError(error, mode));
          return;
        }
        setFormError(null);
        setMode("login");
        // We briefly set a success-like form message via formError with a special prefix
        setFormError("__success__Password reset link sent to your email!");
      }
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Resend verification ----

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setFormError(null);
    try {
      const { error } = await resendVerification(email);
      if (error) {
        setFormError(mapAuthError(error, mode));
      } else {
        setFormError("__success__Verification email sent! Check your inbox.");
        setResendCooldown(60);
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Derived ----

  const isSuccess = formError?.startsWith("__success__");
  const displayError = formError && !isSuccess ? formError : null;
  const displaySuccess = isSuccess ? formError.replace("__success__", "") : null;
  const checks = passwordChecks(password);

  // ---- Render helpers ----

  const renderFieldError = (field: keyof FieldErrors) => {
    const err = fieldErrors[field];
    if (!err) return null;
    return (
      <p id={`${field}-error`} role="alert" className="text-xs text-destructive mt-1 ml-1">
        {err}
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
            met
              ? "text-green-700 dark:text-green-400"
              : "text-muted-foreground"
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${met ? "text-green-600 dark:text-green-400" : "text-muted-foreground/40"}`} />
          {label}
        </li>
      ))}
    </ul>
  );

  // ---- Verify-notice screen ----

  if (mode === "verify-notice") {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-hidden">
        <header className="px-4 pt-4 safe-top">
          <button
            onClick={() => { setMode("login"); setFormError(null); }}
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
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mb-8">
            You must verify your email before you can sign in.
          </p>

          {/* Form-level feedback */}
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
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend verification email"}
          </Button>

          <button
            onClick={() => { setMode("login"); setFormError(null); }}
            className="mt-4 text-sm text-primary font-semibold"
          >
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  // ---- Main auth form ----

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <header className="px-4 pt-4 safe-top">
        {mode !== "login" && (
          <button
            onClick={() => setMode("login")}
            className="p-2 -ml-2"
            aria-label="Back to sign in"
          >
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

        {/* Form-level error / success alert */}
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
                  onClick={() => setShowPassword(!showPassword)}
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
              {mode === "signup" && renderPasswordPolicy()}
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
            {mode === "login"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : "Send Reset Link"}
          </Button>
        </form>

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
