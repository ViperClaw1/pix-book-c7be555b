import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, type Variants } from "framer-motion";
import {
  Search, MessageCircle, CreditCard, Star, Shield, Clock,
  Zap, ChevronDown, ChevronUp, Utensils, Scissors, Stethoscope, Compass,
  ArrowRight, Apple, Play, Bot, Sparkles, Plane, MapPin, Phone, CalendarX,
  Hourglass, MessageSquareX, Wand2, MapIcon, BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/landing-hero.jpg";
import pixapLogo from "@/assets/pixap-logo.png";
import heroBg from "@/assets/landing-hero-bg.jpg";
import pixapMark from "@/assets/pixap-mark.png";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import heroBeauty from "@/assets/hero-beauty.jpg";
import heroEvents from "@/assets/hero-events.jpg";
import usecasesImg from "@/assets/landing-usecases.png";

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
  { icon: Phone, title: "Endless calls", desc: "Dialing five places to find one open table." },
  { icon: Hourglass, title: "Time wasted on hold", desc: "Minutes lost waiting for a human to pick up." },
  { icon: MessageSquareX, title: "Messages ignored", desc: "DMs that never get a reply, slots that vanish." },
  { icon: CalendarX, title: "Surprise unavailability", desc: "Apps that show ‘free’ — until you arrive." },
];

const features = [
  {
    eyebrow: "Conversational AI",
    title: "Just say what you want.",
    desc: "Pixap understands natural language and finds exactly what fits — cuisine, vibe, time, location, budget.",
    icon: Bot,
    image: heroRestaurant,
    accent: "from-primary/30 via-primary/10 to-transparent",
  },
  {
    eyebrow: "WhatsApp Orchestration",
    title: "We talk to the venue. You don’t.",
    desc: "Our agent contacts businesses on WhatsApp in real time, confirms your slot, and handles the back-and-forth.",
    icon: MessageCircle,
    image: heroBeauty,
    accent: "from-accent/30 via-accent/10 to-transparent",
  },
  {
    eyebrow: "One-tap Checkout",
    title: "Pay once. Done.",
    desc: "Secure payments in KZT, instant confirmation, and a booking pass that lives in your pocket.",
    icon: CreditCard,
    image: heroEvents,
    accent: "from-primary/30 via-accent/20 to-transparent",
  },
];

const demoSteps = [
  { icon: Search, title: "Discover", desc: "Browse curated places or describe your perfect spot." },
  { icon: Wand2, title: "Match", desc: "AI ranks the best fit by taste, distance, and timing." },
  { icon: MessageCircle, title: "Confirm", desc: "We message the venue and lock in your slot." },
  { icon: BellRing, title: "Arrive", desc: "Tap your pass at the door. That’s it." },
];

const useCases = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Scissors, label: "Salons & Spa" },
  { icon: Stethoscope, label: "Medical" },
  { icon: Compass, label: "Tours" },
];

const stats = [
  { value: "<60s", label: "From idea to confirmed booking" },
  { value: "24/7", label: "AI agent that never sleeps" },
  { value: "100%", label: "Real-time venue verification" },
];

const testimonials = [
  { quote: "I booked a haircut and dinner in the same minute. Pixap feels like cheating.", name: "Aliya K.", role: "Almaty" },
  { quote: "No phone calls, no DMs. The AI just gets it done. This is the future of booking.", name: "Daniyar M.", role: "Astana" },
  { quote: "Finally an app that doesn’t pretend a slot is open. Confirmations are real.", name: "Saule T.", role: "Almaty" },
];

const faqs = [
  { q: "Is Pixap free to use?", a: "Yes. The app is free — you only pay for the services you book." },
  { q: "How does the AI booking work?", a: "Our orchestrator contacts the business via WhatsApp to verify availability and confirm your booking instantly." },
  { q: "Are payments secure?", a: "Payments are processed through encrypted, PCI-compliant gateways. We never store card details." },
  { q: "Can I cancel a booking?", a: "Yes. Cancel or reschedule directly in the app — policies depend on the venue." },
  { q: "Where is Pixap available?", a: "Launching in Almaty, Kazakhstan, with expansion to more cities soon." },
];

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
      <a href={APP_STORE_URL} className={cls} aria-label="Download on the App Store">
        <Apple className="w-7 h-7" strokeWidth={1.5} />
        <div className="text-left leading-tight">
          <div className="text-[10px] uppercase tracking-widest opacity-70">Download on the</div>
          <div className="text-base font-semibold">App Store</div>
        </div>
      </a>
      <a href={GOOGLE_PLAY_URL} className={cls} aria-label="Get it on Google Play">
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
  const y = useTransform(progress, [0, 1], [60, -60]);
  const Icon = f.icon;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      variants={fadeUp}
      custom={0}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-20 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
          <Icon className="w-3.5 h-3.5" />
          {f.eyebrow}
        </div>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
          {f.title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">{f.desc}</p>
      </div>
      <motion.div style={{ y }} className="relative aspect-[4/5] max-w-md mx-auto w-full will-change-transform">
        <div className={`absolute -inset-10 bg-gradient-radial ${f.accent} blur-3xl opacity-80`} />
        <div className="relative h-full rounded-[2.5rem] overflow-hidden border border-border/50 shadow-[0_30px_80px_-20px_hsl(220_25%_12%/0.35)]">
          <img src={f.image} alt={f.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 p-3 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">{f.eyebrow}</div>
              <div className="text-muted-foreground text-xs">Powered by Pixap AI</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50">
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
              PIXAP
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
        <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...useCases, ...useCases, ...useCases].map((u, i) => (
            <div key={i} className="flex items-center gap-3 text-muted-foreground">
              <u.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold tracking-widest uppercase">{u.label}</span>
              <span className="text-border">•</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
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
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="px-6 pb-6"
                  >
                    <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
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
              <li><a href={APP_STORE_URL} className="hover:text-foreground transition-colors">App Store</a></li>
              <li><a href={GOOGLE_PLAY_URL} className="hover:text-foreground transition-colors">Google Play</a></li>
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
