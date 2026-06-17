import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";

export default function EmailSentPage() {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<"ok" | "err" | null>(null);

  const resend = async () => {
    if (!email) return;
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/pixap/auth/callback`,
      },
    });
    setSent(error ? "err" : "ok");
    setSending(false);
  };

  return (
    <main className="min-h-[100dvh] w-full flex items-stretch md:items-center justify-center bg-[var(--pixap-background)] md:px-6 md:py-10">
      <div className="flex w-full flex-col gap-6 items-center text-center px-4 py-10 min-h-[100dvh] justify-center md:min-h-0 md:max-w-[440px] md:justify-start md:rounded-2xl md:border md:border-[var(--pixap-border)] md:bg-[var(--pixap-surface)] md:px-7 md:py-10 md:shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
        <div
          aria-hidden
          className="h-16 w-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background: "var(--pixap-gradient-cta)" }}
        >
          ✉️
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold text-[var(--pixap-text)]">
            Check your inbox
          </h1>
          <p className="text-[14px] text-[var(--pixap-text-muted)] max-w-xs">
            We sent a confirmation link to{" "}
            <span className="text-[var(--pixap-text)] font-semibold">
              {email || "your email"}
            </span>
            . Open it to activate your account.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <AppButton
            variant="secondary"
            fullWidth
            loading={sending}
            onClick={resend}
            disabled={!email}
          >
            Resend email
          </AppButton>
          <Link
            to="/pixap/auth"
            className="text-[13px] text-[var(--pixap-link)] py-2"
          >
            Back to sign in
          </Link>
        </div>

        {sent === "ok" ? (
          <p className="text-[12px] text-[var(--pixap-text-muted)]">
            Sent. Check your inbox again.
          </p>
        ) : sent === "err" ? (
          <p className="text-[12px] text-[var(--pixap-danger)]">
            Could not resend. Try again in a moment.
          </p>
        ) : null}
      </div>
    </main>
  );
}
