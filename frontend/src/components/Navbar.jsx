import React from 'react';
import { 
  Flame, 
  Building2, 
  UserCheck, 
  MapPin, 
  Settings as SettingsIcon, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Droplet,
  Compass,
  ThermometerSnowflake
} from 'lucide-react';
import { formatTemp } from '../utils/thermalCalculators';

export default function Navbar({
  cities,
  selectedCity,
  onSelectCity,
  persona,
  onSelectPersona,
  activeTab,
  onSelectTab,
  unit,
  onToggleUnit,
  onOpenSettings,
  onOpenReport,
  onOpenCommunityModal,
  kpis
}) {
  const alertLevel = kpis?.government_environment?.municipal_alert_level || 'Level 2 - Heat Warning';
  const ambientTemp = selectedCity?.default_ambient_temp || 38.5;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-red-950 via-orange-950 to-red-950 border-b border-red-900/50 px-4 py-1 text-xs text-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-red-600/30 text-red-300 font-semibold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-red-500/40">
            <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
            {alertLevel}
          </span>
          <span className="truncate text-slate-300">
            FortyGuard Live Thermal Feed: Extreme surface heat (&gt;45°C) detected across California urban transit hubs. Preventive misting recommended.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
          <span>Resilience Index: <strong className="text-emerald-400">{kpis?.resilient_cities_infrastructure?.urban_resilience_index || 76.4}/100</strong></span>
          <span>Watchlist Nodes (&gt;35°C): <strong className="text-amber-400">{kpis?.data_analysis_correlation?.zones_exceeding_35c_threshold || 12}</strong></span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                FortyGuard HeatShield
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-mono px-1.5 py-0.5 rounded border border-orange-500/30">
                California
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
              Pedestrian Microclimate Resilience & Cooling Station Hub
            </p>
          </div>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 rounded-lg px-2.5 py-1.5">
          <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
          <select
            value={selectedCity?.id || 'los_angeles'}
            onChange={(e) => {
              const found = cities.find(c => c.id === e.target.value);
              if (found) onSelectCity(found);
            }}
            className="bg-transparent text-xs sm:text-sm font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id} className="bg-slate-900 text-slate-200">
                {city.name}
              </option>
            ))}
          </select>
          <div className="hidden md:flex items-center gap-1 text-[11px] bg-orange-500/10 text-orange-300 px-2 py-0.5 rounded border border-orange-500/20 font-mono">
            <ThermometerSnowflake className="w-3 h-3 text-orange-400" />
            {formatTemp(ambientTemp, unit)}
          </div>
        </div>

        {/* Persona Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectPersona('planner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              persona === 'planner'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">City Planner & Govt</span>
            <span className="sm:hidden">Planner</span>
          </button>
          <button
            onClick={() => onSelectPersona('citizen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              persona === 'citizen'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Citizen & Commuter</span>
            <span className="sm:hidden">Citizen</span>
          </button>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <button
            onClick={onToggleUnit}
            title="Toggle °C / °F"
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-semibold text-slate-300 rounded-lg transition-colors"
          >
            °{unit}
          </button>

          {/* Persona specific action button */}
          {persona === 'planner' ? (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Generate Municipal HAP Report</span>
              <span className="md:hidden">Report</span>
            </button>
          ) : (
            <button
              onClick={onOpenCommunityModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Report Heat Hazard</span>
              <span className="md:hidden">Report</span>
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="FortyGuard API & Settings"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-800/60 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-4 py-2">
          <button
            onClick={() => onSelectTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'map'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Thermal Geospatial Map
          </button>

          {persona === 'planner' ? (
            <>
              <button
                onClick={() => onSelectTab('hotspots')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'hotspots'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Top 5% Hotspots &amp; &gt;35°C Watchlist
              </button>
              <button
                onClick={() => onSelectTab('optimizer')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'optimizer'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                Cooling Station Deployer
              </button>
              <button
                onClick={() => onSelectTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                3 Pillars Analytics &amp; Patterns
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectTab('safe-route')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'safe-route'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Shaded Route Navigator
              </button>
              <button
                onClick={() => onSelectTab('cooling-oasis')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'cooling-oasis'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                Cooling Oases &amp; Hydration
              </button>
              <button
                onClick={() => onSelectTab('heat-health')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'heat-health'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Heat Health &amp; WBGT Guide
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
