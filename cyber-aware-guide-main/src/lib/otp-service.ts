/**
 * OTP Service for CyberShield OFAS
 * Handles Indian Mobile Number Validation, 6-digit OTP Generation, 
 * SHA-256 Password Hashing, Rate Limiting, and Expiration Security.
 */

export interface OtpSession {
  mobileNumber: string;
  otp: string;
  expiresAt: number; // Timestamp (5 min)
  attempts: number; // Max 5 attempts allowed
  lastSentAt: number; // Timestamp of last OTP send
  requestCount: number; // Requests within 5 min window
}

const OTP_STORAGE_KEY = "cyber_active_otp_sessions";
const MAX_ATTEMPTS = 5;
const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

/**
 * Validates a 10-digit Indian mobile number.
 * Must start with 6, 7, 8, or 9 and be exactly 10 numeric digits.
 */
export function isValidIndianMobile(mobile: string): boolean {
  const cleaned = mobile.trim().replace(/^(\+91|91|0)/, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Formats a mobile number to standard 10-digit format.
 */
export function formatIndianMobile(mobile: string): string {
  const cleaned = mobile.trim().replace(/^(\+91|91|0)/, "");
  return cleaned;
}

/**
 * Hashes a plaintext password using browser Web Crypto SHA-256.
 */
export async function hashPassword(password: string): Promise<string> {
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

/**
 * Retrieves active OTP sessions map from LocalStorage.
 */
function getSessions(): Record<string, OtpSession> {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves OTP sessions map to LocalStorage.
 */
function saveSessions(sessions: Record<string, OtpSession>) {
  try {
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save OTP sessions", e);
  }
}

export const otpService = {
  /**
   * Request / Generate a new OTP for a given mobile number.
   */
  async requestOtp(mobileNumber: string): Promise<{ success: boolean; otp?: string; message: string; cooldownRemaining?: number }> {
    const cleanMobile = formatIndianMobile(mobileNumber);

    if (!isValidIndianMobile(cleanMobile)) {
      return {
        success: false,
        message: "Invalid mobile number. Must be a valid 10-digit Indian phone number starting with 6-9.",
      };
    }

    const sessions = getSessions();
    const now = Date.now();
    const existing = sessions[cleanMobile];

    // Check 30s resend cooldown
    if (existing && existing.lastSentAt) {
      const elapsed = now - existing.lastSentAt;
      if (elapsed < RESEND_COOLDOWN_MS) {
        const remainingSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingSec} seconds before requesting a new OTP.`,
          cooldownRemaining: remainingSec,
        };
      }
    }

    // Check Rate Limiting (max 3 requests in 5 minutes)
    if (existing && existing.requestCount) {
      const windowElapsed = now - (existing.lastSentAt - (existing.lastSentAt % RATE_LIMIT_WINDOW_MS));
      if (windowElapsed < RATE_LIMIT_WINDOW_MS && existing.requestCount >= MAX_REQUESTS_PER_WINDOW) {
        return {
          success: false,
          message: "Rate limit exceeded. Maximum 3 OTP requests allowed every 5 minutes. Please try again later.",
        };
      }
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const requestCount = (existing && (now - existing.lastSentAt < RATE_LIMIT_WINDOW_MS)) 
      ? (existing.requestCount || 0) + 1 
      : 1;

    const newSession: OtpSession = {
      mobileNumber: cleanMobile,
      otp: generatedOtp,
      expiresAt: now + OTP_EXPIRATION_MS,
      attempts: 0,
      lastSentAt: now,
      requestCount,
    };

    sessions[cleanMobile] = newSession;
    saveSessions(sessions);

    console.log(`[OTP SERVICE] Sent OTP ${generatedOtp} to +91-${cleanMobile}`);

    return {
      success: true,
      otp: generatedOtp,
      message: `OTP sent successfully to +91 ${cleanMobile}`,
    };
  },

  /**
   * Verify an OTP submitted by the user.
   */
  async verifyOtp(mobileNumber: string, submittedOtp: string): Promise<{ success: boolean; message: string }> {
    const cleanMobile = formatIndianMobile(mobileNumber);
    const sessions = getSessions();
    const session = sessions[cleanMobile];
    const now = Date.now();

    if (!session) {
      return {
        success: false,
        message: "No active OTP request found for this mobile number. Please request a new OTP.",
      };
    }

    // Check expiration (5 minutes)
    if (now > session.expiresAt) {
      delete sessions[cleanMobile];
      saveSessions(sessions);
      return {
        success: false,
        message: "OTP has expired (validity: 5 minutes). Please request a new OTP.",
      };
    }

    // Check brute-force attempts
    if (session.attempts >= MAX_ATTEMPTS) {
      delete sessions[cleanMobile];
      saveSessions(sessions);
      return {
        success: false,
        message: "Too many invalid attempts. Your OTP session has been locked. Please request a new OTP.",
      };
    }

    // Increment attempt counter
    session.attempts += 1;
    saveSessions(sessions);

    if (session.otp !== submittedOtp.trim()) {
      const remainingAttempts = MAX_ATTEMPTS - session.attempts;
      return {
        success: false,
        message: `Incorrect OTP. ${remainingAttempts} attempt(s) remaining.`,
      };
    }

    // OTP Verified Successfully! Clear the session so it can't be reused.
    delete sessions[cleanMobile];
    saveSessions(sessions);

    return {
      success: true,
      message: "OTP verified successfully!",
    };
  },
};
