from fastapi import APIRouter
from app.config import settings
from app.models.schemas import SystemSettings
from app.database import db_manager

router = APIRouter(prefix="/settings", tags=["System Settings"])

@router.get("")
async def get_settings():
    return {
        "fortyguard_api_configured": bool(settings.FORTYGUARD_API_KEY),
        "fortyguard_api_base_url": settings.FORTYGUARD_API_BASE_URL,
        "mongodb_connected": db_manager.is_connected_to_mongo,
        "heat_extreme_threshold": settings.TEMP_EXTREME_THRESHOLD,
        "heat_watchlist_threshold": settings.TEMP_WATCHLIST_THRESHOLD,
        "top_hotspot_percentile": settings.TOP_HOTSPOT_PERCENTILE
    }

@router.post("")
async def update_settings(new_settings: SystemSettings):
    settings.FORTYGUARD_API_KEY = new_settings.fortyguard_api_key
    settings.FORTYGUARD_API_BASE_URL = new_settings.fortyguard_api_base_url
    settings.TEMP_EXTREME_THRESHOLD = new_settings.heat_extreme_threshold
    settings.TEMP_WATCHLIST_THRESHOLD = new_settings.heat_watchlist_threshold
    return {
        "success": True,
        "message": "Settings updated successfully",
        "current_status": {
            "fortyguard_api_configured": bool(settings.FORTYGUARD_API_KEY),
            "mongodb_connected": db_manager.is_connected_to_mongo
        }
    }
