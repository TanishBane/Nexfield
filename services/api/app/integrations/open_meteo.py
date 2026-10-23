from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from itertools import zip_longest

class OpenMeteoHourlyData(BaseModel):
    time: List[datetime]
    temperature_2m: List[Optional[float]] = Field(default_factory=list, description="Temperature in Celsius")
    relative_humidity_2m: List[Optional[float]] = Field(default_factory=list, description="Relative humidity in %")
    rain: List[Optional[float]] = Field(default_factory=list, description="Rainfall in mm")
    wind_speed_10m: List[Optional[float]] = Field(default_factory=list, description="Wind speed in km/h")
    et0_fao_evapotranspiration: List[Optional[float]] = Field(default_factory=list, description="Reference evapotranspiration in mm")

class OpenMeteoDailyData(BaseModel):
    time: List[date]
    temperature_2m_max: List[Optional[float]] = Field(default_factory=list, description="Max temperature in Celsius")
    temperature_2m_min: List[Optional[float]] = Field(default_factory=list, description="Min temperature in Celsius")
    rain_sum: List[Optional[float]] = Field(default_factory=list, description="Total rain in mm")
    et0_fao_evapotranspiration: List[Optional[float]] = Field(default_factory=list, description="Reference evapotranspiration in mm")

class OpenMeteoResponse(BaseModel):
    latitude: float
    longitude: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    elevation: float
    hourly: Optional[OpenMeteoHourlyData] = None
    daily: Optional[OpenMeteoDailyData] = None

class NormalizedWeatherObservation(BaseModel):
    timestamp: datetime
    temperature_celsius: Optional[float]
    humidity_percent: Optional[float]
    rainfall_mm: Optional[float]
    wind_speed_kmh: Optional[float]
    evapotranspiration_mm: Optional[float]

class NormalizedDailyWeather(BaseModel):
    date: date
    max_temperature_celsius: Optional[float]
    min_temperature_celsius: Optional[float]
    rainfall_sum_mm: Optional[float]
    evapotranspiration_mm: Optional[float]

class WeatherForecast(BaseModel):
    source: str = "open-meteo"
    latitude: float
    longitude: float
    hourly_observations: List[NormalizedWeatherObservation]
    daily_observations: List[NormalizedDailyWeather]

from .base import BaseAdapter, IntegrationError

class OpenMeteoAdapter(BaseAdapter):
    """
    Adapter for Open-Meteo Forecast and Archive APIs.
    No API key required for non-commercial use.
    """

    FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
    ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

    def __init__(self, timeout: int = 10):
        super().__init__(base_url=self.FORECAST_URL, timeout=timeout)

    async def get_forecast(self, lat: float, lon: float, days: int = 7) -> WeatherForecast:
        """
        Fetch forecast data for a given location.
        """
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "temperature_2m,relative_humidity_2m,rain,wind_speed_10m,et0_fao_evapotranspiration",
            "daily": "temperature_2m_max,temperature_2m_min,rain_sum,et0_fao_evapotranspiration",
            "timezone": "auto",
            "forecast_days": days
        }

        response = await self._get(self.FORECAST_URL, params=params)
        data = response.json()

        try:
            parsed_data = OpenMeteoResponse(**data)
            return self._normalize_response(parsed_data)
        except Exception as e:
            raise IntegrationError(f"Failed to parse Open-Meteo response: {e}")

    async def get_historical(self, lat: float, lon: float, start_date: date, end_date: date) -> WeatherForecast:
        """
        Fetch historical data for a given location and date range.
        """
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "hourly": "temperature_2m,relative_humidity_2m,rain,wind_speed_10m,et0_fao_evapotranspiration",
            "daily": "temperature_2m_max,temperature_2m_min,rain_sum,et0_fao_evapotranspiration",
            "timezone": "auto"
        }

        response = await self._get(self.ARCHIVE_URL, params=params)
        data = response.json()

        try:
            parsed_data = OpenMeteoResponse(**data)
            return self._normalize_response(parsed_data)
        except Exception as e:
            raise IntegrationError(f"Failed to parse Open-Meteo response: {e}")

    def _normalize_response(self, data: OpenMeteoResponse) -> WeatherForecast:
        """
        Normalize the Open-Meteo API response to standard NEXFIELD formats.
        """
        hourly_obs = []
        if data.hourly:
            for ts, t, rh, r, ws, et in zip_longest(
                data.hourly.time,
                data.hourly.temperature_2m,
                data.hourly.relative_humidity_2m,
                data.hourly.rain,
                data.hourly.wind_speed_10m,
                data.hourly.et0_fao_evapotranspiration,
            ):
                if ts is None:
                    continue
                hourly_obs.append(
                    NormalizedWeatherObservation(
                        timestamp=ts,
                        temperature_celsius=t,
                        humidity_percent=rh,
                        rainfall_mm=r,
                        wind_speed_kmh=ws,
                        evapotranspiration_mm=et,
                    )
                )

        daily_obs = []
        if data.daily:
            for dt, tmax, tmin, r, et in zip_longest(
                data.daily.time,
                data.daily.temperature_2m_max,
                data.daily.temperature_2m_min,
                data.daily.rain_sum,
                data.daily.et0_fao_evapotranspiration,
            ):
                if dt is None:
                    continue
                daily_obs.append(
                    NormalizedDailyWeather(
                        date=dt,
                        max_temperature_celsius=tmax,
                        min_temperature_celsius=tmin,
                        rainfall_sum_mm=r,
                        evapotranspiration_mm=et,
                    )
                )

        return WeatherForecast(
            latitude=data.latitude,
            longitude=data.longitude,
            hourly_observations=hourly_obs,
            daily_observations=daily_obs
        )
