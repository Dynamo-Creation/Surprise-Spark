import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminSessionFromRequest, isAuthorizedAdmin } from "@/lib/admin/adminAuth";
import { fallbackFeedbacks } from "@/app/api/feedback/route";
import { sanitizeText } from "@/lib/security/sanitizer";

export const runtime = "nodejs";

const VALID_STATUSES = new Set(["new", "in_progress", "resolved", "archived"]);

async function checkAdmin(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  let isAuthedAdmin = Boolean(user?.email && isAuthorizedAdmin(user.email));

  if (!isAuthedAdmin) {
    const signedAdminSession = await getAdminSessionFromRequest(request);
    if (signedAdminSession?.email && isAuthorizedAdmin(signedAdminSession.email)) {
      isAuthedAdmin = true;
    }
  }

  return isAuthedAdmin;
}

export async function GET(request: NextRequest) {
  try {
    const isAuthedAdmin = await checkAdmin(request);
    if (!isAuthedAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const { data: dbFeedbacks, error } = await supabase
      .from("user_feedbacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(dbFeedbacks)) {
      // Merge with any in-memory fallback feedbacks (avoiding duplicates)
      const seenIds = new Set(dbFeedbacks.map((f) => f.id));
      const combined = [
        ...dbFeedbacks,
        ...fallbackFeedbacks.filter((f) => !seenIds.has(f.id)),
      ];
      return NextResponse.json({ success: true, count: combined.length, feedbacks: combined });
    }

    return NextResponse.json({
      success: true,
      count: fallbackFeedbacks.length,
      feedbacks: fallbackFeedbacks,
    });
  } catch (err: unknown) {
    console.error("[Admin Feedback API] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error fetching feedbacks." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAuthedAdmin = await checkAdmin(request);
    if (!isAuthedAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ error: "Missing feedback ID." }, { status: 400 });
    }

    const { id, status, adminNotes } = body;
    const cleanStatus = typeof status === "string" && VALID_STATUSES.has(status) ? status : undefined;
    const cleanNotes = typeof adminNotes === "string" ? sanitizeText(adminNotes, 1000) : undefined;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (cleanStatus) updates.status = cleanStatus;
    if (cleanNotes !== undefined) updates.admin_notes = cleanNotes;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_feedbacks")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    // Also update in-memory record if present
    const memoryRecord = fallbackFeedbacks.find((f) => f.id === id);
    if (memoryRecord) {
      if (cleanStatus) memoryRecord.status = cleanStatus as any;
      if (cleanNotes !== undefined) memoryRecord.admin_notes = cleanNotes;
    }

    if (error && !memoryRecord) {
      return NextResponse.json(
        { error: "Failed to update feedback: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback: data || memoryRecord,
    });
  } catch (err: unknown) {
    console.error("[Admin Feedback API] PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error updating feedback." },
      { status: 500 }
    );
  }
}
