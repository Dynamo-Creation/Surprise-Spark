import { NextResponse } from "next/server";
import { templateRegistry } from "@/lib/engine/templateRegistry";
import { ALL_BIRTHDAY_TEMPLATES } from "@/lib/engine/templates";
import { resolveVariables } from "@/lib/engine/variableResolver";
import { THEMES, THEME_LIST } from "@/lib/engine/themes";
import { MUSIC_CATEGORIES, MUSIC_TRACKS } from "@/lib/engine/musicCatalog";
import { rateLimiter } from "@/lib/security/rateLimiter";
import { sanitizeText, sanitizeUrl, sanitizePersonalization } from "@/lib/security/sanitizer";
import { isAuthorizedAdmin } from "@/lib/admin/adminAuth";
import { sanitizeAnalyticsPayload } from "@/lib/analytics/privacy";
import { FUNNEL_STEPS_ORDER } from "@/lib/analytics/types";
import { getDeviceCapabilities } from "@/lib/3d/webglDetection";
import { SurpriseModel } from "@/lib/engine/types";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    phase: "Phase 13: Final Pre-Launch Verification",
    tests: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
    },
  };

  function recordTest(key: string, name: string, passed: boolean, details: Record<string, any>) {
    results.summary.total++;
    if (passed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
    results.tests[key] = {
      name,
      passed,
      ...details,
    };
  }

  try {
    // ----------------------------------------------------
    // Test 1: All 8 Birthday Templates Integrity & Registry
    // ----------------------------------------------------
    const expectedSlugs = [
      "magic-gift",
      "birthday-cake-reveal",
      "balloon-room",
      "mystery-door",
      "memory-journey",
      "confetti-blast",
      "rainbow-surprise",
      "cute-character",
    ];

    const registryTemplates = expectedSlugs.map((slug) => ({
      slug,
      template: templateRegistry.getTemplate(slug),
    }));

    const allSlugsRegistered = registryTemplates.every(
      (item) => item.template !== undefined && item.template.slug === item.slug
    );

    const allScenesValid = registryTemplates.every((item) => {
      const tpl = item.template;
      if (!tpl || !tpl.versions || tpl.versions.length === 0) return false;
      const ver = tpl.versions[0];
      return ver.scenes.length >= 7 && ver.scenes.every((sc) => sc.id && sc.name && sc.order >= 1);
    });

    recordTest("birthday_templates", "All 8 Signature Birthday Templates Registered", allSlugsRegistered && allScenesValid, {
      expectedCount: expectedSlugs.length,
      actualCount: registryTemplates.filter((i) => i.template !== undefined).length,
      slugs: expectedSlugs,
      allScenesValid,
    });

    // ----------------------------------------------------
    // Test 2: Personalization Variable Resolver
    // ----------------------------------------------------
    const testContext = {
      recipient_name: "Maya Lin",
      sender_name: "Alex Rivera",
      message: "Happy 25th Birthday! Wishing you a brilliant adventure ahead.",
      special_date: "2026-09-14",
      photo_1: "https://example.com/photo1.jpg",
    };

    const resolvedTitle = resolveVariables("A special gift for {{recipient_name}}!", testContext);
    const resolvedSender = resolveVariables("From: {{sender_name}}", testContext);
    const resolvedMessage = resolveVariables("Note: {{message}}", testContext);
    const unresolvedGraceful = resolveVariables("Tag: {{unmatched_key}}", testContext);

    const personalizationValid =
      resolvedTitle === "A special gift for Maya Lin!" &&
      resolvedSender === "From: Alex Rivera" &&
      resolvedMessage === "Note: Happy 25th Birthday! Wishing you a brilliant adventure ahead." &&
      unresolvedGraceful === "Tag: {{unmatched_key}}";

    recordTest("personalization_engine", "Dynamic Variable Resolver & Content Injection", personalizationValid, {
      resolvedTitle,
      resolvedSender,
      resolvedMessage,
      unresolvedGraceful,
    });

    // ----------------------------------------------------
    // Test 3: Curated Visual Themes & Procedural Music Presets
    // ----------------------------------------------------
    const expectedThemes = ["candy", "pastel", "rainbow", "magical", "party", "galaxy"];
    const allThemesPresent = expectedThemes.every((id) => (THEMES as Record<string, any>)[id] !== undefined);

    const themeColorsValid = THEME_LIST.every(
      (theme) =>
        theme.name &&
        theme.colorSwatch &&
        theme.colorSwatch.length >= 2 &&
        theme.backgroundGradient &&
        theme.accentColor &&
        theme.lighting?.ambientColor &&
        theme.lighting?.directionalColor
    );

    const expectedMusicTracks = [
      "track-happy-sunshine",
      "track-happy-birthday-hop",
      "track-sweet-musicbox",
      "track-sweet-acoustic",
      "track-magic-stardust",
      "track-party-confetti",
      "track-emotional-memories",
    ];

    const allMusicTracksPresent = expectedMusicTracks.every((id) =>
      MUSIC_TRACKS.some((t) => t.id === id)
    );

    recordTest("themes_and_music", "5 Curated Color Themes & 7 Procedural Music Catalog", allThemesPresent && themeColorsValid && allMusicTracksPresent, {
      allThemesPresent,
      themeColorsValid,
      allMusicTracksPresent,
      themesCount: THEME_LIST.length,
      musicTracksCount: MUSIC_TRACKS.length,
      musicCategoriesCount: MUSIC_CATEGORIES.length,
    });

    // ----------------------------------------------------
    // Test 4: Security Sanitization & XSS Defense
    // ----------------------------------------------------
    const maliciousScript = "<script>alert('xss')</script>Celebrate <img src=x onerror=alert(1)> Maya!";
    const cleanedScript = sanitizeText(maliciousScript, 100);

    const hasNoScript = !cleanedScript.toLowerCase().includes("<script>") && !cleanedScript.toLowerCase().includes("</script>");
    const hasNoOnError = !cleanedScript.toLowerCase().includes("onerror=");
    const preservesLegitText = cleanedScript.includes("Celebrate") && cleanedScript.includes("Maya!");

    const dangerousUrl = "javascript:alert(document.cookie)";
    const cleanedUrl = sanitizeUrl(dangerousUrl);

    recordTest("security_sanitizer", "Cross-Site Scripting (XSS) & URL Protocol Protection", hasNoScript && hasNoOnError && preservesLegitText && cleanedUrl === "", {
      input: maliciousScript,
      cleanedText: cleanedScript,
      cleanedUrlBlocked: cleanedUrl === "",
    });

    // ----------------------------------------------------
    // Test 5: Sliding-Window Rate Limiting Engine
    // ----------------------------------------------------
    const rateKey = `rate_check_${Date.now()}`;
    const limit = 4;
    const windowMs = 60_000;

    let burstAllowed = true;
    for (let i = 0; i < limit; i++) {
      const res = rateLimiter.check(rateKey, limit, windowMs);
      if (!res.success) burstAllowed = false;
    }

    const exceededRes = rateLimiter.check(rateKey, limit, windowMs);
    const rateLimitWorking = burstAllowed && !exceededRes.success && exceededRes.resetSeconds > 0;

    recordTest("rate_limiting", "Sliding-Window Rate Limiter Protection", rateLimitWorking, {
      configuredLimit: limit,
      burstAllowed,
      exceededBlocked: !exceededRes.success,
      resetSeconds: exceededRes.resetSeconds,
    });

    // ----------------------------------------------------
    // Test 6: Admin Role-Based Access Control (RBAC)
    // ----------------------------------------------------
    const superadminOk = isAuthorizedAdmin("superadmin");
    const adminOk = isAuthorizedAdmin("admin");
    const tmOk = isAuthorizedAdmin("template_manager");
    const modOk = isAuthorizedAdmin("moderator");
    const normalUserBlocked = !isAuthorizedAdmin("user");
    const emptyBlocked = !isAuthorizedAdmin(null);
    const hackerRoleBlocked = !isAuthorizedAdmin("admin' OR '1'='1");

    const rbacValid =
      superadminOk &&
      adminOk &&
      tmOk &&
      modOk &&
      normalUserBlocked &&
      emptyBlocked &&
      hackerRoleBlocked;

    recordTest("admin_authorization", "Role-Based Access Control (RBAC) Integrity", rbacValid, {
      superadminOk,
      adminOk,
      tmOk,
      modOk,
      normalUserBlocked,
      emptyBlocked,
      hackerRoleBlocked,
    });

    // ----------------------------------------------------
    // Test 7: Zero-PII Analytics Guarantee
    // ----------------------------------------------------
    const rawPayload = {
      templateSlug: "birthday-cake-reveal",
      recipientName: "Maya Lin", // PII
      senderName: "Alex Rivera", // PII
      message: "Secret personal love letter", // PII
      email: "user@example.com", // PII
      password: "mySecretPassword123", // PII
      ip: "203.0.113.195", // PII
      deviceCategory: "mobile", // Non-PII
      stage: 5, // Non-PII
    };

    const cleanPayload = sanitizeAnalyticsPayload(rawPayload);
    const hasLeakedPii =
      "recipientName" in cleanPayload ||
      "senderName" in cleanPayload ||
      "message" in cleanPayload ||
      "email" in cleanPayload ||
      "password" in cleanPayload ||
      "ip" in cleanPayload;

    const zeroPiiGuaranteed = !hasLeakedPii && cleanPayload.templateSlug === "birthday-cake-reveal" && cleanPayload.deviceCategory === "mobile";

    recordTest("zero_pii_analytics", "Zero-PII Analytics Privacy Guarantee", zeroPiiGuaranteed, {
      piiStripped: !hasLeakedPii,
      cleanKeys: Object.keys(cleanPayload),
      funnelStepsCount: FUNNEL_STEPS_ORDER.length,
    });

    // ----------------------------------------------------
    // Test 8: 3D Hardware Capabilities & Adaptive Quality Tiers
    // ----------------------------------------------------
    const caps = getDeviceCapabilities();
    const hardwareValid =
      ["low", "medium", "high"].includes(caps.qualityTier) &&
      caps.maxDpr >= 1 &&
      caps.maxDpr <= 2 &&
      caps.recommendedParticleCount >= 0 &&
      caps.recommendedParticleCount <= 200;

    recordTest("hardware_adaptability", "Adaptive 3D Hardware Tiers & Performance Bounds", hardwareValid, {
      qualityTier: caps.qualityTier,
      maxDpr: caps.maxDpr,
      enableShadows: caps.enableShadows,
      recommendedParticleCount: caps.recommendedParticleCount,
    });

    // ----------------------------------------------------
    // Test 9: End-to-End Surprise Resolution Simulation
    // ----------------------------------------------------
    const testSurprise: SurpriseModel = {
      id: "exp-test-phase13",
      publicId: "sp-prelaunch-test",
      creatorId: "user-test",
      templateId: "tpl-birthday-cake",
      templateVersionId: "ver-birthday-cake-1-0-0",
      recipientName: "Maya",
      senderName: "Alex",
      message: "Happy Birthday from Phase 13 verification!",
      specialDate: "2026-09-14",
      photos: ["https://example.com/p1.jpg", "https://example.com/p2.jpg"],
      status: "published",
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    const resolved = templateRegistry.resolveSurpriseExperience(testSurprise);
    const resolutionValid =
      resolved.template.slug === "birthday-cake-reveal" &&
      resolved.version.id === "ver-birthday-cake-1-0-0" &&
      resolved.scenes.length >= 7;

    recordTest("surprise_resolution", "End-to-End Immutability & Scene Sequencing", resolutionValid, {
      resolvedTemplateSlug: resolved.template.slug,
      resolvedVersionId: resolved.version.id,
      resolvedSceneCount: resolved.scenes.length,
    });

  } catch (error: any) {
    results.error = error.message;
    results.summary.failed++;
  }

  const allPassed = results.summary.failed === 0 && results.summary.passed >= 9;
  return NextResponse.json(results, { status: allPassed ? 200 : 500 });
}
