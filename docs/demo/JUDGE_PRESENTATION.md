# NEXFIELD — ADAPPT 5.0 Judge Presentation & Evaluation Defense

**Competition:** ADAPPT 5.0 — Round 2  
**Problem Statement:** Domain 2: AI in Food Technology  
**Product:** NEXFIELD — The Agricultural Intelligence Operating System  
**Tagline:** *Observe. Predict. Simulate. Optimize. Grow.*  
**Lead Architect:** Tanish Bane (@TanishBane)  
**Collaborator:** Rohan Panchal (@panchalrohan44)  
**Repository:** `https://github.com/TanishBane/Nexfield`

---

## 1. Executive Summary & Domain Alignment

Agriculture is the foundation of food technology. Every post-harvest loss, food spoilage incident, and price volatility crisis originates in farmgate inefficiencies, inadequate crop disease monitoring, or post-harvest storage mismanagement.

**NEXFIELD** bridges the gap between field agronomy, applied machine learning, and food preservation science. It unifies six core modules into a single, cohesive operating system:

```
[ Field Diagnostics ] ──> [ NEXFIELD Insights ] ──> [ Digital Twin ]
  (FieldSight ONNX)         (Anomaly Engine)         (FAO-56 Soil Water)
         │                         │                         │
         ▼                         ▼                         ▼
[ Harvest Quality ]   ──> [ Operations Ops ]  ──> [ Mandi Markets ]
  (Post-Harvest Risk)       (Tenant Ledger)          (Spatial Arbitrage)
```

---

## 2. Provenance & Architectural Transparency

In strict compliance with our **Law of Contract Truth** and **Capability Matrix** (`docs/architecture/CAPABILITY_MATRIX.md`), NEXFIELD does not exaggerate AI capabilities or fabricate sensor feeds:

| Capability | Engine Type | Provenance & Implementation |
|---|---|---|
| **FieldSight Foliar Diagnosis** | Genuine Machine Learning | CPU-optimized ONNX model (`fieldsight_foliar_v1.onnx`, 95.1 KB, 5.13 ms latency). Computes spatial CAM heatmaps from Conv3 feature activations. |
| **NEXFIELD Insights** | Pattern Recognition | Biophysical bounds verification, stale sensor zero-variance freezes, rate-of-change moisture drops, and rolling MAD modified Z-score anomaly detection. |
| **Digital Twin Simulator** | Biophysical Physics | FAO-56 Penman-Monteith crop evapotranspiration ($ET_c = ET_0 \times K_c$), daily water balance, and volumetric conservation ($1\text{ mm} = 10\text{ m}^3/\text{ha}$). |
| **Harvest Quality Intelligence** | Empirical Storage Rules | FAO Bulletin 149 & ICAR-IIHR criteria for Tomato chilling injury ($<10^\circ\text{C}$), Wheat Aspergillus mold ($>14\%$ moisture), and Basmati Rice fissuring ($>14.5\%$). |
| **Mandi Market Arbitrage** | Economic Optimization | Multi-factor transport freight formula (fuel efficiency, toll charges, driver bhatta, hamali, 1.5% APMC cess, 1.0% transit shrinkage) + Official CACP MSP schedule. |
| **Demo Mode** | Synthetic Baseline | Clearly demarcated with persistent banner: `"Development Mode: Synthetic Agronomic Fixtures"`, initialized with realistic Nashik Tomato Precision Estate (2.4 ha). |

---

## 3. Five-Minute Live Demonstration Narrative

### Minute 0:00 – 1:00 · Public Portal & Instant Demo Ingestion
- **Action:** Open landing page (`http://localhost:3000`).
- **Showcase:** Emphasize the clean dark-mode design system, official typography, and the prominent call-to-action **"Explore Live Demo Experience"**.
- **Judge Walkthrough:** Click into `/demo/control`. Note the persistent top banner:
  > *"Nashik Tomato Precision Estate (Tomato · 2.4 ha · Nashik, Maharashtra) — Development Mode: Synthetic Agronomic Fixtures"*
- **Key Point:** Highlight that judges can evaluate the complete system instantly without entering credentials or configuring hardware, while all mock data is explicitly disclosed.

### Minute 1:00 – 2:00 · FieldSight Real AI Computer Vision
- **Action:** Navigate to **FieldSight** (`/demo/fieldsight` or `/fieldsight`).
- **Showcase:** Select a leaf photograph showing foliar disease (e.g. *Tomato Early Blight* or *Wheat Stripe Rust*).
- **Inference Execution:**
  - Watch the inference execute via ONNX Runtime in $\sim 5\text{ ms}$.
  - Point out the **Class Activation Map (CAM)**: Unlike synthetic mockups that superimpose random gradients, this CAM is computed directly from the 64 feature maps of the 3rd convolutional layer, illuminating the exact pathogen lesion cluster.
  - Review the ICAR mitigation advisory: specific chemical dosages (e.g. *Propiconazole 25% EC @ 500 ml/ha*) and non-chemical cultural practices.
- **Scientific Honesty:** Highlight our Model Card (`ml/model_cards/FIELDSIGHT_MODEL_CARD.md`), which openly reports empirical validation metrics rather than claiming unverified 99% accuracy.

