# NEXFIELD Analytics Library

This library provides a scientifically defensible agricultural analytics toolset designed specifically for the NEXFIELD Twin module.

## Scope
Provides pure math and physics logic for biophysical simulation calculations required by the backend, mainly focusing on crop water interactions based on agronomic standards (like FAO-56).

It acts as an isolated and testable collection of logic that processes inputs and computes biophysical metrics.

**Note:** This module does not perform database connections, fastAPI routing, or database migrations, per `AGENTS.md`.

## Features
- **Crop Water Requirement:** Calculate ETc using `ET0 * Kc`.
- **Effective Rainfall:** Estimate the amount of rainfall usable by the crop.
- **Area Conversions:** Support conversion between field sizes (ha) and water volumes (m3).
- **Water Balance Calculations:** Keep track of the soil water deficit considering irrigation, rainfall, and evapotranspiration.
- **Irrigation Efficiency Adjustments:** Adjust water requirements based on irrigation method inefficiencies.
- **Deficit Indicators:** Alert boundaries when crop is water-stressed.
- **Scenario Comparisons:** Evaluate baseline vs alternative conditions for Digital Twin scenarios.

## Integration Instructions
1. Import the pure Python functions from `water_core.py` into your FastAPI router or Pydantic service endpoints (`services/api/...`).
2. Input typed arguments matching `schemas.py` which are compatible with `packages/contracts/src/entities.ts` payloads.
3. Validate and handle all exceptions defined in the pure library before exposing to the client via `ApiResponse<T>`.

## Usage Example

```python
from app.analytics.water_core import calculate_crop_water_requirement
from app.analytics.schemas import CropParameters

params = CropParameters(kc=1.2, et0=5.0)
etc = calculate_crop_water_requirement(params)
print(f"Crop water requirement (ETc): {etc} mm")
```
