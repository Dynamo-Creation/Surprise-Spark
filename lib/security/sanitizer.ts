/**
 * INPUT SANITIZER & XSS PREVENTION UTILITY
 * Strips HTML tags, script vectors, and malicious protocols from creator-submitted text.
 */

const HTML_TAG_REGEX = /<[^>]*>/g;
const DANGEROUS_PROTOCOLS = /^(javascript:|vbscript:|data:text\/html|data:image\/svg\+xml)/i;

/**
 * Strips raw HTML tags and dangerous javascript protocol vectors.
 */
export function sanitizeText(input: unknown, maxLength?: number): string {
  if (typeof input !== "string") {
    return "";
  }

  // 1. Strip HTML tags
  let sanitized = input.replace(HTML_TAG_REGEX, "");

  // 2. Remove script / event-handler strings
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/onload\s*=/gi, "");
  sanitized = sanitized.replace(/onerror\s*=/gi, "");
  sanitized = sanitized.replace(/onclick\s*=/gi, "");

  // 3. Trim whitespace
  sanitized = sanitized.trim();

  // 4. Enforce max length constraint if provided
  if (maxLength && maxLength > 0) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Escapes characters for safe display in raw HTML / template strings.
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitizes URLs to prevent javascript: or malicious protocol injection.
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  if (DANGEROUS_PROTOCOLS.test(trimmed)) {
    return "";
  }
  return trimmed;
}

export interface PersonalizationInput {
  recipient_name?: string;
  sender_name?: string;
  custom_message?: string;
  special_date?: string;
  [key: string]: unknown;
}

/**
 * Sanitizes a complete personalization record before storage or rendering.
 */
export function sanitizePersonalization<T extends PersonalizationInput>(input: T): T {
  return {
    ...input,
    recipient_name: sanitizeText(input.recipient_name, 60),
    sender_name: sanitizeText(input.sender_name, 60),
    custom_message: sanitizeText(input.custom_message, 1000),
    special_date: sanitizeText(input.special_date, 20),
  };
}

/**
 * Validates and normalizes redirect URLs to prevent Open Redirect vulnerabilities.
 * Allows ONLY safe, local relative paths (e.g., "/dashboard", "/create?draft=123").
 * Explicitly rejects:
 * - Empty or non-string inputs
 * - Absolute URLs with schemes (http://, https://, javascript:, data:, etc.)
 * - Protocol-relative URLs (//example.com)
 * - Backslash-prefixed paths (/\example.com or \example.com)
 * - Encoded slash/backslash tricks (/%2f, /%5c, etc.)
 * - Recursive redirect loops to auth pages (/login, /signup, /auth/callback)
 */
export function getSafeRedirectUrl(rawRedirect: string | null | undefined, defaultFallback = "/"): string {
  if (!rawRedirect || typeof rawRedirect !== "string") {
    return defaultFallback;
  }

  let decoded = rawRedirect.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return defaultFallback;
  }

  // Reject empty, protocol-relative, backslash attacks, or URI schemes
  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.startsWith("/\\") ||
    decoded.startsWith("\\") ||
    decoded.includes(":") || // Blocks http:, https:, javascript:, data:, etc.
    decoded.includes("\r") ||
    decoded.includes("\n")
  ) {
    return defaultFallback;
  }

  // Prevent redirect loops back to auth pages
  const normalizedPath = decoded.split("?")[0].toLowerCase();
  if (
    normalizedPath === "/login" ||
    normalizedPath === "/signup" ||
    normalizedPath === "/auth/callback"
  ) {
    return defaultFallback;
  }

  return decoded;
}

