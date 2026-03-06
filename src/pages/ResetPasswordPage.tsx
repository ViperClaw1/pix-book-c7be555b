import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const passwordChecks = (pw: string) => ({
  minLength: pw.length >= 8,
  hasDigit: /\d/.test(pw),
  hasSpecial: /[^A-Za-z0-9]/.test(pw),
});

const allPassed = (pw: string) => {
  const c = passwordChecks(pw);
  return c.minLength && c.hasDigit && c.hasSpecial;
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const touchedRef = useRef<Record<string, boolean>>({});
  const [sessionReady, setSessionReady] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && !sessionReady)) {
        setSessionReady(true);
      }
    });

    // Check if session already exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    // Timeout: if no recovery session after 5s, link is invalid/expired
    const timeout = setTimeout(() => {
      setSessionReady((ready) => {
        if (!ready) setLinkExpired(true);
        return ready;
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const validateField = useCallback(
    (field: string, value: string) => {
      let err: string | undefined;
      if (field === "password") {
        if (!value) err = "Password is required";
        else if (!allPassed(value)) err = "Password does not meet all requirements";
      } else if (field === "confirmPassword") {
        if (!value) err = "Please confirm your password";
        else if (value !== password) err = "Passwords do not match";
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

  const handleChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (touchedRef.current[field]) validateField(field, value);
  };

  const checks = passwordChecks(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    touchedRef.current.password = true;
    touchedRef.current.confirmPassword = true;
    const v1 = validateField("password", password);
    const v2 = validateField("confirmPassword", confirmPassword);
    if (!v1 || !v2) return;

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      setFormError(error);
      return;
    }
    toast.success("Password updated successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">New password</h1>
        <p className="text-sm text-muted-foreground mb-8">Enter your new password below.</p>

        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value, setPassword)}
                onBlur={() => handleBlur("password", password)}
                disabled={loading}
                aria-label="New password"
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
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            {/* Password policy checklist */}
            {password.length > 0 && (
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
            )}
            {fieldErrors.password && (
              <p id="password-error" role="alert" className="text-xs text-destructive mt-1 ml-1">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value, setConfirmPassword)}
                onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                disabled={loading}
                aria-label="Confirm new password"
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                className="pl-10 h-12 rounded-xl bg-secondary border-0"
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p id="confirmPassword-error" role="alert" className="text-xs text-destructive mt-1 ml-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base font-semibold">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Update Password
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
