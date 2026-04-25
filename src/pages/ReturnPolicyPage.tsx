import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const policy = `
# Return & Refund Policy

**Last Updated: March 16, 2026**

This Return & Refund Policy explains how refunds, cancellations, and returns are handled for bookings, services, and products purchased through the Pixap mobile application (the "App"). By using Pixap, you agree to the terms below.

---

## 1. Overview

Pixap is a marketplace that connects users with third-party businesses (restaurants, beauty and wellness providers, medical clinics, tour operators, and other vendors). When you book a service or purchase an item through the App, your transaction is with the listed business. Pixap facilitates the booking and payment but is not the direct provider of the underlying service.

Refund eligibility therefore depends on:
- The type of purchase (booking vs. physical item)
- The cancellation policy of the specific business
- The timing of your cancellation request

---

## 2. Bookings (Restaurants, Beauty, Medical, Tours)

### Free Cancellation Window
Most bookings can be canceled free of charge **up to 24 hours before the scheduled time**, unless the business specifies a different policy on the booking page.

### Late Cancellations
Cancellations made **less than 24 hours** before the scheduled time may be:
- Non-refundable, or
- Subject to a partial refund or cancellation fee

The exact terms are set by the business and shown at checkout.

### No-Shows
If you do not arrive for your booking and do not cancel in advance, the booking is considered a no-show and is **non-refundable**.

### How to Cancel
You can cancel any booking directly in the App:
1. Open **Bookings**
2. Select the booking you want to cancel
3. Tap **Cancel Booking**

---

## 3. Shopping Items (Food, Products, Add-ons)

### Prepared Food & Perishable Items
Due to their nature, prepared food and perishable items are **non-returnable** once an order is confirmed and prepared. If your order is incorrect, missing items, or arrived in unacceptable condition, contact us within **2 hours of receipt** so we can review and process a refund where appropriate.

### Non-Perishable Items
Eligible non-perishable items may be returned within **7 days of delivery**, provided they are unused and in their original packaging. The business may charge a restocking fee.

---

## 4. Refund Processing

### Timing
Approved refunds are issued to your **original payment method**. Processing time:
- **Card payments:** 5–10 business days
- **Other methods:** Up to 14 business days, depending on the provider

### Partial Refunds
In some cases (late cancellations, partial order issues, used promo codes), only a portion of the original amount may be refunded.

### Service Fees
Pixap service fees, payment processing fees, and any applied promotional discounts may be **non-refundable**, even when the underlying booking or item is refunded.

---

## 5. Cancellations by the Business

If a business cancels your booking or is unable to fulfill your order, you will receive a **full refund**, including any applicable service fees, automatically to your original payment method.

---

## 6. Disputes & Issues

If you believe you were charged incorrectly, did not receive the service you paid for, or have any other concern about a transaction:

1. Open the booking or order in the App
2. Tap **Report an Issue**, or
3. Email us at **support@pixap.kz** within **14 days** of the transaction

We will review the case and mediate with the business on your behalf where possible.

---

## 7. Non-Refundable Situations

The following are generally **not eligible** for refunds:
- No-shows without prior cancellation
- Bookings canceled outside the free-cancellation window (unless the business allows it)
- Services already rendered or partially used
- Promotional credits, vouchers, and gift cards (unless required by law)
- Change-of-mind requests after a service has started

---

## 8. Chargebacks

Before initiating a chargeback with your bank or card issuer, please contact us first at **support@pixap.kz**. Most issues can be resolved quickly through the App. Unjustified chargebacks may result in account suspension.

---

## 9. Changes to This Policy

We may update this Return & Refund Policy from time to time. Material changes will be posted in the App, and the "Last Updated" date will be revised. Continued use of Pixap after changes constitutes acceptance of the revised policy.

---

## 10. Contact Us

For questions about refunds, returns, or cancellations:

**Email:** support@pixap.kz

---

*This policy applies to purchases made through the Pixap App and is intended to comply with applicable consumer protection laws in the Republic of Kazakhstan and other jurisdictions where Pixap operates.*
`;

const ReturnPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <article className="prose prose-base dark:prose-invert max-w-none">
        {policy.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-foreground mb-2">{line.slice(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{line.slice(3)}</h2>;
          if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-foreground mt-4 mb-1">{line.slice(4)}</h3>;
          if (line.startsWith('---')) return <hr key={i} className="my-4 border-border" />;
          if (line.startsWith('- **')) {
            const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
            if (match) return <p key={i} className="text-muted-foreground text-sm ml-4 mb-1"><strong className="text-foreground">{match[1]}:</strong> {match[2]}</p>;
          }
          if (line.startsWith('- ')) return <p key={i} className="text-muted-foreground text-sm ml-4 mb-1">• {line.slice(2)}</p>;
          if (/^\d+\.\s/.test(line)) return <p key={i} className="text-muted-foreground text-sm ml-4 mb-1">{line}</p>;
          if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-foreground text-sm font-semibold mt-2">{line.replace(/\*\*/g, '')}</p>;
          if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-muted-foreground text-xs italic mt-2">{line.replace(/\*/g, '')}</p>;
          if (line.trim() === '') return null;
          return <p key={i} className="text-muted-foreground text-sm mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />;
        })}
      </article>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
