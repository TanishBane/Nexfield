# NEXFIELD System API Specification & Contracts (v1.0)

**Document Owner:** Shared Architecture Council  
**Frontend Implementation Lead (Developer A):** Google Antigravity  
**Backend Implementation Lead (Developer B):** OpenAI Codex  
**Integration & Data Adapters:** Google Jules  

---

## 1. Architectural Principles & Invariants

1. **Envelope Consistency:** Every HTTP response must return the standardized `ApiResponse<T>` envelope.
   ```json
   {
     "success": true,
     "data": { ... },
     "error": null,
     "meta": {
       "timestamp": "2026-10-24T00:00:00Z",
       "version": "v1",
       "isFixture": false,
       "requestId": "req-98f2b"
     }
   }
   ```
2. **Fixture Demarcation:** In local development, the frontend invokes a fixture adapter when `NEXT_PUBLIC_USE_FIXTURES=true` or backend is unreachable. All fixture responses explicitly set `"isFixture": true`.
3. **No Unilateral Redesign:** Neither Developer A nor Developer B may change contract payloads or database column conventions without synchronizing `packages/contracts` and `docs/contracts`.
4. **Units of Measurement Standard:**
   - **Land Area:** Hectares (`ha`)
   - **Crop Yield:** Metric Tons (`MT` or `t`) and Metric Tons per Hectare (`MT/ha`)
   - **Market Weights & Volumes:** Quintals (`100 kg`) and Metric Tons
   - **Currency:** Indian Rupee (`INR` / `₹`)
   - **Nutrients:** Kilograms per hectare (`kg/ha`)
   - **Moisture & Organic Carbon:** Percentages (`%`)
   - **Soil pH:** Standard logarithmic scale `0.0 - 14.0`

---

## 2. Common Entities Reference (12 Core Entities)

| # | Entity | Domain Description |
|---|---|---|
| 1 | `User` | Authenticated farmer, agronomist, or field officer profile |
| 2 | `Farm` | Geospatial agricultural holding with soil profile and irrigation taxonomy |
| 3 | `Field` | Delineated operational parcel with continuous soil telemetry and coordinates |
| 4 | `CropCycle` | Temporal cultivation season (Kharif, Rabi, Zaid) with phenological growth tracking |
| 5 | `Observation` | Multi-source telemetry event (IoT probe, weather station, satellite NDVI) |
| 6 | `CropAssessment` | FieldSight AI diagnosis (foliar disease, pest vector, severity, Grad-CAM heatmap) |
| 7 | `SimulationScenario`| Digital Twin what-if intervention projection (irrigation, nitrogen, yield delta) |
| 8 | `FarmTask` | Operational dispatch task (irrigation, spraying, harvesting, equipment) |
| 9 | `InventoryTransaction`| Seed, fertilizer, agrochemical, and diesel ledger entries with cost tracking |
| 10 | `HarvestBatch` | Post-harvest lot with quality grading (moisture, foreign matter) and storage state |
| 11 | `MarketObservation` | Official daily Mandi price observation (min, max, modal, arrival volumes) |
| 12 | `MarketComparison` | Multi-mandi spatial arbitrage analysis calculating net transport/freight margins |

---

## 3. Endpoints by Module

### Module 1: NEXFIELD Control (Farm Command Center)
- `GET /api/v1/control/overview?farmId={uuid}`
  - Returns: aggregated telemetry, active alerts, current crop cycles, weather summary, and urgent tasks.
- `GET /api/v1/control/telemetry?fieldId={uuid}&timeframe=24h|7d|30d`
  - Returns: time-series sensor data (soil moisture, temperature, EC, solar radiation).
- `GET /api/v1/control/alerts?farmId={uuid}&status=active|dismissed`
  - Returns: prioritized agronomic risk alerts.

### Module 2: FieldSight AI (Visual Crop Diagnosis)
- `POST /api/v1/fieldsight/diagnose`
  - Request body: `{ fieldId, cropCycleId?, imageUrl, cropSpecies, scoutingNotes? }`
  - Returns: condition diagnosis, pathogen name, confidence score (0-1), affected percentage, Grad-CAM heatmap overlay URL, organic/chemical recommendations.
- `GET /api/v1/fieldsight/history?fieldId={uuid}`
  - Returns: list of past visual assessments with severity progression.

### Module 3: NEXFIELD Twin (Scenario Simulator)
- `GET /api/v1/twin/fields/{fieldId}/state`
  - Returns: digital twin current state (3D boundary mesh, moisture layer, vegetative health).
- `POST /api/v1/twin/simulate`
  - Request body: `{ fieldId, cycleId, title, interventions: { irrigationScheduleDays, irrigationVolumeM3PerHa, nitrogenTopDressingKgPerHa, biostimulantApplied } }`
  - Returns: simulated yield projection (`MT/ha`), delta vs baseline, water use efficiency, carbon footprint, risk index.

### Module 4: NEXFIELD Intelligence (Agricultural Copilot)
- `POST /api/v1/intelligence/chat`
  - Request body: `{ farmId, fieldId?, userQuery, conversationHistory? }`
  - Returns: streaming or JSON LLM response grounded in real farm telemetry, with citations and actionable next steps.
  - Current backend status: returns `503 LLM_UNAVAILABLE` until a configured provider is available.

### Module 5: NEXFIELD Ops (Farm Operations & Harvests)
- `GET /api/v1/ops/tasks?farmId={uuid}&status={status}&priority={priority}`
  - Returns: task schedule and resource assignments.
- `POST /api/v1/ops/tasks`
  - Request body: `CreateTaskRequest`
- `GET /api/v1/ops/inventory?farmId={uuid}`
  - Returns: stock levels, burn rate, valuation.
- `GET /api/v1/ops/harvest-batches?farmId={uuid}`
  - Returns: harvest lots, grading, warehouse allocation.
- `POST /api/v1/ops/expenses?farmId={uuid}`
  - Records an owner-scoped farm expense with INR amount and idempotency key.
- `GET /api/v1/ops/expenses?farmId={uuid}&category={category}`
  - Returns persisted farm expenses, optionally filtered by category.
- `POST /api/v1/ops/sales?farmId={uuid}`
  - Records a sale against a settled harvest batch and prevents overselling.
- `GET /api/v1/ops/sales?farmId={uuid}`
  - Returns persisted harvest sale records.
- `GET /api/v1/ops/financial-summary?farmId={uuid}`
  - Returns expense totals, persisted sale revenue, explicit target-price projections, estimated net profit, and inventory valuation.

### Module 6: NEXFIELD Markets (Mandi Intelligence & Arbitrage)
- `GET /api/v1/markets/prices?commodity={string}&state={string}&district={string}`
  - Returns: real mandi observations, modal price trends, and arrival volumes.
- `GET /api/v1/markets/arbitrage?commodity={string}&originMandi={string}`
  - Returns: spatial price comparison across neighboring mandis minus freight and mandi cess, identifying net profitable arbitrage opportunities.
  - Current backend status: returns `503 MARKET_DATA_UNAVAILABLE` until a verified market adapter is available.
