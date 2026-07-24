import {
  Eye,
  Fingerprint,
  KeyRound,
  Link2,
  QrCode,
  ShieldCheck,
  Smartphone,
  WifiOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

const tips = [
  {
    icon: KeyRound,
    title: "Never share OTPs",
    text: "No bank, wallet or government agency will ever ask for your OTP, PIN or CVV.",
  },
  {
    icon: Fingerprint,
    title: "Strong passwords",
    text: "Use 12+ characters mixing letters, numbers and symbols. Never reuse passwords.",
  },
  {
    icon: ShieldCheck,
    title: "Two-factor auth",
    text: "Enable 2FA / app-based authentication on email, banking and social accounts.",
  },
  {
    icon: Link2,
    title: "Verify links",
    text: "Hover over links to preview them. Type bank URLs manually instead of clicking.",
  },
  {
    icon: QrCode,
    title: "Avoid unknown QRs",
    text: "Scanning a QR is only for SENDING money, never for receiving.",
  },
  {
    icon: Smartphone,
    title: "Official apps only",
    text: "Install apps from Play Store / App Store. Check the developer name carefully.",
  },
  {
    icon: WifiOff,
    title: "Skip public Wi-Fi",
    text: "Never bank or shop on free public Wi-Fi without a trusted VPN.",
  },
  {
    icon: Eye,
    title: "Stay alert",
    text: "Review bank SMS and statements weekly. Report unknown debits within 3 days.",
  },
];

export function SafetyTips() {
  return (
    <section id="tips" className="py-24 bg-secondary/30 relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <SectionHeading
          eyebrow="Golden Rules"
          title="Cyber Safety Tips Everyone Should Know"
          description="Follow these eight simple rules to dramatically reduce the chance of being scammed online."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((t) => (
            <Card
              key={t.title}
              className="p-6 group hover:border-primary transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
            >
              <div className="size-11 rounded-lg bg-gradient-cyber grid place-items-center mb-4 group-hover:animate-pulse-glow">
                <t.icon className="size-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-1.5">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
