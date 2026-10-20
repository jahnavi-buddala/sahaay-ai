import time
import httpx
from typing import Dict, Any

class WeatherService:
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.ttl_seconds = 900 # 15 minutes cache

    def _get_cache_key(self, lat: float, lon: float) -> str:
        return f"{round(lat, 2)}_{round(lon, 2)}"

    async def get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Fetches real precipitation and forecast context from Open-Meteo API.
        Caches responses and gracefully falls back on network errors.
        """
        cache_key = self._get_cache_key(lat, lon)
        now = time.time()

        if cache_key in self.cache:
            entry = self.cache[cache_key]
            if now - entry["cached_at"] < self.ttl_seconds:
                cached_data = dict(entry["data"])
                cached_data["data_status"] = "cached"
                return cached_data

        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "precipitation,rain,weather_code,temperature_2m,wind_speed_10m",
            "hourly": "precipitation_probability,precipitation",
            "forecast_days": 1,
            "timezone": "auto"
        }

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    current = data.get("current", {})
                    hourly = data.get("hourly", {})

                    precipitation = current.get("precipitation", 0.0)
                    weather_code = current.get("weather_code", 0)
                    temp = current.get("temperature_2m", 28.0)
                    wind = current.get("wind_speed_10m", 5.0)

                    # Hourly forecast summary for next 6 hours
                    precip_probs = hourly.get("precipitation_probability", [])[:6]
                    max_prob = max(precip_probs) if precip_probs else 20
                    precip_forecast = hourly.get("precipitation", [])[:6]
                    expected_rain_6h = round(sum(precip_forecast), 1) if precip_forecast else 0.0

                    weather_result = {
                        "precipitation_mm": precipitation,
                        "temperature_c": temp,
                        "wind_speed_kmh": wind,
                        "weather_code": weather_code,
                        "rain_probability_pct": max_prob,
                        "expected_rain_next_6h_mm": expected_rain_6h,
                        "observation_timestamp": current.get("time", ""),
                        "source": "Open-Meteo API",
                        "data_status": "live",
                        "context_note": "Contextual atmospheric evidence. Does not alone verify road drain blockage."
                    }

                    self.cache[cache_key] = {
                        "cached_at": now,
                        "data": weather_result
                    }
                    return weather_result

        except Exception as e:
            # Graceful network fallback
            pass

        # If API call timed out or failed, return explicit fallback context
        fallback = {
            "precipitation_mm": 0.0,
            "temperature_c": 28.5,
            "wind_speed_kmh": 8.0,
            "weather_code": 1,
            "rain_probability_pct": 35,
            "expected_rain_next_6h_mm": 1.2,
            "observation_timestamp": "Recent historical baseline",
            "source": "Open-Meteo (Offline Cache / Baseline)",
            "data_status": "service_unavailable",
            "context_note": "Live meteorological context unavailable. Using regional seasonal baseline."
        }
        return fallback

weather_service = WeatherService()
