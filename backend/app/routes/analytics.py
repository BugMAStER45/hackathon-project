from fastapi import APIRouter, Query
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Multi-Week Analytics & Correlations"])

@router.get("/weekly-patterns")
async def get_weekly_patterns(city_id: str = Query("los_angeles"), days: int = Query(14, ge=7, le=30)):
    """Returns multi-week historical heat signatures and 24-hr diurnal cycle."""
    return await analytics_service.get_weekly_heat_patterns(city_id, days)

@router.get("/correlations")
async def get_correlations(city_id: str = Query("los_angeles")):
    """Returns correlation matrices across surface material, canopy, footfall, and health risks."""
    return await analytics_service.get_correlations(city_id)

@router.get("/kpis")
async def get_resilience_kpis(city_id: str = Query("los_angeles")):
    """Returns overarching KPIs structured across the 3 Hackathon Pillars."""
    return await analytics_service.get_resilience_kpis(city_id)
