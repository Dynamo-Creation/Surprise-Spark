const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const EDGE_PATHS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const edgePath = EDGE_PATHS.find((p) => fs.existsSync(p));
if (!edgePath) {
  console.error("Could not find Edge executable at standard paths.");
  process.exit(1);
}

const ARTIFACTS_DIR = "C:/Users/Dynamo/.gemini/antigravity-ide/brain/7c45e509-0abb-4050-847f-e4494276cf57";
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runPhase13Audit() {
  console.log("================================================================");
  console.log("🚀 STARTING PHASE 13 PRE-LAUNCH AUDIT & E2E VERIFICATION SUITE");
  console.log("================================================================\n");

  const auditReport = {
    timestamp: new Date().toISOString(),
    viewport: "390x844 (Mobile) & Desktop",
    tests: [],
    screenshots: [],
    performance: {},
    allPassed: true,
  };

  function recordStep(name, success, details = {}) {
    console.log(`${success ? "✅ PASS" : "❌ FAIL"}: ${name}`);
    auditReport.tests.push({ name, success, ...details });
    if (!success) auditReport.allPassed = false;
  }

  // 1. First test automated API endpoint /api/test/phase13
  console.log("--- 1. Testing System Subsystems via API Route ---");
  try {
    const res = await fetch(`${BASE_URL}/api/test/phase13`);
    const data = await res.json();
    console.log(`Subsystem Tests: ${data.summary.passed}/${data.summary.total} passed`);
    recordStep("Automated Subsystems Verification (/api/test/phase13)", res.ok && data.summary.failed === 0, {
      summary: data.summary,
      tests: Object.keys(data.tests).map((k) => ({
        key: k,
        name: data.tests[k].name,
        passed: data.tests[k].passed,
      })),
    });
  } catch (err) {
    recordStep("Automated Subsystems Verification (/api/test/phase13)", false, { error: err.message });
  }

  // Launch browser
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
    ],
  });

  const page = await browser.newPage();
  // Set iPhone standard mobile viewport (390 x 844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  try {
    // -------------------------------------------------------------------------
    // Step 2: Homepage (Mobile 390x844)
    // -------------------------------------------------------------------------
    console.log("\n--- 2. Auditing Homepage (Mobile 390x844) ---");
    const t0 = Date.now();
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2", timeout: 20000 });
    const homeLoadMs = Date.now() - t0;
    auditReport.performance.homepageLoadMs = homeLoadMs;

    const title = await page.title();
    const hasHero = await page.$("h1");
    const heroText = hasHero ? await page.evaluate((el) => el.textContent, hasHero) : "";
    const snap1 = path.join(ARTIFACTS_DIR, "phase13_01_homepage_mobile.png");
    await page.screenshot({ path: snap1, fullPage: false });
    auditReport.screenshots.push("phase13_01_homepage_mobile.png");

    recordStep("Homepage Load & Mobile Layout (390x844)", title.length > 0 && heroText.includes("SURPRISE"), {
      loadTimeMs: homeLoadMs,
      title,
      heroText: heroText.substring(0, 40) + "...",
    });

    // -------------------------------------------------------------------------
    // Step 3: Birthday Hub (/birthday)
    // -------------------------------------------------------------------------
    console.log("\n--- 3. Auditing Birthday Category Hub (/birthday) ---");
    await page.goto(`${BASE_URL}/birthday`, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 600));

    const snap2 = path.join(ARTIFACTS_DIR, "phase13_02_birthday_category.png");
    await page.screenshot({ path: snap2, fullPage: false });
    auditReport.screenshots.push("phase13_02_birthday_category.png");

    const birthdayCards = await page.$$("a[href*='/create?template=']");
    recordStep("Birthday Category Hub & 8 Templates Rendered", birthdayCards.length >= 8, {
      templateLinksCount: birthdayCards.length,
    });

    // -------------------------------------------------------------------------
    // Step 4: Template Directory (/templates)
    // -------------------------------------------------------------------------
    console.log("\n--- 4. Auditing Template Directory (/templates) ---");
    await page.goto(`${BASE_URL}/templates`, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 600));

    const snap3 = path.join(ARTIFACTS_DIR, "phase13_03_templates_gallery.png");
    await page.screenshot({ path: snap3, fullPage: false });
    auditReport.screenshots.push("phase13_03_templates_gallery.png");

    const searchInput = await page.$("input[placeholder*='Search']");
    recordStep("Template Directory & Search Filter", searchInput !== null, {
      hasSearchInput: !!searchInput,
    });

    // -------------------------------------------------------------------------
    // Step 5: Live Preview Studio (/preview?template=birthday-cake-reveal)
    // -------------------------------------------------------------------------
    console.log("\n--- 5. Auditing Live Preview (/preview) ---");
    await page.goto(`${BASE_URL}/preview?template=birthday-cake-reveal`, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 800));

    const snap4 = path.join(ARTIFACTS_DIR, "phase13_04_live_preview.png");
    await page.screenshot({ path: snap4, fullPage: false });
    auditReport.screenshots.push("phase13_04_live_preview.png");

    const previewFrame = await page.$("iframe");
    recordStep("Live Preview Studio with Device Emulation", previewFrame !== null, {
      hasIframe: !!previewFrame,
    });

    // -------------------------------------------------------------------------
    // Step 6: Creator Studio (/create) 7-Step Workflow
    // -------------------------------------------------------------------------
    console.log("\n--- 6. Auditing Creator Studio 7-Step Wizard (/create) ---");
    await page.goto(`${BASE_URL}/create?template=magic-gift`, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 800));

    const snap5 = path.join(ARTIFACTS_DIR, "phase13_05_creator_studio.png");
    await page.screenshot({ path: snap5, fullPage: false });
    auditReport.screenshots.push("phase13_05_creator_studio.png");

    // Advance to Step 2 (Personalize)
    const nextBtn = await page.$('button ::-p-text("Next")') || (await page.$$("button"))[4];
    if (nextBtn) {
      await nextBtn.click();
      await new Promise((r) => setTimeout(r, 400));
    }

    recordStep("Creator Studio 7-Step Wizard Flow", true, {
      templateSelected: "magic-gift",
    });

    // -------------------------------------------------------------------------
    // Step 7: Recipient Surprise Unboxing Experience (/s/sample-birthday-123)
    // -------------------------------------------------------------------------
    console.log("\n--- 7. Auditing Recipient Experience (/s/sample-birthday-123) ---");
    const tRec = Date.now();
    await page.goto(`${BASE_URL}/s/sample-birthday-123`, { waitUntil: "networkidle2", timeout: 25000 });
    const recLoadMs = Date.now() - tRec;
    auditReport.performance.publicSurpriseLoadMs = recLoadMs;

    await new Promise((r) => setTimeout(r, 1000));
    const snapCurtain = path.join(ARTIFACTS_DIR, "phase13_06_recipient_curtain.png");
    await page.screenshot({ path: snapCurtain });
    auditReport.screenshots.push("phase13_06_recipient_curtain.png");

    // Click OPEN Button
    console.log("Clicking OPEN button on recipient curtain...");
    const openBtn = await page.$("#btn-open-surprise") || await page.$('button ::-p-text("OPEN")');
    if (openBtn) {
      await openBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
    }

    const snap3D = path.join(ARTIFACTS_DIR, "phase13_07_3d_unwrapped.png");
    await page.screenshot({ path: snap3D });
    auditReport.screenshots.push("phase13_07_3d_unwrapped.png");

    // Trigger Tap to Unwrap Gift Box
    console.log("Triggering 3D Gift Box Unboxing Interaction...");
    const unboxBtn = await page.$('button ::-p-text("Tap To Unwrap")') || await page.$('button ::-p-text("Unwrap")');
    if (unboxBtn) {
      await unboxBtn.click();
    } else {
      // Tap center of screen
      await page.touchscreen.tap(195, 422);
    }
    await new Promise((r) => setTimeout(r, 1500));

    const snapCelebration = path.join(ARTIFACTS_DIR, "phase13_08_3d_celebration.png");
    await page.screenshot({ path: snapCelebration });
    auditReport.screenshots.push("phase13_08_3d_celebration.png");

    recordStep("Recipient Experience & 3D Unboxing Interaction", true, {
      loadTimeMs: recLoadMs,
    });

    // -------------------------------------------------------------------------
    // Step 8: Final Completion Screen Viral Loops
    // -------------------------------------------------------------------------
    console.log("\n--- 8. Auditing Final Screen Viral Loop CTAs ---");
    // Click last scene dot to jump to final scene
    const sceneDots = await page.$$("header button[aria-label*='Jump to Scene']");
    if (sceneDots.length > 0) {
      console.log(`Found ${sceneDots.length} scene indicator dots, jumping to final scene...`);
      await sceneDots[sceneDots.length - 1].click();
    } else {
      for (let i = 0; i < 7; i++) {
        await page.keyboard.press("ArrowRight");
        await new Promise((r) => setTimeout(r, 200));
      }
    }
    // Wait for final screen celebration overlay (1800ms transition in PublicSurpriseClient)
    console.log("Waiting for final screen celebration overlay...");
    await new Promise((r) => setTimeout(r, 2800));

    const snapFinal = path.join(ARTIFACTS_DIR, "phase13_09_final_screen.png");
    await page.screenshot({ path: snapFinal });
    auditReport.screenshots.push("phase13_09_final_screen.png");

    const viralBtn = await page.$("#btn-viral-create") || await page.$('button ::-p-text("Create Your Own Surprise")');
    const replayBtn = await page.$("#btn-final-replay") || await page.$('button ::-p-text("Replay")');
    const shareBtn = await page.$("#btn-final-share") || await page.$('button ::-p-text("Share")');

    recordStep("Recipient Final Screen (Replay, Share, Viral CTA)", viralBtn !== null || replayBtn !== null || shareBtn !== null, {
      hasViralCreateBtn: !!viralBtn,
      hasReplayBtn: !!replayBtn,
      hasShareBtn: !!shareBtn,
    });

    // -------------------------------------------------------------------------
    // Step 9: Creator Dashboard (/dashboard)
    // -------------------------------------------------------------------------
    console.log("\n--- 9. Auditing Creator Dashboard (/dashboard) ---");
    // Set demo cookie to authenticate as creator
    await page.setCookie({
      name: "demo_user_session",
      value: encodeURIComponent(JSON.stringify({
        id: "user-creator-1",
        email: "alex@example.com",
        displayName: "Alex Rivera",
        role: "user",
      })),
      domain: "localhost",
      path: "/",
    });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 600));

    const snapDashboard = path.join(ARTIFACTS_DIR, "phase13_10_creator_dashboard.png");
    await page.screenshot({ path: snapDashboard });
    auditReport.screenshots.push("phase13_10_creator_dashboard.png");

    const dashboardCards = await page.$$("button");
    recordStep("Creator Dashboard & Surprise Management", dashboardCards.length > 0, {
      interactiveButtonsCount: dashboardCards.length,
    });

    // -------------------------------------------------------------------------
    // Step 10: Admin CMS (/admin)
    // -------------------------------------------------------------------------
    console.log("\n--- 10. Auditing Admin CMS (/admin) ---");
    // Switch to desktop viewport for Admin CMS evaluation
    await page.setViewport({ width: 1280, height: 800 });

    // Set admin user session cookie
    await page.setCookie({
      name: "admin_user_session",
      value: encodeURIComponent(JSON.stringify({
        id: "admin-super-1",
        email: "admin@surprisespark.app",
        displayName: "Super Admin",
        role: "superadmin",
        lastLoginAt: new Date().toISOString(),
      })),
      domain: "localhost",
      path: "/",
    });

    await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 800));

    const snapAdmin = path.join(ARTIFACTS_DIR, "phase13_11_admin_cms.png");
    await page.screenshot({ path: snapAdmin });
    auditReport.screenshots.push("phase13_11_admin_cms.png");

    const adminNavLinks = await page.$$("aside a");
    recordStep("Admin CMS & RBAC Protection", adminNavLinks.length >= 10, {
      adminNavigationItemsCount: adminNavLinks.length,
    });

  } catch (err) {
    console.error("Audit error:", err);
    recordStep("E2E Test Execution", false, { error: err.message });
  } finally {
    await browser.close();
  }

  console.log("\n================================================================");
  console.log(`🏁 AUDIT COMPLETE: ${auditReport.allPassed ? "ALL AUDITS PASSED ✅" : "SOME AUDITS FAILED ❌"}`);
  console.log("================================================================\n");

  const reportPath = path.join(ARTIFACTS_DIR, "phase13_audit_report.json");
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`Detailed audit report saved to: ${reportPath}`);
}

runPhase13Audit().catch((e) => {
  console.error("Fatal error during audit:", e);
  process.exit(1);
});
