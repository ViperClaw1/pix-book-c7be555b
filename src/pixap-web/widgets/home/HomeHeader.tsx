import { Bell, ChevronDown, MapPin } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/pixap-web/shared/lib/cn";

interface Props {
  city: string;
  cities?: string[];
  onSelectCity?: (city: string) => void;
  onChangeCity?: () => void;
  notificationsCount?: number;
}

export function HomeHeader({
  city,
  cities,
  onSelectCity,
  onChangeCity,
  notificationsCount = 0,
}: Props) {
  const list = cities ?? [];

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-3",
        "px-4 md:px-6 xl:px-10 pt-4 pb-3",
        "bg-[var(--pixap-background)]/75 backdrop-blur-xl",
        "border-b border-[var(--pixap-border)]/60",
      )}
    >
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            onClick={list.length === 0 ? onChangeCity : undefined}
            className={cn(
              "flex items-center gap-1.5 h-10 pl-2 pr-3 rounded-full text-left",
              "hover:bg-[var(--pixap-tag-muted)] transition-colors",
            )}
          >
            <span className="h-7 w-7 rounded-full bg-[var(--pixap-tag-muted)] flex items-center justify-center">
              <MapPin size={14} className="text-[var(--pixap-accent)]" aria-hidden />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-[var(--pixap-text-muted)]">
                City
              </span>
              <span className="flex items-center gap-1 text-[14px] font-semibold text-[var(--pixap-text)]">
                {city}
                <ChevronDown size={13} aria-hidden />
              </span>
            </span>
          </button>
        </Popover.Trigger>
        {list.length > 0 ? (
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={8}
              className={cn(
                "z-50 min-w-[180px] p-1.5 rounded-2xl",
                "bg-[var(--pixap-card)] border border-[var(--pixap-border)]",
                "shadow-xl animate-scale-in",
              )}
            >
              {list.map((c) => {
                const active = c === city;
                return (
                  <Popover.Close key={c} asChild>
                    <button
                      type="button"
                      onClick={() => onSelectCity?.(c)}
                      aria-selected={active}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium",
                        "hover:bg-[var(--pixap-tag-muted)] transition-colors",
                        active
                          ? "text-[var(--pixap-accent)]"
                          : "text-[var(--pixap-text)]",
                      )}
                    >
                      {c}
                    </button>
                  </Popover.Close>
                );
              })}
            </Popover.Content>
          </Popover.Portal>
        ) : null}
      </Popover.Root>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        className="relative h-10 w-10 rounded-full bg-[var(--pixap-tag-muted)] flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Bell size={18} className="text-[var(--pixap-text)]" aria-hidden />
        {notificationsCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--pixap-accent)] text-[var(--pixap-on-accent)] text-[10px] font-bold flex items-center justify-center">
            {notificationsCount > 9 ? "9+" : notificationsCount}
          </span>
        )}
      </button>
    </header>
  );
}
