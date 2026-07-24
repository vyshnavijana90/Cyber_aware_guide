import { Facebook, Github, Instagram, Linkedin, Mail, Send, Twitter, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "./SectionHeading";
import { toast } from "sonner";

const TEAM = [
  { name: "Project Lead", role: "Awareness & Content", initials: "PL" },
  { name: "Frontend Dev", role: "UI & Animations", initials: "FD" },
  { name: "Cyber Advisor", role: "Security Research", initials: "CA" },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export function Contact() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Contact The Team"
          description="Questions, suggestions or a story to share? We'd love to hear from you."
        />
        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          <Card className="lg:col-span-3 p-6 md:p-8 border-border shadow-card">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cname" className="mb-2 block">
                    Name
                  </Label>
                  <Input id="cname" name="name" required maxLength={120} />
                </div>
                <div>
                  <Label htmlFor="cemail" className="mb-2 block">
                    Email
                  </Label>
                  <Input id="cemail" name="email" type="email" required maxLength={200} />
                </div>
              </div>
              <div>
                <Label htmlFor="csubject" className="mb-2 block">
                  Subject
                </Label>
                <Input id="csubject" name="subject" maxLength={150} />
              </div>
              <div>
                <Label htmlFor="cmessage" className="mb-2 block">
                  Message
                </Label>
                <Textarea id="cmessage" name="message" rows={5} required maxLength={1000} />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-cyber border-0 text-primary-foreground"
              >
                <Send className="size-4 mr-2" /> Send message
              </Button>
            </form>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 border-border">
              <Mail className="size-6 text-primary mb-3" />
              <h4 className="font-semibold mb-1">Email us</h4>
              <a
                href="mailto:hello@cybershield.in"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                hello@cybershield.in
              </a>
            </Card>

            <Card className="p-6 border-border">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <User className="size-4" /> The Team
              </h4>
              <ul className="space-y-3">
                {TEAM.map((m) => (
                  <li key={m.name} className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-cyber grid place-items-center text-primary-foreground text-xs font-semibold">
                      {m.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 border-border">
              <h4 className="font-semibold mb-3">Follow us</h4>
              <div className="flex gap-2 flex-wrap">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="size-10 rounded-lg border border-border grid place-items-center text-muted-foreground hover:bg-gradient-cyber hover:text-primary-foreground hover:border-transparent transition-all hover:scale-110"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
