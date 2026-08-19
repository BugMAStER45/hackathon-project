from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class GeoPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float] # [lng, lat]

class PedestrianZoneBase(BaseModel):
    id: str
    name: str
    zone_type: str # 'transit_stop', 'public_park', 'pedestrian_street', 'plaza', 'walkway', 'market'
    city_id: str
    location: GeoPoint
    footfall_hourly: int = 1200
    shade_coverage_pct: float = 20.0
    albedo_factor: float = 0.15
    surface_material: str = "Asphalt / Dark Pavement"
    current_surface_temp: float = 41.2
    current_ambient_temp: float = 38.0
    wbgt_temp: float = 31.5 # Wet Bulb Globe Temp
    heat_index: float = 43.5
    risk_level: str = "extreme" # 'extreme', 'high', 'warning', 'safe'
    cooling_station_deployed: bool = False
    is_top_5_percent: bool = False
    is_watchlist_35c: bool = True
    vulnerability_score: float = 85.0 # 0-100 score

class PedestrianZone(PedestrianZoneBase):
    last_updated: Optional[datetime] = None

class HeatTelemetryRecord(BaseModel):
    id: Optional[str] = None
    city_id: str
    zone_id: str
    timestamp: datetime
    surface_temp: float
    ambient_temp: float
    wbgt_temp: float
    heat_index: float
    solar_irradiance_wm2: float
    humidity_pct: float
    albedo: float
    wind_speed_ms: float
    uhi_intensity: float

class CoolingStation(BaseModel):
    id: str
    name: str
    station_type: str # 'misting_tent', 'hydration_kiosk', 'solar_cooling_pod', 'tree_canopy_shelter', 'indoor_cooling_center'
    city_id: str
    location: GeoPoint
    capacity_ppl_hr: int = 450
    cooling_radius_m: float = 50.0
    temp_drop_celsius: float = 4.8
    status: str = "active" # 'active', 'recommended', 'planned'
    water_level_pct: float = 88.0
    deployed_at: Optional[datetime] = None
    cost_estimate_usd: float = 4500.0
    people_served_daily: int = 2400
    zone_id: Optional[str] = None

class DeployStationRequest(BaseModel):
    station_type: str
    zone_id: str
    name: Optional[str] = None
    city_id: str
    coordinates: List[float] # [lng, lat]

class HotspotRankItem(BaseModel):
    rank: int
    zone_id: str
    name: str
    zone_type: str
    location: GeoPoint
    surface_temp: float
    ambient_temp: float
    wbgt_temp: float
    footfall_hourly: int
    risk_score: float
    recommended_intervention: str
    potential_temp_reduction: float
    lives_protected_daily: int

class WatchlistItem(BaseModel):
    zone_id: str
    name: str
    zone_type: str
    location: GeoPoint
    surface_temp: float
    ambient_temp: float
    rate_of_temp_rise: float # °C/hour
    threshold_exceeded_by: float # °C above 35°C
    alert_level: str # 'Critical Advisory', 'Elevated Watch', 'Pre-emptive Action'

class HotspotAnalysisResponse(BaseModel):
    city_id: str
    city_name: str
    analyzed_at: datetime
    total_zones_analyzed: int
    top_5_percent_count: int
    watchlist_above_35_count: int
    extreme_risk_count: int
    avg_surface_temp: float
    max_surface_temp: float
    top_hotspots: List[HotspotRankItem]
    watchlist_35c: List[WatchlistItem]

class MunicipalReport(BaseModel):
    report_id: str
    generated_at: datetime
    city_id: str
    city_name: str
    state: str
    emergency_level: str # 'Heat Emergency Level 3 (Extreme)', 'Level 2 (Severe)', 'Level 1 (Advisory)'
    resilience_score: float # 0 - 100
    executive_summary: str
    key_findings: List[str]
    top_hotspots: List[HotspotRankItem]
    watchlist_35c: List[WatchlistItem]
    immediate_actions: List[str]
    long_term_urban_planning_recommendations: List[str]
    estimated_budget_usd: float
    estimated_lives_shielded_daily: int

class SafeRouteRequest(BaseModel):
    city_id: str
    origin: List[float] # [lat, lng]
    destination: List[float] # [lat, lng]
    preference: str = "coolest_shaded" # 'coolest_shaded' | 'fastest'

class RouteSegment(BaseModel):
    coordinates: List[List[float]] # [[lat, lng], ...]
    is_shaded: bool
    segment_temp_c: float
    surface_material: str

class SafeRouteResponse(BaseModel):
    route_type: str
    waypoints: List[List[float]]
    segments: List[RouteSegment]
    total_distance_m: int
    duration_minutes: int
    average_temp_celsius: float
    max_temp_celsius: float
    shaded_percentage: float
    cooling_stations_en_route: List[CoolingStation]
    thermal_stress_reduction_pct: float

class CommunityHeatReport(BaseModel):
    id: Optional[str] = None
    city_id: str
    coordinates: List[float] # [lng, lat]
    hazard_type: str # 'broken_water_fountain', 'unshaded_bus_stop', 'scorching_pavement', 'heat_exhaustion_incident'
    description: str
    reported_temp: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "verified"

class SystemSettings(BaseModel):
    fortyguard_api_key: str
    fortyguard_api_base_url: str
    mongodb_url: str
    heat_extreme_threshold: float
    heat_watchlist_threshold: float
