const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- NEXFIELD SAAS PLATFORM VERIFICATION ---');

// 1. Verify Logo Assets
const logoJpgPath = path.join(__dirname, '..', 'apps', 'web', 'public', 'branding', 'nexfield-logo.jpg');
const logoSvgPath = path.join(__dirname, '..', 'apps', 'web', 'public', 'branding', 'nexfield-logo.svg');
const iconSvgPath = path.join(__dirname, '..', 'apps', 'web', 'app', 'icon.svg');

assert(fs.existsSync(logoJpgPath), 'Official nexfield-logo.jpg must exist in public/branding');
assert(fs.existsSync(logoSvgPath), 'nexfield-logo.svg vector asset must exist in public/branding');
assert(fs.existsSync(iconSvgPath), 'icon.svg must exist in apps/web/app for browser favicon');
console.log('✓ Official logo assets verified (JPG, SVG, and favicon)');

// 2. Verify Key Pages Exist
const expectedPages = [
  'apps/web/app/page.tsx', // Public Marketing Landing
  'apps/web/app/onboarding/page.tsx', // 5-step Farmer Onboarding Wizard
  'apps/web/app/data-center/page.tsx', // Data Ingestion Center
  'apps/web/app/demo/control/page.tsx', // Demo Control HUD
  'apps/web/app/demo/twin/page.tsx', // Demo 3D Twin Simulator
  'apps/web/app/demo/fieldsight/page.tsx', // Demo FieldSight AI
  'apps/web/app/demo/intelligence/page.tsx', // Demo Agronomic Copilot
  'apps/web/app/demo/ops/page.tsx', // Demo Ops Ledger
  'apps/web/app/demo/markets/page.tsx', // Demo Mandi Spreads
  'apps/web/components/branding/NexfieldLogo.tsx', // Logo component
  'apps/web/components/demo/DemoBanner.tsx', // Demo Mode banner
  'apps/web/lib/store/useDemoStore.ts', // Isolated Demo Store
];

for (const p of expectedPages) {
  const fullPath = path.join(__dirname, '..', p);
  assert(fs.existsSync(fullPath), `Expected file must exist: ${p}`);
}
console.log(`✓ All ${expectedPages.length} core SaaS platform pages and components verified`);

// 3. Verify Landing Page Content
const landingContent = fs.readFileSync(path.join(__dirname, '..', 'apps/web/app/page.tsx'), 'utf8');
assert(landingContent.includes('Observe. Predict. Simulate. Optimize. Grow.'), 'Landing page must feature official tagline');
assert(landingContent.includes('ADAPPT 5.0'), 'Landing page must cite ADAPPT 5.0 problem statement');
assert(landingContent.includes('/demo/control'), 'Landing page must link to interactive demo');
assert(landingContent.includes('/login'), 'Landing page must link to authentication portal');
console.log('✓ Public SaaS landing page copy and value propositions verified');

// 4. Verify Demo Store Logic
const demoStoreContent = fs.readFileSync(path.join(__dirname, '..', 'apps/web/lib/store/useDemoStore.ts'), 'utf8');
assert(demoStoreContent.includes('Nashik Tomato Precision Estate'), 'Demo store must be initialized with Nashik Tomato Estate');
assert(demoStoreContent.includes('2.4'), 'Demo store must specify 2.4 hectares area');
assert(demoStoreContent.includes('toggleDripIrrigation'), 'Demo store must support interactive drip irrigation toggle');
assert(demoStoreContent.includes('applyWhatIfScenario'), 'Demo store must support biophysical what-if scenarios');
assert(demoStoreContent.includes('resetDemo'), 'Demo store must support 1-click state reset');
console.log('✓ Isolated demo store domain accuracy and actions verified');

// 5. Verify AGENTS.md Governance
const agentsMd = fs.readFileSync(path.join(__dirname, '..', 'AGENTS.md'), 'utf8');
assert(agentsMd.includes('Tanish Bane (@TanishBane)'), 'AGENTS.md must list Tanish Bane as frontend lead');
assert(agentsMd.includes('Rohan Panchal (@panchalrohan44)'), 'AGENTS.md must list Rohan Panchal as backend lead');
console.log('✓ AGENTS.md multi-agent governance and real developer identities verified');

console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY (5/5) ---');
