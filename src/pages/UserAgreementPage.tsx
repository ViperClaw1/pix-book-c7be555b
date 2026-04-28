import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const agreement = `
# User Agreement

**Last Updated: April 28, 2026**

This User Agreement ("Agreement") is a binding contract between you ("User", "you") and Pixap ("we", "us", "our") governing your access to and use of the Pixap mobile application and related services (collectively, the "Service"). By creating an account or using the Service, you agree to these terms.

---

## 1. Eligibility

You must be at least **18 years old** (or the age of majority in your jurisdiction) and able to enter into a legally binding contract to use Pixap. By using the Service, you confirm that you meet these requirements.

---

## 2. The Service

Pixap is an AI-powered booking aggregator that helps users discover and reserve services from third-party businesses, including restaurants, beauty and wellness providers, medical clinics, and tour operators. Pixap facilitates discovery, communication (including via WhatsApp), and payment but is **not the direct provider** of the underlying services.

---

## 3. Your Account

### Registration
To book services, you must create an account and provide accurate, current information including your name, email, and phone number.

### Account Security
You are responsible for safeguarding your account credentials and for all activity that occurs under your account. Notify us immediately at **support@pixap.kz** if you suspect unauthorized use.

### One Account Per User
You may not create multiple accounts, share your account, or transfer it to another person.

---

## 4. Bookings & Payments

### Bookings
When you confirm a booking, you enter into a contract directly with the listed business. Pixap acts as an intermediary and is not a party to that contract.

### Pricing & Currency
All prices are displayed in **Kazakhstani Tenge (KZT)** unless stated otherwise. Prices include applicable taxes unless noted.

### Payment Processing
Payments are processed through secure third-party providers (e.g., Stripe). By submitting a payment, you authorize Pixap and its providers to charge your selected payment method.

### Cancellations & Refunds
Cancellations and refunds are governed by our [Return & Refund Policy](/returns) and the cancellation terms of the specific business.

---

## 5. User Conduct

You agree **not** to:
- Use the Service for any unlawful, fraudulent, or harmful purpose
- Make false, abusive, or speculative bookings
- Impersonate any person or misrepresent your identity
- Attempt to access, scrape, or interfere with the Service's systems
- Upload malicious code or attempt to disrupt other users' access
- Harass, threaten, or abuse businesses, staff, or other users
- Resell or commercially exploit the Service without our written consent

Violation may result in immediate suspension or termination of your account.

---

## 6. User Content

You may submit reviews, ratings, photos, and other content ("User Content"). By submitting User Content, you grant Pixap a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute it in connection with the Service.

You represent that your User Content is accurate, lawful, and does not infringe any third-party rights.

We may remove User Content that violates this Agreement or applicable law at our sole discretion.

---

## 7. Third-Party Businesses

Pixap does not control and is not responsible for the quality, safety, legality, or fulfillment of services provided by third-party businesses. Any disputes regarding the underlying service should be resolved primarily with the business. We will mediate where reasonably possible.

---

## 8. Intellectual Property

All content, branding, software, and design elements of the Service (excluding User Content and third-party content) are owned by Pixap or its licensors and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our prior written permission.

---

## 9. Privacy

Your use of the Service is also governed by our [Privacy Policy](/privacy), which explains how we collect, use, and protect your personal information.

---

## 10. Notifications

By creating an account, you consent to receive transactional notifications (booking confirmations, reminders, payment receipts) via push notification, email, SMS, or WhatsApp. You may opt out of marketing communications at any time in your account settings.

---

## 11. Termination

You may delete your account at any time through the App or by following the steps on our [Data Deletion page](/data-deletion).

We may suspend or terminate your account, with or without notice, if you violate this Agreement, engage in fraudulent activity, or for any other reason at our reasonable discretion.

---

## 12. Disclaimers

The Service is provided **"as is"** and **"as available"** without warranties of any kind, express or implied. To the maximum extent permitted by law, Pixap disclaims all warranties, including merchantability, fitness for a particular purpose, and non-infringement.

We do not guarantee that the Service will be uninterrupted, error-free, or that any defects will be corrected.

---

## 13. Limitation of Liability

To the maximum extent permitted by law, Pixap shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising out of or related to your use of the Service.

Our total liability for any claim arising under this Agreement shall not exceed the **greater of (a) the amount you paid to Pixap in the 6 months preceding the claim, or (b) 10,000 KZT**.

---

## 14. Indemnification

You agree to indemnify and hold Pixap, its affiliates, and its personnel harmless from any claims, damages, or expenses (including reasonable legal fees) arising from your use of the Service, your User Content, or your violation of this Agreement.

---

## 15. Changes to This Agreement

We may update this Agreement from time to time. Material changes will be notified through the App or by email, and the "Last Updated" date will be revised. Continued use of the Service after changes constitutes acceptance of the revised Agreement.

---

## 16. Governing Law & Disputes

This Agreement is governed by the laws of the **Republic of Kazakhstan**, without regard to conflict-of-law principles. Any disputes shall be resolved in the competent courts of Almaty, Kazakhstan, unless otherwise required by mandatory local law.

---

## 17. Contact Us

For questions about this Agreement:

**Email:** support@pixap.kz

---

*By using Pixap, you acknowledge that you have read, understood, and agree to be bound by this User Agreement.*
`;

const UserAgreementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <article className="prose prose-base dark:prose-invert max-w-none">
          {agreement.split('\n').map((line, i) => {
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
            return <p key={i} className="text-muted-foreground text-sm mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>') }} />;
          })}
        </article>
      </div>
    </div>
  );
};

export default UserAgreementPage;
