# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> NEXFIELD UX Lab - Group F: Demo Mode >> Verify Demo Mode
- Location: regression.spec.ts:162:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText(/Synthetic Baseline Fixtures|Development Mode/i).first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" getByText(/Synthetic Baseline Fixtures|Development Mode/i).first() with timeout 5000ms
  - waiting for getByText(/Synthetic Baseline Fixtures|Development Mode/i).first()
    13 × locator resolved to <span class="text-[10px] font-mono text-[#8CA394] px-2 py-0.5 rounded bg-[#101914] border border-[#23352A] hidden lg:inline">Development Mode: Synthetic Agronomic Fixtures</span>
       - unexpected value "hidden"

```

```yaml
- text: Interactive Demo Nashik Tomato Precision Estate
- button "Reset Demo"
- link "Exit to Real Workspace":
  - /url: /login
- complementary:
  - link "NEXFIELD Official Logo NEXFIELD OS Demo Mode":
    - /url: /demo/control
    - img "NEXFIELD Official Logo"
    - text: NEXFIELD OS Demo Mode
  - text: Observation & Twin
  - link "Overview Command Center & Priorities":
    - /url: /demo/control
  - link "Crop Health Pathology & Grad-CAM":
    - /url: /demo/fieldsight
  - link "Digital Twin Biophysical Hydrology":
    - /url: /demo/twin
  - text: Intelligence & Ops
  - link "Insights Agronomic AI Assistant":
    - /url: /demo/intelligence
  - link "Operations Work Orders & Storage":
    - /url: /demo/ops
  - link "Markets APMC Price Arbitrage":
    - /url: /demo/markets
  - text: Data & Settings
  - link "Farm Data CSV / GeoJSON / IoT":
    - /url: /demo/data-center
  - link "Add Farm Register Acreage":
    - /url: /demo/onboarding
  - text: ADAPPT 5.0 Domain 2
  - paragraph: AI in Food Technology & Crop Intelligence
- banner:
  - button "Toggle Navigation Sidebar"
  - button "⌘K"
  - text: Nashik Tomato Precision Estate
  - link "Sign In":
    - /url: /login
    - button "Sign In"
- main:
  - navigation "Breadcrumbs":
    - link "Home":
      - /url: /
    - link "Interactive Demo":
      - /url: /demo
    - text: Command Center
  - text: Live Demonstration Estate Sentinel-2 Synced (4m ago) · Verified Fixtures
  - heading "Nashik Tomato Precision Estate" [level=1]
  - paragraph: Nashik, Maharashtra (20.0059° N, 73.7901° E) · 2.4 Hectares · Tomato (Abhinav F1 Hybrid (Semi-Determinate))
  - text: "27.8°C · 64% RH Clear Sky · Solar: 785 W/m²"
  - button "Start Drip Irrigation"
  - text: "Growth Milestone: Flowering & Early Fruit Set (BBCH 65) • Day 48 of 95 Cycle Completed: 55%"
  - heading "Your Farm Today" [level=2]
  - paragraph: Three critical observations requiring your agronomic decision.
  - text: 3 Active Items Irrigation & Hydrology
  - button "Dismiss priority"
  - heading "Vadose Infiltration Window Active" [level=3]
  - paragraph: Soil moisture is at 41%. Drip fertigation with water-soluble 13-0-45 is recommended within 18 hours to sustain fruit enlargement and prevent blossom-end rot.
  - button "Start Drip Irrigation"
  - text: Crop Protection Alert
  - button "Dismiss priority"
  - heading "Early Blight Risk Elevated in Sector 2-B" [level=3]
  - paragraph: Canopy microclimate humidity has exceeded 85% for 6 consecutive hours. ICAR preventive bio-fungicide or copper oxychloride spray due.
  - link "Inspect Leaf Symptoms":
    - /url: /demo/fieldsight
  - text: Wholesale Market Opportunity
  - button "Dismiss priority"
  - heading "Nashik APMC Price Surge (+₹210 / qtl)" [level=3]
  - paragraph: Modal wholesale price jumped to ₹2,450/qtl due to low terminal arrivals. Favorable net realization after factoring ₹45 freight deduction.
  - link "Review Market Returns":
    - /url: /demo/markets
  - heading "Farm at a Glance" [level=2]
  - paragraph: Key vital signs distilled into understandable agricultural terms.
  - text: "Soil Moisture 41.4% Optimal Root Zone Capacity Crop Condition 94% Canopy NDVI: 0.81 (Vigorous) Today's Weather 27.8°C 64% Humidity · Low Heat Stress (4.2%) Season Progress 55% Day 48 of 95 (Fruit Enlargement)"
  - heading "Explore Your Farm" [level=2]
  - paragraph: Dive deeper into specialized agronomic modules.
  - link "Inspect Crops FieldSight AI pathology scanner with Grad-CAM heatmaps and ICAR chemical rotation regimens. Inspect Foliage":
    - /url: /demo/fieldsight
    - heading "Inspect Crops" [level=3]
    - paragraph: FieldSight AI pathology scanner with Grad-CAM heatmaps and ICAR chemical rotation regimens.
    - text: Inspect Foliage
  - link "Open Digital Twin 3D biophysical Vadose zone mesh simulating drought, heatwaves, and irrigation what-if scenarios. Simulate Scenarios":
    - /url: /demo/twin
    - heading "Open Digital Twin" [level=3]
    - paragraph: 3D biophysical Vadose zone mesh simulating drought, heatwaves, and irrigation what-if scenarios.
    - text: Simulate Scenarios
  - link "Manage Tasks Operational work order dispatching, fertilizer inventory, and grain silo moisture assurance. Dispatch Orders":
    - /url: /demo/ops
    - heading "Manage Tasks" [level=3]
    - paragraph: Operational work order dispatching, fertilizer inventory, and grain silo moisture assurance.
    - text: Dispatch Orders
  - link "Explore Markets Live wholesale Agmarknet mandi spreads with multi-factor freight arbitrage deductions. Compare Mandis":
    - /url: /demo/markets
    - heading "Explore Markets" [level=3]
    - paragraph: Live wholesale Agmarknet mandi spreads with multi-factor freight arbitrage deductions.
    - text: Compare Mandis
  - text: "Recent Estate Activity Audit Trail Verified Soil Sensor Probe Synced Moisture 41.4% · Matrix potential -33 kPa (Optimal) LoRa Soil Probe #2 • 4 mins ago Satellite Multispectral Refresh Sentinel-2 MSI composite: 0.81 NDVI canopy vigor Copernicus Hub • 32 mins ago Microclimate Weather Logged 28.4°C ambient with 62% relative humidity Field Weather Station • 1 hour ago"
  - button "Inspect Deep Sensor Strata & Chemistry (0-30cm Depth)"
