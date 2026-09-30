import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import crypto from "node:crypto";

export const runtime = "nodejs";

const MAX_SIZE = 15 * 1024 * 1024; // 15MB

const ALLOWED_AUDIO_EXTENSIONS = new Set([
  "mp3",
  "wav",
  "m4a",
  "aac",
  "ogg",
  "flac",
  "webm",
  "opus",
]);

/**
 * Validates audio file binary magic byte signatures to prevent malicious payload uploads
 * masquerading under audio MIME types or extensions.
 */
function verifyAudioHeader(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  // 1. MP3 with ID3v2 tag: "ID3" (0x49 0x44 0x33)
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) return true;

  // 2. MP3 raw MPEG sync: starts with 0xFF followed by 0xE0-0xFF frame sync
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) return true;

  // 3. WAV: "RIFF" ... "WAVE"
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x41 && buffer[10] === 0x56 && buffer[11] === 0x45
  ) return true;

  // 4. OGG: "OggS" (0x4f 0x67 0x67 0x53)
  if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) return true;

  // 5. FLAC: "fLaC" (0x66 0x4c 0x61 0x43)
  if (buffer[0] === 0x66 && buffer[1] === 0x4c && buffer[2] === 0x61 && buffer[3] === 0x43) return true;

  // 6. WebM / Matroska (browser voice recording): 0x1A 0x45 0xDF 0xA3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) return true;

  // 7. M4A / MP4 Audio: bytes 4..7 are "ftyp" (0x66 0x74 0x79 0x70)
  if (
    buffer.length >= 8 &&
    buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70
  ) return true;

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Audio upload service is temporarily unavailable." },
        { status: 503 }
      );
    }

    // 1. Authentication Check (Prevent Unauthenticated File Uploads & Storage Abuse)
    let user: { id?: string; email?: string } | null = null;

    // Check Bearer token in Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader?.toLowerCase().startsWith("bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token) {
        try {
          const adminSupabase = createClient(supabaseUrl, supabaseKey);
          const { data, error } = await adminSupabase.auth.getUser(token);
          if (!error && data?.user) {
            user = data.user;
          }
        } catch {
          // Token verification fallback
        }
      }
    }

    // Check cookie-based session via Supabase SSR
    if (!user) {
      try {
        const serverSupabase = await createServerClient();
        const { data, error } = await serverSupabase.auth.getUser();
        if (!error && data?.user) {
          user = data.user;
        }
      } catch (authErr) {
        console.warn("[Upload Audio Security] Session check warning:", authErr);
      }
    }

    // Fallback for local development demo session if Supabase is unconfigured
    if (!user && !isSupabaseConfigured()) {
      const demoCookie = request.cookies.get("demo_user_session");
      if (demoCookie?.value) {
        try {
          const parsed = JSON.parse(decodeURIComponent(demoCookie.value));
          if (parsed && (parsed.id || parsed.email)) {
            user = parsed;
          }
        } catch {}
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to upload audio files." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No audio file provided. Send a valid 'file' form field." },
        { status: 400 }
      );
    }

    // 1. File Size Verification
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Audio file exceeds 15MB limit. Please upload a smaller track or voice note." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "Audio file is empty (0 bytes)." },
        { status: 400 }
      );
    }

    // 2. Extension Verification
    const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
    const safeExt = ALLOWED_AUDIO_EXTENSIONS.has(rawExt) ? rawExt : "mp3";

    // 3. Binary Magic Byte Header Inspection
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!verifyAudioHeader(buffer)) {
      return NextResponse.json(
        { error: "Invalid audio file. Header inspection failed to verify valid audio format." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. Cryptographically Secure Random Storage Path (No Path Traversal or Collisions)
    const randomId = crypto.randomUUID();
    const storagePath = `surprises/${randomId}.${safeExt}`;

    // 5. Upload to Supabase Storage "music" Bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("music")
      .upload(storagePath, buffer, {
        contentType: file.type || "audio/mpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Upload Audio Security] Storage upload error:", uploadError.message);
      return NextResponse.json(
        { error: "Storage upload failed. Please try again." },
        { status: 500 }
      );
    }

    // 6. Retrieve Permanent Public URL
    const { data: publicUrlData } = supabase.storage
      .from("music")
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      return NextResponse.json(
        { error: "Failed to generate public URL for uploaded audio." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      publicUrl,
      fileName: `${randomId}.${safeExt}`,
      storagePath: uploadData?.path || storagePath,
      fileSize: file.size,
    });
  } catch (err: unknown) {
    console.error("[Upload Audio Security] Unhandled server error:", err);
    return NextResponse.json(
      { error: "Failed to process audio upload safely." },
      { status: 500 }
    );
  }
}
