import React from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

function RiskPill({ temp }) {
  if (temp >= 45) return <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-data bg-red-500/20 text-red-300 border border-red-500/40">EXTREME</span>;
  if (temp >= 40) return <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-data bg-orange-500/20 text-orange-300 border border-orange-500/40">HIGH</span>;
  return <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-data bg-amber-500/20 text-amber-300 border border-amber-500/40">WATCHLIST</span>;
}

export default function WatchlistPanel({ watchlist = [], unit }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-slide">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Watchlist Sectors
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 font-data">
                {watchlist.length} Sectors
              </span>
            </h3>
            <p className="text-xs text-slate-400">Proactive thermal surveillance — zones exceeding 35°C</p>
          </div>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <span className="text-4xl">🌡️</span>
          <p className="text-slate-400 text-sm font-data">No sectors in watchlist</p>
          <p className="text-slate-500 text-xs">All zones are below the 35°C threshold</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[480px]">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3">Surface Temp</th>
                <th className="py-2.5 px-3">Delta +35°C</th>
                <th className="py-2.5 px-3">Rise Rate</th>
                <th className="py-2.5 px-3">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {watchlist.map(item => (
                <tr key={item.zone_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{item.name}</td>
                  <td className="py-2.5 px-3 font-data font-bold text-orange-400">{formatTemp(item.surface_temp, unit)}</td>
                  <td className="py-2.5 px-3 font-data text-amber-300">+{item.threshold_exceeded_by}°C</td>
                  <td className="py-2.5 px-3 font-data text-slate-300 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                    +{item.rate_of_temp_rise}°C/hr
                  </td>
                  <td className="py-2.5 px-3"><RiskPill temp={item.surface_temp} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
