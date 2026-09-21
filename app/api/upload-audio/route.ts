import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * POST /api/upload-audio
 * Accepts a multipart form upload with field "file" (audio blob/file).
 * Uploads to Supabase Storage "music" bucket under surprises/ folder.
 * Returns a permanent public URL for embedding in shared surprise links.
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase configuration missing" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided. Send a 'file' field in multipart form data." },
        { status: 400 }
      );
    }

    // Validate file type — accept common audio formats and webm (voice notes)
    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/mp4",
      "audio/x-m4a",
      "audio/m4a",
      "audio/aac",
      "audio/ogg",
      "audio/flac",
      "audio/webm",
      "audio/opus",
      "application/ogg",
    ];

    const isAudioMime = allowedTypes.includes(file.type) || file.type.startsWith("audio/");
    const isAudioExt = /\.(mp3|wav|m4a|aac|ogg|flac|opus|wma|weba|webm)$/i.test(file.name);

    if (!isAudioMime && !isAudioExt) {
      return NextResponse.json(
        { error: `Unsupported audio format: ${file.type || file.name}. Supported: MP3, WAV, M4A, AAC, OGG, FLAC, WebM.` },
        { status: 400 }
      );
    }

    // Limit file size to 15MB
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Audio file too large. Maximum size is 15MB." },
        { status: 400 }
      );
    }

    // Generate a unique, sanitized filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split(".").pop()?.toLowerCase() || "mp3";
    const sanitizedOriginalName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 40);
    const storagePath = `surprises/${sanitizedOriginalName}_${timestamp}_${randomSuffix}.${ext}`;

    // Read file as ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage "music" bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("music")
      .upload(storagePath, buffer, {
        contentType: file.type || "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("[Upload Audio] Supabase Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get the permanent public URL
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
      fileName: file.name,
      storagePath: uploadData?.path || storagePath,
      fileSize: file.size,
    });
  } catch (err: unknown) {
    const message = (err as Error)?.message || "Unknown error";
    console.error("[Upload Audio] Server error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
