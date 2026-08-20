import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import ThermalMap from './components/Map/ThermalMap';
import HotspotList from './components/Planner/HotspotList';
import WatchlistPanel from './components/Planner/WatchlistPanel';
import StationOptimizer from './components/Planner/StationOptimizer';
import ResilientCityMetrics from './components/Analytics/ResilientCityMetrics';
import SafeRoutePlanner from './components/Citizen/SafeRoutePlanner';
import CoolingOasisList from './components/Citizen/CoolingOasisList';
import HeatHealthCard from './components/Citizen/HeatHealthCard';
import WeeklyPatternChart from './components/Analytics/WeeklyPatternChart';
import CorrelationChart from './components/Analytics/CorrelationChart';
import MunicipalReportModal from './components/Planner/MunicipalReportModal';
import CommunityReportModal from './components/Citizen/CommunityReportModal';
import DeployModal from './components/Common/DeployModal';
import SettingsModal from './components/Common/SettingsModal';
import ToastContainer from './components/Common/Toast';
import LoadingSkeleton from './components/Common/LoadingSkeleton';
import { api } from './services/api';

const CITIES = [
  { id: 'los_angeles',  name: 'Los Angeles, CA',  default_ambient_temp: 42.1 },
  { id: 'palm_springs', name: 'Palm Springs, CA', default_ambient_temp: 47.8 },
  { id: 'fresno',       name: 'Fresno, CA',        default_ambient_temp: 41.3 },
  { id: 'sacramento',   name: 'Sacramento, CA',    default_ambient_temp: 39.7 },
  { id: 'san_francisco',name: 'San Francisco, CA', default_ambient_temp: 29.4 },
];

let toastId = 0;

