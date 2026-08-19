import random
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.database import db_manager
from app.config import CALIFORNIA_CITIES
from app.services.osm_service import osm_service

logger = logging.getLogger("heatshield.cooling")

# Pre-seeded active cooling stations across California cities
PRESEEDED_COOLING_STATIONS: Dict[str, List[Dict[str, Any]]] = {
    "los_angeles": [
        {
            "id": "cool_la_1",
            "name": "Grand Park Mist Oasis & Hydration Hub",
            "station_type": "misting_tent",
            "city_id": "los_angeles",
            "location": {"type": "Point", "coordinates": [-118.2458, 34.0558]},
            "capacity_ppl_hr": 600,
            "cooling_radius_m": 65.0,
            "temp_drop_celsius": 5.4,
            "status": "active",
            "water_level_pct": 92.0,
            "deployed_at": "2026-08-01T10:00:00Z",
            "cost_estimate_usd": 5200.0,
            "people_served_daily": 3200,
            "zone_id": "zone_los_angeles_5"
        },
        {
            "id": "cool_la_2",
            "name": "Little Tokyo Solar Shade & Cooling Hub",
            "station_type": "solar_cooling_pod",
            "city_id": "los_angeles",
            "location": {"type": "Point", "coordinates": [-118.2401, 34.0498]},
            "capacity_ppl_hr": 450,
            "cooling_radius_m": 50.0,
            "temp_drop_celsius": 4.6,
            "status": "active",
            "water_level_pct": 84.0,
            "deployed_at": "2026-08-05T09:00:00Z",
            "cost_estimate_usd": 7500.0,
            "people_served_daily": 2100,
            "zone_id": "zone_los_angeles_9"
        }
    ],
    "palm_springs": [
        {
            "id": "cool_ps_1",
            "name": "Downtown Palm Canyon Ultra-Mist Pergola",
            "station_type": "misting_tent",
            "city_id": "palm_springs",
            "location": {"type": "Point", "coordinates": [-116.5450, 33.8247]},
            "capacity_ppl_hr": 800,
            "cooling_radius_m": 75.0,
            "temp_drop_celsius": 6.2,
            "status": "active",
            "water_level_pct": 78.0,
            "deployed_at": "2026-07-20T08:30:00Z",
            "cost_estimate_usd": 6800.0,
            "people_served_daily": 4500,
            "zone_id": "zone_palm_springs_1"
        }
    ],
    "fresno": [
        {
            "id": "cool_fr_1",
            "name": "Fulton Mall Smart Hydration Station",
            "station_type": "hydration_kiosk",
            "city_id": "fresno",
            "location": {"type": "Point", "coordinates": [-119.7900, 36.7375]},
            "capacity_ppl_hr": 400,
            "cooling_radius_m": 35.0,
            "temp_drop_celsius": 3.8,
            "status": "active",
            "water_level_pct": 95.0,
            "deployed_at": "2026-08-10T11:00:00Z",
            "cost_estimate_usd": 3800.0,
            "people_served_daily": 1800,
            "zone_id": "zone_fresno_1"
        }
    ],
    "sacramento": [
        {
            "id": "cool_sac_1",
            "name": "Capitol Park Hydration & Misting Pavilion",
            "station_type": "tree_canopy_shelter",
            "city_id": "sacramento",
            "location": {"type": "Point", "coordinates": [-121.4900, 38.5765]},
            "capacity_ppl_hr": 550,
            "cooling_radius_m": 55.0,
            "temp_drop_celsius": 4.5,
            "status": "active",
            "water_level_pct": 89.0,
            "deployed_at": "2026-08-08T10:00:00Z",
            "cost_estimate_usd": 5500.0,
            "people_served_daily": 2600,
            "zone_id": "zone_sacramento_3"
        }
    ],
    "san_francisco": [
        {
            "id": "cool_sf_1",
            "name": "Civic Center Resilience Hydration Hub",
            "station_type": "hydration_kiosk",
            "city_id": "san_francisco",
            "location": {"type": "Point", "coordinates": [-122.4170, 37.7795]},
            "capacity_ppl_hr": 700,
            "cooling_radius_m": 40.0,
            "temp_drop_celsius": 3.5,
            "status": "active",
            "water_level_pct": 91.0,
            "deployed_at": "2026-08-12T09:30:00Z",
            "cost_estimate_usd": 4200.0,
            "people_served_daily": 3900,
            "zone_id": "zone_san_francisco_2"
        }
    ]
}

