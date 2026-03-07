

## Move Notifications from BottomNav to Header Bell

### Changes

**1. `src/components/BottomNav.tsx`**
- Remove the `NotificationsSheet` import, `useUnreadCount` hook, `Bell` import, and the entire notifications bell block (lines 51-64)
- Remove unused imports (`Bell`, `useUnreadCount`, `NotificationsSheet`)

**2. `src/pages/Index.tsx`**
- Import `NotificationsSheet` component
- Wrap the existing header Bell button with `<NotificationsSheet>` so tapping it opens the drawer
- Keep the existing unread badge logic as-is

The header Bell button (line 30-37) becomes:
```tsx
<NotificationsSheet unreadCount={unreadCount}>
  <button className="relative p-2 rounded-full bg-secondary">
    <Bell className="w-5 h-5 text-foreground" />
    {unreadCount > 0 && (
      <span className="...">
        {unreadCount}
      </span>
    )}
  </button>
</NotificationsSheet>
```

### Files Changed

| File | Action |
|------|--------|
| `src/components/BottomNav.tsx` | Remove Alerts bell + related imports |
| `src/pages/Index.tsx` | Wrap header Bell with NotificationsSheet |

