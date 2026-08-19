from fastapi import APIRouter, Query
from typing import Dict, Any
from app.services.hotspot_service import hotspot_service
from app.services.fortyguard_service import fortyguard_engine
from app.services.osm_service import osm_service

router = APIRouter(prefix="/heat", tags=["FortyGuard Thermal & Hotspots"])

@router.get("/live")
async def get_live_heat_telemetry(city_id: str = Query("los_angeles")):
    """Returns real-time FortyGuard thermal microclimate grid data."""
    zones = await osm_service.get_pedestrian_zones_for_city(city_id)
    return {
        "city_id": city_id,
        "telemetry_source": "FortyGuard Thermal Model & API",
        "zones_telemetry": zones
    }

@router.get("/hotspots")
async def get_top_5_percent_hotspots(city_id: str = Query("los_angeles")):
    """Pinpoints the Top 5% extreme heat hotspots in the pedestrian network."""
    return await hotspot_service.analyze_city_hotspots(city_id)

@router.get("/watchlist")
async def get_watchlist_above_35(city_id: str = Query("los_angeles")):
    """Tracks potential hotspots and areas with temperatures > 35°C."""
    analysis = await hotspot_service.analyze_city_hotspots(city_id)
    return {
        "city_id": city_id,
        "total_above_35c": analysis["watchlist_above_35_count"],
        "watchlist": analysis["watchlist_35c"]
    }
