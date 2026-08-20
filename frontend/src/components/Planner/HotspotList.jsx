import React, { useState } from 'react';
import { Flame, AlertTriangle, Droplet, ChevronDown, ChevronUp, Thermometer, Users } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

const RANK_STYLES = [
  'bg-red-500 text-white',
  'bg-orange-500 text-white',
  'bg-orange-400 text-white',
  'bg-amber-500 text-slate-900',
  'bg-amber-400 text-slate-900',
];

function RiskBadge({ level }) {
  const map = {
    critical:  'bg-red-500/20 text-red-300 border-red-500/40',
    extreme:   'bg-red-500/20 text-red-300 border-red-500/40',
    high:      'bg-orange-500/20 text-orange-300 border-orange-500/40',
    moderate:  'bg-amber-500/20 text-amber-300 border-amber-500/40',
    low:       'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  };
  const cls = map[level?.toLowerCase()] || 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-data border uppercase tracking-wide ${cls}`}>
      {level}
    </span>
  );
}

function HotspotCard({ hotspot, rank, unit, onDeploy }) {
  const [expanded, setExpanded] = useState(false);
  const rankStyle = RANK_STYLES[rank - 1] || 'bg-slate-700 text-white';

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 hover:border-orange-500/30 rounded-xl transition-all">
      {/* Summary row */}
      <div
        className="flex items-center gap-3 p-3.5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Rank badge */}
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-bold shrink-0 ${rankStyle}`}>
          {rank}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-100 truncate">{hotspot.name}</span>
            <RiskBadge level={hotspot.risk_level} />
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] font-data text-slate-400">
            <span className="text-orange-400 font-bold">{formatTemp(hotspot.current_surface_temp, unit)}</span>
            <span>·</span>
            <span className="capitalize">{hotspot.zone_type?.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onDeploy && onDeploy(hotspot); }}
            className="px-2.5 py-1.5 bg-cyan-600/80 hover:bg-cyan-500 text-white font-semibold text-[10px] rounded-lg transition-all flex items-center gap-1 border border-cyan-500/40"
          >
            <Droplet className="w-3 h-3" />
            Deploy
          </button>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-700/60 px-4 pb-3.5 pt-3 animate-fade-slide">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 rounded-lg p-2.5 text-center">
              <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <div className="font-data font-bold text-sm text-orange-400">{formatTemp(hotspot.current_surface_temp, unit)}</div>
              <div className="text-[10px] text-slate-500 font-data">Surface Temp</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2.5 text-center">
              <Thermometer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="font-data font-bold text-sm text-amber-400">{formatTemp(hotspot.wbgt_temp, unit)}</div>
              <div className="text-[10px] text-slate-500 font-data">WBGT Index</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2.5 text-center">
              <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="font-data font-bold text-sm text-cyan-400">{hotspot.footfall_hourly?.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 font-data">Pedestrians/hr</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2.5 text-center">
              <Flame className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <div className="font-data font-bold text-sm text-red-400">{hotspot.albedo_factor?.toFixed(2)}</div>
              <div className="text-[10px] text-slate-500 font-data">Albedo Factor</div>
            </div>
          </div>
          {hotspot.recommended_intervention && (
            <div className="mt-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-300">
              <span className="font-semibold">Recommended: </span>{hotspot.recommended_intervention}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HotspotList({ hotspots = [], unit, onDeployToZone }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-slide">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Top 5% Heat Hotspots
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full border border-red-500/40 font-data">
                {hotspots.length} Zones
              </span>
            </h3>
            <p className="text-xs text-slate-400">Click any hotspot to expand thermal details — deploy cooling station</p>
          </div>
        </div>
      </div>

      {hotspots.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <span className="text-5xl">🌡️</span>
          <p className="text-slate-400 font-data text-sm">No hotspots detected</p>
          <p className="text-slate-500 text-xs">Select a city or wait for FortyGuard data to load</p>
        </div>
      ) : (
        <div className="space-y-2">
          {hotspots.map((h, i) => (
            <HotspotCard
              key={h.zone_id || h.id || i}
              hotspot={h}
              rank={i + 1}
              unit={unit}
              onDeploy={onDeployToZone}
            />
          ))}
        </div>
      )}
    </div>
  );
}
