import { NextResponse } from "next/server";
import {
  FunnelStep,
  FUNNEL_STEPS_ORDER,
  PerformanceMetrics,
} from "@/lib/analytics/types";
import {
  sanitizeAnalyticsPayload,
  isTrackingAllowed,
  purgeAnalyticsData,
} from "@/lib/analytics/privacy";
import {
  eventDeduplicator,
  trackFunnel,
  trackSurpriseEvent,
  trackPerformance,
} from "@/lib/analytics/tracker";
import { analyticsStore } from "@/lib/analytics/analyticsStore";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // ----------------------------------------------------
    // Test 1: Deduplication Engine
    // ----------------------------------------------------
    const dupTestKey = `api_test_dedup_${Date.now()}`;
    const firstCheck = eventDeduplicator.isDuplicate(dupTestKey);
    const secondCheck = eventDeduplicator.isDuplicate(dupTestKey);

    results.tests.deduplication = {
      name: "Event Deduplication Engine",
      firstAttemptIsDuplicate: firstCheck, // Expected: false
      secondAttemptIsDuplicate: secondCheck, // Expected: true
      passed: firstCheck === false && secondCheck === true,
    };

    // ----------------------------------------------------
    // Test 2: Zero-PII Payload Sanitization
    // ----------------------------------------------------
    const dirtyPayload = {
      templateSlug: "magic_gift",
      recipientName: "Alice Wonderland", // MUST BE STRIPPED
      senderName: "Bob The Builder", // MUST BE STRIPPED
      message: "Top secret birthday wish!", // MUST BE STRIPPED
      password: "secret_password_123", // MUST BE STRIPPED
      email: "alice@example.com", // MUST BE STRIPPED
      ip: "192.168.1.1", // MUST BE STRIPPED
      deviceCategory: "desktop", // KEPT
      stage: 3, // KEPT
    };

    const cleanPayload = sanitizeAnalyticsPayload(dirtyPayload);
    const hasPii =
      "recipientName" in cleanPayload ||
      "senderName" in cleanPayload ||
      "message" in cleanPayload ||
      "password" in cleanPayload ||
      "email" in cleanPayload ||
      "ip" in cleanPayload;

    results.tests.zero_pii_sanitization = {
      name: "Zero-PII Data Sanitization Guarantee",
      hasPiiLeaked: hasPii,
      cleanKeys: Object.keys(cleanPayload),
      passed: !hasPii && cleanPayload.templateSlug === "magic_gift" && cleanPayload.deviceCategory === "desktop",
    };

    // ----------------------------------------------------
    // Test 3: 9-Stage Product Funnel Integrity
    // ----------------------------------------------------
    const funnelStages = analyticsStore.getFunnelMetrics();
    const allNinePresent = FUNNEL_STEPS_ORDER.every((step) =>
      funnelStages.some((fs) => fs.step === step)
    );

    // Record test funnel event
    const testFunnelResult = trackFunnel("signup", { metadata: { channel: "organic_test" } });

    results.tests.product_funnel = {
      name: "9-Stage Product Funnel Progression",
      requiredStepsCount: FUNNEL_STEPS_ORDER.length,
      currentFunnelStepsCount: funnelStages.length,
      allNinePresent,
      testEventTracked: testFunnelResult.tracked,
      passed: allNinePresent && testFunnelResult.tracked,
    };

    // ----------------------------------------------------
    // Test 4: Template Analytics Breakdown (All 8 Templates)
    // ----------------------------------------------------
    const templateMetrics = analyticsStore.getTemplateMetrics();
    const expectedSlugs = [
      "magic_gift",
      "cake_reveal",
      "balloon_room",
      "mystery_door",
      "memory_journey",
      "confetti_blast",
      "rainbow_surprise",
      "cute_character",
    ];
    const allEightTemplatesPresent = expectedSlugs.every((slug) =>
      templateMetrics.some((tpl) => tpl.slug === slug)
    );

    // Test incrementing a template metric
    const initialMagicViews = templateMetrics.find((t) => t.slug === "magic_gift")?.views || 0;
    analyticsStore.recordTemplateInteraction("magic_gift", "view");
    const updatedMagicViews =
      analyticsStore.getTemplateMetrics().find((t) => t.slug === "magic_gift")?.views || 0;

    results.tests.template_analytics = {
      name: "8-Template Operational Telemetry",
      templateCount: templateMetrics.length,
      allEightTemplatesPresent,
      viewsIncremented: updatedMagicViews === initialMagicViews + 1,
      passed: allEightTemplatesPresent && updatedMagicViews === initialMagicViews + 1,
    };

    // ----------------------------------------------------
    // Test 5: Technical Performance & Device Category Telemetry
    // ----------------------------------------------------
    const perfResult = trackPerformance({
      loadTimeMs: 450,
      renderFps: 60,
      webGlAvailable: true,
    });

    const perfMetrics = analyticsStore.getPerformanceMetrics();

    results.tests.performance_telemetry = {
      name: "Technical Latency & Device Category Telemetry",
      tracked: perfResult.tracked,
      desktopShare: perfMetrics.deviceShare.desktop,
      averageLoadTimeMs: perfMetrics.averageLoadTimeMs,
      passed: perfResult.tracked && perfMetrics.deviceShare.desktop > 0,
    };

    // ----------------------------------------------------
    // Test 6: Platform Growth Telemetry (DAU, WAU, MAU, Abandonment)
    // ----------------------------------------------------
    const platformGrowth = analyticsStore.getPlatformMetrics();
    const growthValid =
      platformGrowth.dau > 0 &&
      platformGrowth.wau > 0 &&
      platformGrowth.mau > 0 &&
      platformGrowth.editorAbandonmentRate > 0 &&
      platformGrowth.completionRate > 0;

    results.tests.growth_kpis = {
      name: "Platform Growth KPIs (DAU / WAU / MAU / Abandonment)",
      dau: platformGrowth.dau,
      wau: platformGrowth.wau,
      mau: platformGrowth.mau,
      editorAbandonmentRate: platformGrowth.editorAbandonmentRate,
      completionRate: platformGrowth.completionRate,
      passed: growthValid,
    };

    // ----------------------------------------------------
    // Summary
    // ----------------------------------------------------
    const allPassed = Object.values(results.tests).every((t: any) => t.passed === true);
    results.allPassed = allPassed;

    return NextResponse.json(results, { status: allPassed ? 200 : 500 });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        stack: err.stack,
        allPassed: false,
      },
      { status: 500 }
    );
  }
}
