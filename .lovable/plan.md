

## Add Description Field to Shopping Items

### 1. Database Migration

Add a `description` column to the `shopping_items` table:

```sql
ALTER TABLE public.shopping_items
ADD COLUMN description text DEFAULT '';
```

### 2. Update `AdminBusinessCardDetail.tsx`

- Add a `description` field to the item form state
- Add a `Textarea` input (min-height 100px) labeled "Description" in the Add Item / Add Menu Item dialog
- Import `Textarea` from `@/components/ui/textarea`
- Pass `description` in the `createItem.mutateAsync` call
- Display item descriptions in the item list (truncated, below the price)

### Files Changed

| File | Action |
|------|--------|
| Migration SQL | Add `description` column to `shopping_items` |
| `src/pages/AdminBusinessCardDetail.tsx` | Add description textarea to dialog and display in item cards |

