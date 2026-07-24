import { Quote, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

const STORIES = [
  {
    name: "Priya Sharma",
    role: "College Student, Delhi",
    text: "I got an SMS saying my KYC will expire. Because I'd read about phishing here, I checked the URL — it was fake. Saved my ₹40,000 scholarship!",
    initials: "PS",
  },
  {
    name: "Ramesh Patel",
    role: "Retired Teacher, Ahmedabad",
    text: "A 'bank officer' called for OTP. Thanks to the safety tips, I refused and reported to 1930. My pension is safe.",
    initials: "RP",
  },
  {
    name: "Anjali Verma",
    role: "Small Business Owner",
    text: "An OLX buyer sent a QR claiming to pay me. I'd just taken the quiz on this site and knew it was a debit trap. Hung up immediately.",
    initials: "AV",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Success Stories"
          title="People Who Stayed Safe"
          description="Real stories from people who recognised the scam in time."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <Card
              key={s.name}
              className="p-6 relative border-border hover:shadow-glow hover:-translate-y-1 transition-all"
            >
              <Quote className="absolute top-4 right-4 size-8 text-primary/20" />
              <div className="flex gap-0.5 mb-3 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6">"{s.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="size-10 rounded-full bg-gradient-cyber grid place-items-center text-primary-foreground text-sm font-semibold">
                  {s.initials}
                </div>
                <div>
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
