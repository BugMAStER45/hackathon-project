import React from 'react';
import { AlertCircle, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function WatchlistPanel({ watchlist = [], unit, onSelectZone }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Potential Hotspots Watchlist (&gt; 35°C)
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                {watchlist.length} Sectors
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Proactive thermal escalation surveillance to prevent heat stroke clusters
            </p>
          </div>
        </div>
      </div>

      {/* Table of Watchlist Sectors */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Pedestrian Sector</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Surface Temp</th>
              <th className="py-2.5 px-3">&gt; 35°C Delta</th>
              <th className="py-2.5 px-3">Rate of Rise</th>
              <th className="py-2.5 px-3">Alert Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {watchlist.map((item) => (
              <tr key={item.zone_id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-200">
                  {item.name}
                </td>
                <td className="py-2.5 px-3 text-slate-400 capitalize">
                  {item.zone_type?.replace('_', ' ')}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-orange-400">
                  {formatTemp(item.surface_temp, unit)}
                </td>
                <td className="py-2.5 px-3 font-mono text-amber-300">
                  +{item.threshold_exceeded_by}°C
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                  +{item.rate_of_temp_rise}°C/hr
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.surface_temp >= 45 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : item.surface_temp >= 40
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.alert_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
