import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { apiClient, FraudReportResponse, UserResponse, DashboardStatsResponse } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  Lock,
  Eye,
  Settings,
  Bell,
  Layers,
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

function DashboardPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myReports, setMyReports] = useState<FraudReportResponse[]>([]);

  // Admin Dashboard States
  const [adminStats, setAdminStats] = useState<DashboardStatsResponse | null>(null);
  const [adminReports, setAdminReports] = useState<FraudReportResponse[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"reports" | "users" | "stats">("reports");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<FraudReportResponse | null>(null);

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
      const [stats, reports, users] = await Promise.all([
        apiClient.adminGetStats(),
        apiClient.adminGetReports(filterType || undefined, filterStatus || undefined),
        apiClient.adminGetUsers(),
      ]);
      setAdminStats(stats);
      setAdminReports(reports);
      setAdminUsers(users);
    } catch (err) {
      console.warn("Backend admin fetch failed, using mock data", err);
      // Mock stats
      setAdminStats({
        totalUsers: 4,
        totalReports: 6,
        pendingReports: 3,
        resolvedReports: 2,
        reportsByCategory: { Phishing: 2, "UPI Fraud": 3, "OTP Scam": 1 },
        reportsByStatus: { PENDING: 3, INVESTIGATING: 1, RESOLVED: 2 },
      });
      
      // Mock reports
      const localReports = JSON.parse(localStorage.getItem("mock_reports") || "[]");
      const mockBackendReports: FraudReportResponse[] = [
        {
          id: 101,
          userId: 2,
          userName: "Amit Kumar",
          userEmail: "amit@gmail.com",
          fraudType: "UPI Fraud",
          description: "Scammer requested Rs. 5000 using fake refund collect request on PhonePe.",
          location: "Bangalore",
          status: "PENDING",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 102,
          userId: 3,
          userName: "Sneha Patel",
          userEmail: "sneha@yahoo.com",
          fraudType: "Phishing",
          description: "Received suspicious SMS with link saying KYC needs immediate update to prevent SIM block.",
          location: "Mumbai",
          status: "RESOLVED",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ];
      // Merge local reports to see them in admin too
      const formattedLocal = localReports.map((r: any, idx: number) => ({
        id: r.id || idx + 200,
        userId: 1,
        userName: user?.name || "Local User",
        userMobileNumber: user?.phoneNumber || "",
        userEmail: user?.email || "",
        fraudType: r.fraudType,
        description: r.description,
        status: r.status || "PENDING",
        createdAt: r.createdAt || new Date().toISOString(),
      }));

      setAdminReports([...formattedLocal, ...mockBackendReports]);

      // Mock users
      setAdminUsers([
        { id: 1, name: user?.name || "Regular User", email: user?.email || "user@example.com", mobileNumber: user?.phoneNumber || "", createdAt: new Date().toISOString() },
        { id: 2, name: "Amit Kumar", email: "amit.kumar@example.com", mobileNumber: "9876543210", createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
        { id: 3, name: "Sneha Patel", email: "sneha.patel@example.com", mobileNumber: "8765432109", createdAt: new Date(Date.now() - 3600000 * 72).toISOString() },
      ]);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      if (user.role === "ROLE_ADMIN") {
        fetchAdminData().finally(() => setLoading(false));
      } else {
        fetchUserData().finally(() => setLoading(false));
      }
    }
  }, [user, filterType, filterStatus]);

  const handleUpdateStatus = async (reportId: number, newStatus: string) => {
    try {
      await apiClient.adminUpdateReportStatus(reportId, newStatus);
      toast.success(`Report status updated to ${newStatus}`);
      fetchAdminData();
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus as any });
      }
    } catch (err) {
      console.error("Failed to update status on backend", err);
      // Fallback update in UI state
      setAdminReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus as any } : r))
      );
      toast.warning("Backend offline. Updated locally for display.");
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus as any });
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
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

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const isAdmin = user?.role === "ROLE_ADMIN";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome,{" "}
              <span className="text-gradient">
                {user?.name || user?.email || "User"}
              </span>
              {isAdmin && (
                <span className="ml-3 text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full font-semibold">
                  Administrator
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin
                ? "Manage reported cyber incidents, analyze stats, and update active cases."
                : "Track your reported incidents, review your cybersecurity rating, and view lessons."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="size-4" />
            </Button>
            <Button variant="destructive" onClick={logout} className="flex items-center gap-2">
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-sm">Loading dashboard details...</p>
          </div>
        ) : isAdmin ? (
          /* ========================================================================= */
          /* ADMIN DASHBOARD VIEW                                                      */
          /* ========================================================================= */
          <div className="space-y-8">
            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <Users className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats?.totalUsers ?? 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered members</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
                  <FileText className="size-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats?.totalReports ?? 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Submitted fraud cases</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Cases</CardTitle>
                  <Clock className="size-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">{adminStats?.pendingReports ?? 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting investigation</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Cases</CardTitle>
                  <CheckCircle className="size-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-500">{adminStats?.resolvedReports ?? 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Closed successfully</p>
                </CardContent>
              </Card>
            </div>

            {/* Admin Tabs */}
            <div className="flex border-b border-border gap-6">
              <button
                onClick={() => setActiveTab("reports")}
                className={`pb-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "reports"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="size-4" /> Fraud Reports ({adminReports.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`pb-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "users"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="size-4" /> Registered Users ({adminUsers.length})
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`pb-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "stats"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="size-4" /> Category Analytics
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "reports" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reports List */}
                <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm shadow-card flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle>Incidents Pipeline</CardTitle>
                      <CardDescription>Review and change state of incoming scam complaints</CardDescription>
                    </div>
                    {/* Filters */}
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-background border border-border rounded px-2.5 py-1 text-xs outline-none focus:border-primary"
                      >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="INVESTIGATING">Investigating</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto max-h-[500px]">
                    <div className="divide-y divide-border">
                      {adminReports.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                          No reports match selected filters.
                        </div>
                      ) : (
                        adminReports.map((report) => (
                          <div
                            key={report.id}
                            onClick={() => setSelectedReport(report)}
                            className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-secondary/20 px-3 rounded-lg transition-colors ${
                              selectedReport?.id === report.id ? "bg-secondary/40 border-l-4 border-primary" : ""
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm">{report.fraudType}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusBadgeClass(report.status)}`}>
                                  {report.status}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-lg">
                                {report.description}
                              </p>
                              <div className="text-[10px] text-muted-foreground flex gap-3">
                                <span>By: {report.userName} ({report.userMobileNumber ? `+91 ${report.userMobileNumber}` : report.userEmail || "Verified Filer"})</span>
                                <span>•</span>
                                <span>{formatTime(report.createdAt)}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="shrink-0 group">
                              Manage <ArrowRight className="size-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Details / Action Panel */}
                <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                  <CardHeader>
                    <CardTitle>Incident Detail Panel</CardTitle>
                    <CardDescription>Select a report to review description and take action</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedReport ? (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Fraud Category</label>
                          <p className="text-sm font-semibold">{selectedReport.fraudType}</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Filer Information</label>
                          <p className="text-xs font-medium">{selectedReport.userName}</p>
                          <p className="text-xs text-muted-foreground">{selectedReport.userMobileNumber ? `+91 ${selectedReport.userMobileNumber}` : selectedReport.userEmail || "Verified User"}</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Submitted On</label>
                          <p className="text-xs">{formatTime(selectedReport.createdAt)}</p>
                        </div>

                        {selectedReport.location && (
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Report Location</label>
                            <p className="text-xs">{selectedReport.location}</p>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Incident Details</label>
                          <p className="text-xs bg-secondary/30 p-3 rounded border border-border text-foreground leading-relaxed whitespace-pre-wrap">
                            {selectedReport.description}
                          </p>
                        </div>

                        {selectedReport.screenshotUrl && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Screenshot Attachment</label>
                            <a
                              href={`http://localhost:8080${selectedReport.screenshotUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-lg overflow-hidden border border-border hover:border-primary transition-colors bg-background"
                            >
                              <img
                                src={`http://localhost:8080${selectedReport.screenshotUrl}`}
                                alt="Incident Attachment"
                                className="max-h-40 w-full object-contain"
                              />
                            </a>
                          </div>
                        )}

                        <div className="pt-4 border-t border-border space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-2">Change Status Workflow</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                              onClick={() => handleUpdateStatus(selectedReport.id, "PENDING")}
                              disabled={selectedReport.status === "PENDING"}
                            >
                              Pending
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                              onClick={() => handleUpdateStatus(selectedReport.id, "INVESTIGATING")}
                              disabled={selectedReport.status === "INVESTIGATING"}
                            >
                              Investigate
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                              onClick={() => handleUpdateStatus(selectedReport.id, "RESOLVED")}
                              disabled={selectedReport.status === "RESOLVED"}
                            >
                              Resolve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                              onClick={() => handleUpdateStatus(selectedReport.id, "REJECTED")}
                              disabled={selectedReport.status === "REJECTED"}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20 text-muted-foreground text-sm flex flex-col items-center justify-center space-y-2">
                        <AlertTriangle className="size-8 text-muted-foreground opacity-50" />
                        <p>No Incident Selected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "users" && (
              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader>
                  <CardTitle>Registered Users Directory</CardTitle>
                  <CardDescription>View all members of the CyberShield awareness portal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground uppercase font-bold text-[10px]">
                          <th className="py-3 px-4">User ID</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email / Mobile Number</th>
                          <th className="py-3 px-4">Account Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {adminUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-secondary/15 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-muted-foreground">USR-{u.id}</td>
                            <td className="py-3.5 px-4 font-medium">{u.name}</td>
                            <td className="py-3.5 px-4 text-muted-foreground font-mono">{u.email || (u.mobileNumber ? `+91 ${u.mobileNumber}` : "N/A")}</td>
                            <td className="py-3.5 px-4 text-muted-foreground">{formatTime(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                  <CardHeader>
                    <CardTitle>Incidents by Category</CardTitle>
                    <CardDescription>Breakdown of reported frauds by category</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {adminStats && Object.keys(adminStats.reportsByCategory).length > 0 ? (
                      Object.entries(adminStats.reportsByCategory).map(([category, count]) => {
                        const maxCount = Math.max(...Object.values(adminStats.reportsByCategory));
                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                        return (
                          <div key={category} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold">{category}</span>
                              <span className="text-muted-foreground font-mono">{count} cases</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-cyber"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-6">No data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                  <CardHeader>
                    <CardTitle>Incidents by Status</CardTitle>
                    <CardDescription>Workflow processing status breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {adminStats && Object.keys(adminStats.reportsByStatus).length > 0 ? (
                      Object.entries(adminStats.reportsByStatus).map(([status, count]) => {
                        const total = adminStats.totalReports || 1;
                        const percentage = (count / total) * 100;
                        return (
                          <div key={status} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold uppercase tracking-wider">{status}</span>
                              <span className="text-muted-foreground font-mono">
                                {count} / {total} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  status === "RESOLVED"
                                    ? "bg-emerald-500"
                                    : status === "PENDING"
                                      ? "bg-amber-500"
                                      : status === "INVESTIGATING"
                                        ? "bg-blue-500"
                                        : "bg-rose-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-6">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* REGULAR USER DASHBOARD VIEW                                               */
          /* ========================================================================= */
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Security Score</CardTitle>
                  <ShieldCheck className="size-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85/100</div>
                  <p className="text-xs text-muted-foreground mt-1">Excellent protection</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">My Reports</CardTitle>
                  <ShieldAlert className="size-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{myReports.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Incidents reported</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Modules Completed</CardTitle>
                  <Lock className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 15 available</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Security Level</CardTitle>
                  <Eye className="size-4 text-primary-foreground text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">Secure</div>
                  <p className="text-xs text-muted-foreground mt-1">Low risk exposure</p>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reports Activity List */}
              <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm shadow-card">
                <CardHeader>
                  <CardTitle>Recent Activity & Reports</CardTitle>
                  <CardDescription>Track state of incidents you have submitted to our panel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {myReports.length === 0 ? (
                      <div className="text-center py-10 space-y-2 text-muted-foreground">
                        <ShieldCheck className="size-10 mx-auto text-muted-foreground/45" />
                        <p className="text-sm">You haven't filed any fraud reports yet.</p>
                        <Button variant="link" size="sm" asChild>
                          <a href="/#report">Report a scam now</a>
                        </Button>
                      </div>
                    ) : (
                      myReports.map((report, idx) => (
                        <div key={report.id || idx} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                          <div className="size-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <ShieldAlert className="size-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <p className="text-sm font-semibold">{report.fraudType}</p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusBadgeClass(report.status)}`}>
                                {report.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {report.description}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1.5 flex gap-2 items-center">
                              <span>Submitted: {formatTime(report.createdAt)}</span>
                              {report.location && (
                                <>
                                  <span>•</span>
                                  <span>Locality: {report.location}</span>
                                </>
                              )}
                            </p>
                            {report.screenshotUrl && (
                              <div className="mt-2">
                                <a
                                  href={`http://localhost:8080${report.screenshotUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-primary hover:underline flex items-center gap-1"
                                >
                                  <FileText className="size-3" /> View attachment screenshot
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tips & Safety panel */}
              <div className="space-y-6">
                <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card">
                  <CardHeader>
                    <CardTitle>Daily Cybersecurity Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-xs italic text-foreground leading-relaxed">
                        "Always enable two-factor authentication (2FA) on your email and banking accounts.
                        It adds an extra layer of protection even if your password gets compromised."
                      </p>
                    </div>
                    <Button className="w-full bg-gradient-cyber border-0 text-primary-foreground" asChild>
                      <a href="/#tips">Review Safety tips</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card text-center p-6">
                  <div className="size-12 rounded-full bg-emerald-500/10 grid place-items-center mx-auto mb-3">
                    <ShieldCheck className="size-6 text-emerald-500" />
                  </div>
                  <h4 className="font-semibold text-sm">Need help or advice?</h4>
                  <p className="text-xs text-muted-foreground my-2">
                    Call national helpline 1930 to block illegal bank transfers instantly.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/#contact">Contact security advisor</a>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
