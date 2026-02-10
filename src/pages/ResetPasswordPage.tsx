import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
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
            {/* Password policy chips */}
            <div className="flex flex-wrap gap-2 mt-1.5 ml-1">
              {[
                { met: checks.minLength, label: "8+ characters" },
                { met: checks.hasDigit, label: "1 digit" },
                { met: checks.hasSpecial, label: "1 special char" },
              ].map(({ met, label }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                    met
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {met && <CheckCircle2 className="w-3 h-3" />}
                  {label}
                </span>
              ))}
            </div>
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
