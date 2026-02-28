

## Fix Cart Page Content Being Covered by Bottom Nav

### Problem
The cart page content and its fixed bottom "Total/Pay" bar sit behind the bottom navigation tab bar (which is ~64px tall plus safe area). The page has `pb-28` (7rem = 112px) but the fixed checkout bar at the bottom doesn't account for the nav bar height, causing overlap.

### Solution
1. **Increase bottom padding** on the cart page container from `pb-28` to `pb-44` (~176px) so scrollable content clears both the checkout bar and the bottom nav.
2. **Move the fixed bottom checkout bars up** by adding `bottom-16` (64px) instead of `bottom-0`, so they sit above the bottom navigation bar. This applies to both the Bookings and Shopping tab checkout bars.

### Files to Change
- **`src/pages/CartPage.tsx`**:
  - Change outer div from `pb-28` to `pb-44`
  - Change both fixed bottom bars (bookings checkout and shopping checkout) from `bottom-0` to `bottom-16` so they float above the bottom nav

