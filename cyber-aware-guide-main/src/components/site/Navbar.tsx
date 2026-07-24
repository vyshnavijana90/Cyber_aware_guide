import { useEffect, useState } from "react";
import { Menu, ShieldCheck, X, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#frauds", label: "Frauds" },
  { href: "/#tips", label: "Safety Tips" },
  { href: "/#quiz", label: "Quiz" },
  { href: "/#stats", label: "Stats" },
  { href: "/#report", label: "Report" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border shadow-card"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        <a href="/" className="flex items-center gap-2 group">
          <div className="size-9 rounded-lg bg-gradient-cyber grid place-items-center shadow-glow">
            <ShieldCheck className="size-5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight text-lg">
            CyberShield <span className="text-gradient">OFAS</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {l.label}
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-cyber scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link to="/dashboard">
                  <UserIcon className="size-4" />
                  <span className="max-w-[120px] truncate">{user?.name || (user?.mobileNumber ? `+91 ${user.mobileNumber}` : "User")}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                <LogOut className="size-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-cyber border-0 text-primary-foreground hover:opacity-90"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            asChild
            className="hidden lg:inline-flex bg-secondary text-foreground hover:bg-secondary/80 ml-2"
          >
            <a href="/#report">Report Fraud</a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-border my-2 pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary flex items-center gap-2"
                  >
                    <UserIcon className="size-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gradient-cyber text-primary-foreground"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
