import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const policy = `
# Privacy Policy

**Last Updated: March 16, 2026**

PixBook ("we," "our," or "us") operates the PixBook mobile application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App. By using the App, you agree to the terms of this Privacy Policy.

---

## 1. Information We Collect

### Personal Information
When you create an account, we may collect:
- Name, email address, and phone number
- Profile information you choose to provide

### Automatically Collected Information
- Device type, operating system, and unique device identifiers
- Usage data, analytics, and crash reports
- IP address and general location data

### Information from Device Permissions
We request certain device permissions to provide core App functionality (see Section 2).

---

## 2. Device Permissions & Why We Need Them

### 📷 Camera Access
We request camera access so you can:
- Take photos to upload as profile pictures or business images
- Scan QR codes for promotions or check-ins

**You can deny or revoke camera access at any time through your device settings. The App will continue to function, but photo-capture features will be unavailable.**

### 📂 Storage / Photo Library Access
We request access to your device's storage and photo library so you can:
- Select existing photos from your gallery to upload to your profile or listings
- Save downloaded content (e.g., receipts, confirmations) to your device

**You can deny or revoke storage access at any time. Features requiring file selection or saving will be unavailable.**

### 📍 Fine (Precise) Geolocation
We request precise location access so we can:
- Show nearby businesses, restaurants, and services relevant to your current location
- Provide accurate directions and distance estimates to listed places
- Personalize search results and recommendations based on proximity

**Location data is processed in real time and is not stored on our servers beyond what is needed to fulfill your request. You can deny or revoke location access at any time; location-based features will fall back to manual search.**

### 🔔 Push Notifications
We request permission to send push notifications so we can:
- Alert you about booking confirmations, updates, and reminders
- Notify you of order status changes and payment receipts
- Inform you about promotions, new features, or important account activity

**You can disable push notifications at any time through your device settings. This will not affect core App functionality.**

---

## 3. How We Use Your Information

We use collected information to:
- Provide, maintain, and improve the App's features and services
- Process bookings, orders, and payments
- Send transactional communications (e.g., confirmations, receipts)
- Personalize your experience and provide relevant recommendations
- Monitor usage patterns and diagnose technical issues
- Comply with legal obligations

---

## 4. How We Share Your Information

We do **not** sell your personal information. We may share information with:
- **Service Providers:** Third-party vendors who assist with payment processing, push notifications, analytics, and hosting (e.g., Stripe, OneSignal)
- **Legal Compliance:** When required by law, regulation, or legal process
- **Business Transfers:** In connection with a merger, acquisition, or sale of assets
- **With Your Consent:** When you explicitly authorize sharing

---

## 5. Data Retention

We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us (see Section 10).

---

## 6. Data Security

We implement industry-standard security measures including encryption in transit (TLS/SSL), secure authentication, and access controls. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.

---

## 7. Children's Privacy

The App is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will promptly delete it. If you believe a child under 13 has provided us with personal information, please contact us.

---

## 8. Your Rights (U.S. Residents)

Depending on your state of residence, you may have the right to:
- **Access** the personal information we hold about you
- **Delete** your personal information
- **Opt out** of the sale or sharing of personal information (we do not sell your data)
- **Non-discrimination** for exercising your privacy rights

**California residents** may have additional rights under the California Consumer Privacy Act (CCPA/CPRA). **Virginia, Colorado, Connecticut, and other state residents** may have rights under their respective state privacy laws.

To exercise any of these rights, please contact us using the information in Section 10.

---

## 9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy within the App and updating the "Last Updated" date. Your continued use of the App after changes constitutes acceptance of the revised policy.

---

## 10. Contact Us

If you have questions or concerns about this Privacy Policy or your data, please contact us at:

**Email:** privacy@pixbook.app

---

*This Privacy Policy is intended to comply with applicable U.S. federal and state privacy laws, including the California Consumer Privacy Act (CCPA/CPRA), Virginia Consumer Data Protection Act (VCDPA), Colorado Privacy Act (CPA), and Connecticut Data Privacy Act (CTDPA).*
`;

const PrivacyPolicyPage = () => {
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
          if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-foreground text-sm font-semibold mt-2">{line.replace(/\*\*/g, '')}</p>;
          if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-muted-foreground text-xs italic mt-2">{line.replace(/\*/g, '')}</p>;
          if (line.trim() === '') return null;
          return <p key={i} className="text-muted-foreground text-sm mb-2">{line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/<strong>|<\/strong>/g, (m) => m)}</p>;
        })}
      </article>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
