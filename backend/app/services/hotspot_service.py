import math
from typing import List, Dict, Any
from datetime import datetime
from app.config import CALIFORNIA_CITIES, settings
from app.services.osm_service import osm_service

class HotspotAnalysisService:
    """Service to pinpoint Top 5% extreme heat hotspots and monitor >35°C watchlist."""

    @staticmethod
    async def analyze_city_hotspots(city_id: str) -> Dict[str, Any]:
        city_cfg = CALIFORNIA_CITIES.get(city_id, CALIFORNIA_CITIES["los_angeles"])
        zones = await osm_service.get_pedestrian_zones_for_city(city_id)
        
        if not zones:
            return {
                "city_id": city_id,
                "city_name": city_cfg.name,
                "analyzed_at": datetime.utcnow().isoformat(),
                "total_zones_analyzed": 0,
                "top_5_percent_count": 0,
                "watchlist_above_35_count": 0,
                "extreme_risk_count": 0,
                "avg_surface_temp": 0.0,
                "max_surface_temp": 0.0,
                "top_hotspots": [],
                "watchlist_35c": []
            }

        # Calculate composite risk score for each zone
        scored_zones = []
        for z in zones:
            surface_t = z["current_surface_temp"]
            wbgt_t = z["wbgt_temp"]
            footfall = z["footfall_hourly"]
            shade = z["shade_coverage_pct"]
            
            # Weighted Risk Score
            # High surface temp + WBGT + high pedestrian footfall + lack of shade
            risk_score = round(
                (surface_t * 0.45) + 
                (wbgt_t * 0.35) + 
                (min(footfall, 5000) / 100.0 * 0.15) + 
                ((100.0 - shade) * 0.05),
                1
            )
            
            scored_zones.append({**z, "composite_risk_score": risk_score})

        # Sort descending by composite risk score
        scored_zones.sort(key=lambda x: x["composite_risk_score"], reverse=True)
        
        # Determine Top 5% (minimum 2 hotspots for clarity in city dashboards)
        cutoff_count = max(2, math.ceil(len(scored_zones) * settings.TOP_HOTSPOT_PERCENTILE))
        top_hotspot_raw = scored_zones[:cutoff_count]
        
        top_hotspots = []
        for idx, z in enumerate(top_hotspot_raw):
            # Mark is_top_5_percent
            z["is_top_5_percent"] = True
            
            # Select specific intervention
            if z["zone_type"] == "transit_stop":
                intervention = "Deploy High-Capacity Misting Tent + Hydration Kiosk"
                temp_drop = 5.2
            elif z["zone_type"] == "market" or z["zone_type"] == "pedestrian_street":
                intervention = "Deploy Solar-Powered Air-Cooled Shelter + Tension Shade Canopy"
                temp_drop = 4.8
            elif z["zone_type"] == "plaza":
                intervention = "Deploy Smart Microclimate Pod + Cool Pavement Coating"
                temp_drop = 6.1
            else:
                intervention = "Deploy Mobile Water Misting Station + Expand Tree Canopy"
                temp_drop = 4.2
                
            lives_protected = int(z["footfall_hourly"] * 4.2) # estimated daily foot traffic benefiting
            
            top_hotspots.append({
                "rank": idx + 1,
                "zone_id": z["id"],
                "name": z["name"],
                "zone_type": z["zone_type"],
                "location": z["location"],
                "surface_temp": z["current_surface_temp"],
                "ambient_temp": z["current_ambient_temp"],
                "wbgt_temp": z["wbgt_temp"],
                "footfall_hourly": z["footfall_hourly"],
                "risk_score": z["composite_risk_score"],
                "recommended_intervention": intervention,
                "potential_temp_reduction": temp_drop,
                "lives_protected_daily": lives_protected
            })

        # Watchlist for zones >= 35.0°C
        watchlist_35c = []
        for z in scored_zones:
            if z["current_surface_temp"] >= settings.TEMP_WATCHLIST_THRESHOLD:
                rate_of_rise = round(0.8 + (z["current_surface_temp"] - 35.0) * 0.12, 2)
                delta_35 = round(z["current_surface_temp"] - 35.0, 1)
                
                if z["current_surface_temp"] >= 45.0:
                    alert_level = "Critical Advisory - Immediate Intervention Required"
                elif z["current_surface_temp"] >= 40.0:
                    alert_level = "Elevated Watch - High Risk of Heat Stroke"
                else:
                    alert_level = "Pre-emptive Action - Potential Hotspot Escalation"

                watchlist_35c.append({
                    "zone_id": z["id"],
                    "name": z["name"],
                    "zone_type": z["zone_type"],
                    "location": z["location"],
                    "surface_temp": z["current_surface_temp"],
                    "ambient_temp": z["current_ambient_temp"],
                    "rate_of_temp_rise": rate_of_rise,
                    "threshold_exceeded_by": delta_35,
                    "alert_level": alert_level
                })

        surface_temps = [z["current_surface_temp"] for z in scored_zones]
        avg_temp = round(sum(surface_temps) / len(surface_temps), 1) if surface_temps else 0.0
        max_temp = max(surface_temps) if surface_temps else 0.0
        extreme_count = sum(1 for z in scored_zones if z["risk_level"] == "extreme")

        return {
            "city_id": city_id,
            "city_name": city_cfg.name,
            "analyzed_at": datetime.utcnow().isoformat(),
            "total_zones_analyzed": len(scored_zones),
            "top_5_percent_count": len(top_hotspots),
            "watchlist_above_35_count": len(watchlist_35c),
            "extreme_risk_count": extreme_count,
            "avg_surface_temp": avg_temp,
            "max_surface_temp": max_temp,
            "top_hotspots": top_hotspots,
            "watchlist_35c": watchlist_35c
        }

hotspot_service = HotspotAnalysisService()
