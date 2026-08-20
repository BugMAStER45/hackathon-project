import React, { useState, useEffect } from 'react';
import { Compass, Trees, ShieldCheck, Sun } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function SafeRoutePlanner({
  zones = [],
  onCalculateRoute,
  activeRoute,
  unit
}) {
  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [preference, setPreference] = useState('coolest_shaded');
  const [loading, setLoading] = useState(false);

  // Fix: sync defaults when zones load
  useEffect(() => {
    if (zones.length >= 2) {
      if (!originId) setOriginId(zones[0].id);
      if (!destinationId) setDestinationId(zones[1].id);
    }
  }, [zones]);

  const handleCompute = async () => {
    const originZone = zones.find(z => z.id === originId) || zones[0];
    const destZone   = zones.find(z => z.id === destinationId) || zones[1];
    if (!originZone || !destZone) return;
    setLoading(true);
    await onCalculateRoute({
      origin:      [originZone.location.coordinates[1], originZone.location.coordinates[0]],
      destination: [destZone.location.coordinates[1],   destZone.location.coordinates[0]],
      preference
    });
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 animate-fade-slide">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Safe Shaded Route Navigator
            <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40 font-data">
              Heat-Shielded
            </span>
          </h3>
          <p className="text-xs text-slate-400">Avoid high-albedo asphalt — navigate via shaded parks &amp; misting kiosks</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Origin</label>
          <select
            value={originId}
            onChange={e => setOriginId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {zones.map(z => (
              <option key={`orig_${z.id}`} value={z.id}>
                {z.name} ({formatTemp(z.current_surface_temp, unit)})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Destination</label>
          <select
            value={destinationId}
            onChange={e => setDestinationId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {zones.map(z => (
              <option key={`dest_${z.id}`} value={z.id}>
                {z.name} ({formatTemp(z.current_surface_temp, unit)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Route preference */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setPreference('coolest_shaded')}
          className={`flex-1 p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            preference === 'coolest_shaded'
              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trees className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="font-bold text-white">Coolest Shaded</div>
              <div className="text-[10px] text-emerald-400/80">Max shade + cooling stations</div>
            </div>
          </div>
          <span className="text-[10px] font-data bg-emerald-500/30 px-2 py-0.5 rounded">-45% Heat</span>
        </button>

        <button
          onClick={() => setPreference('fastest')}
          className={`flex-1 p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            preference === 'fastest'
              ? 'bg-red-500/20 border-red-500/60 text-red-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-orange-400" />
            <div className="text-left">
              <div className="font-bold text-white">Fastest Direct</div>
              <div className="text-[10px] text-red-400/80">Direct asphalt sidewalk</div>
            </div>
          </div>
          <span className="text-[10px] font-data bg-slate-800 px-2 py-0.5 rounded text-slate-300">Unshaded</span>
        </button>
      </div>

      <button
        onClick={handleCompute}
        disabled={loading || zones.length < 2}
        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
      >
        <Compass className="w-4 h-4" />
        {loading ? 'Calculating Thermal Path...' : 'Find Coolest Safe Route'}
      </button>

      {/* Route result */}
      {activeRoute && (
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3 animate-fade-slide">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">
                {activeRoute.route_type === 'coolest_shaded' ? 'Cool-Path Recommended' : 'Direct Path'}
              </span>
            </div>
            <span className="text-xs font-data font-bold text-emerald-400">
              {activeRoute.total_distance_m}m &bull; {activeRoute.duration_minutes} min
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-data">
            <div>
              <span className="text-[10px] text-slate-500 block">Avg Temp</span>
              <strong className="text-emerald-400">{formatTemp(activeRoute.average_temp_celsius, unit)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Shade</span>
              <strong className="text-white">{activeRoute.shaded_percentage}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Heat Relief</span>
              <strong className="text-cyan-300">-{activeRoute.thermal_stress_reduction_pct}%</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
