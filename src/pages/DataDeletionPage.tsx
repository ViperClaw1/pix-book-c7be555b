import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DataDeletionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition text-sm text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <article className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Account & Data Deletion</h1>
            <p className="text-sm text-muted-foreground">Last Updated: April 25, 2026</p>
          </header>

          <section className="space-y-3">
            <p className="text-foreground/90 leading-relaxed">
              This page explains how users of the <strong>Pixap</strong> mobile application (available on Google Play)
              can request deletion of their account and associated personal data, in compliance with Google Play's
              User Data policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">How to Request Account Deletion</h2>
            <p className="text-foreground/90 leading-relaxed">
              You can request the deletion of your Pixap account and personal data using either of the following methods:
            </p>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Option 1 — In-App Request</h3>
              <ol className="list-decimal list-inside space-y-1 text-foreground/90">
                <li>Open the Pixap app and sign in to your account.</li>
                <li>Go to <strong>Profile</strong> from the bottom navigation bar.</li>
                <li>Tap <strong>Edit Profile</strong>.</li>
                <li>Scroll to the bottom and tap <strong>Delete Account</strong>.</li>
                <li>Confirm the action when prompted.</li>
              </ol>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Option 2 — Email Request</h3>
              <p className="text-foreground/90">
                Send an email to{" "}
                <a href="mailto:support@pixap.kz" className="text-primary underline">
                  support@pixap.kz
                </a>{" "}
                from the email address registered with your Pixap account, with the subject{" "}
                <em>"Account Deletion Request"</em>.
              </p>
              <p className="text-foreground/90">
                Our team will verify your identity and process the request within <strong>7 business days</strong>.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Data That Will Be Deleted</h2>
            <p className="text-foreground/90 leading-relaxed">
              When you request account deletion, the following personal data will be permanently removed from our systems:
            </p>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>Email address</li>
              <li>First and last name</li>
              <li>Phone number</li>
              <li>Profile photo</li>
              <li>Saved favorites and personal preferences</li>
              <li>Authentication credentials</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Data That May Be Retained</h2>
            <p className="text-foreground/90 leading-relaxed">
              For legal, accounting, and fraud-prevention purposes, certain anonymized transactional records
              (e.g., past bookings, payment receipts) may be retained as required by applicable law. This data is
              dissociated from your personal identifiers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Storage & Retention Period</h2>
            <p className="text-foreground/90 leading-relaxed">
              After your deletion request is confirmed, your personal data is removed from active systems immediately
              and fully purged from backups within <strong>90 days</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
            <p className="text-foreground/90 leading-relaxed">
              For any questions regarding account deletion or your data, please contact us at{" "}
              <a href="mailto:support@pixap.kz" className="text-primary underline">
                support@pixap.kz
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default DataDeletionPage;
