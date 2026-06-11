import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";
import { AppSpinner } from "@/pixap-web/shared/ui/AppSpinner";

/** Gate that redirects unauthenticated users to /pixap/auth. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = usePixapAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="pixap-shell flex items-center justify-center py-20">
        <AppSpinner size={26} />
      </main>
    );
  }
  if (!session) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/pixap/auth?redirect=${redirect}`} replace />;
  }
  return <>{children}</>;
}
