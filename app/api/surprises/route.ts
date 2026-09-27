import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeText, sanitizeUrl } from "@/lib/security/sanitizer";

export const runtime = "nodejs";

const PUBLIC_ID_REGEX = /^[a-zA-Z0-9_-]{3,64}$/;
const SLUG_REGEX = /^[a-zA-Z0-9_-]{2,64}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const {
      publicId,
      templateSlug,
      recipientName,
      senderName,
      customMessage,
      endearment,
      question,
      dodgeText,
      audioUrl,
      photos,
      metadata,
    } = body;

    // 1. Strict Format Validation
    if (!publicId || typeof publicId !== "string" || !PUBLIC_ID_REGEX.test(publicId)) {
      return NextResponse.json(
        { error: "Invalid publicId. Must be 3-64 alphanumeric characters, underscores, or hyphens." },
        { status: 400 }
      );
    }

    if (!templateSlug || typeof templateSlug !== "string" || !SLUG_REGEX.test(templateSlug)) {
      return NextResponse.json(
        { error: "Invalid templateSlug format." },
        { status: 400 }
      );
    }

    // 2. Input Sanitization & Length Clamping
    const cleanRecipient = sanitizeText(recipientName, 60);
    const cleanSender = sanitizeText(senderName, 60);
    const cleanMessage = sanitizeText(customMessage, 2000);
    const cleanEndearment = sanitizeText(endearment, 60);
    const cleanQuestion = sanitizeText(question, 120);
    const cleanDodgeText = sanitizeText(dodgeText, 120);
    const cleanAudioUrl = audioUrl ? sanitizeUrl(audioUrl) : "";

    let cleanPhotos: string[] = [];
    if (Array.isArray(photos)) {
      cleanPhotos = photos
        .slice(0, 20)
        .map((p) => (typeof p === "string" ? sanitizeUrl(p) : ""))
        .filter(Boolean);
    }

    let cleanMetadata: Record<string, unknown> = {};
    if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
      const metaStr = JSON.stringify(metadata);
      if (metaStr.length <= 15000) {
        cleanMetadata = metadata as Record<string, unknown>;
      }
    }

    const supabase = await createClient();

    // 3. User Authentication & Ownership Verification (IDOR Defense)
    let currentUserId: string | null = null;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      currentUserId = user?.id || null;
    } catch {
      currentUserId = null;
    }

    // Check if the surprise record already exists
    const { data: existingRecord } = await supabase
      .from("published_surprises")
      .select("user_id, public_id")
      .eq("public_id", publicId)
      .maybeSingle();

    if (existingRecord) {
      // If previously published by an authenticated user, only that owner can update it
      if (existingRecord.user_id && existingRecord.user_id !== currentUserId) {
        return NextResponse.json(
          { error: "Forbidden: You do not have permission to modify this surprise." },
          { status: 403 }
        );
      }
    }

    // 4. Safe Database Upsert
    const upsertPayload: Record<string, unknown> = {
      public_id: publicId,
      template_slug: templateSlug,
      recipient_name: cleanRecipient,
      sender_name: cleanSender,
      custom_message: cleanMessage,
      endearment: cleanEndearment,
      question: cleanQuestion,
      dodge_text: cleanDodgeText,
      audio_url: cleanAudioUrl,
      photos: cleanPhotos,
      metadata: cleanMetadata,
      updated_at: new Date().toISOString(),
    };

    // If new or owned, attach user_id
    if (currentUserId) {
      upsertPayload.user_id = currentUserId;
    }

    const { data, error } = await supabase
      .from("published_surprises")
      .upsert(upsertPayload, { onConflict: "public_id" })
      .select();

    if (error) {
      console.error("[Surprises API Security] Database error on upsert:", error.message);
      return NextResponse.json(
        { error: "Failed to persist surprise. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, surprise: data?.[0] });
  } catch (err: unknown) {
    console.error("[Surprises API Security] Unhandled error:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId || !PUBLIC_ID_REGEX.test(publicId)) {
      return NextResponse.json(
        { error: "Valid publicId query parameter is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("published_surprises")
      .select("public_id, template_slug, recipient_name, sender_name, custom_message, endearment, question, dodge_text, audio_url, photos, metadata, created_at")
      .eq("public_id", publicId)
      .maybeSingle();

    if (error) {
      console.error("[Surprises API Security] Database fetch error:", error.message);
      return NextResponse.json({ error: "Failed to retrieve surprise." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Surprise not found." }, { status: 404 });
    }

    return NextResponse.json({ surprise: data });
  } catch (err: unknown) {
    console.error("[Surprises API Security] Unhandled error in GET:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
