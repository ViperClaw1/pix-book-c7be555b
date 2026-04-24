import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, MessageCircle, CreditCard, CheckCircle, Star, Shield, Clock,
  Zap, ChevronDown, ChevronUp, Utensils, Scissors, Stethoscope, Compass,
  ArrowRight, Smartphone, Bot, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/landing-hero.jpg";
import pixapLogo from "@/assets/pixap-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const useCases = [
  { icon: Utensils, title: "Restaurants", desc: "Find and reserve a table at the best spots — no calls, no waiting." },
  { icon: Scissors, title: "Beauty & Wellness", desc: "Book a stylist, barber, or spa therapist in seconds." },
  { icon: Stethoscope, title: "Medical", desc: "Schedule doctor appointments without hold music." },
  { icon: Compass, title: "Tourism", desc: "Discover local experiences, tours, and activities." },
];

const steps = [
  { icon: Search, title: "Tell us what you need", desc: "Search or describe what you're looking for — our AI understands you." },
  { icon: Bot, title: "AI finds the best match", desc: "Smart suggestions based on your preferences, location, and availability." },
  { icon: MessageCircle, title: "Automated confirmation", desc: "Pixap contacts the venue via WhatsApp to confirm your slot in real time." },
  { icon: CreditCard, title: "Pay & go", desc: "Secure in-app payment. Get your booking details instantly." },
];

const benefits = [
  { icon: Clock, title: "Save hours every week", desc: "No more calling around, checking availability, or waiting on hold." },
  { icon: Zap, title: "Book in under 60 seconds", desc: "From search to confirmed booking — faster than making a phone call." },
  { icon: Shield, title: "Real-time confirmation", desc: "Know instantly if your slot is available. No surprises." },
  { icon: Star, title: "Personalized suggestions", desc: "AI learns your preferences and surfaces the best options for you." },
];

const faqs = [
  { q: "Is Pixap free to use?", a: "Yes, downloading and using Pixap is free. You only pay for the services you book." },
  { q: "How does the AI booking work?", a: "When you select a service, our AI orchestrator contacts the business via WhatsApp to check availability and confirm your booking — all automatically, in real time." },
  { q: "Is my payment information secure?", a: "Absolutely. All payments are processed through secure, encrypted payment gateways. We never store your card details." },
  { q: "What if I need to cancel a booking?", a: "You can cancel or reschedule directly in the app. Cancellation policies depend on the specific business." },
  { q: "Which cities is Pixap available in?", a: "We're currently launching in Almaty, Kazakhstan, with plans to expand to more cities soon." },
];

const ctaLabels = ["Download Pixap — It's Free", "Get Started", "Book Your First Appointment"];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2">
            <img src={pixapLogo} alt="Pixap logo" className="w-8 h-8 rounded-lg" />
            <span className="text-2xl font-bold tracking-tight text-primary font-sans">Pixap</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <Button size="sm" className="rounded-full px-5">
            Get the App <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              AI-Powered Booking
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
              Book anything.<br />
              <span className="text-primary">Skip the hassle.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Restaurants, salons, doctors, tours — Pixap's AI finds, confirms, and books for you in seconds. No calls. No waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="rounded-full text-base px-8 py-6 shadow-lg">
                {ctaLabels[0]} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-base px-8 py-6" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Available on iOS & Android · No credit card required</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <img
              src={heroImage}
              alt="Pixap app showing restaurant, beauty, and medical booking options on a smartphone"
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              width={1280}
              height={720}
              fetchPriority="high"
            />
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-secondary/50 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-3xl font-bold text-foreground">
            Booking shouldn't feel like a chore
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Calling businesses, checking schedules, getting put on hold, sending messages that go unanswered — you just want to reserve a table or see a doctor, not manage a project.
          </motion.p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl sm:text-3xl font-bold text-foreground">
            Pixap books for you — <span className="text-primary">automatically</span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Tell us what you need. Our AI finds the best options, contacts the business, confirms availability via WhatsApp, and completes your booking — all while you sit back.
          </motion.p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-secondary/50 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">How Pixap Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="h-full text-center border-none shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="pt-8 pb-6 px-5 space-y-3">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <s.icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary tracking-widest uppercase">Step {i + 1}</span>
                    <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">Why People Love Pixap</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="flex gap-4 items-start p-5 rounded-2xl bg-card shadow-sm border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="bg-secondary/50 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-4">One app for everything you book</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Whether it's dinner for two or a dentist check-up, Pixap handles it all.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => (
              <motion.div key={uc.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="h-full text-center border-none shadow-md bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6 px-5 space-y-3">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <uc.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{uc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof placeholder */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Trusted by early users</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-sm bg-card">
                <CardContent className="pt-6 pb-5 px-5 space-y-3">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {i === 1 && `"I booked a haircut and a restaurant in under 2 minutes. This is the future."`}
                    {i === 2 && `"No more calling clinics and waiting on hold. Pixap just handles it."`}
                    {i === 3 && `"Love that it confirms via WhatsApp — feels real, not just a form submission."`}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">[Early beta user]</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            [Social proof section — replace with real testimonials and metrics when available]
          </p>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-secondary/50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">Built on trust & transparency</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Lock, title: "Encrypted Payments", desc: "Your financial data is always protected with industry-standard encryption." },
              { icon: Shield, title: "Privacy First", desc: "We never sell your data. Your booking history stays private." },
              { icon: CheckCircle, title: "Real Confirmations", desc: "Every booking is verified directly with the business — no fake availability." },
            ].map((t, i) => (
              <motion.div key={t.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <t.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-foreground text-sm">{f.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.2 }}
                    className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Smartphone className="w-12 h-12 mx-auto opacity-80" />
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Ready to stop calling<br />and start booking?
          </h2>
          <p className="text-lg opacity-90 max-w-lg mx-auto">
            Join thousands of people who let Pixap handle their bookings. It's free to download.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="secondary" className="rounded-full text-base px-8 py-6 shadow-lg">
              Download for iOS <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Download for Android <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-bold text-foreground text-lg">Pixap</span>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/returns" className="hover:text-foreground transition-colors">Return Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p>© {new Date().getFullYear()} Pixap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
