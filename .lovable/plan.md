

## Make Admin Dashboard Responsive (Table to Cards on Mobile/Tablet)

### Approach

Use Tailwind's `md:` breakpoint to show tables on desktop and card-based lists on mobile/tablet. Each of the three admin components will render both layouts, toggling visibility with `hidden md:block` and `md:hidden`.

### Changes

#### 1. `src/components/admin/AdminTransactions.tsx`

- Keep the existing `<Table>` but wrap it in `hidden md:block`
- Add a mobile card list (`md:hidden`) where each booking renders as a card showing:
  - Date and status badge in a row at the top
  - Buyer name and email
  - Business name
  - Cost (right-aligned or bottom)

#### 2. `src/components/admin/AdminUsers.tsx`

- Wrap existing `<Table>` in `hidden md:block`
- Add mobile card list (`md:hidden`) with each user as a card:
  - Name (bold) and role badge
  - Email below
  - Edit/Delete action buttons in the card footer

#### 3. `src/components/admin/AdminBusinessCards.tsx`

- Wrap existing `<Table>` in `hidden md:block`
- Add mobile card list (`md:hidden`) with each card showing:
  - Name (bold) and type badge
  - Category and rating
  - Price
  - Edit/Delete action buttons

#### 4. `src/pages/AdminDashboard.tsx`

- Reduce main padding on small screens: `p-3 md:p-6`
- The sidebar already collapses via `collapsible="icon"`, so it works on smaller screens

### Technical Notes

- No new components needed -- the card layouts are simple `div` structures using existing Tailwind utilities (`rounded-lg border bg-card p-4`, etc.)
- All existing logic (filtering, search, dialogs) remains unchanged -- only the rendering layer is duplicated for the two breakpoints
- The `md:` breakpoint (768px) is the toggle point between card and table views
