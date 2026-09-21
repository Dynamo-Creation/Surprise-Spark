import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const recipientName = searchParams.get("recipientName") || searchParams.get("name") || "Sarah";
    const senderName = searchParams.get("senderName") || searchParams.get("sender") || "Alex";
    const message = searchParams.get("message") || "Wishing you the happiest celebration filled with love and magic!";
    const endearment = searchParams.get("endearment") || "";
    const question = searchParams.get("question") || "";
    const dodgeText = searchParams.get("dodgeText") || "";
    const audioUrl = searchParams.get("audioUrl") || "";

    if (!slug) {
      return new NextResponse("Template slug is required", { status: 400 });
    }

    const rootDir = process.cwd();
    // Resolve slug and common aliases (e.g. lov-animation -> love-animation)
    const effectiveSlug = slug === "lov-animation" ? "love-animation" : slug;
    const targetSlugs = [effectiveSlug];
    if (slug !== effectiveSlug) targetSlugs.push(slug);

    // Check multiple candidate locations for index.html - prioritize dist for compiled Vite/React apps
    const candidates: string[] = [];
    for (const s of targetSlugs) {
      candidates.push(
        path.join(rootDir, "public", "templates", s, "dist", "index.html"),
        path.join(rootDir, "lib", "engine", "templates", "custom", s, "dist", "index.html"),
        path.join(rootDir, "public", "templates", s, "index.html"),
        path.join(rootDir, "public", "templates", s, "build", "index.html"),
        path.join(rootDir, "lib", "engine", "templates", "custom", s, "index.html")
      );
    }

    let htmlContent: string | null = null;
    let foundPath = "";

    for (const cand of candidates) {
      try {
        htmlContent = await fs.readFile(cand, "utf-8");
        foundPath = cand;
        break;
      } catch {
        // continue
      }
    }

    if (!htmlContent) {
      // Fallback: try fetching from public static URL (ensures compatibility on serverless platforms)
      for (const s of targetSlugs) {
        for (const sub of ["dist/index.html", "index.html"]) {
          try {
            const staticUrl = new URL(`/templates/${s}/${sub}`, request.url);
            const res = await fetch(staticUrl.toString());
            if (res.ok) {
              htmlContent = await res.text();
              foundPath = staticUrl.pathname;
              break;
            }
          } catch {
            // continue
          }
        }
        if (htmlContent) break;
      }
    }

    if (!htmlContent) {
      // If no index.html exists, return an interactive fallback animation player
      const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slug} — Live Preview</title>
  <style>
    body {
      margin: 0;
      background: radial-gradient(circle at center, #1e0828 0%, #070913 100%);
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
      text-align: center;
    }
    .badge {
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(168, 85, 247, 0.2);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #d8b4fe;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    h1 {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      margin: 0 0 12px;
      background: linear-gradient(135deg, #f43f5e, #a855f7, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding: 0 16px;
    }
    p {
      color: #94a3b8;
      font-size: clamp(14px, 1.8vw, 17px);
      max-width: min(90%, 560px);
      line-height: 1.6;
      margin: 0 0 24px;
      padding: 0 12px;
    }
    .heart {
      font-size: 64px;
      animation: pulse 1.4s infinite ease-in-out;
      margin-bottom: 20px;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(244, 63, 94, 0.4)); }
      50% { transform: scale(1.15); filter: drop-shadow(0 0 35px rgba(244, 63, 94, 0.9)); }
    }
    .btn {
      padding: 12px 28px;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      border: none;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(168, 85, 247, 0.35);
      transition: transform 0.2s;
    }
    .btn:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="badge">Template Live Preview</div>
  <div class="heart">✨ 🎁 ✨</div>
  <h1>${recipientName}, You've Got A Surprise!</h1>
  <p>"${message}"</p>
  <p style="font-weight: bold; color: #f472b6;">— ${senderName}</p>
  <button class="btn" onclick="alert('Animation Triggered!')">Replay Animation</button>
