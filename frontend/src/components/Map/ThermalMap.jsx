import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { formatTemp, getTempColor } from '../../utils/thermalCalculators';
import HeatLegend from './HeatLegend';
import MapControls from './MapControls';

const TILE_URLS = {
  dark:    'https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  streets: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};
const TILE_ATTR = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>';

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 13, { animate: true, duration: 1.2 });
  }, [center, zoom]);
  return null;
}

function TileLayerSwitcher({ baseMap }) {
  return (
    <TileLayer
      url={TILE_URLS[baseMap] || TILE_URLS.dark}
      attribution={TILE_ATTR}
      maxZoom={19}
    />
  );
}

export default function ThermalMap({
  zones = [],
  stations = [],
  activeRoute,
  unit,
  highlightStation,
}) {
  const [layers, setLayers] = useState({ heatGrid: true, coolingStations: true, safeRoute: true });
  const [tempFilter, setTempFilter] = useState('all');
  const [baseMap, setBaseMap] = useState('dark');
  const [flyTarget, setFlyTarget] = useState(null);

  // Expose fly-to for external triggers (navigate button)
  useEffect(() => {
    if (highlightStation) {
      const [lng, lat] = highlightStation.location?.coordinates || [];
      if (lat && lng) setFlyTarget({ center: [lat, lng], zoom: 15 });
    }
  }, [highlightStation]);

  const handleToggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredZones = zones.filter(z => {
    if (tempFilter === '35') return z.current_surface_temp >= 35;
    if (tempFilter === '40') return z.current_surface_temp >= 40;
    return true;
  });

  const defaultCenter = zones.length > 0
    ? [zones[0].location.coordinates[1], zones[0].location.coordinates[0]]
    : [34.0522, -118.2437];

  const routePositions = activeRoute?.waypoints?.map(wp =>
    Array.isArray(wp) ? wp : [wp.lat, wp.lng]
  ) || [];

  return (
    <div className="relative w-full h-[600px] lg:h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="w-full h-full"
        zoomControl={true}
        style={{ background: '#060b14' }}
      >
        <TileLayerSwitcher baseMap={baseMap} />
        {flyTarget && <FlyTo center={flyTarget.center} zoom={flyTarget.zoom} />}

        {/* Thermal zone nodes */}
        {layers.heatGrid && filteredZones.map(zone => {
          const lat  = zone.location.coordinates[1];
          const lng  = zone.location.coordinates[0];
          const temp = zone.current_surface_temp;
          const isTop5 = zone.is_top_5_percent;
          const color = getTempColor(temp);

          return (
            <React.Fragment key={zone.id}>
              {/* Pulsing outer ring for top 5% hotspots */}
              {isTop5 && (
                <CircleMarker
                  center={[lat, lng]}
                  radius={22}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.08,
                    weight: 1.5,
                    dashArray: '4 4',
                  }}
                  className="heat-pulse"
                />
              )}
              {/* Core thermal marker */}
              <CircleMarker
                center={[lat, lng]}
                radius={isTop5 ? 10 : 7}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isTop5 ? 0.9 : 0.7,
                  weight: isTop5 ? 2 : 1,
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[220px]">
                    <div className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                      {isTop5 && <span className="text-[10px] bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded font-data border border-red-500/40">TOP 5%</span>}
                      {zone.name}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-data">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Surface Temp</span>
                        <span className="font-bold" style={{ color }}>{formatTemp(temp, unit)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Ambient</span>
                        <span className="font-bold text-orange-300">{formatTemp(zone.current_ambient_temp, unit)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">WBGT</span>
                        <span className="font-bold text-amber-400">{formatTemp(zone.wbgt_temp, unit)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Pedestrians/hr</span>
                        <span className="font-bold text-cyan-400">{zone.footfall_hourly?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Zone Type</span>
                        <span className="text-slate-300 capitalize">{zone.zone_type?.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Risk Level</span>
                        <span className="text-red-300 font-semibold capitalize">{zone.risk_level}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* Cooling station markers */}
        {layers.coolingStations && stations.map(station => {
          const lat = station.location.coordinates[1];
          const lng = station.location.coordinates[0];
          return (
            <CircleMarker
              key={station.id}
              center={[lat, lng]}
              radius={8}
              pathOptions={{
                color: '#22d3ee',
                fillColor: '#22d3ee',
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <div className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                    <span className="text-lg">💧</span> {station.name}
                  </div>
                  <div className="space-y-1 text-xs font-data">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-cyan-300 capitalize">{station.station_type?.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temp Drop</span>
                      <span className="text-emerald-400 font-bold">-{station.temp_drop_celsius}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capacity</span>
                      <span className="text-white">{station.capacity_ppl_hr} ppl/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Water Level</span>
                      <span className={station.water_level_pct > 50 ? 'text-emerald-400' : 'text-amber-400'}>
                        {station.water_level_pct}%
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Safe route polyline */}
        {layers.safeRoute && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#10b981', weight: 4, opacity: 0.85, dashArray: '10 6' }}
          />
        )}
      </MapContainer>

      {/* Map overlay controls */}
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
