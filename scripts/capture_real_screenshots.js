const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../docs/assets/screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('Launching browser...');
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
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(waitMs);
  }

  // 1. Command Center
  await loadPage('http://localhost:3000/control', 3000);
  await page.screenshot({
    path: path.join(OUT_DIR, '01-command-center.png'),
    fullPage: false,
  });
  console.log('Saved 01-command-center.png');

  // 2. FieldSight AI
  await loadPage('http://localhost:3000/fieldsight', 2500);
  await page.screenshot({
    path: path.join(OUT_DIR, '02-fieldsight-ai.png'),
    fullPage: false,
  });
  console.log('Saved 02-fieldsight-ai.png');

  // 3. NEXFIELD Twin (3D WebGL)
  await loadPage('http://localhost:3000/twin', 4000); // Allow WebGL canvas to finish initial frame
  await page.screenshot({
    path: path.join(OUT_DIR, '03-nexfield-twin.png'),
    fullPage: false,
  });
  console.log('Saved 03-nexfield-twin.png');

  // 4. Intelligence Copilot
  await loadPage('http://localhost:3000/intelligence', 2000);
  await page.screenshot({
    path: path.join(OUT_DIR, '04-intelligence.png'),
    fullPage: false,
  });
  console.log('Saved 04-intelligence.png');

  // 5. Operations Ledger
  await loadPage('http://localhost:3000/ops', 2000);
  await page.screenshot({
    path: path.join(OUT_DIR, '05-operations.png'),
    fullPage: false,
  });
  console.log('Saved 05-operations.png');

  // 6. Mandi Markets
  await loadPage('http://localhost:3000/markets', 2500);
  await page.screenshot({
    path: path.join(OUT_DIR, '06-markets.png'),
    fullPage: false,
  });
  console.log('Saved 06-markets.png');

  // 7. Twin Simulation Comparison (Scrolled to scenario comparison)
  await loadPage('http://localhost:3000/twin', 3500);
  await page.evaluate(() => {
    window.scrollBy(0, 520);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, '07-twin-simulation-comparison.png'),
    fullPage: false,
  });
  console.log('Saved 07-twin-simulation-comparison.png');

  // 8. Crop Assessment Result (Scrolled to diagnosis and remediation)
  await loadPage('http://localhost:3000/fieldsight', 2000);
  await page.evaluate(() => {
    window.scrollBy(0, 380);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, '08-crop-assessment-result.png'),
    fullPage: false,
  });
  console.log('Saved 08-crop-assessment-result.png');

  // 9. Market Price Analysis (Scrolled to trend and transport calculator)
  await loadPage('http://localhost:3000/markets', 2500);
  await page.evaluate(() => {
    window.scrollBy(0, 480);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, '09-market-price-analysis.png'),
    fullPage: false,
  });
  console.log('Saved 09-market-price-analysis.png');

  await desktopContext.close();

  // 10. Mobile Responsive Context (iPhone 14 / 390x844)
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
    timeout: 30000,
  });
  await mobilePage.waitForTimeout(2500);
  await mobilePage.screenshot({
    path: path.join(OUT_DIR, '10-mobile-responsive.png'),
    fullPage: false,
  });
  console.log('Saved 10-mobile-responsive.png');

  await mobileContext.close();
  await browser.close();
  console.log('All 10 authentic screenshots successfully captured and saved to docs/assets/screenshots/');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
