import { AppButton } from "@/pixap-web/shared/ui/AppButton";
import { AppInput } from "@/pixap-web/shared/ui/AppInput";
import { AppSpinner } from "@/pixap-web/shared/ui/AppSpinner";
import { Avatar } from "@/pixap-web/shared/ui/Avatar";
import { Badge } from "@/pixap-web/shared/ui/Badge";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { usePixapTheme } from "@/pixap-web/app/providers/ThemeProvider";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";

export default function FoundationPreview() {
  const { theme, toggle } = usePixapTheme();
  const { session, loading } = usePixapAuth();

  return (
    <main className="pixap-shell px-4 py-5 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold leading-[34px] text-[var(--pixap-text)]">
          Pixap
        </h1>
        <AppButton variant="secondary" size="sm" onClick={toggle}>
          {theme === "dark" ? "Light" : "Dark"}
        </AppButton>
      </header>

      <section className="flex flex-col gap-2">
        <p className="text-[17px] font-semibold text-[var(--pixap-text)]">
          Phase 0 — Foundation
        </p>
        <p className="text-[14px] text-[var(--pixap-text-muted)]">
          Tokens, providers, primitives and Supabase wired up. Theme toggles
          via the button above and persists in <code>localStorage</code>.
        </p>
      </section>

      <section className="flex flex-col gap-3 p-4 rounded-[var(--pixap-radius-card)] bg-[var(--pixap-card)] border border-[var(--pixap-border)]">
        <p className="text-[15px] font-semibold text-[var(--pixap-text)]">Primitives</p>
        <div className="flex flex-wrap gap-2">
          <AppButton variant="primary" size="md">Primary</AppButton>
          <AppButton variant="accent" size="md">Accent</AppButton>
          <AppButton variant="secondary" size="md">Secondary</AppButton>
          <AppButton variant="ghost" size="md">Ghost</AppButton>
        </div>
        <AppInput label="Email" placeholder="you@example.com" />
        <div className="flex items-center gap-3">
          <Avatar name="Pix Ap" size={40} />
          <Badge tone="accent">NEW</Badge>
          <Badge tone="neutral">Tag</Badge>
          <AppSpinner />
        </div>
        <Skeleton className="h-20 w-full" />
      </section>

      <section
        className="p-4 rounded-[var(--pixap-radius-hero)] text-white font-semibold"
        style={{ background: "var(--pixap-gradient-cta)" }}
      >
        CTA gradient
      </section>

      <section className="text-[12px] text-[var(--pixap-text-muted)]">
        Auth: {loading ? "checking…" : session ? `signed in as ${session.user.email}` : "signed out"}
      </section>
    </main>
  );
}
