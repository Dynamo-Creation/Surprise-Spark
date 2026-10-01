import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminSessionFromRequest, isAuthorizedAdmin } from "@/lib/admin/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate Administrator
    // 1. Strict Server-Side Administrator Authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    let isAuthedAdmin = Boolean(user?.email && isAuthorizedAdmin(user.email));

    if (!isAuthedAdmin) {
      const adminCookie = request.cookies.get("admin_user_session");
      if (adminCookie?.value) {
        try {
          const parsed = JSON.parse(decodeURIComponent(adminCookie.value));
          if (parsed?.email && isAuthorizedAdmin(parsed.email)) {
            isAuthedAdmin = true;
          }
        } catch {}
      }
    }

    if (!isAuthedAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    // 2. Query all real published surprises
    const { data: surprises, error } = await supabase
      .from("published_surprises")
      .select("public_id, template_slug, recipient_name, sender_name, photos, audio_url, user_id, metadata, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin Surprises API] Fetch error:", error.message);
      return NextResponse.json(
        { error: "Failed to load surprises from database." },
        { status: 500 }
      );
    }

    // 3. Format response safely
    const formatted = (surprises || []).map((s: any) => ({
      id: s.public_id,
      publicId: s.public_id,
      userId: s.user_id || undefined,
      templateSlug: s.template_slug || "sweet-celebration",
      recipientName: s.recipient_name || "Someone Special",
      senderName: s.sender_name || "Anonymous",
      photosCount: Array.isArray(s.photos) ? s.photos.length : 0,
      hasAudio: Boolean(s.audio_url),
      viewCount: Number(s.metadata?.viewCount || 0),
      shareCount: Number(s.metadata?.shareCount || 0),
      status: "published" as const,
      createdAt: s.created_at || new Date().toISOString(),
      updatedAt: s.updated_at || s.created_at || new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, count: formatted.length, surprises: formatted });
  } catch (err: unknown) {
    console.error("[Admin Surprises API] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error fetching surprises." },
      { status: 500 }
    );
  }
}
