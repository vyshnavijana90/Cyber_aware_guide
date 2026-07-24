import { useState } from "react";
import { CheckCircle2, ExternalLink, Phone, Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeading } from "./SectionHeading";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api-client";

const FRAUD_TYPES = [
  "Phishing",
  "OTP Scam",
  "UPI Fraud",
  "Fake Job",
  "Social Media Scam",
  "Fake Customer Care",
  "QR Code Scam",
  "Loan App Fraud",
  "Other",
];

export function ReportForm() {
  const { isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value.trim();
    if (!description) {
      toast.error("Please describe the incident");
      return;
    }

    const selectValue = (form.querySelector("#type") as HTMLElement)?.innerText?.trim() || "Other";
    const fraudType = FRAUD_TYPES.includes(selectValue) ? selectValue : "Other";

    if (isAuthenticated) {
      try {
        const formData = new FormData();
        formData.append("fraudType", fraudType);
        formData.append("description", description);
        formData.append("location", "Online");
        
        const fileInput = form.querySelector("#file") as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          formData.append("screenshot", fileInput.files[0]);
        }
        
        await apiClient.submitReport(formData);
        toast.success("Report saved to database! Also file an official complaint at cybercrime.gov.in");
      } catch (err: any) {
        console.error("Backend submit failed, falling back to local storage.", err);
        const mockReports = JSON.parse(localStorage.getItem("mock_reports") || "[]");
        mockReports.push({
          id: Math.random(),
          fraudType,
          description,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("mock_reports", JSON.stringify(mockReports));
        toast.warning("Backend offline. Saved report locally.");
      }
    } else {
      toast.info("Report simulated! Log in to save reports and view history.");
    }

    setSubmitted(true);
    form.reset();
    setFileName("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="report" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Take Action"
          title="Report a Cyber Crime"
          description="Share what happened so we can warn others. For legal action, always file an official complaint."
        />
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="lg:col-span-2 p-6 md:p-8 border-border shadow-card">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field id="name" label="Your name" required />
                <Field id="contact" label="Contact (email / phone)" required />
              </div>
              <div>
                <Label htmlFor="type" className="mb-2 block">
                  Fraud type
                </Label>
                <Select name="type">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select fraud type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAUD_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Describe the incident
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="What happened, when, how much was involved..."
                  maxLength={1000}
                />
              </div>
              <div>
                <Label htmlFor="file" className="mb-2 block">
                  Upload screenshot (optional)
                </Label>
                <label
                  htmlFor="file"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-secondary/40 transition-colors"
                >
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {fileName || "Click to upload image (max 5MB)"}
                  </span>
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  />
                </label>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-cyber border-0 text-primary-foreground"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="size-4 mr-2" /> Report submitted
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" /> Submit report
                  </>
                )}
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-6 bg-gradient-cyber text-primary-foreground border-0 shadow-glow">
              <Phone className="size-8 mb-3" />
              <div className="text-sm opacity-80">National Cyber Crime Helpline</div>
              <a href="tel:1930" className="text-5xl font-bold tracking-tight block my-2">
                1930
              </a>
              <p className="text-sm opacity-90">
                Call within 24 hours for the best chance of fund recovery.
              </p>
            </Card>
            <Card className="p-6 border-border">
              <ExternalLink className="size-6 mb-3 text-primary" />
              <h4 className="font-semibold mb-1">National Cyber Crime Portal</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Official Government of India portal to register cyber crime complaints.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
                  Visit cybercrime.gov.in
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input id={id} name={id} required={required} maxLength={120} />
    </div>
  );
}
