/**
 * Email Security — Gmail-Only Enforcement
 *
 * Only Google Mail (@gmail.com) addresses are permitted for account creation
 * and authentication. Users must either:
 *   1. Use "Continue with Google" (OAuth — the recommended primary path), or
 *   2. Enter a valid @gmail.com address to receive a verification code (OTP).
 *
 * All other email providers (including corporate, education, and disposable
 * domains) are explicitly blocked.
 */

/** The only email domain permitted for direct email entry. */
const ALLOWED_DOMAIN = "gmail.com";

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  domain?: string;
}

/**
 * Validates that an email address is a well-formed @gmail.com address.
 *
 * @returns `{ isValid: true }` only when the domain is exactly `gmail.com`.
 */
export function validateEmailSecurity(rawEmail: string): EmailValidationResult {
  const email = (rawEmail || "").trim().toLowerCase();

  if (!email) {
    return {
      isValid: false,
      error: "Please enter your Gmail address.",
    };
  }

  // Standard RFC 5322 regex check
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address.",
    };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: "Invalid email format.",
    };
  }

  const domain = parts[1];

  // ──────────────────────────────────────────────
  //  STRICT WHITELIST — only @gmail.com is allowed
  // ──────────────────────────────────────────────
  if (domain !== ALLOWED_DOMAIN) {
    return {
      isValid: false,
      domain,
      error:
        "Only Google Mail (@gmail.com) accounts are supported. Please use your Gmail address or sign in with \"Continue with Google\".",
    };
  }

  return {
    isValid: true,
    domain,
  };
}
