import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";

/** Phase 2 will replace this with the real 6-step preference flow. */
export default function OnboardingPlaceholder() {
  const navigate = useNavigate();
  const { user } = usePixapAuth();
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    setLoading(true);
    await supabase.auth.updateUser({
      data: { ...(user?.user_metadata ?? {}), pixap_onboarded: true },
    });
    setLoading(false);
    navigate("/pixap", { replace: true });
  };

  return (
    <main className="pixap-shell px-4 py-6 flex flex-col gap-4">
      <h1 className="text-[22px] font-bold text-[var(--pixap-text)]">
        Welcome to Pixap
      </h1>
      <p className="text-[14px] text-[var(--pixap-text-muted)]">
        The real onboarding (city, categories, vibes, habits, music, temperament)
        ships in Phase 2. Tap below to mark this account as onboarded.
      </p>
      <AppButton variant="accent" size="lg" fullWidth loading={loading} onClick={finish}>
        Continue
      </AppButton>
    </main>
  );
}
