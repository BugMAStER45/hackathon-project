import React from 'react';
import { Layers, Filter, Droplet, Flame, Compass, Map } from 'lucide-react';

export default function MapControls({
  layers, onToggleLayer,
  tempFilter, onChangeTempFilter,
  baseMap, onChangeBaseMap
}) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Layer Toggles */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-2.5 max-w-[200px]">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
          <Layers className="w-3.5 h-3.5 text-orange-400" />
          <span>Overlays</span>
        </div>
        {[
          { key: 'heatGrid',       icon: <Flame    className="w-3 h-3 text-orange-400" />, label: 'Thermal Grid' },
          { key: 'coolingStations',icon: <Droplet  className="w-3 h-3 text-cyan-400"   />, label: 'Cooling Stations' },
          { key: 'safeRoute',      icon: <Compass  className="w-3 h-3 text-emerald-400"/>, label: 'Safe Route' },
        ].map(({ key, icon, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5">{icon}{label}</span>
            <input
              type="checkbox"
              checked={layers[key]}
              onChange={() => onToggleLayer(key)}
              className="rounded bg-slate-800 border-slate-600 text-orange-500 focus:ring-0 cursor-pointer"
            />
          </label>
        ))}
      </div>

      {/* Basemap switcher — actually switches TileLayer */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
          <Map className="w-3.5 h-3.5 text-purple-400" />
          <span>Basemap</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'dark',      label: 'Dark' },
            { id: 'satellite', label: 'Sat' },
            { id: 'streets',   label: 'Streets' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onChangeBaseMap(id)}
              className={`px-1.5 py-1 rounded text-[10px] font-medium transition-colors ${
                baseMap === id
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Thermal filter */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Thermal Filter</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'all', label: 'All',    cls: 'bg-orange-500 text-white' },
            { id: '35',  label: '>35°C',  cls: 'bg-amber-500 text-slate-950' },
            { id: '40',  label: '>40°C',  cls: 'bg-red-500 text-white' },
          ].map(({ id, label, cls }) => (
            <button
              key={id}
              onClick={() => onChangeTempFilter(id)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                tempFilter === id ? cls : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
