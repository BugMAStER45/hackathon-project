import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { formatTemp, getTempColor } from '../../utils/thermalCalculators';
import HeatLegend from './HeatLegend';
import MapControls from './MapControls';
import { Loader2 } from 'lucide-react';

const TILE_URLS = {
  dark:      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  streets:   'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
};
const TILE_ATTR = {
  dark:      '&copy; OpenStreetMap contributors',
  satellite: '&copy; Esri',
  streets:   '&copy; OpenStreetMap contributors',
};

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 13, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function TileLayerSwitcher({ baseMap, onMapLoading }) {
  return (
    <TileLayer
      key={baseMap}
      url={TILE_URLS[baseMap] || TILE_URLS.satellite}
      attribution={TILE_ATTR[baseMap] || TILE_ATTR.satellite}
      maxZoom={19}
      keepBuffer={8}
      updateWhenZooming={false}
      updateWhenIdle={true}
      className={baseMap === 'dark' ? 'dark-map-filter' : ''}
      eventHandlers={{
        loading: () => onMapLoading(true),
        load: () => onMapLoading(false),
      }}
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
  const [layers,       setLayers]       = useState({ heatGrid: true, coolingStations: true, safeRoute: true });
  const [tempFilter,   setTempFilter]   = useState('all');
  const [baseMap,      setBaseMap]      = useState('satellite'); // DEFAULT SET TO SATELLITE
  const [flyTarget,    setFlyTarget]    = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(false);

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

  function getTempRing(temp) {
    if (temp >= 43) return { color: '#FF2D55', fill: 'rgba(255,45,85,0.18)',  r: 18 };
    if (temp >= 40) return { color: '#FF6B35', fill: 'rgba(255,107,53,0.16)', r: 16 };
    if (temp >= 37) return { color: '#FFD700', fill: 'rgba(255,215,0,0.14)',  r: 14 };
    return           { color: '#00D4FF', fill: 'rgba(0,212,255,0.12)',  r: 12 };
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ height: '600px', border: '1px solid rgba(255,255,255,0.08)', zIndex: 10 }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ width: '100%', height: '100%', background: '#060610' }}
        zoomControl={true}
        wheelPxPerZoomLevel={120}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        <TileLayerSwitcher baseMap={baseMap} onMapLoading={setIsMapLoading} />
        {flyTarget && <FlyTo center={flyTarget.center} zoom={flyTarget.zoom} />}

        {/* Heat Zone Markers */}
        {layers.heatGrid && filteredZones.map((zone) => {
          const temp  = zone.current_surface_temp || 0;
          const ring  = getTempRing(temp);
          const [lng, lat] = zone.location?.coordinates || [0, 0];
          return (
            <React.Fragment key={zone.zone_id || zone.id || Math.random()}>
              <CircleMarker
                center={[lat, lng]}
                radius={ring.r + 6}
                pathOptions={{ color: ring.color, fillColor: ring.fill, fillOpacity: 0.35, weight: 0 }}
              />
              <CircleMarker
                center={[lat, lng]}
                radius={ring.r}
                pathOptions={{ color: ring.color, fillColor: ring.color, fillOpacity: 0.75, weight: 1.5 }}
              >
                <Popup>
                  <div style={{ padding: '10px 14px', minWidth: '180px' }}>
                    <p style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '2px', color: '#7070a0', marginBottom: '4px' }}>THERMAL ZONE</p>
                    <p style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '18px', color: ring.color, letterSpacing: '2px', marginBottom: '6px' }}>
                      {formatTemp(temp, unit)}
                    </p>
                    <p style={{ fontSize: '11px', color: '#e4e4f0', fontWeight: 600 }}>{zone.zone_name || zone.name}</p>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* Cooling Station Markers */}
        {layers.coolingStations && stations.map((station) => {
          const [lng, lat] = station.location?.coordinates || [0, 0];
          return (
            <CircleMarker
              key={station.station_id || Math.random()}
              center={[lat, lng]}
              radius={10}
              pathOptions={{ color: '#00D4FF', fillColor: '#00D4FF', fillOpacity: 0.8, weight: 2 }}
            >
              <Popup>
                <div style={{ padding: '10px 14px', minWidth: '180px' }}>
                  <p style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '2px', color: '#00D4FF', marginBottom: '4px' }}>COOLING STATION</p>
                  <p style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '16px', color: '#e4e4f0', letterSpacing: '2px', marginBottom: '4px' }}>{station.name}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Safe Route Polyline */}
        {layers.safeRoute && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#00FF88', weight: 3, opacity: 0.85, dashArray: '8 4' }}
          />
        )}
      </MapContainer>

      {/* OVERLAY LOADING INDICATOR */}
      {isMapLoading && (
        <div style={{
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(6,6,16,0.95)', border: '1px solid var(--border)',
          color: 'var(--text)', padding: '10px 24px', borderRadius: '30px',
          fontFamily: 'Space Mono,monospace', fontSize: '11px', letterSpacing: '2px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.8)'
        }}>
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          LOADING MAP TILES...
        </div>
      )}

      {/* Overlay Controls */}
      <MapControls
        layers={layers}
        onToggleLayer={handleToggleLayer}
        onChangeBaseMap={setBaseMap}
        activeBaseMap={baseMap}
        tempFilter={tempFilter}
        onChangeTempFilter={setTempFilter}
      />
      <HeatLegend unit={unit} />
    </div>
  );
}
