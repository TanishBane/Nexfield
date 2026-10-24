const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureExperience() {
  console.log('--- CAPTURING EXPERIENCE 2.0 SCREENSHOTS FOR PROJECT EARTH ---');
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

  const routes = [
    {
      name: 'experience-hero.png',
      url: 'http://localhost:3000/',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        // Dismiss entrance intro if active
        try {
          const skipBtn = await page.$('button:has-text("Skip Intro")');
          if (skipBtn) await skipBtn.click();
        } catch (_) {}
        await page.waitForTimeout(1000);
      },
    },
    {
      name: 'experience-scroll.png',
      url: 'http://localhost:3000/',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        try {
          const skipBtn = await page.$('button:has-text("Skip Intro")');
          if (skipBtn) await skipBtn.click();
        } catch (_) {}
        await page.waitForTimeout(500);
        // Scroll down to Chapter 2 / Chapter 3
        await page.evaluate(() => window.scrollTo(0, 1400));
        await page.waitForTimeout(1200);
      },
    },
    {
      name: 'experience-control.png',
      url: 'http://localhost:3000/demo/control',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(1000);
      },
    },
    {
      name: 'experience-digital-twin.png',
      url: 'http://localhost:3000/demo/twin',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(2000);
      },
    },
    {
      name: 'experience-fieldsight.png',
      url: 'http://localhost:3000/demo/fieldsight',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(1200);
      },
    },
    {
      name: 'experience-markets.png',
      url: 'http://localhost:3000/demo/markets',
      viewport: { width: 1440, height: 900 },
      action: async (page) => {
        await page.waitForTimeout(1000);
      },
    },
    {
      name: 'experience-mobile.png',
      url: 'http://localhost:3000/demo/control',
      viewport: { width: 390, height: 844 },
      action: async (page) => {
        await page.waitForTimeout(1000);
      },
    },
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
      if (item.action) {
        await item.action(page);
      }
      const targetPath = path.join(outDir, item.name);
      await page.screenshot({ path: targetPath, fullPage: false });

      // Also copy to artifactDir
      const artifactPath = path.join(artifactDir, item.name);
      fs.copyFileSync(targetPath, artifactPath);

      console.log(`✓ Saved ${item.name}`);
    } catch (err) {
      console.error(`✗ Error capturing ${item.name}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('--- ALL EXPERIENCE SCREENSHOTS SAVED ---');
}

captureExperience().catch((err) => {
  console.error('Fatal experience capture error:', err);
  process.exit(1);
});
