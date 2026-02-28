

## Add Shopping Category and Shopping Flow

### Overview
Add a new "Shopping" category and a complete shopping flow that lets users buy food items (from Restaurants) or goods (from Shopping business cards), with additional item suggestions for food, quantity controls, and an updated cart experience.

### Database Changes

**1. New table: `shopping_items`** -- products sold by business cards
- `id` (uuid, PK), `business_card_id` (uuid, FK to business_cards), `name` (text), `image` (text), `price` (numeric), `item_type` (enum: 'main', 'sauce', 'beverage'), `created_at` (timestamptz)
- RLS: public SELECT, no INSERT/UPDATE/DELETE from client

**2. New table: `shopping_cart_items`** -- user's shopping cart
- `id` (uuid, PK), `user_id` (uuid), `shopping_item_id` (uuid, FK), `business_card_id` (uuid, FK), `quantity` (integer, default 1), `parent_id` (uuid, nullable self-ref for additional items), `created_at` (timestamptz)
- RLS: users can CRUD only their own items

**3. New enum: `shopping_item_type`** ('main', 'sauce', 'beverage')

**4. Insert seed data:**
- Add "Shopping" category row
- Add Shopping business cards (e.g. "Mega Store", "Tech Mall") with shopping items
- Add food items for existing Restaurant business cards (e.g. burgers, pasta)
- Add additional items (sauces: ketchup, mayo, BBQ; beverages: cola, juice, water)

### New Files

**`src/hooks/useShoppingItems.ts`**
- `useShoppingItems(businessCardId)` -- fetch main items for a business card
- `useAdditionalItems(businessCardId)` -- fetch sauces/beverages for a business card
- `useShoppingCart()` -- fetch user's shopping cart with joined item data
- `useAddToShoppingCart()`, `useUpdateShoppingCartQuantity()`, `useRemoveShoppingCartItem()` -- mutations

**`src/pages/ShoppingItemsPage.tsx`**
- Lists all shopping items (main type) for a given business card
- Each item shows name, image, price, and an "Add to Cart" button
- Route: `/shop/:businessCardId`

**`src/components/AdditionalItemsSheet.tsx`**
- Bottom sheet that appears after adding a Restaurant food item
- Shows suggested sauces and beverages with quantity controls
- "Skip" and "Add" options
- Skipped entirely for Shopping category business cards

**`src/components/CartConfirmationSheet.tsx`**
- Appears after items are added to cart
- Shows the main item + any additional items with quantity controls (+/-)
- Two buttons: "Continue Shopping" (goes back to items list) and "Go to Cart" (navigates to /cart)

**`src/pages/CartPage.tsx` (modified)**
- Add a new "Shopping" tab/section for shopping cart items (separate from booking cart items)
- Each main item shows name, image, price, quantity controls
- If main item has additional items, show a collapsible/expandable block (collapsed by default)
- Expand reveals additional items with their own quantity controls
- Remove button on each item; clicking "-" when quantity is 1 removes the item
- Total recalculates based on all items and quantities

### Modified Files

**`src/pages/PlaceDetail.tsx`**
- For Restaurant and Shopping category business cards, add a "Shop Items" / "Menu" button alongside "Book Now"
- Clicking it navigates to `/shop/:id`

**`src/App.tsx`**
- Add route: `/shop/:id` -> `ShoppingItemsPage`

**`src/hooks/useCategories.ts`**
- Add icon mapping for "Shopping": "🛍️"

### Technical Details

```text
Shopping Flow:
                                              
  PlaceDetail ──> ShoppingItemsPage ──> [Add to Cart]
                                              │
                              ┌────────────────┴────────────────┐
                              │ Restaurant?                     │ Shopping?
                              ▼                                 ▼
                   AdditionalItemsSheet              CartConfirmationSheet
                   (sauces, beverages)                (quantity controls)
                              │                                 │
                              ▼                                 │
                   CartConfirmationSheet                        │
                   (main + additionals)                         │
                              │                                 │
                    ┌─────────┴─────────┐             ┌─────────┴─────────┐
                    ▼                   ▼             ▼                   ▼
             Continue Shopping    Go to Cart   Continue Shopping    Go to Cart
             (back to items)     (/cart)       (back to items)     (/cart)
```

Cart page shopping section layout:
```text
  ┌─────────────────────────────────┐
  │ [img] Burger         2x  800 ₸ │  [-] [2] [+]  [🗑]
  │  ▸ Additional items (2)        │  <- collapsed by default
  │  ┌─ Ketchup       1x  200 ₸   │  [-] [1] [+]  [🗑]
  │  └─ Cola           1x  500 ₸   │  [-] [1] [+]  [🗑]
  └─────────────────────────────────┘
```

- Clicking "-" when qty=1 removes the item (with confirmation toast)
- Removing a main item also removes all its additional items
- Total at bottom sums (price x quantity) for all items
