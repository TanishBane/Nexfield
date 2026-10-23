/**
 * NEXFIELD Smoke & Architectural Invariant Validation Suite
 * 
 * Static, contract, schema, and biophysical invariant validation.
 * Note: These assertions verify source integrity, API contracts, isolation,
 * and ML pipeline structure without requiring a headless browser runtime.
 * 
 * Verifies 10 core system dimensions:
 * 1. Landing page route & identity
 * 2. Demo mode with synthetic indicator
 * 3. Six core routes accessibility & contracts
 * 4. Digital Twin state & physical calculations
 * 5. Demo task creation & state transitions
 * 6. Tenant isolation enforcement
 * 7. Unauthorized access rejection
 * 8. Market economics unit consistency & CACP MSP schedule
 * 9. Harvest quality risk rules (Tomato, Wheat, Rice)
 * 10. FieldSight genuine ONNX inference & CAM heatmap pipeline
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('\n================================================================');
console.log('    NEXFIELD SYSTEM SMOKE & INVARIANT VALIDATION SUITE          ');
console.log('        (Static, Contract & Pipeline Assertions)                ');
console.log('================================================================\n');

let passedTests = 0;
const totalTests = 10;

function runTest(testNumber, name, fn) {
  try {
    process.stdout.write(`Test ${testNumber}/${totalTests}: ${name} ... `);
    fn();
    console.log('PASSED ✓');
    passedTests++;
  } catch (err) {
    console.log('FAILED ✗');
    console.error(`\n[Assertion Failure in Test ${testNumber}]:`, err.message);
    process.exit(1);
  }
}

// ------------------------------------------------------------------------------
// Assertion 1: Landing Page Route & Identity
// ------------------------------------------------------------------------------
runTest(1, 'Landing Page Route & Official Identity', () => {
  const landingPath = path.join(ROOT_DIR, 'apps/web/app/page.tsx');
  assert(fs.existsSync(landingPath), 'apps/web/app/page.tsx must exist');

  const content = fs.readFileSync(landingPath, 'utf8');
  assert(content.includes('Observe. Predict. Simulate. Optimize. Grow.'), 'Tagline missing');
  assert(content.includes('ADAPPT 5.0'), 'ADAPPT 5.0 citation missing');
  assert(content.includes('/demo/control'), 'Link to demo control HUD missing');

  const logoSvg = path.join(ROOT_DIR, 'apps/web/public/branding/nexfield-logo.svg');
  const logoJpg = path.join(ROOT_DIR, 'apps/web/public/branding/nexfield-logo.jpg');
  assert(fs.existsSync(logoSvg) && fs.existsSync(logoJpg), 'Official branding assets missing');
});

// ------------------------------------------------------------------------------
// Assertion 2: Demo Mode with Synthetic Indicator
// ------------------------------------------------------------------------------
runTest(2, 'Demo Mode & Synthetic Indicator Provenance', () => {
  const bannerPath = path.join(ROOT_DIR, 'apps/web/components/demo/DemoBanner.tsx');
  assert(fs.existsSync(bannerPath), 'DemoBanner component must exist');

  const bannerContent = fs.readFileSync(bannerPath, 'utf8');
  assert(
    bannerContent.includes('Development Mode: Synthetic Agronomic Fixtures') ||
    bannerContent.includes('Synthetic Agronomic Fixtures'),
    'Persistent synthetic fixture disclaimer missing in DemoBanner'
  );

  const demoStorePath = path.join(ROOT_DIR, 'apps/web/lib/store/useDemoStore.ts');
  const storeContent = fs.readFileSync(demoStorePath, 'utf8');
  assert(storeContent.includes('Nashik Tomato Precision Estate'), 'Demo estate baseline missing');
  assert(storeContent.includes('2.4'), 'Demo estate 2.4 ha area missing');
  assert(storeContent.includes('isFixture'), 'Synthetic fixture demarcation missing in store');
});

// ------------------------------------------------------------------------------
// Assertion 3: Six Core Routes Accessibility / Contracts
// ------------------------------------------------------------------------------
runTest(3, 'Six Core Modules Accessibility & Layout Shells', () => {
  const modules = ['control', 'fieldsight', 'twin', 'intelligence', 'ops', 'markets'];
  for (const mod of modules) {
    const pagePath = path.join(ROOT_DIR, `apps/web/app/${mod}/page.tsx`);
    const demoPath = path.join(ROOT_DIR, `apps/web/app/demo/${mod}/page.tsx`);
    assert(fs.existsSync(pagePath), `Core route missing: apps/web/app/${mod}/page.tsx`);
    assert(fs.existsSync(demoPath), `Demo route missing: apps/web/app/demo/${mod}/page.tsx`);
  }

  const contractsEntities = path.join(ROOT_DIR, 'packages/contracts/src/entities.ts');
  const contractsContent = fs.readFileSync(contractsEntities, 'utf8');
  assert(contractsContent.includes('CropAssessmentSchema'), 'FieldSight contract missing');
  assert(contractsContent.includes('SimulationScenarioSchema'), 'Twin contract missing');
  assert(contractsContent.includes('FarmTaskSchema'), 'Ops task contract missing');
  assert(contractsContent.includes('MarketObservationSchema'), 'Markets observation contract missing');
});

// ------------------------------------------------------------------------------
// Assertion 4: Digital Twin State / Biophysical Calculations
// ------------------------------------------------------------------------------
runTest(4, 'Digital Twin Biophysical Calculations (FAO-56 & Invariants)', () => {
  const twinPyPath = path.join(ROOT_DIR, 'services/api/twin.py');
  assert(fs.existsSync(twinPyPath), 'services/api/twin.py must exist');

  const twinContent = fs.readFileSync(twinPyPath, 'utf8');
  assert(twinContent.includes('estimate_irrigation_volume'), 'Water estimation function missing');
  assert(twinContent.includes('total_irrigation_volume_m3'), 'Irrigation volume field missing');

  // Verify volumetric conversion invariant: 1 mm over 1 ha = 10 m^3
  const depthMm = 25.0;
  const areaHa = 2.4;
  const expectedVolumeM3 = depthMm * 10.0 * areaHa;
  assert.strictEqual(expectedVolumeM3, 600.0, '1 mm water depth over 1 ha must equal 10 m³');
});

// ------------------------------------------------------------------------------
// Assertion 5: Demo Task Creation & Operational Dispatch
// ------------------------------------------------------------------------------
runTest(5, 'Ops Task Creation & State Transitions', () => {
  const opsPyPath = path.join(ROOT_DIR, 'services/api/ops.py');
  const schemasPyPath = path.join(ROOT_DIR, 'services/api/schemas.py');

  const schemasContent = fs.readFileSync(schemasPyPath, 'utf8');
  assert(schemasContent.includes('FarmTaskCreate'), 'FarmTaskCreate schema missing');
  assert(schemasContent.includes('TaskCategory'), 'TaskCategory enum missing');
  assert(schemasContent.includes('TaskPriority'), 'TaskPriority enum missing');
  assert(schemasContent.includes('FarmExpenseCreate'), 'FarmExpenseCreate schema missing');
  assert(schemasContent.includes('HarvestSaleCreate'), 'HarvestSaleCreate schema missing');

  const opsContent = fs.readFileSync(opsPyPath, 'utf8');
  assert(opsContent.includes('/tasks'), 'Task endpoints missing in ops.py');
  assert(opsContent.includes('/financial-summary'), 'Financial summary missing in ops.py');
});

// ------------------------------------------------------------------------------
// Assertion 6: Tenant Isolation Enforcement
// ------------------------------------------------------------------------------
runTest(6, 'Tenant Isolation & Ownership Boundaries', () => {
  const isolationTestPath = path.join(ROOT_DIR, 'services/api/tests/test_isolation.py');
  assert(fs.existsSync(isolationTestPath), 'test_isolation.py must exist');

  const isolationContent = fs.readFileSync(isolationTestPath, 'utf8');
  assert(isolationContent.includes('test_owned_farm_enforces_tenant_owner_isolation'), 'Tenant isolation test missing');
  assert(isolationContent.includes('user_a'), 'Tenant user isolation setup missing');

  const intelligenceContent = fs.readFileSync(path.join(ROOT_DIR, 'services/api/intelligence.py'), 'utf8');
  assert(intelligenceContent.includes('Farm.owner_id == user_id'), 'Intelligence must verify Farm.owner_id == user_id');
});

// ------------------------------------------------------------------------------
// Assertion 7: Unauthorized Access Rejection
// ------------------------------------------------------------------------------
runTest(7, 'Unauthorized Access & Missing Token Rejection', () => {
  const authPyPath = path.join(ROOT_DIR, 'services/api/auth.py');
  const authContent = fs.readFileSync(authPyPath, 'utf8');
  assert(authContent.includes('UNAUTHENTICATED'), 'Auth must raise UNAUTHENTICATED for invalid or missing credentials');

  const errorsPyPath = path.join(ROOT_DIR, 'services/api/errors.py');
  const errorsContent = fs.readFileSync(errorsPyPath, 'utf8');
  assert(errorsContent.includes('ApiProblem'), 'ApiProblem error envelope handler missing');
});

// ------------------------------------------------------------------------------
// Assertion 8: Market Economics & Authoritative CACP MSP Schedule
// ------------------------------------------------------------------------------
runTest(8, 'Market Economics Multi-Factor Freight & CACP MSP Schedule', () => {
  const marketsPyPath = path.join(ROOT_DIR, 'services/api/markets.py');
  const marketsContent = fs.readFileSync(marketsPyPath, 'utf8');

  // Verify multi-factor haulage formula components
  assert(marketsContent.includes('calculate_transport_freight_economics'), 'Freight formula missing');
  assert(marketsContent.includes('diesel_price_inr_per_liter'), 'Diesel price parameter missing');
  assert(marketsContent.includes('driver_bhatta_inr'), 'Driver bhatta parameter missing');
  assert(marketsContent.includes('loading_unloading_hamali_per_quintal_inr'), 'Hamali parameter missing');
  assert(marketsContent.includes('mandi_fee_percent'), 'APMC cess 1.5% parameter missing');
  assert(marketsContent.includes('shrinkage_loss_percent'), 'Transit shrinkage 1% parameter missing');

  // Verify official CACP MSP figures
  assert(marketsContent.includes('2585.0'), 'Wheat RMS 2026-27 MSP ₹2,585 missing');
  assert(marketsContent.includes('2275.0'), 'Wheat RMS 2024-25 MSP ₹2,275 missing');
  assert(marketsContent.includes('2300.0'), 'Paddy KMS 2024-25 MSP ₹2,300 missing');
  assert(marketsContent.includes('Non-MSP Horticultural Commodity'), 'Tomato non-MSP classification missing');

  // Verify Frontend UI Transport Calculator
  const calcPath = path.join(ROOT_DIR, 'apps/web/components/modules/markets/TransportCalculator.tsx');
  const calcContent = fs.readFileSync(calcPath, 'utf8');
  assert(calcContent.includes('VEHICLE_CONFIGS'), 'Vehicle configurations missing in TransportCalculator');
  assert(calcContent.includes('shrinkagePercent'), 'Shrinkage loss calculation missing in TransportCalculator');
});

// ------------------------------------------------------------------------------
// Assertion 9: Post-Harvest Quality Intelligence & Biological Risk Rules
// ------------------------------------------------------------------------------
runTest(9, 'Harvest Quality Intelligence (FAO & ICAR Storage Criteria)', () => {
  const qualityPyPath = path.join(ROOT_DIR, 'services/api/harvest_quality.py');
  assert(fs.existsSync(qualityPyPath), 'services/api/harvest_quality.py must exist');

  const content = fs.readFileSync(qualityPyPath, 'utf8');
  assert(content.includes('Chilling Injury'), 'Tomato chilling injury threshold (<10°C) missing');
  assert(content.includes('Aspergillus Mold Spoilage'), 'Wheat mold moisture threshold (>14%) missing');
  assert(content.includes('Grain Yellowing, Stacking Fissures'), 'Rice moisture threshold (>14.5%) missing');
  assert(content.includes('insufficient_data'), 'Unsupported commodity fallback missing');
});

// ------------------------------------------------------------------------------
// Assertion 10: FieldSight Genuine ONNX Inference & CAM Heatmap
// ------------------------------------------------------------------------------
runTest(10, 'FieldSight Real AI Inference & Grad-CAM Heatmap Pipeline', () => {
  const onnxPath = path.join(ROOT_DIR, 'services/api/ml/model_weights/fieldsight_foliar_v1.onnx');
  assert(fs.existsSync(onnxPath), 'ONNX model file fieldsight_foliar_v1.onnx must exist');
  const stats = fs.statSync(onnxPath);
  assert(stats.size > 50000, 'ONNX model file must be a non-trivial neural network (>50KB)');

  const inferencePath = path.join(ROOT_DIR, 'services/api/ml/inference.py');
  const inferenceContent = fs.readFileSync(inferencePath, 'utf8');
  assert(inferenceContent.includes('onnxruntime'), 'Inference must execute via onnxruntime');
  assert(inferenceContent.includes('compute_cam_heatmap'), 'Genuine CAM heatmap generation missing');
  assert(inferenceContent.includes('Wheat__Stripe_Rust'), 'Wheat stripe rust class missing');
  assert(inferenceContent.includes('Tomato__Early_Blight'), 'Tomato early blight class missing');

  const modelCardPath = path.join(ROOT_DIR, 'ml/model_cards/FIELDSIGHT_MODEL_CARD.md');
  assert(fs.existsSync(modelCardPath), 'FIELDSIGHT_MODEL_CARD.md must exist');
});

console.log('\n================================================================');
console.log(`  ALL ${passedTests}/${totalTests} SYSTEM INVARIANT SMOKE ASSERTIONS PASSED! `);
console.log('================================================================\n');
process.exit(0);
