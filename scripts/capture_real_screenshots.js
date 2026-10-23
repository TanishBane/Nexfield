const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../docs/assets/screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('Launching Edge Chromium...');
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  // Desktop context
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const page = await desktopContext.newPage();

  // Helper function to safely navigate and wait
  async function loadPage(url, waitMs = 2500) {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 35000 });
    await page.waitForTimeout(waitMs);
  }

  // 1. Landing Page
  await loadPage('http://localhost:3000/', 2500);
  await page.screenshot({
    path: path.join(OUT_DIR, 'landing-page.png'),
    fullPage: false,
  });
  console.log('Saved landing-page.png');

  // 2. Command Center
  await loadPage('http://localhost:3000/control', 3000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'command-center.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, '01-command-center.png'),
    fullPage: false,
  });
  console.log('Saved command-center.png');

  // 3. FieldSight AI
  await loadPage('http://localhost:3000/fieldsight', 2500);
  await page.screenshot({
    path: path.join(OUT_DIR, 'fieldsight-ai.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, '02-fieldsight-ai.png'),
    fullPage: false,
  });
  console.log('Saved fieldsight-ai.png');

  // 4. Digital Twin (3D WebGL)
  await loadPage('http://localhost:3000/twin', 4000); // Allow Three.js canvas to render
  await page.screenshot({
    path: path.join(OUT_DIR, 'digital-twin.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, '03-nexfield-twin.png'),
    fullPage: false,
  });
  console.log('Saved digital-twin.png');

  // 5. Intelligence Copilot
  await loadPage('http://localhost:3000/intelligence', 2000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'intelligence.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, '04-intelligence.png'),
    fullPage: false,
  });
  console.log('Saved intelligence.png');

  // 6. Operations Ledger
  await loadPage('http://localhost:3000/ops', 2000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'operations.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, '05-operations.png'),
    fullPage: false,
  });
  console.log('Saved operations.png');

  // 7. Mandi Markets
  await loadPage('http://localhost:3000/markets', 2500);
  await page.screenshot({
    path: path.join(OUT_DIR, 'markets.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, '06-markets.png'),
    fullPage: false,
  });
  console.log('Saved markets.png');

  // 8. Authentication (/login)
  await loadPage('http://localhost:3000/login', 2000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'authentication.png'),
    fullPage: false,
  });
  console.log('Saved authentication.png');

  // 9. Onboarding (/onboarding)
  await loadPage('http://localhost:3000/onboarding', 2000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'onboarding.png'),
    fullPage: false,
  });
  console.log('Saved onboarding.png');

  // 10. Data Center (/data-center)
  await loadPage('http://localhost:3000/data-center', 2000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'data-center.png'),
    fullPage: false,
  });
  console.log('Saved data-center.png');

  // 11. Twin Simulation Comparison (scrolled)
  await loadPage('http://localhost:3000/twin', 3500);
  await page.evaluate(() => {
    window.scrollBy(0, 520);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'twin-simulation.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT_DIR, '07-twin-simulation-comparison.png'),
    fullPage: false,
  });
  console.log('Saved twin-simulation.png');

  // Also capture Crop Assessment Result & Market Price Analysis for legacy references
  await loadPage('http://localhost:3000/fieldsight', 2000);
  await page.evaluate(() => {
    window.scrollBy(0, 380);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, '08-crop-assessment-result.png'),
    fullPage: false,
  });

  await loadPage('http://localhost:3000/markets', 2500);
  await page.evaluate(() => {
    window.scrollBy(0, 480);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, '09-market-price-analysis.png'),
    fullPage: false,
  });

  // 12. Demo Mode (/demo/control)
  await loadPage('http://localhost:3000/demo/control', 3000);
  await page.screenshot({
    path: path.join(OUT_DIR, 'demo-mode.png'),
    fullPage: false,
  });
  console.log('Saved demo-mode.png');

  await desktopContext.close();

  // 13. Mobile Responsive Viewport (iPhone 14 / 390x844)
  console.log('Capturing mobile responsive viewport...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/control', {
    waitUntil: 'load',
    timeout: 35000,
  });
  await mobilePage.waitForTimeout(2500);
  await mobilePage.screenshot({
    path: path.join(OUT_DIR, 'mobile.png'),
    fullPage: false,
  });
  await mobilePage.screenshot({
    path: path.join(OUT_DIR, '10-mobile-responsive.png'),
    fullPage: false,
  });
  console.log('Saved mobile.png');

  await mobileContext.close();
  await browser.close();
  console.log('All 13 authentic screenshots successfully captured and saved to docs/assets/screenshots/');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
