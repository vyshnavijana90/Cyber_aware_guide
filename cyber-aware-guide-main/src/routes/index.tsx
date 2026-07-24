import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { FraudTypes } from "@/components/site/FraudTypes";
import { SafetyTips } from "@/components/site/SafetyTips";
import { Quiz } from "@/components/site/Quiz";
import { ReportForm } from "@/components/site/ReportForm";
import { Stats } from "@/components/site/Stats";
import { Videos } from "@/components/site/Videos";
import { Testimonials } from "@/components/site/Testimonials";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberShield — Online Fraud Awareness System" },
      {
        name: "description",
        content:
          "Learn to identify phishing, OTP, UPI, and social media scams. Free cyber safety education for everyone.",
      },
      { property: "og:title", content: "CyberShield — Stay Safe from Online Frauds" },
      {
        property: "og:description",
        content:
          "Interactive cyber awareness platform with safety tips, quiz, statistics and reporting tools.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <FraudTypes />
        <SafetyTips />
        <Stats />
        <Quiz />
        <ReportForm />
        <Videos />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
