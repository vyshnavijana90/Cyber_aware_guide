import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-cyber grid place-items-center">
            <ShieldCheck className="size-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">CyberShield — Online Fraud Awareness System</span>
        </div>
        <div className="text-muted-foreground text-center md:text-right">
          <div>
            For emergencies, call{" "}
            <a href="tel:1930" className="text-primary font-semibold">
              1930
            </a>
          </div>
          <div className="text-xs mt-1">
            © {new Date().getFullYear()} CyberShield · Built for digital safety
          </div>
        </div>
      </div>
    </footer>
  );
}