</body>
</html>`;
      return new NextResponse(fallbackHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // In love-animation or custom templates, bypass the "port === 3000" check so standalone animation runs natively!
    let patchedHtml = htmlContent
      .replace(/window\.location\.port === ["']3000["']/g, "false")
      .replace(/window\.location\.hostname\.includes\(["']run\.app["']\)/g, "false");

    // Inject base href so scripts, styles, and assets resolve correctly
    const baseHref = foundPath.includes("dist")
      ? `/templates/${effectiveSlug}/dist/`
      : `/templates/${effectiveSlug}/`;
    const baseTag = `<base href="${baseHref}">`;
    if (patchedHtml.includes("<head>")) {
      patchedHtml = patchedHtml.replace("<head>", `<head>\n    ${baseTag}`);
    } else {
      patchedHtml = baseTag + patchedHtml;
    }

    // Dynamically inject personalized recipient/sender text into templates with hardcoded texts
    const targetEndearment = endearment || "My Everything";
    if (recipientName && recipientName !== "Sarah") {
      patchedHtml = patchedHtml.replace(
        "const heartText = 'I Love ❤️ You';",
        `const heartText = 'I Love ❤️ ' + ${JSON.stringify(recipientName)};`
      );
      patchedHtml = patchedHtml.replace(
        /For Someone<br><span>So Special<\/span>/g,
        `For ${recipientName}<br><span>${targetEndearment}</span>`
      );
    } else if (endearment) {
      patchedHtml = patchedHtml.replace(
        /For Someone<br><span>So Special<\/span>/g,
        `For Someone<br><span>${targetEndearment}</span>`
      );
    }

    if (senderName && senderName !== "Alex") {
      patchedHtml = patchedHtml.replace(
        "const heartSubText = 'Always & Forever';",
        `const heartSubText = 'Always & Forever — ' + ${JSON.stringify(senderName)};`
      );
      patchedHtml = patchedHtml.replace(
        /See What He Wants To Say/g,
        `See What ${senderName} Wants To Say`
      );
    }

    if (message && !message.startsWith("Wishing you the happiest")) {
      patchedHtml = patchedHtml.replace(
        /"Of all the love stories in the world, ours will forever be my favorite\."/g,
        JSON.stringify(message)
      );
    }

    if (question) {
      patchedHtml = patchedHtml.replace(
        /Will You Be Mine\?/g,
        question
      );
    }

    if (dodgeText) {
      patchedHtml = patchedHtml.replace(
        /Aise kaise mana kar sakti ho! 😉💖/g,
        dodgeText
      );
    }

    // Automatically trigger preview interactions
    const autoTriggerScript = `
    <script>
      (function() {
        console.log("[Live Preview Panel] Initializing template animation preview for ${effectiveSlug}...");
        window.isTemplatePreview = true;
        window.recipientName = ${JSON.stringify(recipientName)};
        window.recipientEndearment = ${JSON.stringify(endearment)};
        window.senderName = ${JSON.stringify(senderName)};
        window.customMessage = ${JSON.stringify(message)};
        window.proposalQuestion = ${JSON.stringify(question)};
        window.dodgeTooltipText = ${JSON.stringify(dodgeText)};
        window.customAudioUrl = ${JSON.stringify(audioUrl)};

        function autoLaunch() {
          var rootEl = document.getElementById("root");
          var isReactApp = rootEl && (rootEl.children.length > 0 || window.reactActive);

          // Only invoke fallback standalone canvas if React bundle is not active
          if (!isReactApp && !window._previewStarted && typeof initStandaloneApp === "function") {
            window._previewStarted = true;
            try {
              initStandaloneApp();
              console.log("[Live Preview Panel] initStandaloneApp started as fallback");
            } catch(e) {
              console.warn("[Live Preview Panel] initStandaloneApp error:", e);
            }
          }

          // Trigger start interactions
          setTimeout(function() {
            if (!isReactApp) {
              var overlay = document.getElementById("fallbackOverlay");
              if (overlay) {
                overlay.click();
              }
            }
            var playBtn = document.querySelector(".play-button, .btn-play, #playBtn");
            if (playBtn) {
              playBtn.click();
            }
          }, 300);
        }

        if (document.readyState === "complete" || document.readyState === "interactive") {
          setTimeout(autoLaunch, 250);
        } else {
          window.addEventListener("DOMContentLoaded", function() {
            setTimeout(autoLaunch, 250);
          });
        }
      })();
    </script>
    `;

    if (patchedHtml.includes("</body>")) {
      patchedHtml = patchedHtml.replace("</body>", `${autoTriggerScript}</body>`);
    } else {
      patchedHtml += autoTriggerScript;
    }

    return new NextResponse(patchedHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: unknown) {
    return new NextResponse(
      `<html><body><h3>Failed to load template preview:</h3><pre>${(err as Error)?.message}</pre></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
