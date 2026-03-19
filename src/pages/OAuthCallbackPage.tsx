import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const CALLBACK_TIMEOUT_MS = 10000;

const buildAuthErrorUrl = (error?: string | null, errorCode?: string | null, errorDescription?: string | null) => {
  const params = new URLSearchParams();

  if (error) params.set("error", error);
  if (errorCode) params.set("error_code", errorCode);
  if (errorDescription) params.set("error_description", errorDescription);

  const query = params.toString();
  return query ? `/auth?${query}` : "/auth";
};

const OAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.startsWith("#") ? url.hash.slice(1) : url.hash);
    const code = url.searchParams.get("code");
    const authError = hashParams.get("error") ?? url.searchParams.get("error");
    const authErrorCode = hashParams.get("error_code") ?? url.searchParams.get("error_code");
    const authErrorDescription = hashParams.get("error_description") ?? url.searchParams.get("error_description");

    let isFinished = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let unsubscribe = () => {};

    const finish = (destination: string) => {
      if (isFinished) return;
      isFinished = true;
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
      navigate(destination, { replace: true });
    };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        finish("/");
      }
    });
    unsubscribe = () => data.subscription.unsubscribe();

    timeoutId = setTimeout(() => {
      finish(buildAuthErrorUrl("invalid_request", "bad_oauth_state", "OAuth state not found or expired"));
    }, CALLBACK_TIMEOUT_MS);

    if (authError) {
      finish(buildAuthErrorUrl(authError, authErrorCode, authErrorDescription));
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        unsubscribe();
      };
    }

    void (async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          finish(buildAuthErrorUrl("invalid_request", "bad_oauth_state", error.message));
          return;
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        finish("/");
      }
    })();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
