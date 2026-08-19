import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Flame, Droplet, ShieldCheck, AlertTriangle, Wind, Sun, Users, Trees, Navigation } from 'lucide-react';
import HeatLegend from './HeatLegend';
import MapControls from './MapControls';
import { getTempColor, formatTemp, getRiskBadge } from '../../utils/thermalCalculators';

// Helper component to smoothly re-center map on city switch
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcons for Cooling Stations
const createCoolingIcon = (type) => {
  return L.divIcon({
    className: 'custom-cooling-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
        <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

export default function ThermalMap({
  selectedCity,
  zones = [],
  coolingStations = [],
  topHotspots = [],
  activeRoute = null,
  persona,
  unit,
  onDeployClick,
  onSetRouteDestination
}) {
  const [layers, setLayers] = React.useState({
    heatGrid: true,
    coolingStations: true,
    safeRoute: true
  });
  const [tempFilter, setTempFilter] = React.useState('all'); // 'all', '35', '40'
  const [baseMap, setBaseMap] = React.useState('dark');

  const center = [selectedCity?.lat || 34.0488, selectedCity?.lng || -118.2518];
  const zoom = selectedCity?.zoom || 14;

  const handleToggleLayer = (layerName) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Filter zones by temperature
  const filteredZones = zones.filter(z => {
    if (tempFilter === '40') return z.current_surface_temp >= 40.0;
    if (tempFilter === '35') return z.current_surface_temp >= 35.0;
    return true;
  });

  return (
    <div className="relative w-full h-[600px] lg:h-[680px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapRecenter center={center} zoom={zoom} />

        {/* Dark Matter CartoDB Basemap for high-contrast thermal visualization */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* FortyGuard Thermal Pedestrian Nodes */}
        {layers.heatGrid && filteredZones.map((zone) => {
          const coords = [zone.location.coordinates[1], zone.location.coordinates[0]];
          const color = getTempColor(zone.current_surface_temp);
          const badge = getRiskBadge(zone.risk_level);
          const isTop5 = zone.is_top_5_percent || topHotspots.some(h => h.zone_id === zone.id);

          return (
            <React.Fragment key={zone.id}>
              {/* Outer Heat Halo */}
              <CircleMarker
                center={coords}
                radius={isTop5 ? 26 : 18}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isTop5 ? 0.45 : 0.25,
                  color: color,
                  weight: isTop5 ? 2.5 : 1,
                  dashArray: isTop5 ? '3, 4' : null
                }}
              />

              {/* Core Node Marker */}
              <CircleMarker
                center={coords}
                radius={isTop5 ? 10 : 7}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.95,
                  color: '#ffffff',
                  weight: 2
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-3 max-w-[280px] text-slate-100 text-xs">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-2 mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-white leading-tight">{zone.name}</h4>
                        <span className="text-[10px] text-slate-400 capitalize">{zone.zone_type?.replace('_', ' ')}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Thermodynamic Telemetry Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400">Surface Temp</div>
                        <div className="text-base font-extrabold" style={{ color }}>
                          {formatTemp(zone.current_surface_temp, unit)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Ambient Air</div>
                        <div className="text-base font-bold text-slate-200">
                          {formatTemp(zone.current_ambient_temp, unit)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">WBGT Heat Stress</div>
                        <div className="text-xs font-semibold text-amber-400">
                          {formatTemp(zone.wbgt_temp, unit)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Solar / Albedo</div>
                        <div className="text-xs font-mono text-slate-300">
                          α = {zone.albedo_factor}
                        </div>
                      </div>
                    </div>

                    {/* Pedestrian context */}
                    <div className="space-y-1 text-[11px] text-slate-300 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Users className="w-3 h-3 text-orange-400" /> Hourly Footfall:
                        </span>
                        <strong className="text-white">{zone.footfall_hourly?.toLocaleString()} ppl/hr</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Trees className="w-3 h-3 text-emerald-400" /> Canopy Shade:
                        </span>
                        <strong className="text-white">{zone.shade_coverage_pct}%</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pavement:</span>
                        <span className="text-slate-200 truncate max-w-[130px]">{zone.surface_material}</span>
                      </div>
                    </div>

                    {/* Actions based on Persona */}
                    {persona === 'planner' ? (
                      <button
                        onClick={() => onDeployClick && onDeployClick(zone)}
                        className="w-full py-1.5 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-600/30"
                      >
                        <Droplet className="w-3.5 h-3.5" />
                        Deploy Cooling Station Here
                      </button>
                    ) : (
                      <button
                        onClick={() => onSetRouteDestination && onSetRouteDestination(zone)}
                        className="w-full py-1.5 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-600/30"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Navigate Here (Shaded Route)
                      </button>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* Active Cooling Stations */}
        {layers.coolingStations && coolingStations.map((station) => {
          const coords = [station.location.coordinates[1], station.location.coordinates[0]];
          return (
            <React.Fragment key={station.id}>
              {/* Cooling Radius Circle */}
              <CircleMarker
                center={coords}
                radius={32}
                pathOptions={{
                  fillColor: '#06b6d4',
                  fillOpacity: 0.18,
                  color: '#22d3ee',
                  weight: 1.5,
                  dashArray: '4, 4'
                }}
              />

              {/* Station Marker */}
              <Marker
                position={coords}
                icon={createCoolingIcon(station.station_type)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-3 max-w-[260px] text-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                      <Droplet className="w-4 h-4" />
                      <h4>{station.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-2">
                      Active Evaporative Cooling Hub deployed under California Heat Action Protocol.
                    </p>

                    <div className="space-y-1.5 bg-slate-900 p-2 rounded-lg border border-slate-800 mb-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Microclimate Relief:</span>
                        <strong className="text-cyan-400">-{station.temp_drop_celsius}°C Drop</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hourly Capacity:</span>
                        <strong className="text-slate-200">{station.capacity_ppl_hr} ppl/hr</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Water Reservoir:</span>
                        <strong className="text-emerald-400">{station.water_level_pct}% Full</strong>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Active Shaded Safe Navigation Route */}
        {layers.safeRoute && activeRoute && (
          <>
            <Polyline
              positions={activeRoute.waypoints}
              pathOptions={{
                color: activeRoute.route_type === 'coolest_shaded' ? '#10b981' : '#ef4444',
                weight: 5,
                opacity: 0.85,
                dashArray: activeRoute.route_type === 'coolest_shaded' ? '6, 8' : null
              }}
            />
            {/* Origin & Destination markers */}
            <CircleMarker
              center={activeRoute.waypoints[0]}
              radius={7}
              pathOptions={{ fillColor: '#3b82f6', color: '#fff', weight: 2 }}
            />
            <CircleMarker
              center={activeRoute.waypoints[activeRoute.waypoints.length - 1]}
              radius={7}
              pathOptions={{ fillColor: '#10b981', color: '#fff', weight: 2 }}
            />
          </>
        )}
      </MapContainer>

      {/* Floating Controls & Legend */}
      <MapControls
        layers={layers}
        onToggleLayer={handleToggleLayer}
        tempFilter={tempFilter}
        onChangeTempFilter={setTempFilter}
        baseMap={baseMap}
        onChangeBaseMap={setBaseMap}
      />
      <HeatLegend unit={unit} />
    </div>
  );
}
