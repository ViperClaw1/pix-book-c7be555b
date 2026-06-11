import { ReactNode } from "react";

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function StepLayout({ title, subtitle, children }: StepLayoutProps) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5">
        <h2 className="text-[22px] font-bold leading-tight text-[var(--pixap-text)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-[14px] text-[var(--pixap-text-muted)]">{subtitle}</p>
        ) : null}
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
