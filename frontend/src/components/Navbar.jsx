import React, { useState, useEffect } from 'react';
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
  ThermometerSnowflake,
  Clock
} from 'lucide-react';
import { formatTemp } from '../utils/thermalCalculators';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-data text-[10px] text-slate-400 hidden lg:flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

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
  kpis,
  tabBadges = {}
}) {
  const alertLevel = kpis?.government_environment?.municipal_alert_level || 'Level 2 — Heat Warning';
  const ambientTemp = selectedCity?.default_ambient_temp || 38.5;

  const plannerTabs = [
    { id: 'map',       icon: <Compass className="w-3.5 h-3.5" />,  label: 'Thermal Map' },
    { id: 'hotspots',  icon: <Flame className="w-3.5 h-3.5" />,     label: 'Top 5% Hotspots' },
    { id: 'optimizer', icon: <Droplet className="w-3.5 h-3.5" />,   label: 'Cooling Deployer' },
    { id: 'analytics', icon: <BarChart3 className="w-3.5 h-3.5" />, label: '3 Pillars Analytics' },
  ];
  const citizenTabs = [
    { id: 'map',           icon: <Compass className="w-3.5 h-3.5" />,       label: 'Thermal Map' },
    { id: 'safe-route',    icon: <Compass className="w-3.5 h-3.5" />,       label: 'Safe Route' },
    { id: 'cooling-oasis', icon: <Droplet className="w-3.5 h-3.5" />,       label: 'Cooling Oases' },
    { id: 'heat-health',   icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'Heat Health' },
  ];
  const tabs = persona === 'planner' ? plannerTabs : citizenTabs;
  const activeColor = persona === 'planner' ? 'orange' : 'cyan';

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      {/* Emergency alert bar */}
      <div className="bg-gradient-to-r from-red-950 via-orange-950 to-red-950 border-b border-red-900/50 px-4 py-1 text-xs text-orange-200 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 bg-red-600/30 text-red-300 font-semibold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-red-500/40 shrink-0">
            <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
            {alertLevel}
          </span>
          <span className="truncate text-slate-300 text-[11px]">
            FortyGuard Live Thermal Feed — Extreme surface heat (&gt;45°C) detected across California urban transit hubs.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400 shrink-0 ml-4">
          <span>Resilience: <strong className="text-emerald-400 font-data">{kpis?.resilient_cities_infrastructure?.urban_resilience_index || '—'}/100</strong></span>
          <span>&gt;35°C: <strong className="text-amber-400 font-data">{kpis?.data_analysis_correlation?.zones_exceeding_35c_threshold || '—'}</strong></span>
          <LiveClock />
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg tracking-widest bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                HeatShield
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-data px-1.5 py-0.5 rounded border border-orange-500/30">
                CA
              </span>
            </div>
            <p className="text-[9px] text-slate-500 tracking-wide font-data">FortyGuard Thermal Platform</p>
          </div>
        </div>

        {/* City selector */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 rounded-lg px-2.5 py-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <select
            value={selectedCity?.id || 'los_angeles'}
            onChange={e => { const f = cities.find(c => c.id === e.target.value); if (f) onSelectCity(f); }}
            className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1 max-w-[130px] sm:max-w-none"
          >
            {cities.map(city => (
              <option key={city.id} value={city.id} className="bg-slate-900 text-slate-200">
                {city.name}
              </option>
            ))}
          </select>
          <div className="hidden md:flex items-center gap-1 text-[10px] bg-orange-500/10 text-orange-300 px-1.5 py-0.5 rounded border border-orange-500/20 font-data shrink-0">
            <ThermometerSnowflake className="w-3 h-3 text-orange-400" />
            {formatTemp(ambientTemp, unit)}
          </div>
        </div>

        {/* Persona switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => onSelectPersona('planner')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              persona === 'planner'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">City Planner</span>
            <span className="sm:hidden">Plan</span>
          </button>
          <button
            onClick={() => onSelectPersona('citizen')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              persona === 'citizen'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Citizen</span>
            <span className="sm:hidden">Citizen</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleUnit}
            title="Toggle °C / °F"
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-data font-semibold text-slate-300 rounded-lg transition-colors"
          >
            °{unit}
          </button>
          {persona === 'planner' ? (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">HAP Report</span>
            </button>
          ) : (
            <button
              onClick={onOpenCommunityModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Report Hazard</span>
            </button>
          )}
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-tab navigation — sticky, scrollable, no scrollbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <nav className="flex gap-1 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const badge = tabBadges[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all relative shrink-0 ${
                  isActive
                    ? activeColor === 'orange'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                      : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
                {badge > 0 && (
                  <span className={`ml-0.5 text-[9px] font-data font-bold px-1.5 py-0.5 rounded-full ${
                    activeColor === 'orange'
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
