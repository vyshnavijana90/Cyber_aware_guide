import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent, u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-g4NrI0RJ.css";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const API_BASE = "http://localhost:8081";
async function request(path, options = {}) {
  const token = localStorage.getItem("cyber_auth_token");
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      try {
        errorMessage = await response.text();
      } catch {
      }
    }
    throw new Error(errorMessage);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
}
const apiClient = {
  setToken(token) {
    localStorage.setItem("cyber_auth_token", token);
  },
  clearToken() {
    localStorage.removeItem("cyber_auth_token");
  },
  async login(email, password) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },
  async signup(email, password, name) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name })
    });
  },
  async adminLogin(username, password) {
    return request("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  },
  async getProfile() {
    return request("/api/users/profile");
  },
  async submitReport(formData) {
    return request("/api/reports", {
      method: "POST",
      body: formData
    });
  },
  async getMyReports() {
    return request("/api/reports/my");
  },
  // Admin endpoints
  async adminGetUsers() {
    return request("/api/admin/users");
  },
  async adminGetReports(fraudType, status) {
    const params = new URLSearchParams();
    if (fraudType) params.append("fraudType", fraudType);
    if (status) params.append("status", status);
    const queryString = params.toString();
    const path = `/api/admin/reports${queryString ? `?${queryString}` : ""}`;
    return request(path);
  },
  async adminUpdateReportStatus(id, status) {
    return request(`/api/admin/reports/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
  },
  async adminGetStats() {
    return request("/api/admin/stats");
  }
};
async function hashPassword(password) {
  if (!password) return "";
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "_cybershield_salt_2026");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.warn("Crypto API fallback hash", err);
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return "sha256_" + Math.abs(hash).toString(16);
  }
}
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse saved user", error);
      try {
        localStorage.removeItem("auth_user");
      } catch (e) {
        console.error("Failed to remove auth_user from localStorage", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  const getRegisteredUsers = () => {
    try {
      const usersRaw = localStorage.getItem("cyber_registered_users");
      const registeredUsers = usersRaw ? JSON.parse(usersRaw) : [];
      return Array.isArray(registeredUsers) ? registeredUsers : [];
    } catch {
      return [];
    }
  };
  const fallbackLogin = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === "admin@cybershield.com" && password === "admin123") {
      const adminUser = {
        id: "admin",
        email: "admin@cybershield.com",
        name: "Administrator",
        role: "ROLE_ADMIN"
      };
      setUser(adminUser);
      localStorage.setItem("auth_user", JSON.stringify(adminUser));
      toast.success("Logged in as Administrator!");
      navigate({ to: "/dashboard" });
      return true;
    }
    const registeredUsers = getRegisteredUsers();
    const foundUser = registeredUsers.find((u) => u.email.toLowerCase().trim() === cleanEmail && u.verified);
    if (!foundUser) {
      toast.error("Incorrect email or password.");
      return false;
    }
    if (password) {
      const hashedInput = await hashPassword(password);
      if (foundUser.passwordHash !== hashedInput && foundUser.passwordHash !== password) {
        toast.error("Incorrect email or password.");
        return false;
      }
    }
    const sessionUser = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: "ROLE_USER",
      phoneNumber: foundUser.phoneNumber
    };
    setUser(sessionUser);
    localStorage.setItem("auth_user", JSON.stringify(sessionUser));
    toast.success("Successfully logged in!");
    navigate({ to: "/dashboard" });
    return true;
  };
  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      let authResponse;
      try {
        if (cleanEmail === "admin@cybershield.com") {
          authResponse = await apiClient.adminLogin(cleanEmail, password);
        } else {
          authResponse = await apiClient.login(cleanEmail, password);
        }
      } catch (err) {
        if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))) {
          console.warn("Backend server offline. Falling back to LocalStorage Auth.");
          return await fallbackLogin(cleanEmail, password);
        }
        throw err;
      }
      apiClient.setToken(authResponse.token);
      const loggedUser = {
        id: String(authResponse.id || 0),
        email: authResponse.email || cleanEmail,
        name: authResponse.name,
        role: authResponse.role,
        phoneNumber: authResponse.mobileNumber
      };
      setUser(loggedUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
      toast.success("Successfully logged in via Backend!");
      navigate({ to: "/dashboard" });
      return true;
    } catch (error) {
      console.error("Login error", error);
      let userFriendlyMessage = "Incorrect email or password.";
      if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("Internal Server Error") || error.message.includes("500"))) {
        userFriendlyMessage = "Something went wrong. Please try again later.";
      }
      toast.error(userFriendlyMessage);
      return false;
    }
  };
  const fallbackSignup = async (email, name, password) => {
    const cleanEmail = email.toLowerCase().trim();
    const registeredUsers = getRegisteredUsers();
    const exists = registeredUsers.some((u) => u.email.toLowerCase().trim() === cleanEmail && u.verified);
    if (exists) {
      toast.error("An account with this email already exists. Please sign in instead.");
      return false;
    }
    const hashedPassword = password ? await hashPassword(password) : "";
    const userId = "usr_" + Math.random().toString(36).substring(2, 9);
    const newUserRecord = {
      id: userId,
      email: cleanEmail,
      passwordHash: hashedPassword,
      name: name || "Cyber User",
      verified: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    registeredUsers.push(newUserRecord);
    localStorage.setItem("cyber_registered_users", JSON.stringify(registeredUsers));
    const sessionUser = {
      id: userId,
      email: cleanEmail,
      name: name || "Cyber User",
      role: "ROLE_USER"
    };
    setUser(sessionUser);
    localStorage.setItem("auth_user", JSON.stringify(sessionUser));
    toast.success("Account created successfully (Offline mode)!");
    navigate({ to: "/dashboard" });
    return true;
  };
  const signup = async (email, name, password) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      let authResponse;
      try {
        authResponse = await apiClient.signup(cleanEmail, password, name);
      } catch (err) {
        if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))) {
          console.warn("Backend server offline. Falling back to LocalStorage Auth.");
          return await fallbackSignup(cleanEmail, name, password);
        }
        throw err;
      }
      apiClient.setToken(authResponse.token);
      const loggedUser = {
        id: String(authResponse.id || 0),
        email: authResponse.email || cleanEmail,
        name: authResponse.name,
        role: authResponse.role,
        phoneNumber: authResponse.mobileNumber
      };
      setUser(loggedUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
      toast.success("Account created successfully via Backend!");
      navigate({ to: "/dashboard" });
      return true;
    } catch (error) {
      console.error("Signup error", error);
      toast.error(error.message || "An unexpected error occurred during registration.");
      return false;
    }
  };
  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("auth_user");
      apiClient.clearToken();
      toast.success("Logged out successfully");
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout error", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading
      },
      children
    }
  );
}
function useAuth() {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$4 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CyberShield" },
      {
        name: "description",
        content: "Online Fraud Awareness System — learn to spot phishing, OTP, UPI and social media scams. Stay safe online."
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "CyberShield" },
      {
        property: "og:description",
        content: "Online Fraud Awareness System — learn to spot phishing, OTP, UPI and social media scams. Stay safe online."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "CyberShield" },
      {
        name: "twitter:description",
        content: "Online Fraud Awareness System — learn to spot phishing, OTP, UPI and social media scams. Stay safe online."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/86782dbc-3563-4fa3-9acd-0b1a45527b42/id-preview-5c3454fd--719c0b15-9a7e-4545-b27b-ceeaafe5bcea.lovable.app-1780061645446.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/86782dbc-3563-4fa3-9acd-0b1a45527b42/id-preview-5c3454fd--719c0b15-9a7e-4545-b27b-ceeaafe5bcea.lovable.app-1780061645446.png"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "dark scroll-smooth", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}`
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$4.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$3 = () => import("./signup-C1-wzz_x.mjs");
const Route$3 = createFileRoute("/signup")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./login-CZG7UZry.mjs");
const Route$2 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./dashboard-Dt23hmQy.mjs");
const Route$1 = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CwSUXuTF.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "CyberShield — Online Fraud Awareness System"
    }, {
      name: "description",
      content: "Learn to identify phishing, OTP, UPI, and social media scams. Free cyber safety education for everyone."
    }, {
      property: "og:title",
      content: "CyberShield — Stay Safe from Online Frauds"
    }, {
      property: "og:description",
      content: "Interactive cyber awareness platform with safety tips, quiz, statistics and reporting tools."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SignupRoute = Route$3.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$4
});
const LoginRoute = Route$2.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$4
});
const DashboardRoute = Route$1.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$4
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  DashboardRoute,
  LoginRoute,
  SignupRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  apiClient as a,
  router as r,
  useAuth as u
};
