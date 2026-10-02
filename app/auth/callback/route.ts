import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const decodedNext = decodeURIComponent(next);
      let cleanNext = "/";
      if (decodedNext.startsWith("/") && !decodedNext.startsWith("//") && !decodedNext.startsWith("/\\")) {
        cleanNext = decodedNext;
      }
      const targetUrl = isLocalEnv
        ? `${origin}${cleanNext}`
        : forwardedHost
        ? `https://${forwardedHost}${cleanNext}`
        : `${origin}${cleanNext}`;

      const res = NextResponse.redirect(targetUrl);

      // If user is an authorized admin, set admin session cookie immediately
      if (data?.user?.email && (await import("@/lib/admin/adminAuth")).isAuthorizedAdmin(data.user.email)) {
        const rawName = (data.user.user_metadata?.full_name as string) || data.user.email.split("@")[0] || "Administrator";
        const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const adminSession = {
          id: data.user.id,
          email: data.user.email,
          displayName,
          role: "superadmin",
          lastLoginAt: new Date().toISOString(),
        };
        res.cookies.set(
          "admin_user_session",
          encodeURIComponent(JSON.stringify(adminSession)),
          { path: "/", maxAge: 86400, sameSite: "lax" }
        );
      }

      return res;
    }
  }

  // Return the user to an error page or login with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
