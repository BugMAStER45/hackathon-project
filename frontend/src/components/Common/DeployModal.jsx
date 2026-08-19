import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Droplet, SunMedium, CloudFog, Trees, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function DeployModal({
  targetZone,
  isOpen,
  onClose,
  onConfirmDeploy,
  cityId,
  unit
}) {
  const [stationType, setStationType] = useState('misting_tent');
  const [stationName, setStationName] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [impactResult, setImpactResult] = useState(null);

  if (!isOpen || !targetZone) return null;

  const typeProfiles = {
    misting_tent: { label: 'High-Pressure Misting Tent', drop: 5.4, capacity: 600, radius: 60, icon: CloudFog },
    solar_cooling_pod: { label: 'Solar-Powered Cooling Pod', drop: 5.0, capacity: 500, radius: 50, icon: SunMedium },
    hydration_kiosk: { label: 'Smart Hydration Refill Kiosk', drop: 3.6, capacity: 450, radius: 35, icon: Droplet },
    tree_canopy_shelter: { label: 'Urban Canopy & Mist Pergola', drop: 4.5, capacity: 550, radius: 55, icon: Trees },
  };

  const selectedProfile = typeProfiles[stationType] || typeProfiles.misting_tent;

  const handleDeploy = async () => {
    setSimulating(true);
    const res = await onConfirmDeploy({
      city_id: cityId,
      zone_id: targetZone.id,
      station_type: stationType,
      name: stationName || `${selectedProfile.label} at ${targetZone.name}`,
      coordinates: targetZone.location.coordinates
    });

    // Trigger celebratory confetti
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });

    setImpactResult(res?.simulation_impact || {
      localized_temp_reduction_c: selectedProfile.drop,
      daily_pedestrians_protected: targetZone.footfall_hourly * 4
    });
    setSimulating(false);
  };

  const handleFinish = () => {
    setImpactResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Deploy Cooling Station &amp; Simulate Relief
              </h3>
              <span className="text-xs text-slate-400">
                Target: {targetZone.name}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {impactResult ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Cooling Station Deployed!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Thermodynamic microclimate relief successfully simulated for {targetZone.name}.
              </p>
            </div>

            {/* Simulation Results Banner */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-emerald-500/40 text-left font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Immediate Temp Drop</span>
                <div className="text-xl font-bold text-emerald-400">
                  -{impactResult.localized_temp_reduction_c}°C
                </div>
                <span className="text-[10px] text-slate-400">
                  {formatTemp(targetZone.current_surface_temp, unit)} &rarr; {formatTemp(targetZone.current_surface_temp - impactResult.localized_temp_reduction_c, unit)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Daily Commuters Protected</span>
                <div className="text-xl font-bold text-cyan-300">
                  {impactResult.daily_pedestrians_protected?.toLocaleString()} ppl
                </div>
                <span className="text-[10px] text-slate-400">Heatstroke risk eliminated</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/30"
            >
              Done &amp; Update Live Map
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4 text-xs">
            {/* Zone Current Status */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Current Surface Heat</span>
                <strong className="text-red-400 text-sm">{formatTemp(targetZone.current_surface_temp, unit)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Hourly Footfall</span>
                <strong className="text-slate-200 text-sm">{targetZone.footfall_hourly?.toLocaleString()} ppl/hr</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Shade Coverage</span>
                <strong className="text-amber-400 text-sm">{targetZone.shade_coverage_pct}%</strong>
              </div>
            </div>

            {/* Station Type Selector */}
            <div>
              <label className="block font-semibold text-slate-300 mb-2">
                Select Cooling Station Technology
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(typeProfiles).map(([key, prof]) => {
                  const Icon = prof.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStationType(key)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        stationType === key
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-950/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span className="truncate">{prof.label}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400">
                        <span>-{prof.drop}°C drop</span>
                        <span>{prof.radius}m</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Name */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Station Label / Name (Optional)
              </label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder={`e.g. ${targetZone.name} Mist Kiosk`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="button"
              onClick={handleDeploy}
              disabled={simulating}
              className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/30"
            >
              <Droplet className="w-4 h-4" />
              {simulating ? 'Simulating Thermodynamic Relief...' : 'Deploy & Recalculate Microclimate'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
