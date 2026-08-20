import React, { useState } from 'react';
import { Droplet, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function StationOptimizer({
  recommendations = [],
  activeStations = [],
  unit,
  onDeployRecommendation
}) {
  const [filterType, setFilterType] = useState('all');

  const filtered = recommendations.filter(r => {
    if (filterType === 'all') return true;
    return r.station_type === filterType;
  });

  const types = ['all', 'misting_tent', 'solar_cooling_pod', 'hydration_kiosk', 'tree_canopy_shelter'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 animate-fade-slide">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Cooling Station Optimizer
              <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 font-data">
                AI / Algorithmic
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Optimal placement based on pedestrian footfall, solar deficit &amp; microclimate risk
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs shrink-0">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg font-medium capitalize whitespace-nowrap transition-colors font-data ${
                filterType === type
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'all' ? 'All' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Active Deployed</span>
          <div className="text-xl font-display text-emerald-400 mt-0.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {activeStations.length} Active
          </div>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Recommended</span>
          <div className="text-xl font-display text-cyan-400 mt-0.5 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {recommendations.length} Zones
          </div>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400">Projected Relief</span>
          <div className="text-xl font-display text-orange-400 mt-0.5">
            -4.5°C to -6.2°C
          </div>
        </div>
      </div>

      {/* Recommendation cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-4xl">💧</span>
          <p className="text-slate-400 font-data text-sm mt-2">No recommendations for this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(rec => (
            <div
              key={rec.id}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-cyan-950/20 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-data tracking-wider text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Priority: {rec.priority_score}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100 mt-1.5 group-hover:text-cyan-300 transition-colors">
                    {rec.name}
                  </h4>
                </div>
                {/* Fixed: was incorrectly showing dollar sign before °C */}
                <span className="text-xs font-data font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shrink-0">
                  -{rec.temp_drop_celsius}°C Relief
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3 leading-relaxed">{rec.rationale}</p>

              <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80 text-xs mb-3 font-data">
                <div>
                  <span className="text-[10px] text-slate-500 block">Capacity</span>
                  <strong className="text-slate-200">{rec.capacity_ppl_hr} ppl/hr</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Radius</span>
                  <strong className="text-slate-200">{rec.cooling_radius_m}m</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Est. Cost</span>
                  <strong className="text-slate-200">${rec.cost_estimate_usd?.toLocaleString()}</strong>
                </div>
              </div>

              <button
                onClick={() => onDeployRecommendation && onDeployRecommendation(rec)}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-600/20"
              >
                <Droplet className="w-3.5 h-3.5" />
                Simulate &amp; Deploy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
