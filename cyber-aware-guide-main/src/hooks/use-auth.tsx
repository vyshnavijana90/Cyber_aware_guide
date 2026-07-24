import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { formatIndianMobile, hashPassword } from "@/lib/otp-service";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string; // "ROLE_USER" or "ROLE_ADMIN"
  phoneNumber?: string;
}

export interface RegisteredUser {
  id: string;
  email: string;
  passwordHash?: string;
  name?: string;
  verified: boolean;
  createdAt: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (
    email: string,
    name?: string,
    password?: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for existing session
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

  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      const usersRaw = localStorage.getItem("cyber_registered_users");
      const registeredUsers: RegisteredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
      return Array.isArray(registeredUsers) ? registeredUsers : [];
    } catch {
      return [];
    }
  };

  /**
   * Request OTP for Signup or Login.
   * Sends real SMS to the mobile number entered on Sign Up / Sign In page.
   * NEVER displays the OTP code on the UI or toasts.
   */
  /**
   * Fallback Sign In for LocalStorage
   */
  const fallbackLogin = async (
    email: string,
    password?: string
  ): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();

    // Admin demo account check
    if (cleanEmail === "admin@cybershield.com" && password === "admin123") {
      const adminUser: User = {
        id: "admin",
        email: "admin@cybershield.com",
        name: "Administrator",
        role: "ROLE_ADMIN",
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

    const sessionUser: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: "ROLE_USER",
      phoneNumber: foundUser.phoneNumber,
    };

    setUser(sessionUser);
    localStorage.setItem("auth_user", JSON.stringify(sessionUser));
    toast.success("Successfully logged in!");
    navigate({ to: "/dashboard" });
    return true;
  };

  /**
   * Login Handler
   */
  const login = async (
    email: string,
    password?: string
  ): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();

    try {
      let authResponse;
      try {
        if (cleanEmail === "admin@cybershield.com") {
          authResponse = await apiClient.adminLogin(cleanEmail, password);
        } else {
          authResponse = await apiClient.login(cleanEmail, password);
        }
      } catch (err: any) {
        if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))) {
          console.warn("Backend server offline. Falling back to LocalStorage Auth.");
          return await fallbackLogin(cleanEmail, password);
        }
        throw err;
      }

      apiClient.setToken(authResponse.token);
      const loggedUser: User = {
        id: String(authResponse.id || 0),
        email: authResponse.email || cleanEmail,
        name: authResponse.name,
        role: authResponse.role,
        phoneNumber: authResponse.mobileNumber,
      };
      setUser(loggedUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
      toast.success("Successfully logged in via Backend!");
      navigate({ to: "/dashboard" });
      return true;
    } catch (error: any) {
      console.error("Login error", error);
      let userFriendlyMessage = "Incorrect email or password.";
      
      // If it is a connection failure or server error
      if (error.message && (
        error.message.includes("Failed to fetch") || 
        error.message.includes("NetworkError") || 
        error.message.includes("Internal Server Error") ||
        error.message.includes("500")
      )) {
        userFriendlyMessage = "Something went wrong. Please try again later.";
      }
      
      toast.error(userFriendlyMessage);
      return false;
    }
  };

  /**
   * Fallback Sign Up for LocalStorage
   */
  const fallbackSignup = async (
    email: string,
    name?: string,
    password?: string
  ): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();

    const registeredUsers = getRegisteredUsers();
    const exists = registeredUsers.some((u) => u.email.toLowerCase().trim() === cleanEmail && u.verified);

    if (exists) {
      toast.error("An account with this email already exists. Please sign in instead.");
      return false;
    }

    const hashedPassword = password ? await hashPassword(password) : "";
    const userId = "usr_" + Math.random().toString(36).substring(2, 9);
    
    const newUserRecord: RegisteredUser = {
      id: userId,
      email: cleanEmail,
      passwordHash: hashedPassword,
      name: name || "Cyber User",
      verified: true,
      createdAt: new Date().toISOString(),
    };

    registeredUsers.push(newUserRecord);
    localStorage.setItem("cyber_registered_users", JSON.stringify(registeredUsers));

    const sessionUser: User = {
      id: userId,
      email: cleanEmail,
      name: name || "Cyber User",
      role: "ROLE_USER",
    };

    setUser(sessionUser);
    localStorage.setItem("auth_user", JSON.stringify(sessionUser));

    toast.success("Account created successfully (Offline mode)!");
    navigate({ to: "/dashboard" });
    return true;
  };

  /**
   * Signup Handler
   */
  const signup = async (
    email: string,
    name?: string,
    password?: string
  ): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();

    try {
      let authResponse;
      try {
        authResponse = await apiClient.signup(cleanEmail, password, name);
      } catch (err: any) {
        if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))) {
          console.warn("Backend server offline. Falling back to LocalStorage Auth.");
          return await fallbackSignup(cleanEmail, name, password);
        }
        throw err;
      }

      apiClient.setToken(authResponse.token);
      const loggedUser: User = {
        id: String(authResponse.id || 0),
        email: authResponse.email || cleanEmail,
        name: authResponse.name,
        role: authResponse.role,
        phoneNumber: authResponse.mobileNumber,
      };
      setUser(loggedUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
      toast.success("Account created successfully via Backend!");
      navigate({ to: "/dashboard" });
      return true;
    } catch (error: any) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
