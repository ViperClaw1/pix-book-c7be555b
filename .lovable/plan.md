

## Plan: Call Button + Directions Modal

### 1. Database: Add `phone` column to `business_cards`

- Run a migration to add a `phone text default ''` column to `business_cards`.
- Populate all 6 existing records with mock phone numbers from the `mockData.ts` file.

### 2. Update `BusinessCard` TypeScript interface

**File: `src/hooks/useBusinessCards.ts`**

- Add `phone: string` to the `BusinessCard` interface.

### 3. Call Button -- `tel:` link

**File: `src/pages/PlaceDetail.tsx`**

- Wire the existing "Call" button to open the native phone dialer using `window.open("tel:" + place.phone)`.
- If `phone` is empty, show a toast saying "Phone number not available".

### 4. Directions Button -- Full-screen Sheet

**File: `src/pages/PlaceDetail.tsx`**

- Add state `showDirections` to toggle a Drawer/Sheet.
- Clicking "Directions" opens the sheet.

**New file: `src/components/DirectionsSheet.tsx`**

A bottom sheet (using the existing `vaul` Drawer component) containing:

- **Header** with the place name, address, and a close button.
- **An embedded Google Maps iframe** showing the destination location using the place address (no API key required for simple embed).
- **Route options** -- three buttons for driving, transit, and walking that open Google Maps in a new tab with the correct `travelmode` parameter:
  `https://www.google.com/maps/dir/?api=1&destination={encoded_address}&travelmode=driving|transit|walking`
- **"Open in Google Maps" button** -- opens the full Google Maps directions page externally.

This approach uses no API key and no Directions API. It works by:
- Embedding a Google Maps `embed` iframe for the visual map preview.
- Linking out to Google Maps with URL parameters for actual route building.

This is the most practical approach because:
- Google Directions API requires billing and an API key.
- The embedded iframe + external links give users the full routing experience in Google Maps itself.
- No cost, no key management.

### Files Changed

| File | Change |
|------|--------|
| Migration SQL | Add `phone` column + populate mock data |
| `src/hooks/useBusinessCards.ts` | Add `phone` to interface |
| `src/pages/PlaceDetail.tsx` | Wire Call button with `tel:`, add Directions sheet toggle |
| `src/components/DirectionsSheet.tsx` | New component: Drawer with map embed + route option links |

### Technical Details

- The Google Maps embed URL format: `https://www.google.com/maps/embed/v1/place?key=...&q={address}` requires an API key. Instead, we'll use the free `maps.google.com/maps?q={address}&output=embed` format inside an iframe.
- Route links use the universal Google Maps URL scheme: `https://www.google.com/maps/dir/?api=1&destination={address}&travelmode={mode}` -- this opens in the user's browser/Google Maps app with no API key needed.
- The Drawer component from `vaul` is already installed and available at `src/components/ui/drawer.tsx`.

