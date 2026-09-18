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
 * Checks if a user object or role string qualifies as an authorized administrator.
 */
export function isAuthorizedAdmin(roleOrUser?: unknown): boolean {
  if (!roleOrUser) return false;

  if (typeof roleOrUser === "string") {
    return ADMIN_ROLES.includes(roleOrUser.toLowerCase() as AdminRole);
  }

  if (typeof roleOrUser === "object") {
    const u = roleOrUser as Record<string, unknown>;
    const directRole = (u.role as string)?.toLowerCase();
    if (ADMIN_ROLES.includes(directRole as AdminRole)) return true;

    // Check user_metadata or app_metadata
    const appMeta = u.app_metadata as Record<string, unknown> | undefined;
    const userMeta = u.user_metadata as Record<string, unknown> | undefined;
    const appRole = (appMeta?.role as string)?.toLowerCase();
    const userRole = (userMeta?.role as string)?.toLowerCase();

    if (ADMIN_ROLES.includes(appRole as AdminRole)) return true;
    if (ADMIN_ROLES.includes(userRole as AdminRole)) return true;
    if (appMeta?.is_admin === true || userMeta?.is_admin === true) return true;

    // Check known administrator emails or patterns (allows admin accounts in both live and local modes)
    const email = (u.email as string)?.toLowerCase();
    if (email) {
      if (KNOWN_ADMIN_EMAILS.includes(email)) return true;
      if (email.includes("admin") || email.endsWith("@admin.com")) return true;

      const envAdminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
        : [];
      if (envAdminEmails.includes(email)) return true;
    }
  }

  return false;
}

/**
 * Parses and verifies admin credentials from incoming request cookies or headers.
 */
export function getAdminSessionFromRequest(
  request: NextRequest
): AdminUserSession | null {
  // 1. Check dedicated admin session cookie
  const adminCookie = request.cookies.get("admin_user_session");
  if (adminCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(adminCookie.value));
      if (isAuthorizedAdmin(parsed?.role)) {
        return parsed as AdminUserSession;
      }
    } catch {
      // Invalid cookie payload
    }
  }

  // 2. Check demo user session if it has an admin role
  const demoCookie = request.cookies.get("demo_user_session");
  if (demoCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(demoCookie.value));
      if (isAuthorizedAdmin(parsed)) {
        return {
          id: parsed.id || "admin-root",
          email: parsed.email || "admin@surprisespark.app",
          displayName: parsed.user_metadata?.full_name || parsed.displayName || "Platform Administrator",
          role: (parsed.role as AdminRole) || "superadmin",
          lastLoginAt: new Date().toISOString(),
        };
      }
    } catch {
      // Invalid cookie payload
    }
  }

  // 3. Check authorization header for test/service runner
  const authHeader = request.headers.get("x-admin-role");
  if (authHeader && isAuthorizedAdmin(authHeader)) {
    return {
      id: "header-admin-user",
      email: "admin-service@surprisespark.app",
      displayName: "System Administrator",
      role: authHeader.toLowerCase() as AdminRole,
      lastLoginAt: new Date().toISOString(),
    };
  }

  return null;
}
