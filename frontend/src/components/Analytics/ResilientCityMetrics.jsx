import React from 'react';
import { 
  Building2, 
  Leaf, 
  BarChart3, 
  ShieldCheck, 
  Droplet, 
  Trees, 
  Users, 
  Flame, 
  AlertTriangle,
  Zap,
  TrendingDown
} from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function ResilientCityMetrics({
  kpis,
  unit
}) {
  if (!kpis) return null;

  const pillar1 = kpis.resilient_cities_infrastructure || {};
  const pillar2 = kpis.government_environment || {};
  const pillar3 = kpis.data_analysis_correlation || {};

  return (
    <div className="space-y-5">
      {/* Pillar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Resilient Cities & Infrastructure */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold">
                Pillar 1
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                Resilient Cities &amp; Infrastructure
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Urban Resilience Index</span>
                <strong className="text-cyan-300 font-mono text-sm">{pillar1.urban_resilience_index}/100</strong>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" 
                  style={{ width: `${pillar1.urban_resilience_index}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Cooling Coverage</span>
                <strong className="text-emerald-400 text-sm">{pillar1.cooling_station_coverage_pct}%</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Tree Canopy Shade</span>
                <strong className="text-emerald-400 text-sm">{pillar1.tree_canopy_shade_pct}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Government & Environment */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Pillar 2
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                Government &amp; Environment
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Municipal Alert Status</span>
              <div className="text-sm font-bold text-orange-400 mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                {pillar2.municipal_alert_level}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">HAP Compliance</span>
                <strong className="text-emerald-400 text-sm">{pillar2.heat_action_plan_compliance_pct}%</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Commuters Shielded</span>
                <strong className="text-cyan-300 text-sm">{pillar2.daily_vulnerable_commuters_protected?.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Data Analysis & Correlation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-bold">
                Pillar 3
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                Data Analysis &amp; Correlation
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Avg Pedestrian Surface Temp</span>
                <strong className="text-orange-400 font-mono text-sm">{formatTemp(pillar3.city_average_surface_temp_c, unit)}</strong>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-400">Urban Heat Island (UHI) Delta</span>
                <strong className="text-red-400 font-mono">+{pillar3.uhi_thermal_excess_c}°C</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">&gt;35°C Watchlist</span>
                <strong className="text-amber-400 text-sm">{pillar3.zones_exceeding_35c_threshold} Sectors</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Peak Recorded</span>
                <strong className="text-red-400 text-sm">{formatTemp(pillar3.max_recorded_surface_temp_c, unit)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
