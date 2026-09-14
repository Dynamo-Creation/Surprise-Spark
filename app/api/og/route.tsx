import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Someone Special";
  const sender = searchParams.get("sender");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.25) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.25) 0%, transparent 50%)",
          fontFamily: "sans-serif",
          padding: "40px",
          textAlign: "center",
        }}
      >
        {/* Floating Gift Box Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "32px",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            fontSize: "64px",
            boxShadow: "0 20px 40px rgba(236, 72, 153, 0.4)",
            marginBottom: "28px",
          }}
        >
          🎁
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "900",
            color: "#ffffff",
            letterSpacing: "-0.03em",
            marginBottom: "16px",
            lineHeight: 1.15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>A Special Surprise for {name}!</span>
        </div>

        {/* Subtitle / Sender hint */}
        <div
          style={{
            fontSize: "24px",
            color: "#cbd5e1",
            fontWeight: "500",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {sender ? (
            <span>Created with love by {sender} ✨</span>
          ) : (
            <span>Open your interactive celebration surprise ✨</span>
          )}
        </div>

        {/* Branding Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: "18px",
            fontWeight: "700",
            color: "#f472b6",
          }}
        >
          <span>SurpriseSpark • Don’t Just Send A Wish. Send A Surprise.</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
