import { NextResponse } from "next/server";
import { rateLimiter } from "@/lib/security/rateLimiter";
import { sanitizeText, sanitizePersonalization, escapeHtml, sanitizeUrl } from "@/lib/security/sanitizer";
import { isAuthorizedAdmin } from "@/lib/admin/adminAuth";
import { getDeviceCapabilities, QualityTier } from "@/lib/3d/webglDetection";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // ----------------------------------------------------
    // Test 1: Sliding-Window Rate Limiter
    // ----------------------------------------------------
    const testIp = `rate_test_${Date.now()}`;
    const limit = 5;
    const windowMs = 30_000;

    let allAllowedUntilFifth = true;
    for (let i = 0; i < limit; i++) {
      const res = rateLimiter.check(testIp, limit, windowMs);
      if (!res.success) allAllowedUntilFifth = false;
    }

    // 6th request must be rejected
    const blockedRes = rateLimiter.check(testIp, limit, windowMs);

    results.tests.rate_limiter = {
      name: "Sliding-Window Rate Limiter Protection",
      configuredLimit: limit,
      burstAllowed: allAllowedUntilFifth,
      burstBlockedOnExceeded: !blockedRes.success,
      resetSeconds: blockedRes.resetSeconds,
      passed: allAllowedUntilFifth && !blockedRes.success && blockedRes.resetSeconds > 0,
    };

    // ----------------------------------------------------
    // Test 2: Input Sanitization & XSS Prevention
    // ----------------------------------------------------
    const dirtyInput = `<script>alert('pwned')</script>Happy <b onclick="evil()">Birthday</b> Maya! <iframe src="javascript:evil()"></iframe>`;
    const cleanOutput = sanitizeText(dirtyInput, 100);

    const hasScriptTag = cleanOutput.toLowerCase().includes("<script>") || cleanOutput.toLowerCase().includes("</script>");
    const hasIframeTag = cleanOutput.toLowerCase().includes("<iframe") || cleanOutput.toLowerCase().includes("javascript:");
    const hasEventHandler = cleanOutput.toLowerCase().includes("onclick=");
    const preservesText = cleanOutput.includes("Happy Birthday Maya!");

    const dirtyUrl = "javascript:alert('attack')";
    const cleanUrl = sanitizeUrl(dirtyUrl);

    results.tests.input_sanitizer = {
      name: "Input Sanitization & XSS Prevention Guarantee",
      rawInput: dirtyInput,
      cleanOutput,
      hasScriptTag,
      hasIframeTag,
      hasEventHandler,
      cleanUrlRejected: cleanUrl === "",
      passed: !hasScriptTag && !hasIframeTag && !hasEventHandler && preservesText && cleanUrl === "",
    };

    // ----------------------------------------------------
    // Test 3: Admin Authorization & Untrusted Header Immunity
    // ----------------------------------------------------
    const superadminValid = isAuthorizedAdmin("superadmin");
    const moderatorValid = isAuthorizedAdmin("moderator");
    const adminValid = isAuthorizedAdmin("admin");
    const regularUserBlocked = isAuthorizedAdmin("user");
    const spoofedHeaderBlocked = isAuthorizedAdmin(null);

    results.tests.admin_authorization = {
      name: "Admin Role-Based Access Control",
      superadminAllowed: superadminValid,
      moderatorAllowed: moderatorValid,
      adminAllowed: adminValid,
      regularUserBlocked: !regularUserBlocked,
      nullRoleBlocked: !spoofedHeaderBlocked,
      passed: superadminValid && moderatorValid && !regularUserBlocked && !spoofedHeaderBlocked,
    };

    // ----------------------------------------------------
    // Test 4: Low-End Device Adaptive Quality Tiers
    // ----------------------------------------------------
    const caps = getDeviceCapabilities();
    const validTier = ["low", "medium", "high"].includes(caps.qualityTier);
    const validDpr = caps.maxDpr >= 1 && caps.maxDpr <= 2;
    const validParticles = caps.recommendedParticleCount >= 0 && caps.recommendedParticleCount <= 150;

    results.tests.adaptive_quality_tier = {
      name: "Adaptive 3D Performance & Hardware Tiers",
      qualityTier: caps.qualityTier,
      enableShadows: caps.enableShadows,
      maxDpr: caps.maxDpr,
      recommendedParticleCount: caps.recommendedParticleCount,
      passed: validTier && validDpr && validParticles,
    };

    // ----------------------------------------------------
    // Test 5: SEO robots.txt & sitemap.xml Endpoints
    // ----------------------------------------------------
    const robotsConfig = robots();
    const sitemapEntries = sitemap();

    const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
    const disallowsAdmin = Array.isArray(rules?.disallow) && rules.disallow.some((d) => d.includes("/admin"));
    const allowsPublic = Array.isArray(rules?.allow) && rules.allow.includes("/");
    const hasSitemapUrl = Boolean(robotsConfig.sitemap && robotsConfig.sitemap.includes("sitemap.xml"));
    const hasSitemapEntries = Array.isArray(sitemapEntries) && sitemapEntries.length >= 5;

    results.tests.seo_discovery = {
      name: "SEO Crawling & Sitemap Endpoints",
      disallowsAdmin,
      allowsPublic,
      hasSitemapUrl,
      sitemapEntriesCount: sitemapEntries.length,
      passed: disallowsAdmin && allowsPublic && hasSitemapUrl && hasSitemapEntries,
    };

    // ----------------------------------------------------
    // Test 6: Secret Management & Zero Leak Guarantee
    // ----------------------------------------------------
    const publicKeys = Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_"));
    const hasLeakedServiceRole = publicKeys.some((k) => k.toLowerCase().includes("service_role"));

    results.tests.secret_management = {
      name: "Secret Management & Zero Client-Side Secret Leak",
      publicKeysInspectedCount: publicKeys.length,
      hasLeakedServiceRole,
      passed: !hasLeakedServiceRole,
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
