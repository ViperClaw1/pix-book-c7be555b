import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform, useSpring, MotionValue, type Variants } from "framer-motion";
import {
  Search, MessageCircle, CreditCard, Star, Shield, Clock,
  Zap, ChevronDown, ChevronUp, Utensils, Scissors, Music, Compass,
  ArrowRight, Apple, Play, Bot, Sparkles, Heart, MapPin, Phone, CalendarX,
  Hourglass, Users, Wand2, Activity, BellRing, Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/landing-hero.jpg";
import pixapLogo from "@/assets/pixap-logo.png";
import heroBg from "@/assets/landing-hero-bg.jpg";
import pixapMark from "@/assets/pixap-mark.png";
import appShowcase from "@/assets/landing-app-showcase.png";
import featureSmartBooking from "@/assets/feature-smart-booking.png";
import featureVibeMatch from "@/assets/feature-vibe-match.png";
import featureNightPlanned from "@/assets/feature-night-planned.png";
import featureExplore from "@/assets/feature-explore.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import type { Dict } from "@/i18n/translations";


const APP_STORE_URL = "https://apps.apple.com/us/app/pixap/id6760616898";
const GOOGLE_PLAY_URL = "#";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const painIcons = [Phone, Hourglass, Users, CalendarX];
const featureIcons = [Bot, Heart, Activity, Users];
const featureImages = [featureSmartBooking, featureVibeMatch, featureNightPlanned, featureExplore];
const featureAccents = [
  "from-primary/30 via-primary/10 to-transparent",
  "from-accent/30 via-accent/10 to-transparent",
  "from-primary/30 via-accent/20 to-transparent",
  "from-accent/30 via-primary/10 to-transparent",
];
const demoIcons = [Search, Wand2, Route, BellRing];

const useCaseIcons = [Utensils, Scissors, Music, Compass];

function trackStoreClick(store: "app_store" | "google_play") {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", "store_click", {
      event_category: "conversion",
      event_label: store,
      store,
    });
    w.gtag("event", "conversion", { send_to: "G-TZL3J8NSPT", store });
  }
}

function StoreButtons({ variant = "solid" as "solid" | "ghost" }) {
  const { t } = useI18n();
  const base =
    "group inline-flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-300 will-change-transform";
  const solid =
    "bg-foreground text-background hover:scale-[1.03] shadow-[0_10px_40px_-10px_hsl(220_25%_12%/0.5)]";
  const ghost =
    "border border-foreground/20 text-foreground hover:bg-foreground/5 backdrop-blur-md";
  const cls = variant === "solid" ? `${base} ${solid}` : `${base} ${ghost}`;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href={APP_STORE_URL} onClick={() => trackStoreClick("app_store")} className={cls} aria-label={`${t.store.downloadOn} ${t.store.appStore}`}>
        <Apple className="w-7 h-7" strokeWidth={1.5} />
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-widest opacity-70">{t.store.downloadOn}</div>
          <div className="text-base font-semibold">{t.store.appStore}</div>
        </div>
      </a>
      <a href={GOOGLE_PLAY_URL} onClick={() => trackStoreClick("google_play")} className={cls} aria-label={`${t.store.getItOn} ${t.store.googlePlay}`}>
        <Play className="w-6 h-6 fill-current" strokeWidth={1.5} />
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-widest opacity-70">{t.store.getItOn}</div>
          <div className="text-base font-semibold">{t.store.googlePlay}</div>
        </div>
      </a>
    </div>
  );
}

type FeatureItem = { eyebrow: string; title: string; desc: string; icon: typeof Bot; image: string; accent: string };

