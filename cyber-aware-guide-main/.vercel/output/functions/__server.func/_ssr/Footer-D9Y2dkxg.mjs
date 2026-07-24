import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button, f as cn } from "./card-DqUEeS36.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-DDjKn-1a.mjs";
import { J as ShieldCheck, a0 as User, u as LogOut, a3 as X, v as Menu, V as Sun, w as Moon } from "../_libs/lucide-react.mjs";
function ThemeToggle() {
  const [dark, setDark] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: toggle, "aria-label": "Toggle theme", children: dark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "size-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "size-5" }) });
}
const links = [
  { href: "/#home", label: "Home" },
  { href: "/#frauds", label: "Frauds" },
  { href: "/#tips", label: "Safety Tips" },
  { href: "/#quiz", label: "Quiz" },
  { href: "/#stats", label: "Stats" },
  { href: "/#report", label: "Report" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" }
];
function Navbar() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border shadow-card" : "bg-transparent"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex items-center justify-between px-4 h-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "flex items-center gap-2 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-gradient-cyber grid place-items-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tracking-tight text-lg", children: [
              "CyberShield ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "OFAS" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-1", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: l.href,
              className: "px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group",
              children: [
                l.label,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-cyber scale-x-0 group-hover:scale-x-100 transition-transform origin-left" })
              ]
            },
            l.href
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
            isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[120px] truncate", children: user?.name || (user?.mobileNumber ? `+91 ${user.mobileNumber}` : "User") })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => logout(), title: "Logout", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 text-destructive" }) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Login" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  size: "sm",
                  className: "bg-gradient-cyber border-0 text-primary-foreground hover:opacity-90",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Sign Up" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                className: "hidden lg:inline-flex bg-secondary text-foreground hover:bg-secondary/80 ml-2",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#report", children: "Report Fraud" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "lg:hidden",
                onClick: () => setOpen((o) => !o),
                "aria-label": "Menu",
                children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" })
              }
            )
          ] })
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "container mx-auto px-4 py-4 flex flex-col gap-1", children: [
          links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: l.href,
              onClick: () => setOpen(false),
              className: "px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary",
              children: l.label
            },
            l.href
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border my-2 pt-2 flex flex-col gap-2", children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/dashboard",
                onClick: () => setOpen(false),
                className: "px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }),
                  " Dashboard"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  logout();
                  setOpen(false);
                },
                className: "px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary flex items-center gap-2 text-destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
                  " Logout"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/login",
                onClick: () => setOpen(false),
                className: "px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary",
                children: "Login"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/signup",
                onClick: () => setOpen(false),
                className: "px-3 py-2 rounded-md text-sm font-medium bg-gradient-cyber text-primary-foreground",
                children: "Sign Up"
              }
            )
          ] }) })
        ] }) })
      ]
    }
  );
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border bg-secondary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-gradient-cyber grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "CyberShield — Online Fraud Awareness System" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground text-center md:text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "For emergencies, call",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:1930", className: "text-primary font-semibold", children: "1930" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-1", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " CyberShield · Built for digital safety"
      ] })
    ] })
  ] }) });
}
export {
  Footer as F,
  Navbar as N
};
