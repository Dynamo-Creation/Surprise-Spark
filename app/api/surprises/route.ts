import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    if (!publicId || !templateSlug) {
      return NextResponse.json(
        { error: "publicId and templateSlug are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("published_surprises")
      .upsert(
        {
          public_id: publicId,
          template_slug: templateSlug,
          recipient_name: recipientName || "",
          sender_name: senderName || "",
          custom_message: customMessage || "",
          endearment: endearment || "",
          question: question || "",
          dodge_text: dodgeText || "",
          audio_url: audioUrl || "",
          photos: photos || [],
          metadata: metadata || {},
        },
        { onConflict: "public_id" }
      )
      .select();

    if (error) {
      console.error("[Surprises API] Error persisting to Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, surprise: data?.[0] });
  } catch (err: unknown) {
    const message = (err as Error)?.message || "Unknown error";
    console.error("[Surprises API] Server error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ error: "publicId query parameter is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("published_surprises")
      .select("*")
      .eq("public_id", publicId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ surprise: data });
  } catch (err: unknown) {
    const message = (err as Error)?.message || "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
