import React from 'react';
import { Droplet, MapPin, CheckCircle, Navigation, ShieldCheck, SunMedium, CloudFog, Trees } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function CoolingOasisList({
  stations = [],
  unit,
  onNavigateToStation
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'misting_tent': return <CloudFog className="w-4 h-4 text-cyan-400" />;
      case 'solar_cooling_pod': return <SunMedium className="w-4 h-4 text-amber-400" />;
      case 'tree_canopy_shelter': return <Trees className="w-4 h-4 text-emerald-400" />;
      default: return <Droplet className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Nearest Cooling Oases &amp; Hydration Hubs
              <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40">
                {stations.length} Active Hubs
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Public misting stations, cold water refill points &amp; air-cooled shelters
            </p>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {stations.map((st) => (
          <div
            key={st.id}
            className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-cyan-950/30 group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  {getIcon(st.station_type)}
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
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                -{st.temp_drop_celsius}°C Relief
              </span>
            </div>

            {/* Status Specs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-xs mb-3 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Radius</span>
                <strong className="text-slate-200">{st.cooling_radius_m}m</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Capacity</span>
                <strong className="text-slate-200">{st.capacity_ppl_hr} ppl/hr</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Water Reservoir</span>
                <strong className="text-cyan-400">{st.water_level_pct}% Full</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigateToStation && onNavigateToStation(st)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 hover:border-cyan-500/40"
            >
              <Navigation className="w-3.5 h-3.5" />
              View Location on Map
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
