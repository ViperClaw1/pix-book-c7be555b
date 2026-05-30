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


const APP_STORE_URL = "#";
const GOOGLE_PLAY_URL = "#";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const pains = [
  { icon: Phone, title: "Five apps, one night", desc: "Reservations here, tickets there, group chat everywhere." },
  { icon: Hourglass, title: "Guessing the vibe", desc: "Photos lie. You only know the mood once you arrive." },
  { icon: Users, title: "Lost in the group chat", desc: "Plans dissolve in a thread of ‘maybe later’ replies." },
  { icon: CalendarX, title: "Packed or empty", desc: "No way to see how crowded a place is right now." },
];

const features = [
  {
    eyebrow: "Pix AI Smart Booking",
    title: "Just say it. We book it.",
    desc: "Tell Pix AI what you’re in the mood for — cuisine, music, budget, time. It negotiates with venues on WhatsApp and locks in a confirmed seat in under a minute.",
    icon: Bot,
    image: featureSmartBooking,
    accent: "from-primary/30 via-primary/10 to-transparent",
  },
  {
    eyebrow: "Vibe Matching",
    title: "Find places that feel like you.",
    desc: "Calm, luxury, social, underground — pick your vibe and Pixap surfaces the venues whose energy matches yours tonight.",
    icon: Heart,
    image: featureVibeMatch,
    accent: "from-accent/30 via-accent/10 to-transparent",
  },
  {
    eyebrow: "Live Crowd Metrics",
    title: "See the room before you go.",
    desc: "Real-time crowd levels, wait times and energy reads from every spot — so you walk into the night you actually wanted.",
    icon: Activity,
    image: featureNightPlanned,
    accent: "from-primary/30 via-accent/20 to-transparent",
  },
  {
    eyebrow: "Social + Booking, One Place",
    title: "Plan together. Book together.",
    desc: "Invite friends, vote on the plan, split the bill, and confirm dinner, drinks and the club in one shared timeline.",
    icon: Users,
    image: featureExplore,
    accent: "from-accent/30 via-primary/10 to-transparent",
  },
];

const demoSteps = [
  { icon: Search, title: "Describe your night", desc: "Tell Pix AI the vibe, the crew, the hours — in your own words." },
  { icon: Wand2, title: "Match the vibe", desc: "AI ranks venues by your taste, live crowd levels, and distance." },
  { icon: Route, title: "Build the plan", desc: "Dinner, drinks, club — chained into one smart route with your friends." },
  { icon: BellRing, title: "Arrive", desc: "One pass, all stops. Walk in, skip the line, enjoy the night." },
];

const useCases = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Scissors, label: "Salons & Spa" },
  { icon: Music, label: "Nightlife" },
  { icon: Compass, label: "Events" },
];

const marqueeUseCases = Array.from({ length: 16 }, (_, index) => useCases[index % useCases.length]);

const stats = [
  { value: "<60s", label: "From idea to confirmed plan" },
  { value: "Live", label: "Crowd & wait-time data, always on" },
  { value: "1 app", label: "Plan, book, split and arrive together" },
];

const testimonials = [
  { quote: "Friday night, six friends, three venues — all confirmed in two minutes. Pix AI just runs the night.", name: "Aliya K.", role: "Almaty" },
  { quote: "The vibe match nailed it. Calm dinner, social bar, underground club — exactly the night I described.", name: "Daniyar M.", role: "Astana" },
  { quote: "Seeing live crowd levels before we leave the house is a cheat code. No more dead rooms.", name: "Saule T.", role: "Almaty" },
];

const faqs = [
  { q: "What is Pix AI smart booking?", a: "Pix AI is the concierge inside the app. You describe what you want, it talks to venues on WhatsApp in real time and returns a confirmed booking — no calls, no DMs from you." },
  { q: "How does vibe matching work?", a: "Pick a mood — calm, luxury, social or underground — and Pixap ranks venues by their crowd energy, music, design and reviews so the result actually feels right." },
  { q: "What are live crowd metrics?", a: "We show real-time occupancy, wait time and energy level for partner venues, so you can decide between two places without leaving the couch." },
  { q: "Can I plan a night with friends?", a: "Yes. Invite your group, vote on places, build a multi-stop route, split the bill, and let Pix AI lock every reservation at once." },
  { q: "Where is Pixap available?", a: "Launching in Almaty, Kazakhstan, with expansion to more cities soon." },
];


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
  const base =
    "group inline-flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-300 will-change-transform";
  const solid =
    "bg-foreground text-background hover:scale-[1.03] shadow-[0_10px_40px_-10px_hsl(220_25%_12%/0.5)]";
  const ghost =
    "border border-foreground/20 text-foreground hover:bg-foreground/5 backdrop-blur-md";
  const cls = variant === "solid" ? `${base} ${solid}` : `${base} ${ghost}`;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href={APP_STORE_URL} onClick={() => trackStoreClick("app_store")} className={cls} aria-label="Download on the App Store">
        <Apple className="w-7 h-7" strokeWidth={1.5} />
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-widest opacity-70">Download on the</div>
          <div className="text-base font-semibold">App Store</div>
        </div>
      </a>
      <a href={GOOGLE_PLAY_URL} onClick={() => trackStoreClick("google_play")} className={cls} aria-label="Get it on Google Play">
        <Play className="w-6 h-6 fill-current" strokeWidth={1.5} />
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-widest opacity-70">Get it on</div>
          <div className="text-base font-semibold">Google Play</div>
        </div>
      </a>
    </div>
  );
}

