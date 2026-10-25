const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve('docs/ux-lab/screenshots/baseline');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'control', path: '/control' },
  { name: 'fieldsight', path: '/fieldsight' },
  { name: 'twin', path: '/twin' },
  { name: 'intelligence', path: '/intelligence' },
  { name: 'ops', path: '/ops' },
  { name: 'markets', path: '/markets' }
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `http://localhost:3000${route.path}`;
      console.log(`Checking ${route.name} at ${vp.name} (${vp.width}x${vp.height})...`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(1000); // allow Three.js / animations / fonts to settle

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const diff = doc.scrollWidth - doc.clientWidth;
          const offenders = [];
          if (diff > 0) {
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > window.innerWidth + 1) {
                offenders.push({
                  tag: el.tagName,
                  className: el.className ? String(el.className).slice(0, 50) : '',
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
              }
            });
          }
          return { diff, offenders: offenders.slice(0, 5) };
        });

        const filename = `${route.name}-${vp.name}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: false });

        results.push({
          route: route.name,
          viewport: vp.name,
          width: vp.width,
          overflow: overflow.diff,
          offenders: overflow.offenders,
          screenshot: filename
        });
      } catch (err) {
        console.error(`Error on ${route.name} (${vp.name}):`, err.message);
        results.push({
          route: route.name,
          viewport: vp.name,
          width: vp.width,
          error: err.message
        });
      }
    }
    await context.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'baseline-audit.json'), JSON.stringify(results, null, 2));
  console.log('Capture complete! Results written to baseline-audit.json');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
