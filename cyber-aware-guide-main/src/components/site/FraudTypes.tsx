import {
  AlertTriangle,
  Banknote,
  Briefcase,
  Fish,
  KeySquare,
  PhoneCall,
  QrCode,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";

type Fraud = {
  icon: LucideIcon;
  title: string;
  about: string;
  example: string;
  prevention: string[];
  warning: string[];
  color: string;
};

const frauds: Fraud[] = [
  {
    icon: Fish,
    title: "Phishing Attacks",
    about:
      "Fake emails, SMS, or websites pretending to be from trusted brands to steal credentials.",
    example:
      "An email from 'support@hdfc-verify.com' asking you to reset your password via a suspicious link.",
    prevention: [
      "Check sender's full email address",
      "Hover over links before clicking",
      "Never enter credentials via email links",
    ],
    warning: [
      "Urgent threats / account suspension",
      "Misspelled domains",
      "Generic greetings like 'Dear Customer'",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: KeySquare,
    title: "OTP Scams",
    about: "Fraudsters trick you into sharing the One-Time Password sent to your phone.",
    example:
      "A 'bank executive' calls saying your card is blocked and asks for the OTP to 'unblock'.",
    prevention: [
      "Never share OTPs with anyone",
      "Banks never ask for OTPs",
      "Use app-based OTPs where possible",
    ],
    warning: [
      "Caller creating urgency",
      "Asking for OTP, PIN or CVV",
      "Unknown international numbers",
    ],
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Smartphone,
    title: "UPI Payment Frauds",
    about:
      "Tricks involving fake collect requests, QR codes or screen-sharing apps to drain your account.",
    example:
      "Seller on OLX sends a 'payment request' link — clicking it deducts ₹10,000 instead of crediting you.",
    prevention: [
      "Never approve a request to receive money",
      "You only enter PIN to send money",
      "Verify UPI handle before paying",
    ],
    warning: [
      "Pay/collect request from buyer",
      "Asked to scan QR to 'receive' money",
      "Screen-sharing requests",
    ],
    color: "from-sky-500 to-blue-500",
  },
  {
    icon: Briefcase,
    title: "Fake Job Offers",
    about: "Scammers post fake jobs and ask for registration / training fees upfront.",
    example: "A 'work-from-home data entry' job demanding ₹2,500 for laptop activation.",
    prevention: [
      "Legitimate jobs never ask for money",
      "Verify company on LinkedIn",
      "Cross-check offer letter domain",
    ],
    warning: [
      "Too-good-to-be-true salary",
      "Generic Gmail offer letters",
      "Pressure to pay quickly",
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Social Media Scams",
    about:
      "Fake profiles, romance scams, lottery wins and investment groups on Instagram, Facebook, WhatsApp.",
    example: "A stranger befriends you on Instagram, then asks for emergency money transfer.",
    prevention: [
      "Don't accept unknown requests",
      "Reverse-image-search profile photos",
      "Never send money to online friends",
    ],
    warning: [
      "Profile created recently",
      "Immediate emotional attachment",
      "Investment 'tips' in DMs",
    ],
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: PhoneCall,
    title: "Fake Customer Care",
    about:
      "Fake support numbers shown in Google search trick you into installing remote-access apps.",
    example:
      "You search 'Paytm helpline', call the first number, and they install AnyDesk on your phone.",
    prevention: [
      "Use only official app's support section",
      "Never install remote-control apps",
      "Don't trust Google's top result blindly",
    ],
    warning: [
      "Asked to install AnyDesk / TeamViewer",
      "Asked for screen-share",
      "Number not listed on official site",
    ],
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: QrCode,
    title: "QR Code Scams",
    about: "Scanning a malicious QR can debit money instead of crediting it.",
    example: "Buyer of your used phone sends a 'payment QR' — scanning + PIN debits your account.",
    prevention: [
      "Scanning is only for sending money",
      "Verify the merchant name first",
      "Avoid QRs from strangers",
    ],
    warning: [
      "QR sent for 'refund'",
      "QR with no merchant name",
      "Asked to enter UPI PIN to 'receive'",
    ],
    color: "from-fuchsia-500 to-purple-500",
  },
  {
    icon: Banknote,
    title: "Loan App Frauds",
    about: "Illegal lending apps with hidden fees, harassment and data theft.",
    example:
      "₹5,000 loan disbursed as ₹3,500, full repayment demanded in 7 days with threatening calls.",
    prevention: [
      "Use RBI-registered NBFCs only",
      "Check app permissions",
      "Read reviews before installing",
    ],
    warning: [
      "No proper website / address",
      "Asks contact + gallery access",
      "Disbursal before agreement",
    ],
    color: "from-red-500 to-rose-500",
  },
];

export function FraudTypes() {
  return (
    <section id="frauds" className="py-24 relative">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Know Your Enemy"
          title="Common Types of Online Frauds"
          description="Tap any card to read examples, prevention tips and warning signs for the most common scams in India today."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {frauds.map((f) => (
            <Card
              key={f.title}
              className="group relative overflow-hidden p-6 bg-card hover:-translate-y-1 transition-all duration-300 hover:shadow-glow border-border"
            >
              <div
                className={`absolute -top-12 -right-12 size-32 rounded-full bg-gradient-to-br ${f.color} opacity-10 group-hover:opacity-30 transition-opacity`}
              />
              <div
                className={`size-12 rounded-xl bg-gradient-to-br ${f.color} grid place-items-center mb-4 shadow-glow`}
              >
                <f.icon className="size-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{f.about}</p>
              <Accordion type="single" collapsible>
                <AccordionItem value="more" className="border-0">
                  <AccordionTrigger className="text-xs uppercase tracking-wider text-primary hover:no-underline py-2">
                    View details
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <Detail label="Real example" text={f.example} />
                    <Detail label="Prevention" items={f.prevention} />
                    <Detail label="Warning signs" items={f.warning} icon />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Detail({
  label,
  text,
  items,
  icon,
}: {
  label: string;
  text?: string;
  items?: string[];
  icon?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      {text && <p className="text-foreground/90">{text}</p>}
      {items && (
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it} className="flex gap-2 text-foreground/90">
              {icon ? (
                <AlertTriangle className="size-3.5 mt-1 text-destructive shrink-0" />
              ) : (
                <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
              )}
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
