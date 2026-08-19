import math
import logging
import httpx
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger("heatshield.fortyguard")

class FortyGuardThermalEngine:
    """
    FortyGuard Thermal Intelligence & Microclimate Simulation Engine.
    Processes live thermal telemetry or computes rigorous thermodynamic
    surface temperatures, Wet-Bulb Globe Temperatures (WBGT), and UHI intensity.
    """

    @property
    def api_key(self) -> str:
        return settings.FORTYGUARD_API_KEY

    @property
    def base_url(self) -> str:
        return settings.FORTYGUARD_API_BASE_URL

    async def fetch_live_fortyguard_data(self, lat: float, lng: float, radius_m: int = 1000) -> Optional[Dict[str, Any]]:
        """Attempt to query live FortyGuard API if key is set."""
        if not self.api_key:
            return None
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                headers = {
                    "x-api-key": self.api_key,
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                params = {"lat": lat, "lng": lng, "radius": radius_m, "api_key": self.api_key}
                resp = await client.get(f"{self.base_url}/thermal/grid", headers=headers, params=params)
                if resp.status_code == 200:
                    return resp.json()
        except Exception as e:
            logger.warning(f"FortyGuard live API query notice: {e}. Falling back to physics microclimate model.")
        return None

    @staticmethod
    def calculate_thermodynamics(
        ambient_temp: float,
        surface_material: str,
        albedo: float,
        shade_pct: float,
        solar_irradiance: float = 950.0, # W/m² for peak California sunlight
        humidity: float = 28.0, # % (typical dry desert/valley CA heat)
        wind_speed: float = 2.2 # m/s
    ) -> Dict[str, float]:
        """
        Thermodynamic Microclimate Calculation:
        Computes surface temperature, WBGT, heat index, and UHI intensity.
        """
        # Convective heat transfer coefficient (hc)
        hc = 10.0 + 3.8 * wind_speed
        
        # Solar absorption
        solar_absorbed = (1.0 - albedo) * solar_irradiance * (1.0 - (shade_pct / 100.0))
        
        # Evapotranspiration cooling delta (parks/grass vs asphalt)
        evapo_cooling = 0.0
        mat_lower = surface_material.lower()
        if "park" in mat_lower or "grass" in mat_lower or "soil" in mat_lower:
            evapo_cooling = 4.5
        elif "tree" in mat_lower or "canopy" in mat_lower:
            evapo_cooling = 6.0
        elif "cool pavement" in mat_lower or "permeable" in mat_lower:
            evapo_cooling = 3.2

        # Surface Temperature (°C)
        surface_temp = ambient_temp + (solar_absorbed / hc) - evapo_cooling
        
        # Clamp to realistic thermal bounds
        surface_temp = round(max(ambient_temp - 3.0, min(surface_temp, 62.0)), 1)
        
        # Wet-Bulb approximation (Stull formula)
        T = ambient_temp
        RH = humidity
        Tw = (T * math.atan(0.151977 * math.sqrt(RH + 8.313659)) +
              math.atan(T + RH) - math.atan(RH - 1.676331) +
              0.00391838 * (RH ** 1.5) * math.atan(0.023101 * RH) - 4.686035)
        
        # Globe Temperature (radiation exposure)
        Tg = ambient_temp + 0.015 * solar_absorbed * (1.0 - (shade_pct / 100.0) * 0.7)
        
        # WBGT outdoor standard: 0.7 * Tw + 0.2 * Tg + 0.1 * T
        wbgt = round(0.7 * Tw + 0.2 * Tg + 0.1 * T, 1)
        
        # Heat Index (Rothfusz equation simplified for dry/moderate air)
        heat_index = round(ambient_temp + 0.5555 * (6.11 * math.exp(5417.7530 * (1/273.16 - 1/(273.15 + Tw))) - 10), 1)
        if heat_index < ambient_temp:
            heat_index = ambient_temp + 1.2
            
        # UHI Intensity (°C elevation above baseline rural)
        uhi = round(max(0.5, (surface_temp - ambient_temp) * 0.45 + (1.0 - albedo) * 2.0), 1)

        return {
            "surface_temp": surface_temp,
            "ambient_temp": round(ambient_temp, 1),
            "wbgt": wbgt,
            "heat_index": heat_index,
            "uhi_intensity": uhi,
            "solar_irradiance_wm2": solar_irradiance,
            "humidity_pct": humidity,
            "wind_speed_ms": wind_speed
        }

    @classmethod
    def classify_heat_risk(cls, surface_temp: float, wbgt: float) -> str:
        """Categorizes heat risk into 4 standardized levels."""
        if surface_temp >= 45.0 or wbgt >= 32.2:
            return "extreme" # Danger of immediate heat stroke
        elif surface_temp >= 39.0 or wbgt >= 29.4:
            return "high"    # Heat exhaustion likely
        elif surface_temp >= 35.0 or wbgt >= 26.7:
            return "warning" # Potential hotspot / caution for prolonged activity
        else:
            return "safe"

fortyguard_engine = FortyGuardThermalEngine()
