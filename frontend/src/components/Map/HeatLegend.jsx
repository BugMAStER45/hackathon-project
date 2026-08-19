import React from 'react';
import { Flame, ShieldAlert, AlertTriangle, ShieldCheck, Sun } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function HeatLegend({ unit }) {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl shadow-2xl max-w-xs text-xs">
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-orange-400" />
          FortyGuard Thermal Scale
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Surface / WBGT</span>
      </div>

      {/* Gradient Bar */}
      <div className="h-3 w-full rounded-md bg-gradient-to-r from-emerald-500 via-blue-500 via-amber-400 via-orange-500 to-red-600 shadow-inner mb-2" />

      {/* Legend Brackets */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-medium">Extreme Risk (Top 5%)</span>
          </div>
          <span className="font-mono text-red-300">&ge; {formatTemp(45, unit)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-orange-400 font-medium">High Danger</span>
          </div>
          <span className="font-mono text-orange-300">40 - {formatTemp(44.9, unit)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-amber-400 font-medium">Watchlist (&gt;35°C)</span>
          </div>
          <span className="font-mono text-amber-300">35 - {formatTemp(39.9, unit)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-medium">Cool Canopy / Shade</span>
          </div>
          <span className="font-mono text-emerald-300">&lt; {formatTemp(32, unit)}</span>
        </div>
      </div>
    </div>
  );
}
