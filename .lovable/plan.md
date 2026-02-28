

## Input Validation Improvements for Add/Edit Business Card Dialog

### Overview

Four changes to the business card form: address autocomplete via Google Places, phone input with mask and validation, empty default values for rating/price, and a textarea for description.

### 1. Address Search Box (Google Places Autocomplete)

**New edge function: `supabase/functions/places-autocomplete/index.ts`**
- Proxies requests to the Google Places Autocomplete API using the already-configured `GOOGLE_MAPS_API_KEY`
- Accepts a `query` parameter, returns a list of place predictions (description + place_id)
- Keeps the API key server-side

**New component: `src/components/admin/AddressAutocomplete.tsx`**
- A text input with a dropdown list of address suggestions
- On typing (debounced ~300ms), calls the edge function to fetch predictions
- On selecting a suggestion, sets the address field value
- Uses Shadcn's `Command` / `Popover` pattern for the dropdown list
- Shows a `MapPin` icon and "Search for an address..." placeholder

### 2. Phone Input with Mask

**Update `AdminBusinessCards.tsx`**
- Replace plain phone `Input` with a custom masked input
- Apply mask format: `+X (XXX) XXX-XX-XX` using a helper function that formats on change
- Validate against regex pattern: `/^\+\d{1,3}\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/`
- Show validation error (red border + message) when the phone doesn't match the pattern on blur or save
- Add phone validation check in `handleSave` -- show toast error if invalid

### 3. Rating and Booking Price Defaults

**Update `AdminBusinessCards.tsx`**
- Change `emptyForm` defaults from `rating: "0", booking_price: "0"` to `rating: "", booking_price: ""`
- The existing `placeholder` attributes ("Rating", "Booking Price") will now show since the values are empty strings
- In `handleSave`, default empty values to 0: `Number(form.rating) || 0`

### 4. Description as Textarea

**Update `AdminBusinessCards.tsx`**
- Replace `<Input placeholder="Description" .../>` with `<Textarea placeholder="Description" className="min-h-[100px]" .../>`
- Import `Textarea` from `@/components/ui/textarea`

### Files Changed

| File | Action |
|------|--------|
| `supabase/functions/places-autocomplete/index.ts` | Create -- edge function proxying Google Places API |
| `src/components/admin/AddressAutocomplete.tsx` | Create -- autocomplete input with dropdown suggestions |
| `src/components/admin/AdminBusinessCards.tsx` | Update -- integrate all 4 changes |

