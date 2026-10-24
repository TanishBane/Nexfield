const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureBefore() {
  console.log('--- CAPTURING BEFORE SCREENSHOTS FOR PROJECT EARTH 2.0 ---');
  const outDir = path.resolve(__dirname, '../docs/assets/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  const routes = [
    { name: 'before-01-homepage.png', url: 'http://localhost:3000/', viewport: { width: 1440, height: 900 } },
    { name: 'before-02-command-center.png', url: 'http://localhost:3000/demo/control', viewport: { width: 1440, height: 900 } },
    { name: 'before-03-mobile-command.png', url: 'http://localhost:3000/demo/control', viewport: { width: 390, height: 844 } },
    { name: 'before-04-fieldsight.png', url: 'http://localhost:3000/demo/fieldsight', viewport: { width: 1440, height: 900 } },
    { name: 'before-05-digital-twin.png', url: 'http://localhost:3000/demo/twin', viewport: { width: 1440, height: 900 } },
    { name: 'before-06-markets.png', url: 'http://localhost:3000/demo/markets', viewport: { width: 1440, height: 900 } },
  ];

  for (const item of routes) {
    const context = await browser.newContext({
      viewport: item.viewport,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log(`Capturing ${item.name} (${item.viewport.width}x${item.viewport.height})...`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      const targetPath = path.join(outDir, item.name);
      await page.screenshot({ path: targetPath, fullPage: false });
      console.log(`✓ Saved ${item.name}`);
    } catch (err) {
      console.error(`✗ Error capturing ${item.name}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('--- ALL BEFORE SCREENSHOTS SAVED ---');
}

captureBefore().catch(err => {
  console.error('Fatal before capture error:', err);
  process.exit(1);
});
