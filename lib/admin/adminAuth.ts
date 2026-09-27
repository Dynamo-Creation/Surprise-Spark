import { type NextRequest } from "next/server";

export type AdminRole = "superadmin" | "admin" | "template_manager" | "moderator";

export interface AdminUserSession {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLoginAt: string;
}

export const ADMIN_ROLES: AdminRole[] = [
  "superadmin",
  "admin",
  "template_manager",
  "moderator",
];

export const KNOWN_ADMIN_EMAILS: string[] = [
  "admin@surprisespark.app",
  "sonu25580@gmail.com",
  "dynamo@surprisespark.app",
];

/**
 * Helper to strictly verify admin email against allowed list and server environment variables.
 * Enforces exact matching only — never substring or wildcard matching.
 */
export function isKnownAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();

  // Exact match against known admin list
  if (KNOWN_ADMIN_EMAILS.includes(normalized)) return true;

  // Exact match against server environment variable ADMIN_EMAILS (comma-separated)
  const envAdminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [];

  return envAdminEmails.includes(normalized);
}

/**
 * Checks if a user object or role string qualifies as an authorized administrator.
 * Enforces server-side integrity: user_metadata is untrusted (client-writable),
 * only verified admin emails or server-assigned app_metadata roles are honored.
 */
export function isAuthorizedAdmin(roleOrUser?: unknown): boolean {
  if (!roleOrUser) return false;

  if (typeof roleOrUser === "string") {
    const normalizedRole = roleOrUser.toLowerCase().trim();
    return ADMIN_ROLES.includes(normalizedRole as AdminRole);
  }

  if (typeof roleOrUser === "object") {
    const u = roleOrUser as Record<string, unknown>;
    const email = typeof u.email === "string" ? u.email.toLowerCase().trim() : "";

    // 1. Check verified app_metadata (server-only, set by Supabase service-role, never client-writable)
    const appMeta = u.app_metadata as Record<string, unknown> | undefined;
    const appRole = typeof appMeta?.role === "string" ? appMeta.role.toLowerCase().trim() : "";
    if (ADMIN_ROLES.includes(appRole as AdminRole)) return true;

    // 2. Check exact authorized administrator email (exact match only)
    if (email && isKnownAdminEmail(email)) {
      return true;
    }

    // 3. For database-verified records (e.g. from public.admin_users query result)
    const directRole = typeof u.role === "string" ? u.role.toLowerCase().trim() : "";
    if (ADMIN_ROLES.includes(directRole as AdminRole)) {
      // If an email is also attached, it must be an authorized admin email
      if (email) {
        return isKnownAdminEmail(email);
      }
      return true;
    }
  }

  return false;
}

/**
 * Parses and verifies admin credentials from incoming request cookies.
 * Disallows untrusted client headers and validates email against authorized list.
 */
export function getAdminSessionFromRequest(
  request: NextRequest
): AdminUserSession | null {
  // Check dedicated admin session cookie
  const adminCookie = request.cookies.get("admin_user_session");
  if (adminCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(adminCookie.value));
      const email = typeof parsed?.email === "string" ? parsed.email.toLowerCase().trim() : "";
      const role = typeof parsed?.role === "string" ? parsed.role.toLowerCase().trim() : "";

      // Strict validation: Role must be an admin role AND email must be an authorized admin email
      if (ADMIN_ROLES.includes(role as AdminRole) && isKnownAdminEmail(email)) {
        return {
          id: String(parsed.id || "admin-root"),
          email,
          displayName: String(parsed.displayName || "Platform Administrator"),
          role: role as AdminRole,
          lastLoginAt: String(parsed.lastLoginAt || new Date().toISOString()),
        };
      }
    } catch {
      // Invalid cookie payload
    }
  }

  return null;
}
