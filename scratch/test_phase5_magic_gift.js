const puppeteer = require("puppeteer-core");
const path = require("path");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACTS_DIR = "C:/Users/Dynamo/.gemini/antigravity-ide/brain/b14cab24-5919-49ed-ad94-fa8e47e52af6";

async function runPhase5Tests() {
  console.log("=== STARTING PHASE 5 MAGIC GIFT 7-SCENE TEST SUITE ===");

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
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
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

  page.on("pageerror", (err) => console.error("[PageError]:", err.message));

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Full 7-Scene Progression on Public URL /s/sample-birthday-123
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 1: 7-Scene Progression on /s/sample-birthday-123 ---");
    await page.goto("http://localhost:3000/s/sample-birthday-123", {
      waitUntil: "networkidle2",
      timeout: 25000,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Scene 1: Introduction
    console.log("Checking Scene 1 (Introduction)...");
    const snap1 = path.join(ARTIFACTS_DIR, "phase5_scene1_intro.png");
    await page.screenshot({ path: snap1 });
    console.log("Captured Scene 1:", snap1);

    // Click Continue to Scene 2
    console.log("Advancing to Scene 2 (Mystery Gift)...");
    const btn1 = await page.$('button ::-p-text("See What\'s Waiting")') || (await page.$$("button"))[0];
    if (btn1) await btn1.click();
    await new Promise((r) => setTimeout(r, 1200));

    // Scene 2: Mystery Gift
    console.log("Checking Scene 2 (Mystery Gift)...");
    const snap2 = path.join(ARTIFACTS_DIR, "phase5_scene2_mystery_gift.png");
    await page.screenshot({ path: snap2 });
    console.log("Captured Scene 2:", snap2);

    // Tap the Gift to Unwrap
    console.log("Triggering Gift Unbox (Scene 3 & 4 Sequence)...");
    const unwrapBtn = await page.$('button ::-p-text("Tap To Unwrap")');
    if (unwrapBtn) await unwrapBtn.click();
    else await page.mouse.click(640, 450);

    // Capture Scene 3 (Rewarding Unboxing Shake & Lid Open)
    await new Promise((r) => setTimeout(r, 600));
    const snap3 = path.join(ARTIFACTS_DIR, "phase5_scene3_unboxing_interaction.png");
    await page.screenshot({ path: snap3 });
    console.log("Captured Scene 3 (Interaction):", snap3);

    // Wait for Scene 4 (Surprise Eruption)
    await new Promise((r) => setTimeout(r, 1600));
    const snap4 = path.join(ARTIFACTS_DIR, "phase5_scene4_surprise_burst.png");
    await page.screenshot({ path: snap4 });
    console.log("Captured Scene 4 (Surprise):", snap4);

    // Click Continue to Scene 5 (Birthday Reveal)
    console.log("Advancing to Scene 5 (Birthday Reveal)...");
    const btnReveal = await page.$('button ::-p-text("See The Birthday Wish")');
    if (btnReveal) await btnReveal.click();
    await new Promise((r) => setTimeout(r, 1200));

    // Scene 5: Birthday Reveal
    console.log("Checking Scene 5 (Birthday Reveal)...");
    const snap5 = path.join(ARTIFACTS_DIR, "phase5_scene5_birthday_reveal.png");
    await page.screenshot({ path: snap5 });
    console.log("Captured Scene 5:", snap5);

    // Click Continue to Scene 6 (Personal Message)
    console.log("Advancing to Scene 6 (Personal Message)...");
    const btnMessage = await page.$('button ::-p-text("Read Your Personal Message")');
    if (btnMessage) await btnMessage.click();
    await new Promise((r) => setTimeout(r, 1200));

    // Scene 6: Personal Message
    console.log("Checking Scene 6 (Personal Message)...");
    const snap6 = path.join(ARTIFACTS_DIR, "phase5_scene6_personal_message.png");
    await page.screenshot({ path: snap6 });
    console.log("Captured Scene 6:", snap6);

    // Click Continue to Scene 7 (Finale)
    console.log("Advancing to Scene 7 (Finale)...");
    const btnFinal = await page.$('button ::-p-text("A Final Note")');
    if (btnFinal) await btnFinal.click();
    await new Promise((r) => setTimeout(r, 1200));

    // Scene 7: Final Screen
    console.log("Checking Scene 7 (Final Actions)...");
    const snap7 = path.join(ARTIFACTS_DIR, "phase5_scene7_final.png");
    await page.screenshot({ path: snap7 });
    console.log("Captured Scene 7:", snap7);

    // Test Share Button Toast
    console.log("Testing Share Button Toast on Scene 7...");
    const shareBtn = await page.$('button ::-p-text("Share Surprise")');
    if (shareBtn) await shareBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    const snapShare = path.join(ARTIFACTS_DIR, "phase5_scene7_share_toast.png");
    await page.screenshot({ path: snapShare });
    console.log("Captured Share Toast:", snapShare);

    // Test Replay Button (restarts to Scene 1)
    console.log("Testing Replay Button...");
    const replayBtn = await page.$('button ::-p-text("Replay Experience")');
    if (replayBtn) await replayBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
    const snapReplay = path.join(ARTIFACTS_DIR, "phase5_scene1_replayed.png");
    await page.screenshot({ path: snapReplay });
    console.log("Captured Replayed Scene 1:", snapReplay);

    // -------------------------------------------------------------------------
    // TEST 2: Edge Cases (Long message, Empty Sender)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: Edge Cases (Long Message, Empty Sender) ---");
    const longMessage = encodeURIComponent(
      "Dear Sophia, looking back on all the crazy years we've spent laughing until our stomachs hurt, surviving late-night study sessions, traveling across cities, and encouraging each other through every high and low, I want you to know how deeply cherished you are. Happy 25th birthday! You deserve all the stars in the galaxy and every dream you are chasing to come true. Keep shining your brilliant radiant light everywhere you go!"
    );
    await page.goto(
      `http://localhost:3000/s/sample-birthday-123?name=Sophia&sender=&message=${longMessage}`,
      { waitUntil: "networkidle2" }
    );
    await new Promise((r) => setTimeout(r, 1200));

    // Step 1 -> Step 2
    const s1Btn = await page.$('button ::-p-text("See What\'s Waiting")');
    if (s1Btn) await s1Btn.click();
    await new Promise((r) => setTimeout(r, 1000));

    // Step 2 -> Step 3 (Unbox)
    const s2Btn = await page.$('button ::-p-text("Tap To Unwrap")');
    if (s2Btn) await s2Btn.click();
    // Wait for auto-unbox & transition to Scene 4
    await new Promise((r) => setTimeout(r, 2200));

    // Step 4 -> Step 5
    const s4Btn = await page.$('button ::-p-text("See The Birthday Wish")');
    if (s4Btn) await s4Btn.click();
    await new Promise((r) => setTimeout(r, 1000));

    // Step 5 -> Step 6 (Personal Message)
    const s5Btn = await page.$('button ::-p-text("Read Your Personal Message")');
    if (s5Btn) await s5Btn.click();
    await new Promise((r) => setTimeout(r, 1200));

    const snapLongMsg = path.join(ARTIFACTS_DIR, "phase5_edgecase_long_message.png");
    await page.screenshot({ path: snapLongMsg });
    console.log("Captured Long Message Edge Case on Scene 6:", snapLongMsg);

    // -------------------------------------------------------------------------
    // TEST 3: Mobile Viewport Optimization (390 x 844)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: Mobile Viewport (390x844) ---");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000/s/sample-birthday-123", { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1500));

    const snapMobile1 = path.join(ARTIFACTS_DIR, "phase5_mobile_scene1.png");
    await page.screenshot({ path: snapMobile1 });
    console.log("Captured Mobile Scene 1:", snapMobile1);

    // Advance to Scene 2 on Mobile
    const mobBtn1 = (await page.$$("main button"))[0];
    if (mobBtn1) await mobBtn1.click();
    await new Promise((r) => setTimeout(r, 1200));

    const snapMobile2 = path.join(ARTIFACTS_DIR, "phase5_mobile_scene2.png");
    await page.screenshot({ path: snapMobile2 });
    console.log("Captured Mobile Scene 2:", snapMobile2);

    // -------------------------------------------------------------------------
    // TEST 4: Creator Preview Frame Integration (/preview)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: Creator Preview Page (/preview) ---");
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto("http://localhost:3000/preview", { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));

    const snapPreview = path.join(ARTIFACTS_DIR, "phase5_preview_studio.png");
    await page.screenshot({ path: snapPreview });
    console.log("Captured Preview Studio Frame:", snapPreview);

    console.log("\n=== ALL PHASE 5 TESTS COMPLETED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("Error during test execution:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

runPhase5Tests();