### Minute 2:00 – 3:00 · Digital Twin Biophysical Scenario Simulation
- **Action:** Open **Twin** (`/demo/twin` or `/twin`).
- **Showcase:** The 3D WebGL field parcel rendering soil moisture layers and NDVI vegetative canopy health.
- **Simulation Controls:**
  - Adjust the irrigation withholding slider to simulate a 72-hour dry spell.
  - Observe the real-time volumetric calculations: moisture deficit $\Delta \theta$, water requirement depth in mm, and volume in $\text{m}^3/\text{ha}$.
  - Note the Water Use Efficiency (WUE in $\text{kg/m}^3$) and carbon footprint ($\text{kg CO}_2\text{e/ha}$) projections.

### Minute 3:00 – 4:00 · NEXFIELD Insights & Post-Harvest Food Quality
- **Action:** Navigate to **Ops** (`/demo/ops` or `/ops`).
- **Telemetry Anomaly Detection:**
  - Show detected sensor freeze anomalies (zero variance across 10 consecutive hourly readings) and physical bounds violations (e.g., impossible soil VWC $< 3\%$).
  - Demonstrate 1-click **"Convert to Work Order"**, which generates an operational maintenance dispatch in the farm task ledger.
- **Harvest Quality Intelligence:**
  - Review the post-harvest storage assessment for stored tomato crates:
  - If cold storage dips below $10^\circ\text{C}$, the engine flags **Foliar Chilling Injury** (membrane damage, epidermal pitting, ripening arrest).
  - If godown humidity is dry ($<85\%$), transpirational weight loss is projected, advising immediate wholesale dispatch within 48 hours to preserve Grade A quality.

### Minute 4:00 – 5:00 · Markets Spatial Arbitrage & CACP MSP Schedule
- **Action:** Open **Markets** (`/demo/markets` or `/markets`).
- **Freight Haulage Engine:**
  - Examine the **Multi-Factor Freight & Net Realization Calculator**.
  - Select vehicle type (e.g., Medium 6-Wheeler, 10 Ton GVW, 4.5 km/L fuel efficiency).
  - Walk through itemized deductions: round-trip diesel fuel expense, driver bhatta, toll cess, hamali loading/unloading (₹12/q), APMC market fee (1.5%), and transit shrinkage loss (1.0%).
- **Statutory CACP Matrix:**
  - Inspect the official **CACP Minimum Support Price Reference Matrix** displaying approved Gazette benchmarks:
    - *Wheat RMS 2026-27:* **₹2,585 / quintal** (approved by CCEA).
    - *Wheat RMS 2024-25:* **₹2,275 / quintal** (historical benchmark).
    - *Paddy Common KMS 2024-25:* **₹2,300 / quintal**.
    - *Tomato:* Transparently classified as *Non-MSP Horticultural Produce* covered under Operation Greens and Market Intervention Scheme (MIS).

---

## 4. Anticipated Judge Questions & Technical Defense

### Q1: *"Is this actual machine learning or just hardcoded heuristics?"*
**Answer:** Both, separated cleanly by domain applicability.  
- Visual crop pathology uses a real convolutional neural network exported to ONNX (`fieldsight_foliar_v1.onnx`, 95 KB) and executed CPU-side via `onnxruntime` with 5.13 ms latency. Its Class Activation Maps are generated directly from the Conv3 tensor activations.
- Biophysical telemetry and sensor anomalies use deterministic physics (FAO-56 Penman-Monteith, modified Z-score median absolute deviation). In agronomy, using deep learning to guess whether soil moisture is below field capacity is scientifically irresponsible; deterministic soil physics is the gold standard.

### Q2: *"How does NEXFIELD address the AI in Food Technology problem statement?"*
**Answer:** The greatest loss in food technology occurs between harvest and processing. In India, up to 18% of tomatoes and 6% of foodgrains spoil before reaching the consumer. NEXFIELD addresses this through:
1. **Pre-Harvest Health Optimization:** FieldSight catches foliar rusts and blights before fungal mycotoxins contaminate the grain.
2. **Post-Harvest Quality Intelligence:** Commodity-specific storage rules based on ICAR and FAO protocols evaluate chilling injury risk, Aspergillus mold moisture thresholds, and Basmati milling fissuring.
3. **Logistics Optimization:** Real-time spatial arbitrage calculations ensure produce is transported to the most profitable and reachable APMC terminal before quality degrades.

### Q3: *"How is multi-tenant security handled?"*
**Answer:** NEXFIELD enforces tenant boundary validation at the database query layer:
- Every farm-scoped query explicitly filters on `Farm.owner_id == user.user_id` and verifies `Farm.archived_at.is_(None)`.
- Cross-tenant lookups return HTTP 404 (`FARM_NOT_FOUND`) rather than leaking information via 403.
- Unauthenticated requests are rejected with HTTP 401 (`UNAUTHENTICATED`).
- All 10 end-to-end assertions in `node tests/e2e-smoke.js` verify these boundaries automatically.

### Q4: *"Can a real farmer use this today?"*
**Answer:** Yes. The application features a 5-step interactive farmer onboarding wizard (`/onboarding`), supports CSV/JSON IoT sensor telemetry ingestion (`/data-center`), and provides offline-capable workflows that do not require external cloud API subscriptions.

---

## 5. Verification Commands for Judges

Judges can independently verify all claims directly from the terminal:

```bash
# 1. Run full Python test suite (76 automated tests)
py -m pytest services/api/tests

# 2. Run TypeScript and contract type checks
pnpm type-check

# 3. Run production build
pnpm build

# 4. Run the 10-point end-to-end smoke test suite
pnpm test:e2e
```
