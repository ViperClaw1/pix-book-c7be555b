import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Mode = "login" | "signup" | "forgot";

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) { toast.error(error); return; }
        toast.success("Welcome back!");
        navigate("/");
      } else if (mode === "signup") {
        if (password !== confirmPassword) { toast.error("Passwords don't match"); return; }
        if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) { toast.error(error); return; }
        toast.success("Check your email to verify your account!");
        setMode("login");
      } else {
        const { error } = await resetPassword(email);
        if (error) { toast.error(error); return; }
        toast.success("Password reset link sent to your email!");
        setMode("login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-4 pt-4 safe-top">
        {mode !== "login" && (
          <button onClick={() => setMode("login")} className="p-2 -ml-2">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl bg-secondary border-0"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl bg-secondary border-0"
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-12 rounded-xl bg-secondary border-0"
            />
          </div>

          {mode !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10 h-12 rounded-xl bg-secondary border-0"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          )}

          {mode === "signup" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 h-12 rounded-xl bg-secondary border-0"
              />
            </div>
          )}

          {mode === "login" && (
            <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary font-medium">
              Forgot password?
            </button>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base font-semibold">
            {loading
              ? "Please wait..."
              : mode === "login"
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
