from app.analytics.schemas import CropParameters

def calculate_crop_water_requirement(params: CropParameters) -> float:
    """
    Calculate crop water requirement (ETc) using FAO-56 method.
    ETc = ET0 * Kc
    """
    return params.et0 * params.kc

def calculate_effective_rainfall(total_rainfall_mm: float) -> float:
    """
    Estimate effective rainfall using a simplified USDA SCS method.
    P_eff = P_total * 0.6 if P_total < 250mm/month (approx 8.3mm/day).
    For simplicity on a daily basis:
    If rainfall < 5mm, effective is 0 (lost to evaporation).
    If rainfall >= 5mm, effective is (rainfall - 5) * 0.75, up to a max of maybe reasonable daily.
    We will use a simpler agronomic heuristic:
    Effective rainfall = 80% of rainfall > 5mm, otherwise 0.
    """
    if total_rainfall_mm < 0:
        raise ValueError("Rainfall cannot be negative")

    if total_rainfall_mm <= 5.0:
        return 0.0

    # 80% of the rainfall above 5mm is effective
    return (total_rainfall_mm - 5.0) * 0.8

def convert_ha_to_m2(area_ha: float) -> float:
    """Convert hectares to square meters."""
    if area_ha < 0:
        raise ValueError("Area cannot be negative")
    return area_ha * 10000.0

def convert_mm_to_m3_per_ha(depth_mm: float) -> float:
    """
    Convert depth in mm to volume in cubic meters per hectare.
    1 mm over 1 hectare = 10 m^3
    """
    if depth_mm < 0:
        raise ValueError("Depth cannot be negative")
    return depth_mm * 10.0

def convert_m3_per_ha_to_mm(volume_m3_per_ha: float) -> float:
    """
    Convert volume in cubic meters per hectare to depth in mm.
    10 m^3 over 1 hectare = 1 mm
    """
    if volume_m3_per_ha < 0:
        raise ValueError("Volume cannot be negative")
    return volume_m3_per_ha / 10.0


from app.analytics.schemas import WaterBalanceInput, WaterBalanceResult

def apply_irrigation_efficiency(volume_m3_per_ha: float, efficiency: float) -> float:
    """
    Calculate the effective water added to the soil by irrigation.
    """
    if volume_m3_per_ha < 0:
        raise ValueError("Irrigation volume cannot be negative")
    if efficiency <= 0 or efficiency > 1:
        raise ValueError("Efficiency must be between 0 and 1")
    return volume_m3_per_ha * efficiency

def calculate_daily_water_balance(input_data: WaterBalanceInput) -> WaterBalanceResult:
    """
    Calculate the daily water balance for the soil.
    Tracks soil moisture, effective rainfall, ETc, and deep percolation.
    """
    # 1. Calculate effective rainfall
    effective_rain_mm = calculate_effective_rainfall(input_data.weather.rainfall_mm)

    # 2. Calculate ETc
    etc_mm = calculate_crop_water_requirement(CropParameters(kc=input_data.crop_kc, et0=input_data.weather.et0_mm))

    # 3. Calculate effective irrigation
    effective_irrigation_mm = 0.0
    if input_data.irrigation:
        effective_irrigation_m3 = apply_irrigation_efficiency(
            input_data.irrigation.volume_m3_per_ha,
            input_data.irrigation.efficiency
        )
        effective_irrigation_mm = convert_m3_per_ha_to_mm(effective_irrigation_m3)

    # 4. Calculate new soil moisture before deep percolation
    # Moisture added = effective rain + effective irrigation
    # Moisture lost = ETc
    new_moisture_mm = input_data.initial_soil_moisture_mm + effective_rain_mm + effective_irrigation_mm - etc_mm

    # 5. Handle water deficit and deep percolation
    deep_percolation_mm = 0.0
    water_stress_coefficient = 1.0 # Ks
    deficit_indicator = False

    if new_moisture_mm > input_data.soil_capacity_mm:
        # Soil is oversaturated, water is lost to deep percolation
        deep_percolation_mm = new_moisture_mm - input_data.soil_capacity_mm
        new_moisture_mm = input_data.soil_capacity_mm
    elif new_moisture_mm < 0:
        # Soil is completely dry
        new_moisture_mm = 0.0

    # Simple water stress indicator (if moisture < 50% of capacity)
    if new_moisture_mm < (0.5 * input_data.soil_capacity_mm):
        deficit_indicator = True
        # Ks decreases linearly from 1.0 at 50% capacity to 0.0 at 0% capacity
        water_stress_coefficient = max(0.0, new_moisture_mm / (0.5 * input_data.soil_capacity_mm))

    return WaterBalanceResult(
        final_soil_moisture_mm=new_moisture_mm,
        effective_rainfall_mm=effective_rain_mm,
        crop_evapotranspiration_mm=etc_mm,
        deep_percolation_mm=deep_percolation_mm,
        deficit_indicator=deficit_indicator,
        water_stress_coefficient=water_stress_coefficient
    )


from app.analytics.schemas import ScenarioInput, ScenarioComparison

def compare_scenarios(scenario: ScenarioInput) -> ScenarioComparison:
    """
    Compare a baseline scenario with an alternative scenario.
    Calculates yield delta percentage and water savings.
    """
    # Calculate yield delta percentage
    if scenario.baseline_yield_mt_per_ha == 0:
        yield_delta_percent = 0.0 if scenario.alternative_yield_mt_per_ha == 0 else float('inf')
    else:
        yield_delta_percent = ((scenario.alternative_yield_mt_per_ha - scenario.baseline_yield_mt_per_ha) / scenario.baseline_yield_mt_per_ha) * 100.0

    # Calculate water saved
    water_saved_m3_per_ha = scenario.baseline_water_used_m3_per_ha - scenario.alternative_water_used_m3_per_ha

    # Calculate Water Use Efficiency (WUE = Yield / Water Used)
    # Yield in MT/ha * 1000 = kg/ha
    # Water in m3/ha
    # WUE is often expressed in kg/m3

    if scenario.baseline_water_used_m3_per_ha > 0:
        baseline_wue = (scenario.baseline_yield_mt_per_ha * 1000.0) / scenario.baseline_water_used_m3_per_ha
    else:
        baseline_wue = 0.0

    if scenario.alternative_water_used_m3_per_ha > 0:
        alternative_wue = (scenario.alternative_yield_mt_per_ha * 1000.0) / scenario.alternative_water_used_m3_per_ha
    else:
        alternative_wue = 0.0

    if baseline_wue == 0:
        wue_change_percent = 0.0 if alternative_wue == 0 else float('inf')
    else:
        wue_change_percent = ((alternative_wue - baseline_wue) / baseline_wue) * 100.0

    return ScenarioComparison(
        yield_delta_percent=yield_delta_percent,
        water_saved_m3_per_ha=water_saved_m3_per_ha,
        water_use_efficiency_change_percent=wue_change_percent
    )
