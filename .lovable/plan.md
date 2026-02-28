

## Admin Business Card Detail Page with Item Management

### Overview

Create a new `/admin/:id` route that displays full business card details and allows admins to add menu items (for restaurants) or shopping items (for shopping businesses) directly linked to that card.

### 1. Database: Add Admin RLS Policies for `shopping_items`

Currently, `shopping_items` has no INSERT/UPDATE/DELETE policies. Add admin policies so admins can manage items:

```sql
CREATE POLICY "Admins can insert shopping items"
ON public.shopping_items FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update shopping items"
ON public.shopping_items FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete shopping items"
ON public.shopping_items FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
```

### 2. New Page: `src/pages/AdminBusinessCardDetail.tsx`

A detail page at `/admin/:id` showing:

- **Header**: Back arrow to `/admin` + business card name
- **Photo**: Full-width image (or placeholder)
- **Info section**: Category badge, tags as pills, star rating (rendered as stars with 0.5 step using half-filled icons), price, description
- **Items section**: 
  - Button labeled "Add Menu" if category is "Restaurants", or "Add Items" if category is "Shopping"
  - List of existing `shopping_items` for this business card, displayed as simple cards with name, image thumbnail, price, and type badge (for restaurants)
  - Each item has edit/delete actions

Uses existing `useBusinessCard(id)` from `useBusinessCards.ts` and a new `useShoppingItemsByBusiness(id)` query that fetches ALL item types (not just "main").

### 3. Add Item Dialog (within the detail page)

A dialog triggered by the "Add Menu" / "Add Items" button containing:

- **Name** input
- **Image uploader** (reuses existing `ImageUploader` component)
- **Price** input (number)
- **Item type** select -- only shown for Restaurant category cards, with options: main, sauce, beverage. For Shopping cards, defaults to "main" and is hidden.

On submit: inserts into `shopping_items` with the `business_card_id` set to the current card.

### 4. New Hooks in `src/hooks/useAdminData.ts`

Add three new hooks:

- `useAdminShoppingItems(businessCardId)` -- fetches all shopping items for a card (all types)
- `useCreateShoppingItem()` -- inserts a new shopping item
- `useDeleteShoppingItem()` -- deletes a shopping item

### 5. Routing Updates

**`src/App.tsx`**: Add route `/admin/:id` alongside the existing `/admin` route:

```
<Route path="/admin" element={...}><AdminDashboard /></Route>
<Route path="/admin/:id" element={...}><AdminBusinessCardDetail /></Route>
```

**`src/components/admin/AdminBusinessCards.tsx`**: Make each business card row/card clickable, navigating to `/admin/{card.id}` on click.

### 6. Star Rating Display

Render the rating as stars with 0.5 granularity:
- Full stars for each whole number
- A half-star (using CSS clip or a half-filled star icon) for .5 values
- Empty stars to fill up to 5 total

### Technical Notes

- The `shopping_items` table already has `name`, `image`, `price`, `item_type`, and `business_card_id` columns -- no schema changes needed beyond RLS policies
- The existing `ImageUploader` component uploads to the `business-cards` bucket, which works for item images too
- The route uses the card's UUID as the slug (`/admin/:id`), matching existing patterns