function FeatureRow({ f, index, progress }: { f: typeof features[number]; index: number; progress: MotionValue<number> }) {
  const reverse = index % 2 === 1;
  const y = useTransform(progress, [0, 1], [40, -40]);
  const Icon = f.icon;
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
          <div className="relative rounded-[2rem] overflow-hidden border border-border/50 shadow-[0_30px_80px_-20px_hsl(220_25%_12%/0.45)] bg-black">
            <img
              src={f.image}
              alt={f.title}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

const LandingPage = () => {
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
    Math.min(demoSteps.length - 1, Math.floor(v * demoSteps.length))
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Pixap — AI Concierge for Bookings in Almaty</title>
        <meta name="description" content="Pixap is an AI concierge that finds places, talks to venues on WhatsApp, and confirms your booking in under a minute. Restaurants, salons, tours and more in Almaty." />
        <link rel="canonical" href="https://pixapp.kz/" />
        <meta property="og:title" content="Pixap — AI Concierge for Bookings in Almaty" />
        <meta property="og:description" content="Find a place, let the AI handle the WhatsApp back-and-forth, and get a confirmed booking in under a minute." />
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
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </div>
            <a href={APP_STORE_URL}>
              <Button size="sm" className="rounded-full px-4 h-9 text-xs font-semibold">
                Get the app <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
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
              <span className="sr-only">Pixap — AI Concierge for Booking Any Place</span>
            </motion.h1>
          </motion.div>

          <motion.p
            style={{ y: taglineY }}
            className="mt-6 text-lg sm:text-xl md:text-2xl font-medium text-primary-foreground/95 will-change-transform"
          >
            <span className="text-pink-300">People.</span>{" "}
            <span className="text-blue-300">Inspire.</span>{" "}
            <span className="text-purple-300">eXplore.</span>{" "}
            <span>Any Place.</span>
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
                  <u.icon className="w-5 h-5 text-primary" />
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
              The booking problem
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
              Booking shouldn’t feel <br className="hidden sm:block" />
              <span className="text-muted-foreground/60">like a part-time job.</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pains.map((p, i) => (
              <motion.div
                key={p.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="group relative p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_hsl(12_76%_58%/0.25)]"
              >
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <p.icon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
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
            Tell Pixap what you want.<br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              We handle the rest.
            </span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            An AI concierge that finds the perfect place, talks to the venue on WhatsApp,
            and confirms your booking — in less than a minute.
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
              See it in motion
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              One app for the whole night.
            </h2>
            <p className="text-lg text-background/70 leading-relaxed">
              From the first craving to the last stop — Pixap plans it, books it, matches the vibe, and reads the room in real time.
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
                alt="Pixap app screens: planning a journey, AI concierge, smart route with vibe match, social booking and the final plan view"
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
                The flow
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Four taps.<br />
                <span className="text-background/50">Zero friction.</span>
              </h2>
              <p className="text-lg text-background/70 max-w-md leading-relaxed">
                Watch how Pixap turns a vague craving into a confirmed booking — without you
                ever picking up the phone.
              </p>

              <div className="relative h-72 w-full max-w-sm rounded-3xl overflow-hidden border border-background/10 bg-background/5">
                <img src={heroImage} alt="Pixap app preview" className="w-full h-full object-cover opacity-90" loading="lazy" />
                <motion.div
                  className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-foreground via-foreground/80 to-transparent"
                >
                  <DemoStepBadge activeStep={activeStep} />
                </motion.div>
              </div>
            </div>

            {/* Right scrolling steps */}
            <div className="space-y-6">
              {demoSteps.map((s, i) => (
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
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
                        Step {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                      <p className="text-background/70 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20 md:py-28 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-10">
          {stats.map((s, i) => (
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
            Loved by early adopters.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="p-7 rounded-3xl bg-card border border-border/60 flex flex-col gap-5 hover:shadow-[0_20px_60px_-20px_hsl(220_25%_12%/0.15)] transition-shadow"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <p className="text-foreground leading-relaxed">“{t.quote}”</p>
                <div className="mt-auto pt-4 border-t border-border/60">
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
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
            Questions, answered.
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
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
            Stop calling.<br />
            <span className="bg-gradient-to-r from-primary via-pink-300 to-accent bg-clip-text text-transparent">
              Start booking.
            </span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-lg text-background/70 max-w-xl mx-auto leading-relaxed"
          >
            Join the waitlist of people who let Pixap’s AI handle every booking.
            Free to download. No credit card required.
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
              The AI booking concierge for everything you used to call about.
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-foreground">Product</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how" className="hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-foreground">Legal</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">User Agreement</a></li>
              <li><a href="/returns" className="hover:text-foreground transition-colors">Return Policy</a></li>
              <li><a href="/data-deletion" className="hover:text-foreground transition-colors">Data Deletion</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-widest uppercase text-foreground">Get the app</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href={APP_STORE_URL} onClick={() => trackStoreClick("app_store")} className="hover:text-foreground transition-colors">App Store</a></li>
              <li><a href={GOOGLE_PLAY_URL} onClick={() => trackStoreClick("google_play")} className="hover:text-foreground transition-colors">Google Play</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-border/60 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Pixap. All rights reserved.</p>
          <p>Made with care in Almaty.</p>
        </div>
      </footer>
    </div>
  );
};

function DemoStepBadge({ activeStep }: { activeStep: MotionValue<number> }) {
  const [step, setStep] = useState(0);
  // Subscribe to changes
  if (typeof window !== "undefined") {
    activeStep.on("change", (v) => setStep(v));
  }
  const s = demoSteps[step] ?? demoSteps[0];
  const Icon = s.icon;
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-background">
        <div className="text-[10px] uppercase tracking-widest text-background/60">Now: Step {step + 1}</div>
        <div className="font-semibold">{s.title}</div>
      </div>
    </div>
  );
}

export default LandingPage;
