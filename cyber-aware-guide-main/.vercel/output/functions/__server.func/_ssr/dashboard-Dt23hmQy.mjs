import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, a as apiClient } from "./router-DDjKn-1a.mjs";
import { B as Button, C as Card, d as CardHeader, e as CardTitle, a as CardContent, b as CardDescription } from "./card-DqUEeS36.mjs";
import { N as Navbar, F as Footer } from "./Footer-D9Y2dkxg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as LoaderCircle, b as Bell, z as Settings, u as LogOut, a1 as Users, m as FileText, k as Clock, h as CircleCheckBig, X as TrendingUp, a as ArrowRight, Y as TriangleAlert, J as ShieldCheck, D as ShieldAlert, t as Lock, l as Eye } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-10 text-primary animate-spin" }) });
  }
  if (!isAuthenticated) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
function DashboardPage() {
  const {
    user,
    logout
  } = useAuth();
  const [loading, setLoading] = reactExports.useState(true);
  const [myReports, setMyReports] = reactExports.useState([]);
  const [adminStats, setAdminStats] = reactExports.useState(null);
  const [adminReports, setAdminReports] = reactExports.useState([]);
  const [adminUsers, setAdminUsers] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("reports");
  const [filterType, setFilterType] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("");
  const [selectedReport, setSelectedReport] = reactExports.useState(null);
  const fetchUserData = async () => {
    try {
      const reports = await apiClient.getMyReports();
      setMyReports(reports);
    } catch (err) {
      console.warn("Backend fetch failed, using local mock data", err);
      const localReports = JSON.parse(localStorage.getItem("mock_reports") || "[]");
      setMyReports(localReports);
    }
  };
  const fetchAdminData = async () => {
    try {
      const [stats, reports, users] = await Promise.all([apiClient.adminGetStats(), apiClient.adminGetReports(filterType || void 0, filterStatus || void 0), apiClient.adminGetUsers()]);
      setAdminStats(stats);
      setAdminReports(reports);
      setAdminUsers(users);
    } catch (err) {
      console.warn("Backend admin fetch failed, using mock data", err);
      setAdminStats({
        totalUsers: 4,
        totalReports: 6,
        pendingReports: 3,
        resolvedReports: 2,
        reportsByCategory: {
          Phishing: 2,
          "UPI Fraud": 3,
          "OTP Scam": 1
        },
        reportsByStatus: {
          PENDING: 3,
          INVESTIGATING: 1,
          RESOLVED: 2
        }
      });
      const localReports = JSON.parse(localStorage.getItem("mock_reports") || "[]");
      const mockBackendReports = [{
        id: 101,
        userId: 2,
        userName: "Amit Kumar",
        userEmail: "amit@gmail.com",
        fraudType: "UPI Fraud",
        description: "Scammer requested Rs. 5000 using fake refund collect request on PhonePe.",
        location: "Bangalore",
        status: "PENDING",
        createdAt: new Date(Date.now() - 36e5 * 2).toISOString()
      }, {
        id: 102,
        userId: 3,
        userName: "Sneha Patel",
        userEmail: "sneha@yahoo.com",
        fraudType: "Phishing",
        description: "Received suspicious SMS with link saying KYC needs immediate update to prevent SIM block.",
        location: "Mumbai",
        status: "RESOLVED",
        createdAt: new Date(Date.now() - 36e5 * 24).toISOString()
      }];
      const formattedLocal = localReports.map((r, idx) => ({
        id: r.id || idx + 200,
        userId: 1,
        userName: user?.name || "Local User",
        userMobileNumber: user?.phoneNumber || "",
        userEmail: user?.email || "",
        fraudType: r.fraudType,
        description: r.description,
        status: r.status || "PENDING",
        createdAt: r.createdAt || (/* @__PURE__ */ new Date()).toISOString()
      }));
      setAdminReports([...formattedLocal, ...mockBackendReports]);
      setAdminUsers([{
        id: 1,
        name: user?.name || "Regular User",
        email: user?.email || "user@example.com",
        mobileNumber: user?.phoneNumber || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }, {
        id: 2,
        name: "Amit Kumar",
        email: "amit.kumar@example.com",
        mobileNumber: "9876543210",
        createdAt: new Date(Date.now() - 36e5 * 48).toISOString()
      }, {
        id: 3,
        name: "Sneha Patel",
        email: "sneha.patel@example.com",
        mobileNumber: "8765432109",
        createdAt: new Date(Date.now() - 36e5 * 72).toISOString()
      }]);
    }
  };
  reactExports.useEffect(() => {
    if (user) {
      setLoading(true);
      if (user.role === "ROLE_ADMIN") {
        fetchAdminData().finally(() => setLoading(false));
      } else {
        fetchUserData().finally(() => setLoading(false));
      }
    }
  }, [user, filterType, filterStatus]);
  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await apiClient.adminUpdateReportStatus(reportId, newStatus);
      toast.success(`Report status updated to ${newStatus}`);
      fetchAdminData();
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({
          ...selectedReport,
          status: newStatus
        });
      }
    } catch (err) {
      console.error("Failed to update status on backend", err);
      setAdminReports((prev) => prev.map((r) => r.id === reportId ? {
        ...r,
        status: newStatus
      } : r));
      toast.warning("Backend offline. Updated locally for display.");
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({
          ...selectedReport,
          status: newStatus
        });
      }
    }
  };
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "INVESTIGATING":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "RESOLVED":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };
  const isAdmin = user?.role === "ROLE_ADMIN";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "container mx-auto px-4 pt-24 pb-12 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold tracking-tight", children: [
            "Welcome,",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: user?.name || user?.email || "User" }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full font-semibold", children: "Administrator" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: isAdmin ? "Manage reported cyber incidents, analyze stats, and update active cases." : "Track your reported incidents, review your cybersecurity rating, and view lessons." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", onClick: logout, className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
            "Logout"
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-24 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Loading dashboard details..." })
      ] }) : isAdmin ? (
        /* ========================================================================= */
        /* ADMIN DASHBOARD VIEW                                                      */
        /* ========================================================================= */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total Users" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4 text-primary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: adminStats?.totalUsers ?? 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Registered members" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total Reports" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-accent" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: adminStats?.totalReports ?? 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Submitted fraud cases" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Pending Cases" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-amber-500" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-amber-500", children: adminStats?.pendingReports ?? 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Awaiting investigation" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Resolved Cases" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4 text-emerald-500" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-emerald-500", children: adminStats?.resolvedReports ?? 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Closed successfully" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-border gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("reports"), className: `pb-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "reports" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4" }),
              " Fraud Reports (",
              adminReports.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("users"), className: `pb-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "users" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }),
              " Registered Users (",
              adminUsers.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("stats"), className: `pb-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "stats" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4" }),
              " Category Analytics"
            ] })
          ] }),
          activeTab === "reports" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 border-border bg-card/50 backdrop-blur-sm shadow-card flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Incidents Pipeline" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review and change state of incoming scam complaints" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "bg-background border border-border rounded px-2.5 py-1 text-xs outline-none focus:border-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Statuses" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PENDING", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "INVESTIGATING", children: "Investigating" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "RESOLVED", children: "Resolved" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "REJECTED", children: "Rejected" })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 overflow-auto max-h-[500px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: adminReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground text-sm", children: "No reports match selected filters." }) : adminReports.map((report) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setSelectedReport(report), className: `py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-secondary/20 px-3 rounded-lg transition-colors ${selectedReport?.id === report.id ? "bg-secondary/40 border-l-4 border-primary" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: report.fraudType }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusBadgeClass(report.status)}`, children: report.status })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-lg", children: report.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "By: ",
                      report.userName,
                      " (",
                      report.userMobileNumber ? `+91 ${report.userMobileNumber}` : report.userEmail || "Verified Filer",
                      ")"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTime(report.createdAt) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "shrink-0 group", children: [
                  "Manage ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 ml-1 transition-transform group-hover:translate-x-1" })
                ] })
              ] }, report.id)) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Incident Detail Panel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Select a report to review description and take action" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: selectedReport ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: "Fraud Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: selectedReport.fraudType })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: "Filer Information" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium", children: selectedReport.userName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedReport.userMobileNumber ? `+91 ${selectedReport.userMobileNumber}` : selectedReport.userEmail || "Verified User" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: "Submitted On" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: formatTime(selectedReport.createdAt) })
                ] }),
                selectedReport.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: "Report Location" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: selectedReport.location })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: "Incident Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs bg-secondary/30 p-3 rounded border border-border text-foreground leading-relaxed whitespace-pre-wrap", children: selectedReport.description })
                ] }),
                selectedReport.screenshotUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider", children: "Screenshot Attachment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `http://localhost:8080${selectedReport.screenshotUrl}`, target: "_blank", rel: "noreferrer", className: "block rounded-lg overflow-hidden border border-border hover:border-primary transition-colors bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: `http://localhost:8080${selectedReport.screenshotUrl}`, alt: "Incident Attachment", className: "max-h-40 w-full object-contain" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-2", children: "Change Status Workflow" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "border-amber-500/30 text-amber-500 hover:bg-amber-500/10", onClick: () => handleUpdateStatus(selectedReport.id, "PENDING"), disabled: selectedReport.status === "PENDING", children: "Pending" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "border-blue-500/30 text-blue-500 hover:bg-blue-500/10", onClick: () => handleUpdateStatus(selectedReport.id, "INVESTIGATING"), disabled: selectedReport.status === "INVESTIGATING", children: "Investigate" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10", onClick: () => handleUpdateStatus(selectedReport.id, "RESOLVED"), disabled: selectedReport.status === "RESOLVED", children: "Resolve" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "border-rose-500/30 text-rose-500 hover:bg-rose-500/10", onClick: () => handleUpdateStatus(selectedReport.id, "REJECTED"), disabled: selectedReport.status === "REJECTED", children: "Reject" })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 text-muted-foreground text-sm flex flex-col items-center justify-center space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-8 text-muted-foreground opacity-50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No Incident Selected" })
              ] }) })
            ] })
          ] }),
          activeTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Registered Users Directory" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "View all members of the CyberShield awareness portal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-muted-foreground uppercase font-bold text-[10px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "User ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Email / Mobile Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Account Created" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: adminUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-secondary/15 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3.5 px-4 font-mono text-muted-foreground", children: [
                  "USR-",
                  u.id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 font-medium", children: u.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-muted-foreground font-mono", children: u.email || (u.mobileNumber ? `+91 ${u.mobileNumber}` : "N/A") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-muted-foreground", children: formatTime(u.createdAt) })
              ] }, u.id)) })
            ] }) }) })
          ] }),
          activeTab === "stats" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Incidents by Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Breakdown of reported frauds by category" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: adminStats && Object.keys(adminStats.reportsByCategory).length > 0 ? Object.entries(adminStats.reportsByCategory).map(([category, count]) => {
                const maxCount = Math.max(...Object.values(adminStats.reportsByCategory));
                const percentage = maxCount > 0 ? count / maxCount * 100 : 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: category }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-mono", children: [
                      count,
                      " cases"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-cyber", style: {
                    width: `${percentage}%`
                  } }) })
                ] }, category);
              }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-6", children: "No data available" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Incidents by Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Workflow processing status breakdown" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: adminStats && Object.keys(adminStats.reportsByStatus).length > 0 ? Object.entries(adminStats.reportsByStatus).map(([status, count]) => {
                const total = adminStats.totalReports || 1;
                const percentage = count / total * 100;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wider", children: status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-mono", children: [
                      count,
                      " / ",
                      total,
                      " (",
                      percentage.toFixed(0),
                      "%)"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${status === "RESOLVED" ? "bg-emerald-500" : status === "PENDING" ? "bg-amber-500" : status === "INVESTIGATING" ? "bg-blue-500" : "bg-rose-500"}`, style: {
                    width: `${percentage}%`
                  } }) })
                ] }, status);
              }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-6", children: "No data available" }) })
            ] })
          ] })
        ] })
      ) : (
        /* ========================================================================= */
        /* REGULAR USER DASHBOARD VIEW                                               */
        /* ========================================================================= */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Security Score" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-success" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: "85/100" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Excellent protection" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "My Reports" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-4 text-accent" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: myReports.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Incidents reported" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Modules Completed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-4 text-primary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: "12" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Out of 15 available" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Security Level" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4 text-primary-foreground text-success" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-success", children: "Secure" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Low risk exposure" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent Activity & Reports" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Track state of incidents you have submitted to our panel" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: myReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10 space-y-2 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-10 mx-auto text-muted-foreground/45" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "You haven't filed any fraud reports yet." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#report", children: "Report a scam now" }) })
              ] }) : myReports.map((report, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-secondary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: report.fraudType }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusBadgeClass(report.status)}`, children: report.status })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: report.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1.5 flex gap-2 items-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Submitted: ",
                      formatTime(report.createdAt)
                    ] }),
                    report.location && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Locality: ",
                        report.location
                      ] })
                    ] })
                  ] }),
                  report.screenshotUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `http://localhost:8080${report.screenshotUrl}`, target: "_blank", rel: "noreferrer", className: "text-[10px] text-primary hover:underline flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }),
                    " View attachment screenshot"
                  ] }) })
                ] })
              ] }, report.id || idx)) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Daily Cybersecurity Tips" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-lg bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs italic text-foreground leading-relaxed", children: '"Always enable two-factor authentication (2FA) on your email and banking accounts. It adds an extra layer of protection even if your password gets compromised."' }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-gradient-cyber border-0 text-primary-foreground", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#tips", children: "Review Safety tips" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card/50 backdrop-blur-sm shadow-card text-center p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-emerald-500/10 grid place-items-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-6 text-emerald-500" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm", children: "Need help or advice?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground my-2", children: "Call national helpline 1930 to block illegal bank transfers instantly." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "w-full", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#contact", children: "Contact security advisor" }) })
              ] })
            ] })
          ] })
        ] })
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) });
export {
  SplitComponent as component
};
