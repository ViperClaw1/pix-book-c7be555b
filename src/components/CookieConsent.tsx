import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/I18nProvider";

const STORAGE_KEY = "pixap_cookie_consent_v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  ts: number;
};

type GtagFn = (...args: unknown[]) => void;

function applyConsent(c: Consent) {
  const w = window as unknown as { gtag?: GtagFn };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      ad_storage: c.marketing ? "granted" : "denied",
      ad_user_data: c.marketing ? "granted" : "denied",
      ad_personalization: c.marketing ? "granted" : "denied",
      analytics_storage: c.analytics ? "granted" : "denied",
      functionality_storage: c.functional ? "granted" : "denied",
      personalization_storage: c.functional ? "granted" : "denied",
    });
  }
}

function save(c: Consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  applyConsent(c);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: c }));
}

export default function CookieConsent() {
  const { t } = useI18n();
  const c = t.cookies;
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [functional, setFunctional] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setOpen(true);
    } catch {
      setOpen(true);
    }
    const openHandler = () => {
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener("open-cookie-settings", openHandler);
    return () => window.removeEventListener("open-cookie-settings", openHandler);
  }, []);

  const acceptAll = () => {
    save({ necessary: true, analytics: true, marketing: true, functional: true, ts: Date.now() });
    setOpen(false);
  };
  const rejectAll = () => {
    save({ necessary: true, analytics: false, marketing: false, functional: false, ts: Date.now() });
    setOpen(false);
  };
  const saveChoice = () => {
    save({ necessary: true, analytics, marketing, functional, ts: Date.now() });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5 pointer-events-none"
          role="dialog"
          aria-live="polite"
          aria-label={c.title}
        >
          <div className="mx-auto max-w-3xl pointer-events-auto rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                <Cookie className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  {c.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {c.body}{" "}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    {c.privacyLink}
                  </Link>
                  .
                </p>

                {details && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3 overflow-hidden"
                  >
                    <Row title={c.necessaryTitle} desc={c.necessaryDesc} checked disabled />
                    <Row title={c.functionalTitle} desc={c.functionalDesc} checked={functional} onChange={setFunctional} />
                    <Row title={c.analyticsTitle} desc={c.analyticsDesc} checked={analytics} onChange={setAnalytics} />
                    <Row title={c.marketingTitle} desc={c.marketingDesc} checked={marketing} onChange={setMarketing} />
                  </motion.div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={acceptAll} className="flex-1 sm:flex-none">
                    {c.acceptAll}
                  </Button>
                  <Button onClick={rejectAll} variant="outline" className="flex-1 sm:flex-none">
                    {c.rejectAll}
                  </Button>
                  {details ? (
                    <Button onClick={saveChoice} variant="secondary" className="flex-1 sm:flex-none">
                      {c.save}
                    </Button>
                  ) : (
                    <Button onClick={() => setDetails(true)} variant="ghost" className="flex-1 sm:flex-none">
                      {c.customize}
                    </Button>
                  )}
                </div>
              </div>
              <button
                onClick={rejectAll}
                aria-label={c.close}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-foreground/[0.02] p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  );
}
