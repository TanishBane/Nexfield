const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../docs/assets/screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function verifyDeployment() {
  console.log('Launching browser to verify live Vercel deployment...');
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  const liveUrl = 'https://nexfield-agritech.vercel.app';
  console.log(`Navigating to ${liveUrl}...`);
  await page.goto(liveUrl, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3000);

  const title = await page.title();
  console.log('Page Title:', title);

  const screenshotPath = path.join(OUT_DIR, 'vercel-deployment-verified.png');
  await page.screenshot({
    path: screenshotPath,
    fullPage: false,
  });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Also check interactive demo link on the live site
  console.log('Checking demo navigation on live site...');
  await page.goto(`${liveUrl}/demo/control`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3000);

  const demoScreenshotPath = path.join(OUT_DIR, 'vercel-demo-control-verified.png');
  await page.screenshot({
    path: demoScreenshotPath,
    fullPage: false,
  });
  console.log(`Saved screenshot to ${demoScreenshotPath}`);

  await browser.close();
  console.log('Verification completed successfully!');
}

verifyDeployment().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
