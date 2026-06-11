import { Bell, ChevronDown, MapPin } from "lucide-react";

interface Props {
  city: string;
  onChangeCity: () => void;
  notificationsCount?: number;
}

export function HomeHeader({ city, onChangeCity, notificationsCount = 0 }: Props) {
  return (
    <header className="flex items-center justify-between px-4 pt-5 pb-3">
      <button
        type="button"
        onClick={onChangeCity}
        className="flex items-center gap-1.5 text-left"
      >
        <MapPin size={16} className="text-[var(--pixap-accent)]" aria-hidden />
        <div className="flex flex-col leading-tight">
          <span className="text-[12px] text-[var(--pixap-text-muted)]">
            Your city
          </span>
          <span className="flex items-center gap-1 text-[15px] font-semibold text-[var(--pixap-text)]">
            {city}
            <ChevronDown size={14} aria-hidden />
          </span>
        </div>
      </button>
      <button
        type="button"
        aria-label="Notifications"
        className="relative h-10 w-10 rounded-full bg-[var(--pixap-tag-muted)] flex items-center justify-center"
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
