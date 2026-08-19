import React from 'react';
import { Flame, AlertTriangle, Users, Droplet, ArrowUpRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatTemp, getTempColor } from '../../utils/thermalCalculators';

export default function HotspotList({
  hotspots = [],
  watchlistCount = 0,
  unit,
  onDeployClick,
  onFocusZone
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Top 5% Extreme Heat Hotspots
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full border border-red-500/40">
                P95 Hazard Tier
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pinpointed by FortyGuard Thermal Microclimate &amp; Pedestrian Exposure Index
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400">Watchlist Nodes (&gt;35°C):</span>
          <div className="text-sm font-bold text-amber-400">{watchlistCount} Sectors Monitored</div>
        </div>
      </div>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {hotspots.map((spot) => {
          const tempColor = getTempColor(spot.surface_temp);
          return (
            <div
              key={spot.zone_id}
              className="bg-slate-950/70 border border-red-900/40 hover:border-red-500/60 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-red-950/30 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-extrabold flex items-center justify-center font-mono">
                    #{spot.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition-colors">
                      {spot.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {spot.zone_type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black tracking-tight" style={{ color: tempColor }}>
                    {formatTemp(spot.surface_temp, unit)}
                  </div>
                  <span className="text-[10px] text-slate-400">Surface Temp</span>
                </div>
              </div>

              {/* Metrics Pill Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-xs mb-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Ambient Air</span>
                  <strong className="text-slate-200">{formatTemp(spot.ambient_temp, unit)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">WBGT Stress</span>
                  <strong className="text-amber-400">{formatTemp(spot.wbgt_temp, unit)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Pedestrians</span>
                  <strong className="text-orange-400">{spot.footfall_hourly?.toLocaleString()}/hr</strong>
                </div>
              </div>

              {/* Recommended Intervention */}
              <div className="space-y-1 text-xs mb-3">
                <span className="text-slate-400 font-medium text-[11px]">Recommended Intervention:</span>
                <p className="text-slate-200 bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-[11px] leading-relaxed text-amber-200/90">
                  {spot.recommended_intervention}
                </p>
              </div>

              {/* Impact & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400">
                  Relief: <strong className="text-emerald-400">-{spot.potential_temp_reduction}°C</strong> | Daily Impact: <strong className="text-slate-200">{spot.lives_protected_daily?.toLocaleString()} ppl</strong>
                </div>
                <button
                  onClick={() => onDeployClick && onDeployClick({
                    id: spot.zone_id,
                    name: spot.name,
                    zone_type: spot.zone_type,
                    location: spot.location,
                    current_surface_temp: spot.surface_temp
                  })}
                  className="flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all shadow-sm"
                >
                  <Droplet className="w-3.5 h-3.5" />
                  Deploy
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
