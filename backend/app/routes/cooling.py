from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from app.models.schemas import DeployStationRequest
from app.services.cooling_service import cooling_service

router = APIRouter(prefix="/cooling", tags=["Cooling Stations & Deployment"])

@router.get("/stations")
async def get_cooling_stations(city_id: str = Query("los_angeles")):
    """Returns all active cooling stations in the specified city."""
    stations = await cooling_service.get_cooling_stations(city_id)
    return {
        "city_id": city_id,
        "count": len(stations),
        "stations": stations
    }

@router.get("/recommendations")
async def get_cooling_recommendations(city_id: str = Query("los_angeles")):
    """Generates AI/algorithmic recommendations for cooling station placement."""
    recs = await cooling_service.recommend_stations(city_id)
    return {
        "city_id": city_id,
        "count": len(recs),
        "recommendations": recs
    }

@router.post("/deploy")
async def deploy_cooling_station(request: DeployStationRequest):
    """Deploys a cooling station and computes simulated thermal impact."""
    result = await cooling_service.deploy_station(
        city_id=request.city_id,
        zone_id=request.zone_id,
        station_type=request.station_type,
        coordinates=request.coordinates,
        name=request.name
    )
    return result
