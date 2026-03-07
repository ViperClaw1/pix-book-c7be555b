

## In-App & Push Notifications

### Overview

There are two parts: (1) in-app notifications shown in a bottom sheet with real-time updates, and (2) push notifications via OneSignal for the React Native wrapper.

---

### Part 1: In-App Notifications

#### 1a. Database: Allow inserts from edge functions

The `notifications` table exists but has no INSERT RLS policy. Notifications will be created server-side (from the Stripe webhook and a new booking notification edge function) using the service role key, so no RLS INSERT policy is needed — service role bypasses RLS.

Enable realtime on the notifications table so the UI updates instantly:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

#### 1b. Update Stripe Webhook to create notifications

In `supabase/functions/stripe-webhook/index.ts`, after clearing the cart on `checkout.session.completed`:

- Insert a **buyer notification**: "Your purchase of X ₸ was successful!"
- Insert an **admin notification** for all admin users: "New purchase of X ₸ by [user email]"
- Query admin user IDs from `user_roles` where `role = 'admin'`

#### 1c. Update Booking Checkout to create notifications

In `CartPage.tsx` handleCheckout (booking flow), after successful booking creation, call a new edge function `create-notification` that inserts notifications for both the buyer and admin users.

Alternatively, to keep it simpler: create a single **`send-notification`** edge function that:
- Accepts `{ user_id, text, business_card_id?, notify_admins? }`
- Inserts into `notifications` table for the user
- If `notify_admins` is true, also inserts for all admin users
- Sends a push notification via OneSignal (Part 2)

#### 1d. Notifications Bottom Sheet UI

Create `src/components/NotificationsSheet.tsx`:
- A bottom drawer/sheet triggered from the BottomNav (add a Bell icon tab or overlay badge)
- Lists notifications using `useNotifications()` hook
- Each notification row shows text, timestamp, read/unread indicator
- Tapping marks as read via `useMarkAsRead()`
- Subscribe to realtime changes on `notifications` table for instant updates

#### 1e. Update BottomNav

- Add a Bell icon button (not a full tab — keep existing 5 tabs) as an overlay or replace one tab
- Show unread count badge using `useUnreadCount()`
- Opens the NotificationsSheet on tap

#### 1f. Realtime subscription

In `NotificationsSheet` or a global provider, subscribe to postgres_changes on `notifications` table filtered by `user_id` to auto-refresh when new notifications arrive.

---

### Part 2: Push Notifications via OneSignal

OneSignal is the best fit — free tier, excellent React Native support, REST API for server-side sends.

#### 2a. OneSignal Setup

- User needs a OneSignal account and App ID + REST API Key
- Store `ONESIGNAL_APP_ID` and `ONESIGNAL_REST_API_KEY` as secrets

#### 2b. Push from edge function

In the `send-notification` edge function, after inserting into the DB, call OneSignal's REST API:

```typescript
await fetch("https://api.onesignal.com/notifications", {
  method: "POST",
  headers: {
    "Authorization": `Key ${ONESIGNAL_REST_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    app_id: ONESIGNAL_APP_ID,
    include_external_user_ids: [userId],
    contents: { en: notificationText },
  }),
});
```

#### 2c. React Native integration note

The React Native wrapper will need `react-native-onesignal` SDK installed and configured with the same App ID. The user's Supabase auth `user.id` should be set as the OneSignal external user ID on login. This is outside the Lovable web app scope but the edge function will be ready to target users by their auth ID.

---

### Files Changed

| File | Action |
|------|--------|
| Migration SQL | Enable realtime on `notifications` |
| `supabase/functions/send-notification/index.ts` | New edge function: insert notification + OneSignal push |
| `supabase/functions/stripe-webhook/index.ts` | Call send-notification logic after successful payment |
| `supabase/config.toml` | Add `send-notification` function config |
| `src/components/NotificationsSheet.tsx` | New bottom sheet UI for notifications list |
| `src/components/BottomNav.tsx` | Add bell icon with unread badge, open sheet |
| `src/pages/CartPage.tsx` | Call send-notification after booking checkout |
| `src/pages/PaymentSuccess.tsx` | Trigger notification query refresh on mount |
| `src/hooks/useNotifications.ts` | Add realtime subscription for live updates |

### Requires from user

- OneSignal App ID and REST API Key (will prompt via secrets tool)

