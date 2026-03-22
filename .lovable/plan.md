

## Fix: Regenerate Complete Schema Export

### Why it broke
The previously generated `database_schema_export.sql` file was essentially empty — it had section comments but no actual SQL statements for enums, tables, functions, triggers, RLS policies, or views. Only the storage bucket INSERT and realtime ALTER were present. So when you run it, no tables get created, and the data export then fails because it references nonexistent tables.

### What I will do
Generate a new, complete `database_schema_export_v2.sql` that includes all DDL in the correct dependency order:

1. **Enums** — `app_role`, `booking_status`, `business_card_type`, `cart_item_status`, `shopping_item_type`
2. **Tables** — All 11 tables (`categories`, `business_cards`, `profiles`, `user_roles`, `bookings`, `cart_items`, `favorites`, `notifications`, `reviews`, `shopping_items`, `shopping_cart_items`) with columns, defaults, primary keys, and foreign keys
3. **Views** — `public_reviews`
4. **Functions** — `has_role`, `handle_new_user`, `handle_new_user_role`, `update_category_count`, `update_updated_at_column`
5. **Triggers** — on `auth.users` for profile/role creation, on `business_cards` for category count, on `profiles` for `updated_at`
6. **RLS** — Enable RLS on all tables + all policy definitions
7. **Storage** — Create `business-cards` bucket
8. **Realtime** — Add `notifications` to realtime publication

All derived from the existing database schema and RLS policies visible in the project context. No code changes to the app itself.

