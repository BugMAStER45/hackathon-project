import random
import logging
import httpx
from typing import List, Dict, Any, Optional
from app.config import CALIFORNIA_CITIES, CityConfig
from app.services.fortyguard_service import fortyguard_engine

logger = logging.getLogger("heatshield.osm")

# High-fidelity urban pedestrian hotspots & infrastructure templates for California cities
CALIFORNIA_PEDESTRIAN_DATASETS: Dict[str, List[Dict[str, Any]]] = {
    "los_angeles": [
        {
            "name": "7th Street / Metro Center Hub",
            "type": "transit_stop",
            "lat": 34.0485, "lng": -118.2587,
            "material": "Dark Asphalt & Granite",
            "albedo": 0.12, "shade": 12.0, "footfall": 3800
        },
        {
            "name": "Pershing Square Plaza",
            "type": "plaza",
            "lat": 34.0482, "lng": -118.2512,
            "material": "Paver Concrete & Stone",
            "albedo": 0.22, "shade": 18.0, "footfall": 2900
        },
        {
            "name": "Grand Central Market Walkway",
            "type": "market",
            "lat": 34.0507, "lng": -118.2492,
            "material": "Paved Concrete Sidewalk",
            "albedo": 0.18, "shade": 30.0, "footfall": 3200
        },
        {
            "name": "Broadway Historic Pedestrian Corridor",
            "type": "pedestrian_street",
            "lat": 34.0445, "lng": -118.2530,
            "material": "Asphalt & Unshaded Walkways",
            "albedo": 0.14, "shade": 15.0, "footfall": 2400
        },
        {
            "name": "Grand Park Fountain & Lawns",
            "type": "public_park",
            "lat": 34.0558, "lng": -118.2458,
            "material": "Grass, Canopy & Water Mist",
            "albedo": 0.30, "shade": 70.0, "footfall": 1500
        },
        {
            "name": "Union Station Transit Plaza",
            "type": "transit_stop",
            "lat": 34.0562, "lng": -118.2365,
            "material": "Asphalt Bus Bays & Concrete",
            "albedo": 0.15, "shade": 22.0, "footfall": 4200
        },
        {
            "name": "Arts District Pedestrian Promenade (Traction Ave)",
            "type": "pedestrian_street",
            "lat": 34.0450, "lng": -118.2370,
            "material": "Exposed Industrial Asphalt",
            "albedo": 0.13, "shade": 10.0, "footfall": 1900
        },
        {
            "name": "Pico Station / Crypto.com Arena Concourse",
            "type": "transit_stop",
            "lat": 34.0407, "lng": -118.2662,
            "material": "Extensive Dark Pavement",
            "albedo": 0.11, "shade": 8.0, "footfall": 4500
        },
        {
            "name": "Little Tokyo Galleria & Japanese Village Plaza",
            "type": "plaza",
            "lat": 34.0498, "lng": -118.2401,
            "material": "Brick Pavers & Partial Awnings",
            "albedo": 0.24, "shade": 45.0, "footfall": 2100
        },
        {
            "name": "Bunker Hill / California Plaza WaterCourt",
            "type": "plaza",
            "lat": 34.0522, "lng": -118.2514,
            "material": "Stone Terraces & Water Features",
            "albedo": 0.28, "shade": 40.0, "footfall": 1800
        },
        {
            "name": "San Pedro St & 5th St Transit Corridor",
            "type": "transit_stop",
            "lat": 34.0440, "lng": -118.2450,
            "material": "Worn Asphalt & Lack of Canopy",
            "albedo": 0.10, "shade": 5.0, "footfall": 3100
        },
        {
            "name": "Chinatown Central Plaza",
            "type": "plaza",
            "lat": 34.0655, "lng": -118.2368,
            "material": "Decorative Pavers & Open Courtyard",
            "albedo": 0.20, "shade": 20.0, "footfall": 1400
        }
    ],
    "palm_springs": [
        {
            "name": "Downtown Palm Canyon Drive Promenade",
            "type": "pedestrian_street",
            "lat": 33.8247, "lng": -116.5450,
            "material": "Exposed Asphalt & Sidewalks",
            "albedo": 0.16, "shade": 18.0, "footfall": 2800
        },
        {
            "name": "Palm Springs Downtown Park & Marilyn Statue",
            "type": "public_park",
            "lat": 33.8235, "lng": -116.5480,
            "material": "Desert Landscaping & Shaded Turf",
            "albedo": 0.28, "shade": 45.0, "footfall": 1600
        },
        {
            "name": "Tahquitz Canyon Way Transit Hub",
            "type": "transit_stop",
            "lat": 33.8210, "lng": -116.5420,
            "material": "Blacktop Asphalt Bus Turnout",
            "albedo": 0.11, "shade": 8.0, "footfall": 1900
        },
        {
            "name": "Village Green Heritage Center",
            "type": "plaza",
            "lat": 33.8205, "lng": -116.5465,
            "material": "Concrete Plaza & Palm Tree Canopy",
            "albedo": 0.22, "shade": 25.0, "footfall": 1200
        },
        {
            "name": "Demuth Community Park & Fields",
            "type": "public_park",
            "lat": 33.8050, "lng": -116.5000,
            "material": "Open Green Fields & Shade Pavilions",
            "albedo": 0.32, "shade": 60.0, "footfall": 950
        }
    ],
    "fresno": [
        {
            "name": "Fulton Street Pedestrian Mall",
            "type": "pedestrian_street",
            "lat": 36.7375, "lng": -119.7900,
            "material": "Urban Asphalt & Pavers",
            "albedo": 0.14, "shade": 14.0, "footfall": 2600
        },
        {
            "name": "Fresno Courthouse Park & Transit Terminal",
            "type": "transit_stop",
            "lat": 36.7350, "lng": -119.7875,
            "material": "Asphalt Transit Bays",
            "albedo": 0.12, "shade": 20.0, "footfall": 3100
        },
        {
            "name": "Tower District / Olive Ave Strip",
            "type": "pedestrian_street",
            "lat": 36.7580, "lng": -119.8000,
            "material": "Concrete Sidewalks & Blacktop",
            "albedo": 0.15, "shade": 18.0, "footfall": 2200
        },
        {
            "name": "Roeding Park Public Trails",
            "type": "public_park",
            "lat": 36.7550, "lng": -119.8250,
            "material": "Mature Tree Canopy & Grass",
            "albedo": 0.30, "shade": 68.0, "footfall": 1100
        }
    ],
    "sacramento": [
        {
            "name": "Capitol Mall West Promenade",
            "type": "pedestrian_street",
            "lat": 38.5775, "lng": -121.5025,
            "material": "Concrete Plaza & Wide Asphalt",
            "albedo": 0.18, "shade": 22.0, "footfall": 2500
        },
        {
            "name": "K Street Pedestrian & Light Rail Mall",
            "type": "transit_stop",
            "lat": 38.5805, "lng": -121.4920,
            "material": "Transit Tracks & Paver Sidewalks",
            "albedo": 0.15, "shade": 16.0, "footfall": 3400
        },
        {
            "name": "Capitol Park Arboretums",
            "type": "public_park",
            "lat": 38.5765, "lng": -121.4900,
            "material": "Dense Botanical Canopy & Turf",
            "albedo": 0.32, "shade": 78.0, "footfall": 1800
        },
        {
            "name": "Sacramento Valley Transit Station",
            "type": "transit_stop",
            "lat": 38.5840, "lng": -121.5000,
            "material": "Rail Platform Asphalt & Concrete",
            "albedo": 0.13, "shade": 15.0, "footfall": 3700
        }
    ],
    "san_francisco": [
        {
            "name": "Market St / Powell St Metro Plaza",
            "type": "transit_stop",
            "lat": 37.7845, "lng": -122.4080,
            "material": "Cable Car Turnaround & Concrete",
            "albedo": 0.20, "shade": 25.0, "footfall": 4800
        },
        {
            "name": "Civic Center Plaza & UN Plaza",
            "type": "plaza",
            "lat": 37.7795, "lng": -122.4170,
            "material": "Expansive Brick & Stone Plaza",
            "albedo": 0.22, "shade": 15.0, "footfall": 3100
        },
        {
            "name": "Mission 24th St Pedestrian Corridor",
            "type": "pedestrian_street",
            "lat": 37.7522, "lng": -122.4184,
            "material": "Asphalt Streets & Sidewalks",
            "albedo": 0.16, "shade": 20.0, "footfall": 2600
        },
        {
            "name": "Yerba Buena Gardens",
            "type": "public_park",
            "lat": 37.7850, "lng": -122.4020,
            "material": "Lawns, Waterfalls & Canopy",
            "albedo": 0.30, "shade": 65.0, "footfall": 2200
        }
    ]
}

