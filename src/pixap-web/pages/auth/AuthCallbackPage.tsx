import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { AppSpinner } from "@/pixap-web/shared/ui/AppSpinner";
import { mapAuthError, postAuthRoute } from "@/pixap-web/shared/lib/authRedirect";

/**
 * OAuth/email confirmation landing page.
 * Supabase publishes a session via the URL hash/search; the auth listener picks
 * it up. We just wait for a session, then redirect based on onboarding status.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeout: number | undefined;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        navigate(postAuthRoute(session.user), { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session?.user) {
        navigate(postAuthRoute(data.session.user), { replace: true });
      } else {
        // Give the SDK a moment to consume the URL fragment/code.
        timeout = window.setTimeout(() => {
          if (mounted) {
            setError(mapAuthError("We could not complete sign-in."));
          }
        }, 4000);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
      if (timeout) window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <main className="pixap-shell px-4 py-16 flex flex-col gap-4 items-center text-center">
      {error ? (
        <>
          <p className="text-[15px] text-[var(--pixap-danger)]">{error}</p>
          <a href="/pixap/auth" className="text-[var(--pixap-link)] text-[14px]">
            Back to sign in
          </a>
        </>
      ) : (
        <>
          <AppSpinner size={28} />
          <p className="text-[14px] text-[var(--pixap-text-muted)]">
            Signing you in…
          </p>
        </>
      )}
    </main>
  );
}
