import React from 'react';
import { Droplet, Navigation, SunMedium, CloudFog, Trees } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

function StationIcon({ type }) {
  switch (type) {
    case 'misting_tent':        return <CloudFog className="w-4 h-4 text-cyan-400" />;
    case 'solar_cooling_pod':   return <SunMedium className="w-4 h-4 text-amber-400" />;
    case 'tree_canopy_shelter': return <Trees className="w-4 h-4 text-emerald-400" />;
    default:                    return <Droplet className="w-4 h-4 text-blue-400" />;
  }
}

function WaterBar({ pct = 0 }) {
  const color = pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-data font-bold ${
        pct > 60 ? 'text-emerald-400' : pct > 30 ? 'text-amber-400' : 'text-red-400'
      }`}>{pct}%</span>
    </div>
  );
}

export default function CoolingOasisList({ stations = [], unit, onNavigateToStation }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-slide">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Nearest Cooling Oases
              <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 font-data">
                {stations.length} Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">Public misting stations, cold water refills &amp; air-cooled shelters</p>
          </div>
        </div>
      </div>

      {stations.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <span className="text-5xl">💧</span>
          <p className="text-slate-400 font-data text-sm">No cooling stations deployed yet</p>
          <p className="text-slate-500 text-xs">Ask your city planner to deploy cooling hubs</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {stations.map(st => (
            <div
              key={st.id}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-cyan-950/30 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <StationIcon type={st.station_type} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {st.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {st.station_type?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-data font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  -{st.temp_drop_celsius}°C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-xs mb-3 font-data">
                <div>
                  <span className="text-[10px] text-slate-500 block">Radius</span>
                  <strong className="text-slate-200">{st.cooling_radius_m}m</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Capacity</span>
                  <strong className="text-slate-200">{st.capacity_ppl_hr} ppl/hr</strong>
                </div>
              </div>

              {/* Water reservoir bar */}
              <div className="mb-3">
                <span className="text-[10px] text-slate-500 font-data block mb-1">Water Reservoir</span>
                <WaterBar pct={st.water_level_pct} />
              </div>

              {/* Fixed: navigate button now calls onNavigateToStation to fly map */}
              <button
                onClick={() => onNavigateToStation && onNavigateToStation(st)}
                className="w-full py-2 bg-slate-800 hover:bg-cyan-900/40 text-cyan-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 hover:border-cyan-500/40"
              >
                <Navigation className="w-3.5 h-3.5" />
                View on Map
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