class OSMService:
    """Service for retrieving pedestrian infrastructure from OpenStreetMap or pre-compiled urban sets."""
    
    @staticmethod
    async def get_pedestrian_zones_for_city(city_id: str) -> List[Dict[str, Any]]:
        city_cfg = CALIFORNIA_CITIES.get(city_id, CALIFORNIA_CITIES["los_angeles"])
        base_temp = city_cfg.default_ambient_temp
        
        raw_zones = CALIFORNIA_PEDESTRIAN_DATASETS.get(city_id, CALIFORNIA_PEDESTRIAN_DATASETS["los_angeles"])
        
        results = []
        for idx, item in enumerate(raw_zones):
            # Compute thermodynamics with FortyGuard model
            thermo = fortyguard_engine.calculate_thermodynamics(
                ambient_temp=base_temp,
                surface_material=item["material"],
                albedo=item["albedo"],
                shade_pct=item["shade"],
            )
            
            risk_level = fortyguard_engine.classify_heat_risk(
                surface_temp=thermo["surface_temp"],
                wbgt=thermo["wbgt"]
            )
            
            # Vulnerability score (0-100) combining thermal stress, footfall, and lack of shade
            vuln_score = min(99.0, round(
                (thermo["surface_temp"] - 30.0) * 2.2 +
                (item["footfall"] / 50.0) * 0.4 +
                (100.0 - item["shade"]) * 0.35,
                1
            ))
            
            zone_id = f"zone_{city_id}_{idx+1}"
            
            results.append({
                "id": zone_id,
                "name": item["name"],
                "zone_type": item["type"],
                "city_id": city_id,
                "location": {
                    "type": "Point",
                    "coordinates": [item["lng"], item["lat"]] # GeoJSON format: [lng, lat]
                },
                "footfall_hourly": item["footfall"],
                "shade_coverage_pct": item["shade"],
                "albedo_factor": item["albedo"],
                "surface_material": item["material"],
                "current_surface_temp": thermo["surface_temp"],
                "current_ambient_temp": thermo["ambient_temp"],
                "wbgt_temp": thermo["wbgt"],
                "heat_index": thermo["heat_index"],
                "risk_level": risk_level,
                "cooling_station_deployed": False,
                "is_top_5_percent": False, # calculated by hotspot service
                "is_watchlist_35c": thermo["surface_temp"] >= 35.0,
                "vulnerability_score": max(10.0, vuln_score)
            })
            
        return results

osm_service = OSMService()
