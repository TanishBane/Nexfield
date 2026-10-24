const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  console.log('--- NEXFIELD CINEMATIC REDESIGN SCREENSHOT CAPTURE ---');

  const outDir = path.resolve(__dirname, '../docs/assets/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  const routes = [
    { name: 'redesign-01-cinematic-home.png', url: 'http://localhost:3000/', viewport: { width: 1440, height: 900 } },
    { name: 'redesign-02-platform-overview.png', url: 'http://localhost:3000/platform', viewport: { width: 1440, height: 900 } },
    { name: 'redesign-03-demo-hub.png', url: 'http://localhost:3000/demo', viewport: { width: 1440, height: 900 } },
    { name: 'redesign-04-command-center.png', url: 'http://localhost:3000/demo/control', viewport: { width: 1440, height: 900 } },
    { name: 'redesign-05-fieldsight-ai.png', url: 'http://localhost:3000/demo/fieldsight', viewport: { width: 1440, height: 900 } },
    { name: 'redesign-06-digital-twin.png', url: 'http://localhost:3000/demo/twin', viewport: { width: 1440, height: 900 } },
    { name: 'redesign-07-mobile-command.png', url: 'http://localhost:3000/demo/control', viewport: { width: 390, height: 844 } },
  ];

  for (const item of routes) {
    const context = await browser.newContext({
      viewport: item.viewport,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log(`Navigating to ${item.url} (${item.viewport.width}x${item.viewport.height})...`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Allow extra time for GSAP and 3D canvases to settle
      await page.waitForTimeout(2500);

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
  console.log('--- ALL SCREENSHOTS SUCCESSFULLY CAPTURED ---');
}

capture().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
