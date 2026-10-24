const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureClarity() {
  console.log('--- CAPTURING CLARITY UPDATE HIGH-RESOLUTION SCREENSHOTS ---');
  const outDir = path.resolve(__dirname, '../docs/assets/screenshots');
  const artifactDir = path.resolve(
    'C:/Users/gmatr/.gemini/antigravity/brain/50af6f2d-34c3-4447-8c29-ad4ae98cbb03/screenshots'
  );

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  const tasks = [
    {
      name: 'ui-clarity-home.png',
      url: 'http://localhost:3000/?skipIntro=true',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(1500);
      },
    },
    {
      name: 'ui-clarity-dashboard.png',
      url: 'http://localhost:3000/demo/control',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(1500);
      },
    },
    {
      name: 'ui-clarity-sidebar.png',
      url: 'http://localhost:3000/demo/control',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(1500);
      },
    },
    {
      name: 'ui-clarity-task-drawer.png',
      url: 'http://localhost:3000/demo/control',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(2000);
        try {
          const btn = await page.waitForSelector('[data-testid="task-drawer-button"]', { timeout: 10000 });
          console.log('Found task-drawer-button, clicking...');
          await btn.click();
          await page.waitForTimeout(1500);
          const drawer = await page.waitForSelector('[data-testid="contextual-task-drawer"]', { timeout: 10000 });
          console.log('Contextual task drawer opened successfully!');
          await page.waitForTimeout(1000);
        } catch (e) {
          console.warn('Task drawer interaction warning:', e.message);
        }
      },
    },
    {
      name: 'ui-clarity-mobile.png',
      url: 'http://localhost:3000/demo/control',
      viewport: { width: 390, height: 844 }, // iPhone 12/13/14
      action: async (page) => {
        await page.waitForTimeout(1500);
      },
    },
    {
      name: 'ui-clarity-footer.png',
      url: 'http://localhost:3000/?skipIntro=true',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
      },
    },
  ];

  for (const item of tasks) {
    console.log(`Capturing: ${item.name} (${item.viewport.width}x${item.viewport.height})...`);
    const context = await browser.newContext({
      viewport: item.viewport,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    page.on('pageerror', (err) => console.log(`[PageError in ${item.name}]:`, err.message));

    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (item.action) {
        await item.action(page);
      }
      const outPath = path.join(outDir, item.name);
      const artPath = path.join(artifactDir, item.name);
      await page.screenshot({ path: outPath, fullPage: false });
      fs.copyFileSync(outPath, artPath);
      console.log(`Saved: ${item.name}`);
    } catch (err) {
      console.error(`Error capturing ${item.name}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('--- ALL CLARITY SCREENSHOTS CAPTURED SUCCESSFULLY ---');
}

captureClarity().catch((err) => {
  console.error('Clarity capture failed:', err);
  process.exit(1);
});
