from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.config import CALIFORNIA_CITIES
from app.services.osm_service import osm_service

router = APIRouter(prefix="/zones", tags=["Pedestrian Zones"])

@router.get("/cities")
async def get_cities():
    """Returns list of California cities with bounding boxes and metadata."""
    return list(CALIFORNIA_CITIES.values())

@router.get("")
async def get_pedestrian_zones(city_id: str = Query("los_angeles", description="City ID (e.g. los_angeles, palm_springs, fresno)")):
    """Returns OpenStreetMap pedestrian infrastructure zones with FortyGuard thermal attributes."""
    zones = await osm_service.get_pedestrian_zones_for_city(city_id)
    return {
        "city_id": city_id,
        "total_zones": len(zones),
        "zones": zones
    }