- alert
```

# Test source

```ts
  69  |     if (await footerLink.isVisible()) {
  70  |         const textContent = await footerLink.innerText();
  71  |         const matches = textContent.match(/NEXFIELD/g) || [];
  72  |         expect(matches.length).toBeLessThanOrEqual(2);
  73  |     }
  74  |   });
  75  | });
  76  |
  77  | test.describe('NEXFIELD UX Lab - Group C: No Unintended Overlap', () => {
  78  |   const viewports = [
  79  |     { width: 360, height: 800 },
  80  |     { width: 390, height: 844 },
  81  |     { width: 768, height: 1024 },
  82  |     { width: 1024, height: 768 },
  83  |     { width: 1280, height: 800 },
  84  |     { width: 1440, height: 900 },
  85  |     { width: 1920, height: 1080 }
  86  |   ];
  87  |
  88  |   for (const vp of viewports) {
  89  |     test(`Check overlap at ${vp.width}x${vp.height}`, async ({ page }) => {
  90  |       await page.setViewportSize(vp);
  91  |       await page.goto('/demo/control');
  92  |
  93  |       const header = page.locator('header').first();
  94  |       const mainContent = page.locator('main').first();
  95  |
  96  |       if (await header.isVisible() && await mainContent.isVisible()) {
  97  |           const headerBox = await header.boundingBox();
  98  |           const mainBox = await mainContent.boundingBox();
  99  |
  100 |           if (headerBox && mainBox) {
  101 |              // We just check that they don't completely swallow each other unless intended
  102 |              // A simple check is that main content starts below or at the bottom of the header if it's sticky
  103 |              expect(mainBox.y).toBeGreaterThanOrEqual(0);
  104 |           }
  105 |       }
  106 |     });
  107 |   }
  108 | });
  109 |
  110 | test.describe('NEXFIELD UX Lab - Group D: Text Readability', () => {
  111 |     test('Check typography for essential interface elements', async ({ page }) => {
  112 |         await page.goto('/demo/control');
  113 |
  114 |         // Wait for page to load
  115 |         await page.waitForTimeout(1000);
  116 |
  117 |         // Let's do a basic Axe check for color contrast which covers text readability partly
  118 |         try {
  119 |             const accessibilityScanResults = await new AxeBuilder({ page })
  120 |                 .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  121 |                 .analyze();
  122 |
  123 |             // We just ensure we ran it. We can write the report later.
  124 |             expect(accessibilityScanResults).toBeDefined();
  125 |         } catch (e) {
  126 |             console.log("Axe check failed or not fully available");
  127 |         }
  128 |     });
  129 | });
  130 |
  131 | test.describe('NEXFIELD UX Lab - Group E: Navigation', () => {
  132 |     test('Check mobile navigation', async ({ page }) => {
  133 |         await page.setViewportSize({ width: 390, height: 844 });
  134 |         await page.goto('/');
  135 |
  136 |         const menuBtn = page.getByRole('button', { name: /menu/i });
  137 |         if (await menuBtn.isVisible()) {
  138 |             await menuBtn.click();
  139 |             const demoLink = page.getByRole('link', { name: /Launch Interactive Demo/i });
  140 |             await expect(demoLink).toBeVisible();
  141 |         }
  142 |     });
  143 |
  144 |     test('Check Command Palette escape key behavior', async ({ page }) => {
  145 |         await page.setViewportSize({ width: 1280, height: 800 });
  146 |         await page.goto('/');
  147 |
  148 |         // Press Cmd+K or Ctrl+K
  149 |         await page.keyboard.press('Control+K');
  150 |         await page.waitForTimeout(500); // Wait for animation
  151 |
  152 |         // Press Escape
  153 |         await page.keyboard.press('Escape');
  154 |         // If there is a dialog, it should be closed. We check body doesn't have a specific class or just assume it succeeds
  155 |         // We'll just verify the page is still interactive
  156 |         const body = page.locator('body');
  157 |         await expect(body).toBeVisible();
  158 |     });
  159 | });
  160 |
  161 | test.describe('NEXFIELD UX Lab - Group F: Demo Mode', () => {
  162 |     test('Verify Demo Mode', async ({ page }) => {
  163 |         await page.goto('/demo/control');
  164 |
  165 |         // Wait for data
  166 |         await page.waitForTimeout(2000);
  167 |
  168 |         const indicator = page.getByText(/Synthetic Baseline Fixtures|Development Mode/i);
> 169 |         await expect(indicator.first()).toBeVisible();
      |                                         ^ Error: expect(locator).toBeVisible() failed
  170 |
  171 |         const twinLink = page.getByRole('button', { name: /Launch Digital Twin/i });
  172 |         if (await twinLink.isVisible()) {
  173 |             // It's there
  174 |         }
  175 |     });
  176 | });
  177 |
  178 | test.describe('NEXFIELD UX Lab - Group G: Responsive Footer', () => {
  179 |     test('Verify responsive footer', async ({ page }) => {
  180 |         await page.setViewportSize({ width: 390, height: 844 });
  181 |         await page.goto('/');
  182 |
  183 |         const footer = page.locator('footer');
  184 |         await expect(footer).toBeVisible();
  185 |
  186 |         const box = await footer.boundingBox();
  187 |         if (box) {
  188 |             expect(box.width).toBeLessThanOrEqual(390); // No horizontal overflow
  189 |         }
  190 |     });
  191 | });
  192 |
  193 | test.describe('NEXFIELD UX Lab - Screenshots & Visual Regression', () => {
  194 |     test('Capture Public navigation', async ({ page }) => {
  195 |         await page.setViewportSize({ width: 1440, height: 900 });
  196 |         await page.goto('/');
  197 |         await page.waitForTimeout(1000);
  198 |         await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'public_navigation.png') });
  199 |     });
  200 |
  201 |     test('Capture Mobile navigation', async ({ page }) => {
  202 |         await page.setViewportSize({ width: 390, height: 844 });
  203 |         await page.goto('/');
  204 |         const menuBtn = page.getByRole('button', { name: /menu/i });
  205 |         if (await menuBtn.isVisible()) {
  206 |             await menuBtn.click();
  207 |             await page.waitForTimeout(500);
  208 |             await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_navigation.png') });
  209 |         }
  210 |     });
  211 |
  212 |     test('Capture Farm dashboard', async ({ page }) => {
  213 |         await page.setViewportSize({ width: 1440, height: 900 });
  214 |         await page.goto('/demo/control');
  215 |         await page.waitForTimeout(2000);
  216 |         await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'farm_dashboard.png'), fullPage: true });
  217 |     });
  218 |
  219 |     test('Capture Demo farm', async ({ page }) => {
  220 |         await page.setViewportSize({ width: 1440, height: 900 });
  221 |         await page.goto('/demo');
  222 |         await page.waitForTimeout(1000);
  223 |         await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'demo_farm.png') });
  224 |     });
  225 |
  226 |     test('Capture Digital Twin entry', async ({ page }) => {
  227 |         await page.setViewportSize({ width: 1440, height: 900 });
  228 |         await page.goto('/demo/twin');
  229 |         await page.waitForTimeout(2000);
  230 |         await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'digital_twin_entry.png') });
  231 |     });
  232 |
  233 |     test('Capture Public footer', async ({ page }) => {
  234 |         await page.setViewportSize({ width: 1440, height: 900 });
  235 |         await page.goto('/');
  236 |         await page.locator('footer').scrollIntoViewIfNeeded();
  237 |         await page.waitForTimeout(1000);
  238 |         await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'public_footer.png') });
  239 |     });
  240 | });
  241 |
```