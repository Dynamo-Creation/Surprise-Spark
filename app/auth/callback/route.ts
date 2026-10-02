import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { sanitizeSupabaseUrl, sanitizeSupabaseKey } from "@/lib/supabase/config";
import { getSafeRedirectUrl } from "@/lib/security/sanitizer";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const originHost = new URL(request.url).host;
    
    // Strict host header validation against open redirects and host header poisoning
    const isSafeForwardedHost = (host: string | null): boolean => {
      if (!host) return false;
      const clean = host.split(":")[0].toLowerCase();
      const originClean = originHost.split(":")[0].toLowerCase();
      if (clean === originClean) return true;
      if (clean === "localhost" || clean === "127.0.0.1") return true;

      // Check configured environment URLs
      try {
        if (process.env.NEXT_PUBLIC_APP_URL) {
          const appHost = new URL(process.env.NEXT_PUBLIC_APP_URL).host.split(":")[0].toLowerCase();
          if (clean === appHost) return true;
        }
        if (process.env.NEXT_PUBLIC_SITE_URL) {
          const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL).host.split(":")[0].toLowerCase();
          if (clean === siteHost) return true;
        }
      } catch {
        // Invalid configured URL format
      }

      // Allow verified production domains only (no wildcard *.vercel.app to avoid third-party tenant spoofing)
      if (
        clean === "surprise-spark-dynamo18.vercel.app" ||
        clean === "surprisespark.app" ||
        clean.endsWith(".surprisespark.app") ||
        clean === "partnerincrime.app" ||
        clean.endsWith(".partnerincrime.app")
      ) {
        return true;
      }

      return false;
    };

    const isLocalEnv = process.env.NODE_ENV === "development";
    const cleanNext = getSafeRedirectUrl(next, "/");
    const targetUrl = isLocalEnv
      ? `${origin}${cleanNext}`
      : (forwardedHost && isSafeForwardedHost(forwardedHost))
      ? `https://${forwardedHost}${cleanNext}`
      : `${origin}${cleanNext}`;

    const res = NextResponse.redirect(targetUrl);
    const cookieStore = await cookies();

    const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const supabaseAnonKey = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignore if called from context where cookieStore is locked
            }
            res.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If user is an authorized admin, set cryptographically signed admin session cookie immediately
      if (data?.user?.email) {
        const { isAuthorizedAdmin, signAdminSession } = await import("@/lib/admin/adminAuth");
        if (isAuthorizedAdmin(data.user.email)) {
          const rawName = (data.user.user_metadata?.full_name as string) || data.user.email.split("@")[0] || "Administrator";
          const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          const adminSession = {
            id: data.user.id,
            email: data.user.email,
            displayName,
            role: "superadmin" as const,
            lastLoginAt: new Date().toISOString(),
          };
          const signedCookie = await signAdminSession(adminSession);
          res.cookies.set(
            "admin_user_session",
            signedCookie,
            { path: "/", maxAge: 86400, sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" }
          );
        }
      }

      return res;
    }

    console.error("Auth callback exchange error:", error);
  }

  // Return the user to an error page or login with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