function FeatureRow({ f, index, progress }: { f: FeatureItem; index: number; progress: MotionValue<number> }) {
  const reverse = index % 2 === 1;
  const y = useTransform(progress, [0, 1], [40, -40]);
  const Icon = f.icon;
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`grid lg:grid-cols-2 gap-10 lg:gap-20 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-5"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
          <Icon className="w-3.5 h-3.5" />
          {f.eyebrow}
        </div>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
          {f.title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">{f.desc}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-auto will-change-transform"
      >
        <motion.div style={{ y }} className="relative will-change-transform">
          <div className={`absolute -inset-10 bg-gradient-radial ${f.accent} blur-3xl opacity-80 pointer-events-none`} />
          <div
            className="relative rounded-[2rem] overflow-hidden border border-border/50 shadow-[0_30px_80px_-20px_hsl(220_25%_12%/0.45)] bg-black"
            style={{ aspectRatio: "3 / 4" }}
          >
            <img
              src={f.image}
              alt={f.title}
              width={960}
              height={1280}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover block transition-all duration-[1200ms] ease-out ${
                loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.04] blur-md"
              }`}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

const LandingPage = () => {
  const { t, lang } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const demoRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const logoY = useTransform(scrollY, [0, 800], [0, -120]);
  const titleY = useTransform(scrollY, [0, 800], [0, -60]);
  const taglineY = useTransform(scrollY, [0, 800], [0, -20]);
  const ctaY = useTransform(scrollY, [0, 800], [0, 20]);
  const overlayOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const { scrollYProgress: featuresProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"],
  });
  const smoothFeatures = useSpring(featuresProgress, { stiffness: 80, damping: 20 });

  const { scrollYProgress: demoProgress } = useScroll({
    target: demoRef,
    offset: ["start start", "end end"],
  });
  const activeStep = useTransform(demoProgress, (v) =>
    Math.min(t.demo.steps.length - 1, Math.floor(v * t.demo.steps.length))
  );

  const features: FeatureItem[] = [t.features.smart, t.features.vibe, t.features.crowd, t.features.social].map(
    (f, i) => ({ ...f, icon: featureIcons[i], image: featureImages[i], accent: featureAccents[i] })
  );

  const useCases = useCaseIcons.map((Icon, i) => ({
    Icon,
    label: [t.marquee.restaurants, t.marquee.salons, t.marquee.nightlife, t.marquee.events][i],
  }));
  const marqueeUseCases = Array.from({ length: 16 }, (_, i) => useCases[i % useCases.length]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <html lang={lang} />
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
        <link rel="canonical" href="https://pixapp.kz/" />
        <meta property="og:title" content={t.meta.title} />
        <meta property="og:description" content={t.meta.ogDescription} />
        <meta property="og:url" content="https://pixapp.kz/" />
      </Helmet>
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50" aria-label="Primary">

        <div className="max-w-6xl mx-auto mt-3 px-3">
          <div className="flex items-center justify-between px-4 sm:px-5 h-14 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/60 shadow-[0_8px_30px_-10px_hsl(220_25%_12%/0.15)]">
            <div className="flex items-center gap-2">
              <img src={pixapLogo} alt="Pixap" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold tracking-tight text-foreground">Pixap</span>
            </div>
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">{t.nav.features}</a>
              <a href="#how" className="hover:text-foreground transition-colors">{t.nav.how}</a>
              <a href="#faq" className="hover:text-foreground transition-colors">{t.nav.faq}</a>
            </div>
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <a href={APP_STORE_URL} onClick={() => trackStoreClick("app_store")}>
                <Button size="sm" className="rounded-full px-4 h-9 text-xs font-semibold">
                  {t.nav.getApp} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Brand Hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 -top-20 -bottom-20 will-change-transform">
          <img
            src={heroBg}
            alt="Travelers overlooking a scenic mountain landscape"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/10 to-foreground/40" />
        </motion.div>

        <motion.div
          style={{ opacity: overlayOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
        >
          <motion.div
            style={{ y: logoY }}
            className="flex flex-col items-center justify-center will-change-transform"
          >
            <img
              src={pixapMark}
              alt="Pixap logo"
              width={512}
              height={512}
              className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
              fetchPriority="high"
            />
            <motion.h1
              style={{ y: titleY }}
              className="mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.08em] text-primary-foreground will-change-transform drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
            >
              <span aria-hidden="true">PIXAP</span>
              <span className="sr-only">{t.hero.srTitle}</span>
            </motion.h1>
          </motion.div>

          <motion.p
            style={{ y: taglineY }}
            className="mt-6 text-lg sm:text-xl md:text-2xl font-medium text-primary-foreground/95 will-change-transform"
          >
            <span className="text-pink-300">{t.hero.taglinePeople}</span>{" "}
            <span className="text-blue-300">{t.hero.taglineInspire}</span>{" "}
            <span className="text-purple-300">{t.hero.taglineExplore}</span>{" "}
            <span>{t.hero.taglineAnyPlace}</span>
          </motion.p>

          <motion.div style={{ y: ctaY }} className="mt-10 will-change-transform">
            <StoreButtons variant="ghost" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-primary-foreground/80" />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee of categories */}
      <section className="relative py-8 border-y border-border/60 bg-secondary/40 overflow-hidden">
        <div className="flex w-max min-w-full animate-[marquee_45s_linear_infinite] whitespace-nowrap will-change-transform">
          {[...Array(2)].map((_, copy) => (
            <div key={copy} className="flex min-w-max shrink-0 gap-12 pr-12" aria-hidden={copy === 1}>
              {marqueeUseCases.map((u, i) => (
                <div key={`${u.label}-${copy}-${i}`} className="flex shrink-0 items-center gap-3 text-muted-foreground">
                  <u.Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold tracking-widest uppercase">{u.label}</span>
                  <span className="text-border">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* Pain Points */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 text-muted-foreground text-xs font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {t.pains.eyebrow}
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
              {t.pains.title1} <br className="hidden sm:block" />
              <span className="text-muted-foreground/60">{t.pains.title2}</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.pains.items.map((p, i) => {
              const Icon = painIcons[i];
              return (
                <motion.div
                  key={p.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i}
                  className="group relative p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_hsl(12_76%_58%/0.25)]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution headline */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-background via-secondary/30 to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground"
          >
            {t.solution.line1}<br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {t.solution.line2}
            </span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t.solution.sub}
          </motion.p>
        </div>
      </section>

      {/* App Showcase */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/25 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[140px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-5 mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 text-background/80 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {t.showcase.eyebrow}
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              {t.showcase.title}
            </h2>
            <p className="text-lg text-background/70 leading-relaxed">
              {t.showcase.desc}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 blur-3xl opacity-60 pointer-events-none" />
            <div className="relative rounded-[2rem] overflow-hidden border border-background/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)] bg-background/[0.03]">
              <img
                src={appShowcase}
                alt={t.showcase.alt}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" ref={featuresRef} className="relative py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-32 md:space-y-48">
          {features.map((f, i) => (
            <FeatureRow key={f.title} f={f} index={i} progress={smoothFeatures} />
          ))}
        </div>
      </section>


      {/* Interactive demo (sticky scroll) */}
      <section id="how" ref={demoRef} className="relative bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 py-24 md:py-32">
            {/* Sticky left */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 text-background/80 text-xs font-semibold tracking-wider uppercase">
                <Zap className="w-3.5 h-3.5" />
                {t.demo.eyebrow}
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                {t.demo.titleA}<br />
                <span className="text-background/50">{t.demo.titleB}</span>
              </h2>
              <p className="text-lg text-background/70 max-w-md leading-relaxed">
                {t.demo.intro}
              </p>

              <div className="relative h-72 w-full max-w-sm rounded-3xl overflow-hidden border border-background/10 bg-background/5">
                <img src={heroImage} alt="Pixap app preview" className="w-full h-full object-cover opacity-90" loading="lazy" />
                <motion.div
                  className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-foreground via-foreground/80 to-transparent"
                >
                  <DemoStepBadge activeStep={activeStep} steps={t.demo.steps} nowLabel={t.demo.nowLabel} />
                </motion.div>
              </div>
            </div>

            {/* Right scrolling steps */}
            <div className="space-y-6">
              {t.demo.steps.map((s, i) => {
                const Icon = demoIcons[i];
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="p-8 rounded-3xl border border-background/10 bg-background/[0.04] backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
                          {t.demo.stepLabel} {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                        <p className="text-background/70 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20 md:py-28 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-10">
          {t.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="mt-3 text-sm text-muted-foreground max-w-[12rem] mx-auto leading-relaxed">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-center text-foreground mb-16"
          >
            {t.testimonials.title}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-5">
            {t.testimonials.items.map((tItem, i) => (
              <motion.div
                key={tItem.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="p-7 rounded-3xl bg-card border border-border/60 flex flex-col gap-5 hover:shadow-[0_20px_60px_-20px_hsl(220_25%_12%/0.15)] transition-shadow"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <p className="text-foreground leading-relaxed">“{tItem.quote}”</p>
                <div className="mt-auto pt-4 border-t border-border/60">
                  <div className="font-semibold text-foreground text-sm">{tItem.name}</div>
                  <div className="text-muted-foreground text-xs">{tItem.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-32 bg-secondary/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-center text-foreground mb-12"
          >
            {t.faq.title}
          </motion.h2>
          <div className="space-y-3">
            {t.faq.items.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-colors hover:border-primary/30">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-foreground">{f.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 md:py-40 overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/30 blur-[160px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/25 blur-[140px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]"
          >
            {t.finalCta.titleA}<br />
            <span className="bg-gradient-to-r from-primary via-pink-300 to-accent bg-clip-text text-transparent">
              {t.finalCta.titleB}
            </span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-lg text-background/70 max-w-xl mx-auto leading-relaxed"
          >
            {t.finalCta.desc}
          </motion.p>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="flex justify-center"
          >
            <div className="[&_a]:!bg-background [&_a]:!text-foreground">
              <StoreButtons variant="solid" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={pixapLogo} alt="Pixap" className="w-7 h-7 rounded-lg" />
              <span className="text-lg font-bold text-foreground">Pixap</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-[14rem]">
              {t.footer.tagline}
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-foreground">{t.footer.product}</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">{t.nav.features}</a></li>
              <li><a href="#how" className="hover:text-foreground transition-colors">{t.nav.how}</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">{t.nav.faq}</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-foreground">{t.footer.legal}</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/privacy" className="hover:text-foreground transition-colors">{t.footer.privacy}</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">{t.footer.terms}</a></li>
              <li><a href="/returns" className="hover:text-foreground transition-colors">{t.footer.returns}</a></li>
             <li><a href="/data-deletion" className="hover:text-foreground transition-colors">{t.footer.dataDeletion}</a></li>
             <li><a href="/community-guidelines" className="hover:text-foreground transition-colors">{t.footer.community}</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-foreground">{t.footer.getApp}</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href={APP_STORE_URL} onClick={() => trackStoreClick("app_store")} className="hover:text-foreground transition-colors">{t.store.appStore}</a></li>
              <li><a href={GOOGLE_PLAY_URL} onClick={() => trackStoreClick("google_play")} className="hover:text-foreground transition-colors">{t.store.googlePlay}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-border/60 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Pixap. {t.footer.rights}</p>
          <p>{t.footer.madeIn}</p>
        </div>
      </footer>
    </div>
  );
};

function DemoStepBadge({ activeStep, steps, nowLabel }: { activeStep: MotionValue<number>; steps: Dict["demo"]["steps"]; nowLabel: string }) {
  const [step, setStep] = useState(0);
  // Subscribe to changes
  if (typeof window !== "undefined") {
    activeStep.on("change", (v) => setStep(v));
  }
  const s = steps[step] ?? steps[0];
  const Icon = demoIcons[step] ?? demoIcons[0];
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-background">
        <div className="text-[10px] uppercase tracking-widest text-background/60">{nowLabel} {step + 1}</div>
        <div className="font-semibold">{s.title}</div>
      </div>
    </div>
  );
}

export default LandingPage;
