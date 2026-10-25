/**
 * NEXFIELD 2.0 Screenshot Capture Suite
 * Captures comprehensive high-fidelity screenshots across Desktop (1440px),
 * Tablet (768px), and Mobile (390px) viewports.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const DOCS_DIR = path.resolve(__dirname, '../docs/assets/screenshots');
const ARTIFACT_DIR = path.resolve('C:/Users/gmatr/.gemini/antigravity/brain/50af6f2d-34c3-4447-8c29-ad4ae98cbb03/post-transformation');

[DOCS_DIR, ARTIFACT_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const pages = [
  { name: '01-home', path: '/' },
  { name: '02-solutions', path: '/solutions' },
  { name: '03-how-it-works', path: '/how-it-works' },
  { name: '04-control', path: '/control' },
  { name: '05-fieldsight', path: '/fieldsight' },
  { name: '06-twin', path: '/twin' },
  { name: '07-intelligence', path: '/intelligence' },
  { name: '08-ops', path: '/ops' },
  { name: '09-markets', path: '/markets' },
];

async function capture() {
  console.log('Launching browser to capture NEXFIELD 2.0 screenshots...');
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { label: 'desktop', width: 1440, height: 900 },
    { label: 'tablet', width: 768, height: 1024 },
    { label: 'mobile', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const p of pages) {
      // For tablet, capture key interactive modules
      if (vp.label === 'tablet' && !['01-home', '04-control', '06-twin'].includes(p.name)) {
        continue;
      }

      console.log(`Capturing [${vp.label}] ${p.name} from ${p.path}...`);
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500); // Allow animations & ECharts to settle

      const filename = `${p.name}-${vp.label}.png`;
      const docsPath = path.join(DOCS_DIR, filename);
      const artPath = path.join(ARTIFACT_DIR, filename);

      await page.screenshot({ path: docsPath, fullPage: false });
      fs.copyFileSync(docsPath, artPath);
    }

    await context.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
