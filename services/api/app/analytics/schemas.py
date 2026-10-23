from pydantic import BaseModel, Field, model_validator
from typing import List, Optional

class CropParameters(BaseModel):
    kc: float = Field(..., description="Crop coefficient", ge=0.0)
    et0: float = Field(..., description="Reference evapotranspiration in mm", ge=0.0)

class DailyWeather(BaseModel):
    rainfall_mm: float = Field(..., description="Total daily rainfall in mm", ge=0.0)
    et0_mm: float = Field(..., description="Reference evapotranspiration in mm", ge=0.0)

class IrrigationEvent(BaseModel):
    volume_m3_per_ha: float = Field(..., description="Irrigation volume applied in m3/ha", ge=0.0)
    efficiency: float = Field(1.0, description="Irrigation efficiency fraction (0 to 1)", gt=0.0, le=1.0)

class WaterBalanceInput(BaseModel):
    initial_soil_moisture_mm: float = Field(..., description="Initial soil moisture in mm", ge=0.0)
    soil_capacity_mm: float = Field(..., description="Maximum soil moisture capacity in mm", gt=0.0)
    weather: DailyWeather
    crop_kc: float = Field(..., description="Crop coefficient", ge=0.0)
    irrigation: Optional[IrrigationEvent] = None

    @model_validator(mode='after')
    def check_initial_moisture(self) -> 'WaterBalanceInput':
        if self.initial_soil_moisture_mm > self.soil_capacity_mm:
            raise ValueError("Initial soil moisture cannot exceed soil capacity.")
        return self

class WaterBalanceResult(BaseModel):
    final_soil_moisture_mm: float = Field(..., description="Final soil moisture after day's balance in mm")
    effective_rainfall_mm: float = Field(..., description="Rainfall effectively stored in soil mm")
    crop_evapotranspiration_mm: float = Field(..., description="Crop evapotranspiration (ETc) mm")
    deep_percolation_mm: float = Field(..., description="Water lost to deep percolation mm")
    deficit_indicator: bool = Field(..., description="True if crop is experiencing water stress")
    water_stress_coefficient: float = Field(..., description="Ks stress coefficient (0 to 1)")

class ScenarioInput(BaseModel):
    baseline_yield_mt_per_ha: float = Field(..., description="Baseline estimated yield in MT/ha", ge=0.0)
    alternative_yield_mt_per_ha: float = Field(..., description="Alternative estimated yield in MT/ha", ge=0.0)
    baseline_water_used_m3_per_ha: float = Field(..., description="Baseline total water used in m3/ha", ge=0.0)
    alternative_water_used_m3_per_ha: float = Field(..., description="Alternative total water used in m3/ha", ge=0.0)

class ScenarioComparison(BaseModel):
    yield_delta_percent: float = Field(..., description="Percentage change in yield (alt vs base)")
    water_saved_m3_per_ha: float = Field(..., description="Water saved in m3/ha (base - alt)")
    water_use_efficiency_change_percent: float = Field(..., description="Change in WUE (Yield / Water)")
