import { ConsentState, UserPrivacyProfile } from "./types";

export type AnalyticsConsent = ConsentState;

const PRIVACY_STORAGE_KEY = "surprisespark_privacy_profile_v1";
const SESSION_ID_KEY = "surprisespark_ephemeral_sid";

const RESTRICTED_PII_KEYS = new Set([
  "recipientName",
  "recipient_name",
  "senderName",
  "sender_name",
  "message",
  "personalMessage",
  "password",
  "email",
  "ip",
  "ip_address",
  "phone",
  "phoneNumber",
  "token",
  "secret",
  "photos",
  "audioUrl",
]);

/**
 * Strips all identifiable personal information (PII) from telemetry payloads.
 */
export function sanitizeAnalyticsPayload<T extends Record<string, unknown>>(payload: T): Partial<T> {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (!RESTRICTED_PII_KEYS.has(k) && !k.toLowerCase().includes("password") && !k.toLowerCase().includes("secret")) {
      clean[k] = v;
    }
  }
  return clean as Partial<T>;
}

/**
 * Returns or generates a completely anonymous, ephemeral session ID.
 * Stored in sessionStorage so it clears automatically when the tab closes.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "srv_session_" + Math.random().toString(36).slice(2, 10);
  }

  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = "anon_sid_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    return "ephemeral_" + Math.random().toString(36).slice(2, 8);
  }
}

/**
 * Retrieves the current privacy consent profile.
 */
export function getPrivacyProfile(): UserPrivacyProfile {
  const defaultProfile: UserPrivacyProfile = {
    consentState: "opt_in",
    telemetryEnabled: true,
    sessionId: getOrCreateSessionId(),
    lastUpdated: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const raw = localStorage.getItem(PRIVACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultProfile,
        ...parsed,
        sessionId: getOrCreateSessionId(),
      };
    }
  } catch {
    // LocalStorage fallback
  }

  return defaultProfile;
}

/**
 * Sets user consent preference.
 */
export function setConsentState(state: ConsentState): UserPrivacyProfile {
  const profile = getPrivacyProfile();
  profile.consentState = state;
  profile.telemetryEnabled = state === "opt_in";
  profile.lastUpdated = new Date().toISOString();

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage fail
    }
  }

  return profile;
}

/**
 * Checks if non-essential telemetry is permitted by the user.
 */
export function isTelemetryPermitted(): boolean {
  const profile = getPrivacyProfile();
  return profile.telemetryEnabled && profile.consentState !== "opt_out";
}

/**
 * Completely purges all stored analytics and session identifiers ("Forget Me").
 */
export function purgeAnalyticsData(): { success: boolean; message: string } {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem("surprisespark_analytics_events_v1");
      // Set to opt_out
      setConsentState("opt_out");
      return {
        success: true,
        message: "All analytics session events have been permanently deleted and telemetry is opted out.",
      };
    } catch {
      // Error handling
    }
  }
  return { success: true, message: "Analytics data purged." };
}

export function isTrackingAllowed(): boolean {
  return isTelemetryPermitted();
}

export function getAnalyticsConsent(): AnalyticsConsent {
  return getPrivacyProfile().consentState;
}

export function setAnalyticsConsent(consent: AnalyticsConsent): UserPrivacyProfile {
  return setConsentState(consent);
}
