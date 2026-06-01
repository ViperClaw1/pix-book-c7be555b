import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import LandingPage from "./pages/LandingPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import DataDeletionPage from "./pages/DataDeletionPage";
import UserAgreementPage from "./pages/UserAgreementPage";
import CommunityGuidelinesPage from "./pages/CommunityGuidelinesPage";
import CookieConsent from "./components/CookieConsent";
import { I18nProvider } from "./i18n/I18nProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CookieConsent />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/returns" element={<ReturnPolicyPage />} />
            <Route path="/data-deletion" element={<DataDeletionPage />} />
            <Route path="/terms" element={<UserAgreementPage />} />
            <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
