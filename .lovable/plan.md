

## In-Dialog Route Display

### Problem
Clicking Drive, Transit, or Walk opens an external Google Maps page. The user wants routes rendered inside the same dialog's embedded map.

### Approach
Use the Google Maps Embed API **directions mode**, which supports showing routes inline. The URL format is:
```
https://www.google.com/maps/embed/v1/directions?key=API_KEY&origin=LAT,LNG&destination=ADDRESS&mode=driving|transit|walking
```

This requires the user's current location as the origin. We'll use the browser Geolocation API for that.

### Changes

**1. Update edge function `supabase/functions/maps-embed/index.ts`**
- Accept optional `origin` and `mode` query params
- When provided, return a directions embed URL instead of a place embed URL
- When not provided, return the existing place embed (current behavior)

**2. Update `src/components/DirectionsSheet.tsx`**
- Add state for `selectedMode` (null = place view, "driving"/"transit"/"walking" = directions view)
- On mode button click: request browser geolocation, then call the edge function with `origin`, `destination`, and `mode` to get a directions embed URL
- Update the iframe `src` with the returned directions embed URL
- Highlight the active mode button
- Keep the "Open in Google Maps" external link button unchanged
- Show a loading indicator while fetching location/embed URL

### Technical Detail

```text
User taps "Drive"
  → navigator.geolocation.getCurrentPosition()
  → GET /functions/v1/maps-embed?address=...&origin=LAT,LNG&mode=driving
  → Edge function returns directions embed URL
  → iframe src updated → route shown in-dialog
```

The place embed remains the default view. Tapping a mode switches to directions. Tapping the same mode again could toggle back to place view.

