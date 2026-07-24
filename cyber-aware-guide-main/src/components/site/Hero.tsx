import { ArrowRight, BookOpen, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-shield.jpg";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section
      id="home"
      className="relative pt-32 pb-20 overflow-hidden bg-gradient-hero text-primary-foreground"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="container relative mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" /> Online Fraud Awareness System
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Stay Safe from{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
              Online Frauds
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl">
            Learn how to recognise phishing scams, OTP frauds, UPI traps and more. A free platform
            built to empower students, seniors and everyday users with the knowledge to stay safe
            online.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/signup">
                <Sparkles className="size-4 mr-2" />
                Get Started
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <a href="#frauds">
                <BookOpen className="size-4 mr-2" />
                Learn More
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <a href="#report">
                <ShieldAlert className="size-4 mr-2" />
                Report Fraud
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#tips">
                Safety Tips <ArrowRight className="size-4 ml-1" />
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-6 text-sm text-white/70">
            <Stat value="₹10,000+ Cr" label="lost to cyber fraud (2024)" />
            <Stat value="1930" label="National Helpline" />
            <Stat value="24/7" label="Awareness available" />
          </div>
        </div>

        <div className="relative animate-float">
          <div className="absolute -inset-8 bg-gradient-glow blur-3xl" />
          <img
            src={heroImg}
            alt="Cyber security shield protecting digital network"
            width={1536}
            height={1024}
            className="relative rounded-2xl border border-white/20 shadow-glow"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}
