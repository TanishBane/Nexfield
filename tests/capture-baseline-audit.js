const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureBaseline() {
  const BASE_URL = process.env.LIVE_URL || 'https://nexfield-agritech.vercel.app';
  console.log(`--- CAPTURING BASELINE SCREENSHOTS FROM ${BASE_URL} ---`);
  
  const outDir = path.resolve('docs/assets/screenshots/baseline-audit');
  const artifactDir = path.resolve('C:/Users/gmatr/.gemini/antigravity/brain/50af6f2d-34c3-4447-8c29-ad4ae98cbb03/baseline-audit');
  
  [outDir, artifactDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const browser = await chromium.launch({ headless: true });

  const targets = [
    { name: '01-home-desktop', path: '/', width: 1440, height: 900 },
    { name: '01-home-tablet', path: '/', width: 768, height: 1024 },
    { name: '01-home-mobile', path: '/', width: 390, height: 844 },
    
    { name: '02-platform-desktop', path: '/platform', width: 1440, height: 900 },
    { name: '03-how-it-works-desktop', path: '/how-it-works', width: 1440, height: 900 },
    { name: '04-about-desktop', path: '/about', width: 1440, height: 900 },
    { name: '05-demo-desktop', path: '/demo', width: 1440, height: 900 },
    
    { name: '06-control-desktop', path: '/control', width: 1440, height: 900 },
    { name: '06-control-tablet', path: '/control', width: 768, height: 1024 },
    { name: '06-control-mobile', path: '/control', width: 390, height: 844 },
    
    { name: '07-fieldsight-desktop', path: '/fieldsight', width: 1440, height: 900 },
    { name: '07-fieldsight-mobile', path: '/fieldsight', width: 390, height: 844 },
    
    { name: '08-twin-desktop', path: '/twin', width: 1440, height: 900 },
    { name: '08-twin-mobile', path: '/twin', width: 390, height: 844 },
    
    { name: '09-intelligence-desktop', path: '/intelligence', width: 1440, height: 900 },
    { name: '10-ops-desktop', path: '/ops', width: 1440, height: 900 },
    { name: '10-ops-mobile', path: '/ops', width: 390, height: 844 },
    
    { name: '11-markets-desktop', path: '/markets', width: 1440, height: 900 },
    { name: '11-markets-mobile', path: '/markets', width: 390, height: 844 }
  ];

  for (const item of targets) {
    const context = await browser.newContext({
      viewport: { width: item.width, height: item.height },
      deviceScaleFactor: 1.5,
    });
    const page = await context.newPage();
    const url = `${BASE_URL}${item.path}`;

    try {
      console.log(`Navigating to ${url} (${item.width}x${item.height})...`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 35000 });
      await page.waitForTimeout(1500);

      const fileName = `${item.name}.png`;
      await page.screenshot({ path: path.join(outDir, fileName), fullPage: false });
      await page.screenshot({ path: path.join(artifactDir, fileName), fullPage: false });
      console.log(`✓ Saved ${fileName}`);
    } catch (err) {
      console.error(`✗ Error on ${url}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('--- BASELINE CAPTURE COMPLETED ---');
}

captureBaseline().catch(err => {
  console.error('Fatal error in captureBaseline:', err);
  process.exit(1);
});
