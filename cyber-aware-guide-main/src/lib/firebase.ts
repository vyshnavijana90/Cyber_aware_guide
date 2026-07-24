import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from "firebase/auth";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const STORAGE_KEY = "cybershield_firebase_config";

/**
 * Default demo configuration or retrieved custom config from localStorage / env.
 */
export function getStoredFirebaseConfig(): FirebaseConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse stored firebase config", e);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  };
}

export function saveFirebaseConfig(config: FirebaseConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save firebase config", e);
  }
}

export function isFirebaseConfigured(): boolean {
  const cfg = getStoredFirebaseConfig();
  return !!(cfg.apiKey && cfg.projectId && cfg.apiKey !== "YOUR_FIREBASE_API_KEY");
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function initFirebase(): { app: FirebaseApp; auth: Auth } | null {
  const config = getStoredFirebaseConfig();

  if (!config.apiKey || !config.projectId || config.apiKey === "YOUR_FIREBASE_API_KEY") {
    return null;
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firebaseAuth = getAuth(firebaseApp);
    return { app: firebaseApp, auth: firebaseAuth };
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    return null;
  }
}

/**
 * Initializes invisible reCAPTCHA verifier attached to a DOM container element.
 */
export function initRecaptchaVerifier(containerId = "recaptcha-container"): RecaptchaVerifier | null {
  const fb = initFirebase();
  if (!fb || !fb.auth) return null;

  try {
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch {}
    }

    recaptchaVerifier = new RecaptchaVerifier(fb.auth, containerId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved automatically");
      },
      "expired-callback": () => {
        console.warn("reCAPTCHA expired, resetting...");
      },
    });

    return recaptchaVerifier;
  } catch (error) {
    console.error("Error creating RecaptchaVerifier:", error);
    return null;
  }
}

/**
 * Sends a real 6-digit SMS OTP to a phone number (+91XXXXXXXXXX) using Firebase Phone Auth.
 */
export async function sendFirebasePhoneOtp(
  mobileNumber: string,
  containerId = "recaptcha-container"
): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; message: string }> {
  const cleanMobile = mobileNumber.replace(/^(\+91|91|0)/, "").trim();
  const formattedNumber = `+91${cleanMobile}`;

  const fb = initFirebase();
  if (!fb || !fb.auth) {
    return {
      success: false,
      message: "Firebase API configuration required. Please enter your Firebase project API key.",
    };
  }

  try {
    const verifier = initRecaptchaVerifier(containerId);
    if (!verifier) {
      return {
        success: false,
        message: "Failed to initialize reCAPTCHA security verifier.",
      };
    }

    const confirmationResult = await signInWithPhoneNumber(fb.auth, formattedNumber, verifier);
    
    return {
      success: true,
      confirmationResult,
      message: `SMS OTP code sent to ${formattedNumber}. Check your mobile phone!`,
    };
  } catch (error: any) {
    console.error("Firebase Phone Auth Error:", error);
    let errorMsg = error.message || "Failed to send SMS OTP code.";
    if (error.code === "auth/invalid-phone-number") {
      errorMsg = "Invalid mobile phone number format for SMS delivery.";
    } else if (error.code === "auth/too-many-requests") {
      errorMsg = "Too many SMS requests sent to this number. Please wait a few minutes.";
    } else if (error.code === "auth/quota-exceeded") {
      errorMsg = "Firebase SMS daily quota exceeded.";
    } else if (error.code === "auth/captcha-check-failed") {
      errorMsg = "reCAPTCHA validation failed. Please try again.";
    }
    return {
      success: false,
      message: errorMsg,
    };
  }
}

/**
 * Confirms the 6-digit OTP received via SMS against Firebase Authentication.
 */
export async function verifyFirebasePhoneOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<{ success: boolean; message: string }> {
  if (!confirmationResult || !otpCode) {
    return {
      success: false,
      message: "Missing OTP verification session or code.",
    };
  }

  try {
    await confirmationResult.confirm(otpCode.trim());
    return {
      success: true,
      message: "Mobile phone verified successfully via SMS!",
    };
  } catch (error: any) {
    console.error("Firebase OTP Verification Error:", error);
    let errorMsg = "Invalid OTP verification code.";
    if (error.code === "auth/invalid-verification-code") {
      errorMsg = "Incorrect OTP code entered. Please check your SMS and try again.";
    } else if (error.code === "auth/code-expired") {
      errorMsg = "The SMS OTP code has expired. Please request a new OTP.";
    }
    return {
      success: false,
      message: errorMsg,
    };
  }
}
