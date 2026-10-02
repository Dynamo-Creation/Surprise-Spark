import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sanitizeText } from "@/lib/security/sanitizer";
import { rateLimiter } from "@/lib/security/rateLimiter";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CATEGORIES = new Set(["bug", "suggestion", "general"]);
const VALID_RATINGS = new Set(["broken", "confused", "neutral", "good", "loved"]);

// In-memory fallback cache for development or when database migration is pending
interface FeedbackRecord {
  id: string;
  user_id: string | null;
  user_name: string;
  user_email: string;
  category: "bug" | "suggestion" | "general";
  rating?: "broken" | "confused" | "neutral" | "good" | "loved";
  message: string;
  status: "new" | "in_progress" | "resolved" | "archived";
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const fallbackFeedbacks: FeedbackRecord[] = [];

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. Sliding Window Rate Limiting (Strict Protection: 3 submissions per IP/10 min)
    const limit = rateLimiter.check(`feedback_${clientIp}`, 3, 10 * 60_000);
    if (!limit.success) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Please wait a few minutes before submitting additional feedback.",
          retryAfter: limit.resetSeconds,
        },
        { status: 429, headers: { "Retry-After": String(limit.resetSeconds) } }
      );
    }

    // 2. Authentication Verification
    const supabase = await createClient();
    let currentUserId: string | null = null;
    let authUserEmail: string | null = null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        currentUserId = user.id;
        authUserEmail = user.email || null;
      }
    } catch {
      // ignore
    }

    // Fallback for local demo session if Supabase is unconfigured in development
    if (!currentUserId && !isSupabaseConfigured()) {
      const demoCookie = request.cookies.get("demo_user_session");
      if (demoCookie?.value) {
        try {
          const parsed = JSON.parse(decodeURIComponent(demoCookie.value));
          if (parsed && (parsed.id || parsed.email)) {
            currentUserId = parsed.id || "demo-user-1";
            authUserEmail = parsed.email || "creator@example.com";
          }
        } catch {}
      }
    }

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to submit feedback." },
        { status: 401 }
      );
    }

    // 3. Request Body Parsing & Sanitization
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON request payload." }, { status: 400 });
    }

    const { userName, userEmail, category, rating, message } = body;

    const cleanName = sanitizeText(userName, 100);
    const rawEmail = typeof userEmail === "string" ? userEmail.trim().toLowerCase() : "";
    const cleanEmail = EMAIL_REGEX.test(rawEmail) ? rawEmail.slice(0, 255) : (authUserEmail || "user@surprisespark.app");

    const cleanCategory = typeof category === "string" && VALID_CATEGORIES.has(category)
      ? (category as "bug" | "suggestion" | "general")
      : "bug";

    const cleanRating = typeof rating === "string" && VALID_RATINGS.has(rating)
      ? (rating as "broken" | "confused" | "neutral" | "good" | "loved")
      : undefined;

    const cleanMessage = sanitizeText(message, 2000);

    if (!cleanMessage || cleanMessage.length < 5) {
      return NextResponse.json(
        { error: "Please provide a detailed description (at least 5 characters)." },
        { status: 400 }
      );
    }

    const newRecord: FeedbackRecord = {
      id: "fb-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6),
      user_id: currentUserId,
      user_name: cleanName || "Anonymous Creator",
      user_email: cleanEmail,
      category: cleanCategory,
      rating: cleanRating,
      message: cleanMessage,
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 4. Persist to Supabase Database
    try {
      const { data, error } = await supabase
        .from("user_feedbacks")
        .insert({
          user_id: currentUserId,
          user_name: newRecord.user_name,
          user_email: newRecord.user_email,
          category: newRecord.category,
          rating: newRecord.rating || null,
          message: newRecord.message,
          status: "new",
        })
        .select()
        .single();

      if (!error && data) {
        newRecord.id = data.id;
      } else {
        // In-memory fallback
        fallbackFeedbacks.unshift(newRecord);
      }
    } catch {
      fallbackFeedbacks.unshift(newRecord);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback! The admin team has received it.",
      feedbackId: newRecord.id,
    });
  } catch (err: unknown) {
    console.error("[Feedback API] Server error:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
