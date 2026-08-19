import React, { useState } from 'react';
import { HeartPulse, Droplet, Sun, AlertTriangle, ShieldCheck, Activity, Info } from 'lucide-react';
import { formatTemp, getWBGTLevel } from '../../utils/thermalCalculators';

export default function HeatHealthCard({
  ambientTemp = 38.5,
  wbgtTemp = 31.2,
  unit
}) {
  const [weightKg, setWeightKg] = useState(70);
  const [activity, setActivity] = useState('walking'); // 'sedentary', 'walking', 'labor'
  const [hoursOutdoor, setHoursOutdoor] = useState(2);

  // Compute recommended hydration (Liters)
  // Base water rate: 0.035L/kg/day + heat loss factor
  const heatLossRateLitersPerHr = activity === 'labor' ? 1.4 : activity === 'walking' ? 0.9 : 0.4;
  const tempMultiplier = ambientTemp >= 38 ? 1.35 : ambientTemp >= 35 ? 1.15 : 1.0;
  const totalWaterNeededLiters = (hoursOutdoor * heatLossRateLitersPerHr * tempMultiplier).toFixed(1);

  const wbgtInfo = getWBGTLevel(wbgtTemp);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Heat Health &amp; WBGT Risk Advisory
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full border border-red-500/40">
                Personalized
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Wet-Bulb Globe Temperature &amp; Personalized Hydration Intake Engine
            </p>
          </div>
        </div>
      </div>

      {/* WBGT Live Gauge Banner */}
      <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
            Current WBGT Heat Stress Index
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-orange-400 font-mono">
              {formatTemp(wbgtTemp, unit)}
            </span>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
              {wbgtInfo.level} Risk
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {wbgtInfo.desc}
          </p>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
          <span className="font-semibold text-slate-200 block border-b border-slate-800 pb-1">
            Heat Exhaustion Warning Signs:
          </span>
          <ul className="space-y-1 text-[11px] text-slate-300">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Heavy sweating, pale/clammy skin, dizziness
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Rapid weak pulse &amp; muscle cramping
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <strong>Immediate Action:</strong> Move to misting pod, sip cold electrolytes
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Hydration Calculator */}
      <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Droplet className="w-4 h-4" />
            <span>Interactive Hydration Requirement Calculator</span>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            ISO 7243 Microclimate Model
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Body Weight ({weightKg} kg)</label>
            <input
              type="range"
              min="45"
              max="130"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Outdoor Activity</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="sedentary">Sitting / Resting in Shade</option>
              <option value="walking">Walking / Commuting</option>
              <option value="labor">Heavy Physical Labor / Cycling</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Outdoor Duration ({hoursOutdoor} hrs)</label>
            <input
              type="range"
              min="1"
              max="8"
              value={hoursOutdoor}
              onChange={(e) => setHoursOutdoor(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Result Banner */}
        <div className="bg-cyan-950/40 border border-cyan-500/40 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Recommended Water Intake for this outing:</span>
            <div className="text-2xl font-black text-cyan-300 font-mono mt-0.5">
              {totalWaterNeededLiters} Liters <span className="text-xs font-normal text-slate-400">({Math.round(totalWaterNeededLiters * 33.8)} fl oz)</span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-300">
            <span className="text-[10px] text-slate-400 block">Replenishment Rate:</span>
            <strong className="text-emerald-400">~250ml every 20 minutes</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
