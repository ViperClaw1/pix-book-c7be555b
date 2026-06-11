import { Navigate, Route, Routes } from "react-router-dom";
import FoundationPreview from "@/pixap-web/pages/FoundationPreview";
import AuthPage from "@/pixap-web/pages/auth/AuthPage";
import EmailSentPage from "@/pixap-web/pages/auth/EmailSentPage";
import AuthCallbackPage from "@/pixap-web/pages/auth/AuthCallbackPage";
import ForgotPasswordPage from "@/pixap-web/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pixap-web/pages/auth/ResetPasswordPage";
import VerifyEmailPage from "@/pixap-web/pages/auth/VerifyEmailPage";
import HomePlaceholder from "@/pixap-web/pages/home/HomePlaceholder";
import OnboardingPage from "@/pixap-web/pages/onboarding/OnboardingPage";
import { RequireAuth } from "@/pixap-web/features/terms-acceptance/RequireAuth";

/**
 * Pixap web router. Mounted under `/pixap/*` from the root App.
 */
export function PixapRoutes() {
  return (
    <Routes>
      <Route index element={<RequireAuth><HomePlaceholder /></RequireAuth>} />
      <Route path="auth" element={<AuthPage />} />
      <Route path="auth/email-sent" element={<EmailSentPage />} />
      <Route path="auth/callback" element={<AuthCallbackPage />} />
      <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="verify-email" element={<VerifyEmailPage />} />
      <Route
        path="onboarding"
        element={<RequireAuth><OnboardingPage /></RequireAuth>}
      />
      <Route path="foundation" element={<FoundationPreview />} />
      <Route path="*" element={<Navigate to="/pixap" replace />} />
    </Routes>
  );
}