export default function App() {
  // ─── State ───
  const [selectedCity,    setSelectedCity]    = useState(CITIES[0]);
  const [persona,         setPersona]         = useState('planner');
  const [activeTab,       setActiveTab]       = useState('map');
  const [unit,            setUnit]            = useState('C');
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  // Data
  const [zones,           setZones]           = useState([]);
  const [hotspotData,     setHotspotData]     = useState(null);
  const [stations,        setStations]        = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [weeklyData,      setWeeklyData]      = useState(null);
  const [correlations,    setCorrelations]    = useState(null);
  const [kpis,            setKpis]            = useState(null);
  const [activeRoute,     setActiveRoute]     = useState(null);
  const [retryCount,      setRetryCount]      = useState(0);

  // UI
  const [showReport,      setShowReport]      = useState(false);
  const [showCommunity,   setShowCommunity]   = useState(false);
  const [showSettings,    setShowSettings]    = useState(false);
  const [deployTarget,    setDeployTarget]    = useState(null);
  const [highlightStation,setHighlightStation]= useState(null);
  const [toasts,          setToasts]          = useState([]);

  // ─── Toast helpers ───
  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);
  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Data Fetching ───
  const fetchCityData = useCallback(async (cityId) => {
    setLoading(true);
    setError(null);
    try {
      const [
        zonesRes, hotspotRes, stationsRes, recsRes,
        weeklyRes, corrRes, kpisRes
      ] = await Promise.all([
        api.getZones(cityId),
        api.getHotspots(cityId),
        api.getStations(cityId),
        api.getRecommendations(cityId),
        api.getWeeklyPatterns(cityId).catch(() => null),
        api.getCorrelations(cityId).catch(() => null),
        api.getKpis(cityId).catch(() => null),
      ]);
      setZones(zonesRes?.zones || []);
      setHotspotData(hotspotRes || null);
      setStations(stationsRes?.stations || []);
      setRecommendations(recsRes?.recommendations || []);
      setWeeklyData(weeklyRes || null);
      setCorrelations(corrRes || null);
      setKpis(kpisRes || null);
      setActiveRoute(null);
    } catch (err) {
      console.error('API error:', err);
      setError('Could not reach the HeatShield backend. The server may be waking up (Render free tier — ~30s). Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCityData(selectedCity.id);
  }, [selectedCity, fetchCityData, retryCount]);

  // ─── Handlers ───
  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setActiveTab('map');
  };

  const handleSelectPersona = (p) => {
    setPersona(p);
    setActiveTab('map');
  };

  const handleCalculateRoute = async (params) => {
    try {
      const res = await api.getSafeRoute(selectedCity.id, params);
      setActiveRoute(res);
      setActiveTab('map');
    } catch (e) {
      addToast('error', 'Route Error', 'Could not calculate safe route. Try again.');
    }
  };

  const handleDeployStation = async (zone) => {
    setDeployTarget(zone);
  };

  const handleConfirmDeploy = async (deployData) => {
    try {
      await api.deployStation(selectedCity.id, deployData);
      const stationsRes = await api.getStations(selectedCity.id);
      setStations(stationsRes?.stations || []);
      addToast('success', 'Station Deployed!', `Cooling station successfully deployed at ${deployData.name || 'selected zone'}.`);
      setDeployTarget(null);
    } catch (e) {
      addToast('error', 'Deploy Failed', 'Could not deploy station. Please try again.');
    }
  };

  const handleNavigateToStation = (station) => {
    setHighlightStation(station);
    setActiveTab('map');
  };

  // ─── Tab badges (data counts) ───
  const tabBadges = {
    hotspots:  hotspotData?.top_5_percent_count || 0,
    optimizer: recommendations.length || 0,
    'cooling-oasis': stations.length || 0,
  };

  // ─── KPI helpers ───
  const maxTemp    = hotspotData?.max_surface_temp || selectedCity.default_ambient_temp;
  const watchlist  = hotspotData?.watchlist_35c   || [];
  const hotspots   = hotspotData?.top_hotspots    || [];
  const kpiData    = kpis || {};

  // ─── Metric Banner ───
  const metricBanner = (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        {
          label: 'Max Surface Temp',
          value: loading ? '—' : `${maxTemp?.toFixed(1)}\u00b0C`,
          sub: 'FortyGuard live thermal',
          color: 'text-red-400',
          border: 'border-red-500/20',
          bg: 'from-red-500/5',
          pill: { text: 'EXTREME', cls: 'bg-red-500/20 text-red-300 border-red-500/40' },
        },
        {
          label: 'Top 5% Hotspots',
          value: loading ? '—' : (hotspotData?.top_5_percent_count ?? '—'),
          sub: 'Pedestrian danger zones',
          color: 'text-orange-400',
          border: 'border-orange-500/20',
          bg: 'from-orange-500/5',
          pill: { text: 'CRITICAL', cls: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
        },
        {
          label: '> 35\u00b0C Sectors',
          value: loading ? '—' : (hotspotData?.watchlist_above_35_count ?? '—'),
          sub: 'Watchlist active zones',
          color: 'text-amber-400',
          border: 'border-amber-500/20',
          bg: 'from-amber-500/5',
          pill: { text: 'WATCHLIST', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        },
        {
          label: 'Active Cooling Hubs',
          value: loading ? '—' : stations.length,
          sub: 'Deployed misting + pods',
          color: 'text-cyan-400',
          border: 'border-cyan-500/20',
          bg: 'from-cyan-500/5',
          pill: { text: 'LIVE', cls: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
        },
      ].map((m, i) => (
        <div key={i} className={`bg-gradient-to-br ${m.bg} to-transparent bg-slate-900/90 border ${m.border} border-slate-800 rounded-xl p-3.5 transition-all hover:border-slate-600`}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[10px] font-data text-slate-400 uppercase tracking-wider">{m.label}</span>
            <span className={`text-[9px] font-data font-bold px-1.5 py-0.5 rounded border ${m.pill.cls} shrink-0`}>{m.pill.text}</span>
          </div>
          <div className={`font-display text-2xl leading-none ${m.color} mb-1`}>{m.value}</div>
          <div className="text-[10px] text-slate-500">{m.sub}</div>
        </div>
      ))}
    </div>
  );

  // ─── Error UI ───
  const errorUI = (
    <div className="flex flex-col items-center justify-center py-24 space-y-5">
      <div className="text-6xl">🔄</div>
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-white mb-2">Backend Waking Up</h2>
        <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
      </div>
      <button
        onClick={() => setRetryCount(c => c + 1)}
        className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30"
      >
        Retry Now
      </button>
      <p className="text-slate-500 text-xs font-data">Render free tier sleeps after 15 min inactivity — first load takes ~30s</p>
    </div>
  );

  // ─── Tab Content ───
  const renderTabContent = () => {
    if (loading) return <LoadingSkeleton />;
    if (error)   return errorUI;

    if (persona === 'planner') {
      switch (activeTab) {
        case 'map':
          return (
            <div className="space-y-5 animate-fade-slide">
              {metricBanner}
              <ThermalMap
                zones={zones}
                stations={stations}
                activeRoute={activeRoute}
                unit={unit}
                highlightStation={highlightStation}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <HotspotList hotspots={hotspots} unit={unit} onDeployToZone={handleDeployStation} />
                <WatchlistPanel watchlist={watchlist} unit={unit} />
              </div>
            </div>
          );
        case 'hotspots':
          return (
            <div className="space-y-5 animate-fade-slide">
              {metricBanner}
              <HotspotList hotspots={hotspots} unit={unit} onDeployToZone={handleDeployStation} />
              <WatchlistPanel watchlist={watchlist} unit={unit} />
            </div>
          );
        case 'optimizer':
          return (
            <div className="space-y-5 animate-fade-slide">
              {metricBanner}
              <StationOptimizer
                recommendations={recommendations}
                activeStations={stations}
                unit={unit}
                onDeployRecommendation={handleDeployStation}
              />
            </div>
          );
        case 'analytics':
          return (
            <div className="space-y-5 animate-fade-slide">
              <ResilientCityMetrics kpis={kpiData} unit={unit} />
              {weeklyData  && <WeeklyPatternChart weeklyData={weeklyData} unit={unit} />}
              {correlations && <CorrelationChart correlations={correlations} />}
            </div>
          );
        default: return null;
      }
    } else {
      // Citizen persona
      switch (activeTab) {
        case 'map':
          return (
            <div className="space-y-5 animate-fade-slide">
              {metricBanner}
              <ThermalMap
                zones={zones}
                stations={stations}
                activeRoute={activeRoute}
                unit={unit}
                highlightStation={highlightStation}
              />
            </div>
          );
        case 'safe-route':
          return (
            <div className="space-y-5 animate-fade-slide">
              <SafeRoutePlanner
                zones={zones}
                onCalculateRoute={handleCalculateRoute}
                activeRoute={activeRoute}
                unit={unit}
              />
              {activeRoute && (
                <ThermalMap
                  zones={zones}
                  stations={stations}
                  activeRoute={activeRoute}
                  unit={unit}
                />
              )}
            </div>
          );
        case 'cooling-oasis':
          return (
            <div className="space-y-5 animate-fade-slide">
              <CoolingOasisList
                stations={stations}
                unit={unit}
                onNavigateToStation={handleNavigateToStation}
              />
            </div>
          );
        case 'heat-health':
          return (
            <div className="space-y-5 animate-fade-slide">
              <HeatHealthCard
                zones={zones}
                unit={unit}
              />
            </div>
          );
        default: return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Navbar */}
      <Navbar
        cities={CITIES}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        persona={persona}
        onSelectPersona={handleSelectPersona}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unit={unit}
        onToggleUnit={() => setUnit(u => u === 'C' ? 'F' : 'C')}
        onOpenSettings={() => setShowSettings(true)}
        onOpenReport={() => setShowReport(true)}
        onOpenCommunityModal={() => setShowCommunity(true)}
        kpis={kpiData}
        tabBadges={tabBadges}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-base tracking-widest bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">HeatShield</span>
              <span className="text-[10px] font-data text-slate-500">v1.0 — FortyGuard Hackathon 2026</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { emoji: '🏙️', label: 'Pillar 1', sub: 'Extreme Heat Crisis', color: 'border-orange-500/30 text-orange-300' },
                { emoji: '💧', label: 'Pillar 2', sub: 'Cooling Deployment', color: 'border-cyan-500/30 text-cyan-300' },
                { emoji: '📊', label: 'Pillar 3', sub: 'Data Correlation', color: 'border-purple-500/30 text-purple-300' },
              ].map(p => (
                <span key={p.label} className={`flex items-center gap-1.5 text-[10px] font-data px-2.5 py-1 bg-slate-900 border ${p.color} rounded-full`}>
                  <span>{p.emoji}</span>
                  <span className="font-bold">{p.label}</span>
                  <span className="text-slate-500">{p.sub}</span>
                </span>
              ))}
            </div>
            <div className="text-[10px] font-data text-slate-500">
              FortyGuard API · OpenStreetMap · California, USA
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showReport   && <MunicipalReportModal hotspots={hotspots} watchlist={watchlist} stations={stations} city={selectedCity} unit={unit} onClose={() => setShowReport(false)} />}
      {showCommunity && <CommunityReportModal city={selectedCity} onClose={() => setShowCommunity(false)} onSubmit={() => { addToast('success', 'Report Submitted', 'Your hazard report has been recorded. Thank you!'); setShowCommunity(false); }} />}
      {showSettings  && <SettingsModal unit={unit} onToggleUnit={() => setUnit(u => u === 'C' ? 'F' : 'C')} onClose={() => setShowSettings(false)} />}
      {deployTarget  && <DeployModal zone={deployTarget} city={selectedCity} onClose={() => setDeployTarget(null)} onConfirm={handleConfirmDeploy} />}
    </div>
  );
}
