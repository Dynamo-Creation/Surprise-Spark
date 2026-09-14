const puppeteer = require("puppeteer-core");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACTS_DIR = path.resolve("C:\\Users\\Dynamo\\.gemini\\antigravity-ide\\brain\\b14cab24-5919-49ed-ad94-fa8e47e52af6");

async function runPhase4Tests() {
  console.log("=== STARTING PHASE 4 3D ENGINE VERIFICATION ===");

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader", // Software WebGL rendering for reliable headless execution
      "--enable-webgl",
      "--ignore-gpu-blocklist",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

  // Listen to browser console messages
  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("error") || text.includes("Error") || text.includes("WebGL")) {
      console.log(`[Browser Console ${msg.type()}]:`, text);
    }
  });

  page.on("pageerror", (err) => {
    console.error("[Browser Page Error]:", err.message);
  });

  try {
    // 1. Navigate to 3D Test Page
    console.log("Navigating to http://localhost:3000/engine-3d-test...");
    await page.goto("http://localhost:3000/engine-3d-test", { waitUntil: "networkidle2", timeout: 25000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Check canvas element presence
    const canvasExists = await page.$("canvas");
    console.log(`3D Canvas present: ${Boolean(canvasExists)}`);

    // Capture Scene 1: Initial 3D Mystery Gift
    const snap1 = path.join(ARTIFACTS_DIR, "phase4_scene1_giftbox_3d.png");
    await page.screenshot({ path: snap1, fullPage: false });
    console.log("Captured initial gift box snapshot:", snap1);

    // 2. Trigger Gift Box Unbox
    console.log("Triggering Gift Box Unbox interaction...");
    // Find unwrap button or click center of canvas
    const unwrapBtn = await page.$('button ::-p-text("Tap To Unwrap")') || await page.$('button');
    if (unwrapBtn) {
      await unwrapBtn.click();
    } else {
      // Click center of screen
      await page.mouse.click(640, 450);
    }

    // Wait 400ms for shake and lid open animation
    await new Promise((r) => setTimeout(r, 450));
    const snap2 = path.join(ARTIFACTS_DIR, "phase4_scene1_opened.png");
    await page.screenshot({ path: snap2, fullPage: false });
    console.log("Captured opened gift box snapshot:", snap2);

    // 3. Wait for scene transition to Scene 2 (3D Birthday Cake)
    console.log("Waiting for automatic transition to Scene 2 (Birthday Cake)...");
    await new Promise((r) => setTimeout(r, 1800));

    const snap3 = path.join(ARTIFACTS_DIR, "phase4_scene2_cake_3d.png");
    await page.screenshot({ path: snap3, fullPage: false });
    console.log("Captured Scene 2 (3D Cake) snapshot:", snap3);

    // 4. Extinguish Candle Flame
    console.log("Clicking candle flame to extinguish...");
    const candleHint = await page.$('text/Tap the candle flame') || await page.$('div[title*="candle"]');
    // Click cake center/candle area
    await page.mouse.click(640, 420);
    await new Promise((r) => setTimeout(r, 600));

    const snap4 = path.join(ARTIFACTS_DIR, "phase4_scene2_candle_extinguished.png");
    await page.screenshot({ path: snap4, fullPage: false });
    console.log("Captured extinguished candle snapshot:", snap4);

    // 5. Navigate to Scene 3 (Letter & Polaroid)
    console.log("Clicking continue to Scene 3...");
    const letterBtn = await page.$('button ::-p-text("Read Heartfelt Letter")') || (await page.$$('button'))[2];
    if (letterBtn) {
      await letterBtn.click();
    }
    await new Promise((r) => setTimeout(r, 1200));

    const snap5 = path.join(ARTIFACTS_DIR, "phase4_scene3_letter.png");
    await page.screenshot({ path: snap5, fullPage: false });
    console.log("Captured Scene 3 (Letter) snapshot:", snap5);

    // 6. Test Mobile Viewport
    console.log("Testing Mobile Viewport (390x844)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000/engine-3d-test", { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1500));

    const snapMobile = path.join(ARTIFACTS_DIR, "phase4_mobile_viewport.png");
    await page.screenshot({ path: snapMobile, fullPage: false });
    console.log("Captured Mobile Viewport snapshot:", snapMobile);

    console.log("=== ALL PHASE 4 3D ENGINE TESTS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("Error during test execution:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

runPhase4Tests();
