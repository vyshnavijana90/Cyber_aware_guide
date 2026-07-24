import { GraduationCap, HeartHandshake, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading
          eyebrow="The Project"
          title="About Online Fraud Awareness System"
          description="A free educational platform built to make cyber safety accessible to every Indian, regardless of age or technical background."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Target,
              title: "Our Objective",
              text: "Educate citizens about cyber safety and prevent online frauds through awareness, examples and practical guidance.",
            },
            {
              icon: GraduationCap,
              title: "Who It's For",
              text: "Students, senior citizens, small business owners and everyday digital users — anyone who uses a smartphone.",
            },
            {
              icon: HeartHandshake,
              title: "Our Promise",
              text: "Free forever, no ads, no data collection. Knowledge that protects your money and identity online.",
            },
          ].map((c) => (
            <Card
              key={c.title}
              className="p-6 border-border text-center hover:shadow-glow transition-shadow"
            >
              <div className="size-12 rounded-xl bg-gradient-cyber grid place-items-center mx-auto mb-4">
                <c.icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
