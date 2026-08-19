import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Dict, Any, List

# Load from backend/.env or root .env
env_paths = [
    Path(__file__).resolve().parent.parent.parent / '.env',
    Path(__file__).resolve().parent.parent / '.env',
    Path.cwd() / '.env'
]
for p in env_paths:
    if p.exists():
        load_dotenv(p)

class CityConfig(BaseModel):
    id: str
    name: str
    state: str
    country: str
    lat: float
    lng: float
    zoom: int
    bbox: List[float] # [min_lat, min_lng, max_lat, max_lng]
    default_ambient_temp: float
    description: str

CALIFORNIA_CITIES: Dict[str, CityConfig] = {
    "los_angeles": CityConfig(
        id="los_angeles",
        name="Los Angeles (Downtown & Historic Core)",
        state="California",
        country="USA",
        lat=34.0488,
        lng=-118.2518,
        zoom=14,
        bbox=[34.0200, -118.2850, 34.0750, -118.2200],
        default_ambient_temp=38.5,
        description="Dense urban core with high pedestrian transit corridors, heavy asphalt coverage, and high Urban Heat Island (UHI) intensity."
    ),
    "palm_springs": CityConfig(
        id="palm_springs",
        name="Palm Springs (Downtown & Pedestrian Strip)",
        state="California",
        country="USA",
        lat=33.8247,
        lng=-116.5413,
        zoom=14,
        bbox=[33.7950, -116.5700, 33.8550, -116.5100],
        default_ambient_temp=43.2,
        description="Desert resort city experiencing severe direct solar irradiance exceeding 1,000 W/m² and ambient heat > 42°C."
    ),
    "fresno": CityConfig(
        id="fresno",
        name="Fresno (Fulton St & Tower District)",
        state="California",
        country="USA",
        lat=36.7468,
        lng=-119.7726,
        zoom=14,
        bbox=[36.7150, -119.8200, 36.7800, -119.7400],
        default_ambient_temp=40.1,
        description="Central Valley urban center with significant agricultural heat trapping and unshaded pedestrian walking malls."
    ),
    "sacramento": CityConfig(
        id="sacramento",
        name="Sacramento (Capitol Mall & K Street)",
        state="California",
        country="USA",
        lat=38.5816,
        lng=-121.4944,
        zoom=14,
        bbox=[38.5550, -121.5300, 38.6050, -121.4600],
        default_ambient_temp=37.8,
        description="State capital pedestrian promenade and transit plazas with mixed tree canopy and high afternoon thermal peaks."
    ),
    "san_francisco": CityConfig(
        id="san_francisco",
        name="San Francisco (Market St & Civic Center)",
        state="California",
        country="USA",
        lat=37.7793,
        lng=-122.4192,
        zoom=14,
        bbox=[37.7550, -122.4500, 37.8050, -122.3900],
        default_ambient_temp=32.4,
        description="Dense transit hubs and public plazas experiencing localized microclimate heat spikes during offshore wind events."
    )
}

class Settings:
    PROJECT_NAME: str = "FortyGuard HeatShield"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # FortyGuard API Config
    FORTYGUARD_API_KEY: str = os.getenv("FORTYGUARD_API_KEY", "")
    FORTYGUARD_API_BASE_URL: str = os.getenv("FORTYGUARD_API_BASE_URL", "https://api.fortyguard.com/v1")
    
    # Database
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "heatshield_california")
    
    # Default selection
    DEFAULT_CITY_ID: str = "los_angeles"
    
    # Heat Risk Thresholds (°C)
    TEMP_EXTREME_THRESHOLD: float = 40.0
    TEMP_HIGH_THRESHOLD: float = 37.0
    TEMP_WATCHLIST_THRESHOLD: float = 35.0
    
    # Top % Hotspots cutoff
    TOP_HOTSPOT_PERCENTILE: float = 0.05 # Top 5%

settings = Settings()
