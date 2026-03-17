# PIX — Application Documentation

## Table of Contents

1. [App Architecture](#app-architecture)
2. [App Functionality](#app-functionality)
3. [API Description](#api-description)

---

## App Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **State / Data** | TanStack React Query, React Context |
| **Routing** | React Router v6 (client-side SPA) |
| **Backend** | Lovable Cloud (Supabase) — Postgres DB, Auth, Edge Functions, Storage |
| **Payments** | Stripe Checkout |
| **Push Notifications** | OneSignal |
| **Maps / Geocoding** | Google Maps Embed & Places Autocomplete APIs |

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives (Button, Dialog, Sheet, etc.)
│   └── admin/           # Admin-specific components
├── contexts/            # React Context providers
│   └── AuthContext.tsx   # Authentication state & methods
├── hooks/               # Custom React hooks (data fetching, mutations)
├── integrations/        # Auto-generated Supabase client & types
├── lib/                 # Utility functions (image helpers, cn())
├── pages/               # Route-level page components
├── assets/              # Static images (hero banners, placeholders)
└── data/                # Mock / seed data

supabase/
└── functions/           # Deno-based Edge Functions (serverless backend)
    ├── admin-create-user/
    ├── create-checkout/
    ├── maps-embed/
    ├── places-autocomplete/
    ├── send-notification/
    └── stripe-webhook/
```

### Authentication & Authorization

- **Authentication** is handled via email/password through the built-in auth system.
- **Email verification** is required before sign-in (not auto-confirmed).
- **Password reset** flow redirects to `/reset-password`.
- **Roles** are stored in a dedicated `user_roles` table with the `app_role` enum (`buyer`, `partner`, `admin`).
- A `has_role(_user_id, _role)` security-definer function is used in RLS policies to prevent recursive checks.
- Admin routes (`/admin`, `/admin/:id`) are wrapped in `<ProtectedRoute>` which checks authentication.

### Row-Level Security (RLS)

Every table has RLS enabled. Key patterns:

| Table | Public Read | Authenticated CRUD | Admin Override |
|-------|------------|-------------------|----------------|
| `business_cards` | ✅ SELECT | — | INSERT / UPDATE / DELETE |
| `categories` | ✅ SELECT | — | INSERT / UPDATE / DELETE |
| `shopping_items` | ✅ SELECT | — | INSERT / UPDATE / DELETE |
| `profiles` | — | Own row only | Full CRUD |
| `bookings` | — | Own rows | SELECT all |
| `cart_items` | — | Own rows | — |
| `shopping_cart_items` | — | Own rows | — |
| `favorites` | — | Own rows (no UPDATE) | — |
| `notifications` | — | SELECT / UPDATE / DELETE own | — |
| `reviews` | ✅ SELECT | Own rows CRUD | — |
| `user_roles` | — | SELECT own | Full CRUD |

### Data Flow

```
User Action → React Component → Custom Hook (useQuery/useMutation)
  → Supabase JS Client → Postgres (RLS enforced)
  → Response → React Query Cache → UI Re-render
```

For payment:
```
Cart Page → create-checkout Edge Function → Stripe Checkout Session
  → Stripe hosted page → stripe-webhook Edge Function
  → Clear cart + Insert notifications → Redirect to /payment-success
```

---

## App Functionality

### User-Facing Features

#### Home Page (`/`)
- **Hero carousel** with promotional banners
- **Category pills** for quick filtering
- **Featured businesses** (horizontal scroll)
- **Recommended businesses** (vertical list)
- **Notification bell** in header with unread count badge

#### Search (`/search`)
- Full-text search across business cards
- Results displayed as place cards

#### Category Browsing (`/category/:id`)
- Lists all businesses within a selected category

#### Business Detail (`/place/:id`)
- Business info: name, image, address, phone, rating, tags, description
- **Reviews** section with star ratings
- **Directions** via Google Maps embed
- **Booking** button (redirects to `/book/:id`)
- **Shopping** button for businesses with items (redirects to `/shop/:id`)
- **Favorite** toggle

#### Shopping (`/shop/:id`)
- Browse items by type: main, sauce, beverage
- Add items to shopping cart with quantity
- Additional items sheet for extras

#### Cart (`/cart`)
- View all shopping cart items grouped by business
- Adjust quantities
- **Stripe Checkout** integration for payment
- Post-payment redirect to success/canceled pages

#### Bookings (`/book/:id`, `/bookings`)
- Date/time picker booking flow
- View upcoming/completed/expired bookings

#### Favorites (`/favorites`)
- List of favorited businesses

#### Profile (`/profile`, `/profile/edit`)
- View and edit personal info (name, email, phone)
- Promo codes display
- Sign out

#### Authentication (`/auth`, `/reset-password`)
- Sign up with email, password, first/last name
- Sign in with email verification check
- Resend verification email
- Password reset via email link

#### Privacy Policy (`/privacy`)
- US-law compliant privacy policy
- Device permission explanations (camera, storage, location, push notifications)

### Admin Features (`/admin`)

#### Dashboard
- **Business Cards Management**: Create, edit, delete businesses with image upload, category assignment, address autocomplete
- **Users Management**: View all profiles, change roles, delete users, create new users
- **Transactions/Bookings**: View all bookings across users

#### Business Card Detail (`/admin/:id`)
- Edit all business fields
- Manage shopping items (add/delete) for that business

---

## API Description

All backend endpoints are implemented as Deno Edge Functions.

### `POST /create-checkout`

Creates a Stripe Checkout session from the authenticated user's shopping cart.

| Field | Details |
|-------|---------|
| **Auth** | Required — Bearer token (JWT) |
| **Request Body** | None (reads cart from DB using authenticated user ID) |
| **Response** | `{ url: string }` — Stripe Checkout redirect URL |
| **Error** | `{ error: string }` with status `500` |

**Flow:**
1. Authenticates user via JWT
2. Fetches `shopping_cart_items` joined with `shopping_items` for pricing
3. Creates/reuses Stripe customer by email
4. Builds line items in KZT currency
5. Returns Stripe Checkout session URL

---

### `POST /stripe-webhook`

Handles Stripe webhook events. **Not called by the client directly** — called by Stripe.

| Field | Details |
|-------|---------|
| **Auth** | Stripe signature verification (`stripe-signature` header) |
| **Event Handled** | `checkout.session.completed` |

**On successful checkout:**
1. Clears the user's `shopping_cart_items`
2. Inserts a purchase confirmation notification for the buyer
3. Inserts notifications for all admin users
4. Sends push notifications via OneSignal to buyer and admins

---

### `POST /admin-create-user`

Creates a new user account (admin only).

| Field | Details |
|-------|---------|
| **Auth** | Required — Bearer token; caller must have `admin` role |
| **Request Body** | `{ email, password, first_name, last_name, role }` |
| **Response** | `{ user_id: string }` |
| **Errors** | `401` Unauthorized, `403` Forbidden, `400` Missing fields or creation error |

**Flow:**
1. Verifies caller is authenticated and has admin role
2. Creates user via admin API with email pre-confirmed
3. Updates role if not default `buyer`

---

### `POST /send-notification`

Creates an in-app notification and sends a push notification.

| Field | Details |
|-------|---------|
| **Auth** | None required (service-level function) |
| **Request Body** | `{ user_id, text, business_card_id?, notify_admins? }` |
| **Response** | `{ success: true }` |

**Features:**
- Inserts notification row in `notifications` table
- Sends push via OneSignal (if configured)
- Optionally notifies all admin users (`notify_admins: true`)

---

### `GET /maps-embed?address=<address>`

Returns a Google Maps embed URL for a given address.

| Field | Details |
|-------|---------|
| **Auth** | None required |
| **Query Params** | `address` (required) |
| **Response** | `{ embedUrl: string }` |
| **Secrets** | `GOOGLE_MAPS_API_KEY` |

---

### `GET /places-autocomplete?query=<query>`

Returns Google Places Autocomplete suggestions.

| Field | Details |
|-------|---------|
| **Auth** | None required |
| **Query Params** | `query` (min 2 chars) |
| **Response** | `{ predictions: [{ description, place_id }] }` |
| **Secrets** | `GOOGLE_MAPS_API_KEY` |

---

### Database Enums

| Enum | Values |
|------|--------|
| `app_role` | `buyer`, `partner`, `admin` |
| `booking_status` | `upcoming`, `completed`, `expired` |
| `business_card_type` | `featured`, `recommended` |
| `cart_item_status` | `created`, `paid`, `expired` |
| `shopping_item_type` | `main`, `sauce`, `beverage` |

### Environment Secrets

| Secret | Used By |
|--------|---------|
| `STRIPE_SECRET_KEY` | `create-checkout`, `stripe-webhook` |
| `STRIPE_WEBHOOK_SECRET` | `stripe-webhook` |
| `GOOGLE_MAPS_API_KEY` | `maps-embed`, `places-autocomplete` |
| `ONESIGNAL_APP_ID` | `send-notification`, `stripe-webhook` |
| `ONESIGNAL_REST_API_KEY` | `send-notification`, `stripe-webhook` |
