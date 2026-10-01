import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminSessionFromRequest, isAuthorizedAdmin } from "@/lib/admin/adminAuth";

export const runtime = "nodejs";

export interface AdminUserResponse {
  id: string;
  email: string;
  displayName: string;
  role: "user" | "creator" | "moderator" | "template_manager" | "superadmin";
  status: "active" | "suspended" | "verified";
  registrationDate: string;
  lastActivityAt: string;
  surprisesCount: number;
  publishedCount: number;
  templateUsage: string[];
}

export async function GET(request: NextRequest) {
  try {
    // 1. Strict Server-Side Administrator Authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    const isAuthedAdmin = Boolean(user?.email && isAuthorizedAdmin(user.email));

    if (!isAuthedAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    // 2. Fetch real user accounts via secure RPC
    const { data: rpcUsers, error: rpcError } = await supabase.rpc("get_admin_users_overview");

    if (!rpcError && Array.isArray(rpcUsers) && rpcUsers.length > 0) {
      const formatted: AdminUserResponse[] = rpcUsers.map((u: any) => ({
        id: u.id,
        email: u.email || "",
        displayName: u.display_name || u.email?.split("@")[0] || "User",
        role: u.role || (u.surprises_count > 0 ? "creator" : "user"),
        status: (u.status as any) || "active",
        registrationDate: u.created_at || new Date().toISOString(),
        lastActivityAt: u.last_activity_at || u.created_at || new Date().toISOString(),
        surprisesCount: Number(u.surprises_count || 0),
        publishedCount: Number(u.published_count || 0),
        templateUsage: Array.isArray(u.template_usage) ? u.template_usage : [],
      }));

      return NextResponse.json({ success: true, users: formatted });
    }

    // 3. Fallback: Query profiles & published surprises directly
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, created_at, last_activity_at");

    const { data: surprises } = await supabase
      .from("published_surprises")
      .select("user_id, template_slug");

    const surpriseCountsByUser: Record<string, number> = {};
    const templatesByUser: Record<string, Set<string>> = {};

    (surprises || []).forEach((s) => {
      if (s.user_id) {
        surpriseCountsByUser[s.user_id] = (surpriseCountsByUser[s.user_id] || 0) + 1;
        if (!templatesByUser[s.user_id]) templatesByUser[s.user_id] = new Set();
        if (s.template_slug) templatesByUser[s.user_id].add(s.template_slug);
      }
    });

    const fallbackUsers: AdminUserResponse[] = (profiles || []).map((p) => {
      const isSuper = user?.id === p.id;
      const count = surpriseCountsByUser[p.id] || 0;
      return {
        id: p.id,
        email: isSuper && user?.email ? user.email : `${p.display_name?.toLowerCase().replace(/\s+/g, "") || "user"}@surprisespark.app`,
        displayName: p.display_name || "Creator",
        role: isSuper ? "superadmin" : count > 0 ? "creator" : "user",
        status: "active",
        registrationDate: p.created_at || new Date().toISOString(),
        lastActivityAt: p.last_activity_at || p.created_at || new Date().toISOString(),
        surprisesCount: count,
        publishedCount: count,
        templateUsage: Array.from(templatesByUser[p.id] || []),
      };
    });

    return NextResponse.json({ success: true, users: fallbackUsers });
  } catch (err: unknown) {
    console.error("[Admin Users API] Error:", err);
    return NextResponse.json(
      { error: "Internal server error fetching admin users." },
      { status: 500 }
    );
  }
}
