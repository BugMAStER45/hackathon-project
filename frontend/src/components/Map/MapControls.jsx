import React from 'react';
import { Layers, Eye, Filter, Droplet, Flame, Compass } from 'lucide-react';

export default function MapControls({
  layers,
  onToggleLayer,
  tempFilter,
  onChangeTempFilter,
  baseMap,
  onChangeBaseMap
}) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Layer Toggles Card */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-2.5 max-w-[200px]">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
          <Layers className="w-3.5 h-3.5 text-orange-400" />
          <span>Map Overlays</span>
        </div>

        <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3 h-3 text-orange-400" />
            Thermal Heat Grid
          </span>
          <input
            type="checkbox"
            checked={layers.heatGrid}
            onChange={() => onToggleLayer('heatGrid')}
            className="rounded bg-slate-800 border-slate-600 text-orange-500 focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
          <span className="flex items-center gap-1.5">
            <Droplet className="w-3 h-3 text-cyan-400" />
            Cooling Stations
          </span>
          <input
            type="checkbox"
            checked={layers.coolingStations}
            onChange={() => onToggleLayer('coolingStations')}
            className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-emerald-400" />
            Safe Walking Route
          </span>
          <input
            type="checkbox"
            checked={layers.safeRoute}
            onChange={() => onToggleLayer('safeRoute')}
            className="rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Temperature Threshold Filter */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Thermal Filter</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onChangeTempFilter('all')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              tempFilter === 'all'
                ? 'bg-orange-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onChangeTempFilter('35')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              tempFilter === '35'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            &gt; 35°C
          </button>
          <button
            onClick={() => onChangeTempFilter('40')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              tempFilter === '40'
                ? 'bg-red-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            &gt; 40°C
          </button>
        </div>
      </div>
    </div>
  );
}
