import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, sanitizeSupabaseUrl, sanitizeSupabaseKey } from "./config";
import { isAuthorizedAdmin } from "@/lib/admin/adminAuth";
import { rateLimiter } from "@/lib/security/rateLimiter";

export async function updateSession(request: NextRequest) {
  // Rate Limiting Security Check
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const pathname = request.nextUrl.pathname;

  // 1. Strict rate limit on auth endpoints (prevent brute-force logins)
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  ) {
    const authLimit = rateLimiter.check(`auth_${clientIp}`, 20, 60_000);
    if (!authLimit.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many authentication requests. Please try again shortly.",
          retryAfter: authLimit.resetSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(authLimit.resetSeconds),
          },
        }
      );
    }
  }

  // 2. Protect internal test/diagnostic routes in production
  if (pathname.startsWith("/api/test/") && process.env.NODE_ENV === "production") {
    let isTestAdmin = false;
    const adminCookie = request.cookies.get("admin_user_session");
    if (adminCookie?.value) {
      try {
        const parsed = JSON.parse(decodeURIComponent(adminCookie.value));
        if (isAuthorizedAdmin(parsed)) isTestAdmin = true;
      } catch {}
    }
    if (!isTestAdmin) {
      return new NextResponse(
        JSON.stringify({ error: "Not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 3. Strict rate limit on file upload endpoints
  if (
    pathname === "/api/upload-audio" ||
    pathname === "/api/admin/templates/upload"
  ) {
    const uploadLimit = rateLimiter.check(`upload_${clientIp}`, 15, 60_000);
    if (!uploadLimit.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Upload rate limit exceeded. Please wait a minute before uploading again.",
          retryAfter: uploadLimit.resetSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(uploadLimit.resetSeconds),
          },
        }
      );
    }
  }

  // 3. Rate limit on generic API endpoints
  if (pathname.startsWith("/api/")) {
    const apiLimit = rateLimiter.check(`api_${clientIp}`, 120, 60_000);
    if (!apiLimit.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please slow down.",
          retryAfter: apiLimit.resetSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(apiLimit.resetSeconds),
          },
        }
      );
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const isConfigured = isSupabaseConfigured();

  // Check user session
  let user = null;
  if (isConfigured) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } else {
    // Check local demo session cookie if live Supabase is not yet configured
    const demoUserCookie = request.cookies.get("demo_user_session");
    if (demoUserCookie) {
      try {
        user = JSON.parse(decodeURIComponent(demoUserCookie.value));
      } catch {
        user = null;
      }
    }
  }

  // Admin Route Protection: Both /admin UI pages and /api/admin API routes require authorized administrator
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isAdminApi = request.nextUrl.pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    let hasAdminAccess = false;

    // 1. Verify authenticated user directly
    if (user && isAuthorizedAdmin(user)) {
      hasAdminAccess = true;
    } else {
      // 2. Check admin session cookie, strictly validating the email against known admin list
      const adminSessionCookie = request.cookies.get("admin_user_session");
      if (adminSessionCookie?.value) {
        try {
          const parsed = JSON.parse(decodeURIComponent(adminSessionCookie.value));
          if (isAuthorizedAdmin(parsed)) {
            hasAdminAccess = true;
          }
        } catch {
          // Invalid cookie
        }
      }
    }

    if (!hasAdminAccess) {
      // For API routes, return 403 Forbidden JSON instead of HTML redirect
      if (isAdminApi) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: Administrator privileges required." }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
        redirectUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(redirectUrl);
      } else {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        redirectUrl.searchParams.set("error", "forbidden_not_admin");
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Protected route checking: /dashboard requires authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is already authenticated and visits /login or /signup, redirect to destination
  const isAuthRoute =
    request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup";
  if (isAuthRoute && user) {
    const targetRedirect = request.nextUrl.searchParams.get("redirect") || "/dashboard";
    const isAdmin = isAuthorizedAdmin(user);
    // If user is admin trying to access admin, or if already logged in with no blocking error
    if ((isAdmin && targetRedirect.startsWith("/admin")) || !request.nextUrl.searchParams.has("error")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = targetRedirect;
      redirectUrl.searchParams.delete("error");
      redirectUrl.searchParams.delete("redirect");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
