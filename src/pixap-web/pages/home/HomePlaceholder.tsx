import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";
import { AppButton } from "@/pixap-web/shared/ui/AppButton";

/** Temporary post-auth placeholder. Replaced by Phase 3 home feed. */
export default function HomePlaceholder() {
  const { user, signOut } = usePixapAuth();
  return (
    <main className="pixap-shell px-4 py-6 flex flex-col gap-4">
      <h1 className="text-[28px] font-bold text-[var(--pixap-text)]">Home</h1>
      <p className="text-[14px] text-[var(--pixap-text-muted)]">
        Signed in as{" "}
        <span className="text-[var(--pixap-text)] font-semibold">
          {user?.email}
        </span>
        .
      </p>
      <AppButton variant="secondary" onClick={signOut}>
        Sign out
      </AppButton>
    </main>
  );
}
