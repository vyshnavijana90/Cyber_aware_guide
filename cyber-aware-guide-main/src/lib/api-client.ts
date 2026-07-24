const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:8081";

export interface AuthResponse {
  token: string;
  type: string;
  id?: number;
  name: string;
  mobileNumber?: string;
  role: string; // "ROLE_USER" or "ROLE_ADMIN"
}

export interface UserResponse {
  id: number;
  name: string;
  mobileNumber: string;
  createdAt: string;
}

export interface FraudReportResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail?: string;
  userMobileNumber?: string;
  fraudType: string;
  description: string;
  location?: string;
  screenshotUrl?: string;
  status: "PENDING" | "INVESTIGATING" | "RESOLVED" | "REJECTED";
  createdAt: string;
}

export interface DashboardStatsResponse {
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  reportsByCategory: Record<string, number>;
  reportsByStatus: Record<string, number>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("cyber_auth_token");
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Only set application/json if body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      try {
        errorMessage = await response.text();
      } catch {}
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }
  return null as unknown as T;
}

export const apiClient = {
  setToken(token: string) {
    localStorage.setItem("cyber_auth_token", token);
  },

  clearToken() {
    localStorage.removeItem("cyber_auth_token");
  },

  async login(email: string, password?: string): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(email: string, password?: string, name?: string): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },

  async adminLogin(username: string, password?: string): Promise<AuthResponse> {
    return request<AuthResponse>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  async getProfile(): Promise<UserResponse> {
    return request<UserResponse>("/api/users/profile");
  },

  async submitReport(formData: FormData): Promise<FraudReportResponse> {
    return request<FraudReportResponse>("/api/reports", {
      method: "POST",
      body: formData,
    });
  },

  async getMyReports(): Promise<FraudReportResponse[]> {
    return request<FraudReportResponse[]>("/api/reports/my");
  },

  // Admin endpoints
  async adminGetUsers(): Promise<UserResponse[]> {
    return request<UserResponse[]>("/api/admin/users");
  },

  async adminGetReports(fraudType?: string, status?: string): Promise<FraudReportResponse[]> {
    const params = new URLSearchParams();
    if (fraudType) params.append("fraudType", fraudType);
    if (status) params.append("status", status);
    
    const queryString = params.toString();
    const path = `/api/admin/reports${queryString ? `?${queryString}` : ""}`;
    return request<FraudReportResponse[]>(path);
  },

  async adminUpdateReportStatus(id: number, status: string): Promise<FraudReportResponse> {
    return request<FraudReportResponse>(`/api/admin/reports/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async adminGetStats(): Promise<DashboardStatsResponse> {
    return request<DashboardStatsResponse>("/api/admin/stats");
  },
};
