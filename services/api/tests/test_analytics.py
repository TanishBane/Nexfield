import pytest
from app.analytics.water_core import (
    calculate_crop_water_requirement,
    calculate_effective_rainfall,
    convert_ha_to_m2,
    convert_mm_to_m3_per_ha,
    convert_m3_per_ha_to_mm,
    apply_irrigation_efficiency,
    calculate_daily_water_balance,
    compare_scenarios
)
from app.analytics.schemas import (
    CropParameters,
    WaterBalanceInput,
    DailyWeather,
    IrrigationEvent,
    ScenarioInput
)

def test_calculate_crop_water_requirement():
    params = CropParameters(kc=1.2, et0=5.0)
    assert calculate_crop_water_requirement(params) == 6.0

def test_calculate_effective_rainfall_zero():
    assert calculate_effective_rainfall(0.0) == 0.0

def test_calculate_effective_rainfall_low():
    assert calculate_effective_rainfall(4.0) == 0.0

def test_calculate_effective_rainfall_high():
    # 25 - 5 = 20 * 0.8 = 16.0
    assert calculate_effective_rainfall(25.0) == 16.0

def test_calculate_effective_rainfall_negative():
    with pytest.raises(ValueError):
        calculate_effective_rainfall(-5.0)

def test_conversions():
    assert convert_ha_to_m2(2.5) == 25000.0
    assert convert_mm_to_m3_per_ha(10.0) == 100.0
    assert convert_m3_per_ha_to_mm(50.0) == 5.0

    with pytest.raises(ValueError):
        convert_ha_to_m2(-1.0)
    with pytest.raises(ValueError):
        convert_mm_to_m3_per_ha(-1.0)
    with pytest.raises(ValueError):
        convert_m3_per_ha_to_mm(-1.0)

def test_apply_irrigation_efficiency():
    assert apply_irrigation_efficiency(100.0, 0.8) == 80.0
    with pytest.raises(ValueError):
        apply_irrigation_efficiency(-10.0, 0.8)
    with pytest.raises(ValueError):
        apply_irrigation_efficiency(100.0, 1.2)
    with pytest.raises(ValueError):
        apply_irrigation_efficiency(100.0, -0.1)

def test_daily_water_balance_no_rain_no_irrigation():
    input_data = WaterBalanceInput(
        initial_soil_moisture_mm=50.0,
        soil_capacity_mm=100.0,
        weather=DailyWeather(rainfall_mm=0.0, et0_mm=5.0),
        crop_kc=1.0,
        irrigation=None
    )
    result = calculate_daily_water_balance(input_data)
    assert result.effective_rainfall_mm == 0.0
    assert result.crop_evapotranspiration_mm == 5.0
    assert result.final_soil_moisture_mm == 45.0
    assert result.deep_percolation_mm == 0.0
    assert result.deficit_indicator == True # 45 < 50
    assert result.water_stress_coefficient == 0.9 # 45 / 50

def test_daily_water_balance_with_rain_and_irrigation():
    input_data = WaterBalanceInput(
        initial_soil_moisture_mm=50.0,
        soil_capacity_mm=100.0,
        weather=DailyWeather(rainfall_mm=15.0, et0_mm=5.0), # effective rain = 8.0
        crop_kc=1.0,
        irrigation=IrrigationEvent(volume_m3_per_ha=100.0, efficiency=1.0) # effective irrigation = 10.0 mm
    )
    result = calculate_daily_water_balance(input_data)
    assert result.effective_rainfall_mm == 8.0
    assert result.crop_evapotranspiration_mm == 5.0
    # 50 + 8 + 10 - 5 = 63.0
    assert result.final_soil_moisture_mm == 63.0
    assert result.deep_percolation_mm == 0.0
    assert result.deficit_indicator == False
    assert result.water_stress_coefficient == 1.0

def test_daily_water_balance_oversaturation():
    input_data = WaterBalanceInput(
        initial_soil_moisture_mm=95.0,
        soil_capacity_mm=100.0,
        weather=DailyWeather(rainfall_mm=30.0, et0_mm=5.0), # effective rain = 20.0
        crop_kc=1.0,
        irrigation=None
    )
    result = calculate_daily_water_balance(input_data)
    # 95 + 20 - 5 = 110.0 => 100 max, 10 deep perc
    assert result.final_soil_moisture_mm == 100.0
    assert result.deep_percolation_mm == 10.0

def test_daily_water_balance_complete_dry():
    input_data = WaterBalanceInput(
        initial_soil_moisture_mm=2.0,
        soil_capacity_mm=100.0,
        weather=DailyWeather(rainfall_mm=0.0, et0_mm=5.0),
        crop_kc=1.0,
        irrigation=None
    )
    result = calculate_daily_water_balance(input_data)
    # 2 + 0 - 5 = -3 => 0.0
    assert result.final_soil_moisture_mm == 0.0
    assert result.deficit_indicator == True
    assert result.water_stress_coefficient == 0.0

def test_daily_water_balance_invalid_initial_moisture():
    with pytest.raises(ValueError):
        WaterBalanceInput(
            initial_soil_moisture_mm=110.0,
            soil_capacity_mm=100.0,
            weather=DailyWeather(rainfall_mm=0.0, et0_mm=5.0),
            crop_kc=1.0,
            irrigation=None
        )

def test_compare_scenarios():
    scenario = ScenarioInput(
        baseline_yield_mt_per_ha=10.0,
        alternative_yield_mt_per_ha=12.0,
        baseline_water_used_m3_per_ha=5000.0,
        alternative_water_used_m3_per_ha=4000.0
    )
    result = compare_scenarios(scenario)
    assert result.yield_delta_percent == 20.0
    assert result.water_saved_m3_per_ha == 1000.0
    # Base WUE = 10000 / 5000 = 2.0
    # Alt WUE = 12000 / 4000 = 3.0
    # Change = (3 - 2) / 2 = 50%
    assert result.water_use_efficiency_change_percent == 50.0

def test_compare_scenarios_zero_baseline():
    scenario = ScenarioInput(
        baseline_yield_mt_per_ha=0.0,
        alternative_yield_mt_per_ha=12.0,
        baseline_water_used_m3_per_ha=0.0,
        alternative_water_used_m3_per_ha=4000.0
    )
    result = compare_scenarios(scenario)
    assert result.yield_delta_percent == float('inf')
    assert result.water_use_efficiency_change_percent == float('inf')

def test_compare_scenarios_zero_both():
    scenario = ScenarioInput(
        baseline_yield_mt_per_ha=0.0,
        alternative_yield_mt_per_ha=0.0,
        baseline_water_used_m3_per_ha=0.0,
        alternative_water_used_m3_per_ha=0.0
    )
    result = compare_scenarios(scenario)
    assert result.yield_delta_percent == 0.0
    assert result.water_use_efficiency_change_percent == 0.0
