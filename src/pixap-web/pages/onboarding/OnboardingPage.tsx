import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";
import { ProgressDots } from "@/pixap-web/shared/ui/ProgressDots";
import { useOnboardingDraft } from "@/pixap-web/features/onboarding/useOnboardingDraft";
import { CityStep } from "@/pixap-web/features/onboarding/steps/CityStep";
import { CategoriesStep } from "@/pixap-web/features/onboarding/steps/CategoriesStep";
import { VibesStep } from "@/pixap-web/features/onboarding/steps/VibesStep";
import { HabitsStep } from "@/pixap-web/features/onboarding/steps/HabitsStep";
import { MusicStep } from "@/pixap-web/features/onboarding/steps/MusicStep";
import { TemperamentStep } from "@/pixap-web/features/onboarding/steps/TemperamentStep";

const TOTAL = 6;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = usePixapAuth();
  const { prefs, update, toggleInArray, clear } = useOnboardingDraft();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const canProceed = (() => {
    switch (step) {
      case 0:
        return !!prefs.city && prefs.city.trim().length > 1;
      case 1:
        return prefs.categoryIds.length > 0;
      case 2:
        return prefs.vibes.length > 0;
      case 3:
        return !!prefs.frequency && prefs.times.length > 0;
      case 4:
        return prefs.music.length > 0;
      case 5:
        return !!prefs.temperament;
      default:
        return false;
    }
  })();

  const finish = async () => {
    setSaving(true);
    setError(undefined);
    const { error: err } = await supabase.auth.updateUser({
      data: {
        ...(user?.user_metadata ?? {}),
        pixap_onboarded: true,
        pixap_prefs: prefs,
      },
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    clear();
    navigate("/pixap", { replace: true });
  };

  const next = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else void finish();
  };
  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <main className="flex min-h-[100dvh] w-full items-stretch justify-center bg-[var(--pixap-background)] md:items-center md:px-6 md:py-10">
      <div
        className="
          flex w-full flex-col px-4 pb-6 pt-5
          min-h-[100dvh]
          md:min-h-0 md:max-w-[640px] md:rounded-2xl md:border md:border-[var(--pixap-border)]
          md:bg-[var(--pixap-surface)] md:px-8 md:py-8 md:shadow-[0_8px_40px_rgba(0,0,0,0.15)]
          lg:max-w-[760px]
        "
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="text-[14px] text-[var(--pixap-text-muted)] disabled:opacity-30"
          >
            ← Back
          </button>
          <ProgressDots total={TOTAL} current={step} />
          <span className="text-[12px] text-[var(--pixap-text-muted)]">
            {step + 1}/{TOTAL}
          </span>
        </div>

        <section className="mt-6 flex-1 md:flex-none">
          {step === 0 && (
            <CityStep value={prefs.city} onChange={(c) => update("city", c)} />
          )}
          {step === 1 && (
            <CategoriesStep
              value={prefs.categoryIds}
              onToggle={(id) => toggleInArray("categoryIds", id)}
            />
          )}
          {step === 2 && (
            <VibesStep
              value={prefs.vibes}
              onToggle={(v) => toggleInArray("vibes", v)}
            />
          )}
          {step === 3 && (
            <HabitsStep
              frequency={prefs.frequency}
              onFrequency={(f) => update("frequency", f as never)}
              times={prefs.times}
              onToggleTime={(t) => toggleInArray("times", t)}
            />
          )}
          {step === 4 && (
            <MusicStep
              value={prefs.music}
              onToggle={(v) => toggleInArray("music", v)}
            />
          )}
          {step === 5 && (
            <TemperamentStep
              value={prefs.temperament}
              onChange={(v) => update("temperament", v as never)}
            />
          )}
        </section>

        {error ? (
          <p className="mt-3 text-[13px] text-[var(--pixap-danger)]">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 md:items-center">
          <div className="w-full md:max-w-[320px]">
            <AppButton
              variant="accent"
              size="lg"
              fullWidth
              loading={saving}
              disabled={!canProceed}
              onClick={next}
            >
              {step === TOTAL - 1 ? "Finish" : "Continue"}
            </AppButton>
          </div>
        </div>
      </div>
    </main>
  );
}
