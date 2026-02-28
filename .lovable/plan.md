

## Add Stripe Checkout to Shopping Cart

### Overview
Create a backend function for Stripe Checkout, a webhook handler for payment confirmation, and a "Pay" button on the Shopping tab of the Cart page. We'll build the webhook endpoint first so you get the URL to configure in Stripe before providing the signing secret.

### Step 1: Create `create-checkout` edge function
- Accepts the shopping cart items from the authenticated user
- Builds Stripe `line_items` dynamically from the cart (using `price_data` with item name, price in KZT, and quantity)
- Creates a Stripe Checkout Session in `mode: "payment"`
- Returns the checkout session URL to redirect the user

### Step 2: Create `stripe-webhook` edge function
- Listens for `checkout.session.completed` events
- Verifies the webhook signature using `STRIPE_WEBHOOK_SECRET`
- On successful payment: clears the user's shopping cart items from the database
- Endpoint URL will be: `https://ceoqpgxbilpytvqtmebm.supabase.co/functions/v1/stripe-webhook`

After deploying, you'll set this URL as your webhook endpoint in Stripe Dashboard, then provide me the webhook signing secret (`whsec_...`).

### Step 3: Add Stripe Publishable Key secret
- Ask you to provide `STRIPE_PUBLISHABLE_KEY` (not strictly needed server-side, but good to have)
- Ask you to provide `STRIPE_WEBHOOK_SECRET` after you configure the webhook in Stripe

### Step 4: Update `CartPage.tsx` -- Shopping tab
- Add a "Pay" button in the sticky bottom bar of the Shopping tab (next to the total)
- On click, call `create-checkout` edge function with the cart data
- Redirect to the Stripe Checkout URL

### Step 5: Add success/cancel pages
- `/payment-success` -- simple confirmation page
- `/payment-canceled` -- simple page with a "Back to Cart" link
- Register both routes in `App.tsx`

### Step 6: Update `supabase/config.toml`
- Add `[functions.stripe-webhook]` with `verify_jwt = false` (Stripe sends unsigned requests)
- Add `[functions.create-checkout]` with `verify_jwt = false` (we validate auth in code)

### Technical Details

```text
Flow:
  CartPage (Pay button)
       │
       ▼
  create-checkout (edge fn)
       │ creates Stripe Checkout Session
       ▼
  Stripe Checkout (redirect)
       │
       ├── success → /payment-success
       │      └── stripe-webhook clears cart
       └── cancel  → /payment-canceled
```

- Currency: KZT (Kazakhstani Tenge, matching the existing ₸ usage)
- The webhook URL after deployment: `https://ceoqpgxbilpytvqtmebm.supabase.co/functions/v1/stripe-webhook`
- I'll deploy both functions, then ask you to:
  1. Add that webhook URL in Stripe Dashboard
  2. Provide the `STRIPE_WEBHOOK_SECRET` back to me

