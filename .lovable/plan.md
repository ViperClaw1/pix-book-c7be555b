## Admin Dashboard Page

### Overview

Create a full-screen fully-responsive admin dashboard at `/admin` with a collapsible sidebar navigation containing three tabs: Transactions, Users, and Business Cards. The page is protected so only admins can access it.

### Architecture

The admin dashboard will break out of the mobile `max-w-lg` container and use a full-width layout with the Shadcn Sidebar component. The bottom navigation bar will be hidden on `/admin` routes.

### 1. Database Changes

**New RLS policies** to let admins read all data:

- `bookings`: Add SELECT policy for admins using `has_role(auth.uid(), 'admin')` so they can see all transactions
- `profiles`: Add SELECT policy for admins to view all user profiles
- `user_roles`: Add SELECT/INSERT/UPDATE/DELETE policies for admins to manage roles
- `business_cards`: Add INSERT/UPDATE/DELETE policies for admins to manage cards
- `categories`: Admins need INSERT to create categories (for new business cards)

### 2. New Files

`**src/pages/AdminDashboard.tsx**` -- Main layout with SidebarProvider, collapsible Sidebar (three menu items: Transactions, Users, Business Cards), and a content area that renders the active tab.

`**src/components/admin/AdminTransactions.tsx**` -- Table showing all bookings (joined with business_cards and profiles for names). Columns: date, buyer name/email, business name, cost, status.

`**src/components/admin/AdminUsers.tsx**` -- Table of all users from profiles + user_roles. Includes:

- Filter dropdown by role (buyer/partner/admin)
- Search input for name or email
- Add/Edit/Delete actions (edit opens a dialog to change name, email, role; delete removes the user role + profile)

`**src/components/admin/AdminBusinessCards.tsx**` -- Table of all business cards. Includes:

- Filter dropdown by category
- Search input for name, tags, or keywords
- Add/Edit/Delete actions via dialogs (form fields: name, image URL, address, phone, category, rating, booking price, tags, description, type)

### 3. Routing Changes

`**src/App.tsx**`:

- Import and add route: `/admin` renders `AdminDashboard` wrapped in `ProtectedRoute`

`**src/components/BottomNav.tsx**`:

- Hide bottom nav when path starts with `/admin`

### 4. Hooks

`**src/hooks/useAdminData.ts**` -- Custom hooks for admin queries:

- `useAllBookings()` -- fetches all bookings with joined business_card and profile data (requires admin RLS policy)
- `useAllProfiles()` -- fetches all profiles with their roles
- `useAllBusinessCards()` -- fetches all business cards with categories
- Mutation hooks for CRUD operations on users, roles, and business cards

### Technical Details

- The sidebar uses `collapsible="icon"` mode with Shadcn's `Sidebar` component
- Each tab is managed via local state (active tab) rather than nested routes, keeping it simple
- Admin access is enforced at two levels: client-side via `useUserRole` (redirects non-admins) and server-side via RLS policies using `has_role()`
- The admin page layout will use `SidebarProvider` wrapping a flex container, separate from the mobile app's `max-w-lg` container
- All data tables use the existing Shadcn `Table` component with search/filter state managed locally
- User deletion will use the service role key via an edge function (since client-side cannot delete auth users)