class CoolingService:
    """Service to handle cooling station recommendations, deployments, and impact simulations."""

    @staticmethod
    async def get_cooling_stations(city_id: str) -> List[Dict[str, Any]]:
        coll = db_manager.get_collection("cooling_stations")
        cursor = await coll.find({"city_id": city_id})
        stations = await cursor.to_list()
        
        # If DB collection is empty for this city, seed with pre-seeded data
        if not stations:
            preseeded = PRESEEDED_COOLING_STATIONS.get(city_id, PRESEEDED_COOLING_STATIONS["los_angeles"])
            for st in preseeded:
                await coll.insert_one(st)
            stations = preseeded
            
        return stations

    @staticmethod
    async def recommend_stations(city_id: str) -> List[Dict[str, Any]]:
        """Identifies vulnerable pedestrian hotspots that lack cooling stations."""
        zones = await osm_service.get_pedestrian_zones_for_city(city_id)
        current_stations = await CoolingService.get_cooling_stations(city_id)
        deployed_zone_ids = {s.get("zone_id") for s in current_stations if s.get("zone_id")}
        
        recommendations = []
        for z in zones:
            if z["id"] in deployed_zone_ids:
                continue
            if z["current_surface_temp"] >= 37.0 or z["risk_level"] in ["extreme", "high"]:
                # Recommend best station type based on urban typology
                if z["zone_type"] == "transit_stop":
                    st_type = "misting_tent"
                    capacity = 650
                    radius = 60.0
                    temp_drop = 5.6
                    cost = 5400.0
                    reason = "High pedestrian dwell time and low shade at transit stop require active evaporative misting."
                elif z["zone_type"] in ["pedestrian_street", "market"]:
                    st_type = "solar_cooling_pod"
                    capacity = 500
                    radius = 50.0
                    temp_drop = 4.9
                    cost = 7200.0
                    reason = "Dense footfall corridor benefits from solar-powered refrigerated airflow and shade canopy."
                elif z["zone_type"] == "plaza":
                    st_type = "tree_canopy_shelter"
                    capacity = 450
                    radius = 55.0
                    temp_drop = 4.5
                    cost = 6100.0
                    reason = "Wide open hardscape needs modular shade structures and misting nozzles."
                else:
                    st_type = "hydration_kiosk"
                    capacity = 400
                    radius = 35.0
                    temp_drop = 3.5
                    cost = 3600.0
                    reason = "Public park walkway needs chilled water refill and heatstroke awareness station."

                recommendations.append({
                    "id": f"rec_{z['id']}",
                    "name": f"Recommended: {z['name']} Cooling Hub",
                    "station_type": st_type,
                    "city_id": city_id,
                    "location": z["location"],
                    "capacity_ppl_hr": capacity,
                    "cooling_radius_m": radius,
                    "temp_drop_celsius": temp_drop,
                    "status": "recommended",
                    "water_level_pct": 100.0,
                    "cost_estimate_usd": cost,
                    "people_served_daily": int(z["footfall_hourly"] * 4.0),
                    "zone_id": z["id"],
                    "priority_score": round(z["vulnerability_score"], 1),
                    "rationale": reason
                })

        # Sort recommendations by highest priority score
        recommendations.sort(key=lambda x: x["priority_score"], reverse=True)
        return recommendations

    @staticmethod
    async def deploy_station(
        city_id: str,
        zone_id: str,
        station_type: str,
        coordinates: List[float],
        name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Deploys a cooling station and computes simulated microclimate relief."""
        coll = db_manager.get_collection("cooling_stations")
        
        station_id = f"cool_{city_id}_{int(datetime.utcnow().timestamp())}"
        
        # Temp drop & capacity profile
        type_profiles = {
            "misting_tent": {"drop": 5.4, "capacity": 600, "radius": 60.0, "cost": 5200.0},
            "solar_cooling_pod": {"drop": 5.0, "capacity": 500, "radius": 50.0, "cost": 7500.0},
            "hydration_kiosk": {"drop": 3.6, "capacity": 450, "radius": 35.0, "cost": 3800.0},
            "tree_canopy_shelter": {"drop": 4.5, "capacity": 550, "radius": 55.0, "cost": 6200.0},
            "indoor_cooling_center": {"drop": 12.0, "capacity": 1200, "radius": 150.0, "cost": 15000.0},
        }
        prof = type_profiles.get(station_type, type_profiles["misting_tent"])
        
        station_name = name or f"{station_type.replace('_', ' ').title()} at {zone_id}"
        
        station_doc = {
            "id": station_id,
            "name": station_name,
            "station_type": station_type,
            "city_id": city_id,
            "location": {"type": "Point", "coordinates": coordinates},
            "capacity_ppl_hr": prof["capacity"],
            "cooling_radius_m": prof["radius"],
            "temp_drop_celsius": prof["drop"],
            "status": "active",
            "water_level_pct": 100.0,
            "deployed_at": datetime.utcnow().isoformat(),
            "cost_estimate_usd": prof["cost"],
            "people_served_daily": prof["capacity"] * 6,
            "zone_id": zone_id
        }
        
        await coll.insert_one(station_doc)
        
        # Calculate impact metrics
        hospitalizations_prevented = round(prof["capacity"] * 0.012, 1)
        economic_savings_usd = round(hospitalizations_prevented * 8400.0, 2)
        
        return {
            "success": True,
            "deployed_station": station_doc,
            "simulation_impact": {
                "localized_temp_reduction_c": prof["drop"],
                "ambient_relief_c": round(prof["drop"] * 0.65, 1),
                "cooling_coverage_area_m2": round(3.14159 * (prof["radius"] ** 2), 0),
                "daily_pedestrians_protected": station_doc["people_served_daily"],
                "estimated_heat_illnesses_avoided_weekly": int(hospitalizations_prevented * 7),
                "estimated_healthcare_savings_usd": economic_savings_usd
            }
        }

cooling_service = CoolingService()
