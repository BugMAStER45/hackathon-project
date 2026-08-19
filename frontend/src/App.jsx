import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ThermalMap from './components/Map/ThermalMap';
import HotspotList from './components/Planner/HotspotList';
import WatchlistPanel from './components/Planner/WatchlistPanel';
import StationOptimizer from './components/Planner/StationOptimizer';
import MunicipalReportModal from './components/Planner/MunicipalReportModal';
import SafeRoutePlanner from './components/Citizen/SafeRoutePlanner';
import CoolingOasisList from './components/Citizen/CoolingOasisList';
import HeatHealthCard from './components/Citizen/HeatHealthCard';
import CommunityReportModal from './components/Citizen/CommunityReportModal';
import WeeklyPatternChart from './components/Analytics/WeeklyPatternChart';
import CorrelationChart from './components/Analytics/CorrelationChart';
import ResilientCityMetrics from './components/Analytics/ResilientCityMetrics';
import SettingsModal from './components/Common/SettingsModal';
import DeployModal from './components/Common/DeployModal';
import { api } from './services/api';
import { 
  Flame, 
  Droplet, 
  Compass, 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  Building2, 
  ShieldAlert,
  Sparkles,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { formatTemp } from './utils/thermalCalculators';

export default function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [persona, setPersona] = useState('planner'); // 'planner' | 'citizen'
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'hotspots', 'optimizer', 'analytics', 'safe-route', 'cooling-oasis', 'heat-health'
  const [unit, setUnit] = useState('C'); // 'C' | 'F'

  // Data states
  const [zones, setZones] = useState([]);
  const [coolingStations, setCoolingStations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [hotspotData, setHotspotData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [correlations, setCorrelations] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [municipalReport, setMunicipalReport] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deployTargetZone, setDeployTargetZone] = useState(null);

  // Load initial cities
  useEffect(() => {
    async function init() {
      try {
        const cityList = await api.getCities();
        setCities(cityList);
        if (cityList.length > 0) {
          setSelectedCity(cityList[0]);
        }
        const sysSettings = await api.getSettings();
        setSettings(sysSettings);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    init();
  }, []);

  // Fetch city-specific data whenever selectedCity changes
  const fetchCityData = async (cityId) => {
    if (!cityId) return;
    setLoading(true);
    try {
      const [
        zoneRes,
        stationsRes,
        recsRes,
        hotspotsRes,
        weeklyRes,
        corrRes,
        kpiRes,
        repRes
      ] = await Promise.all([
        api.getPedestrianZones(cityId),
        api.getCoolingStations(cityId),
        api.getCoolingRecommendations(cityId),
        api.getTopHotspots(cityId),
        api.getWeeklyPatterns(cityId, 14),
        api.getCorrelations(cityId),
        api.getResilienceKPIs(cityId),
        api.getMunicipalReport(cityId)
      ]);

      setZones(zoneRes.zones || []);
      setCoolingStations(stationsRes.stations || []);
      setRecommendations(recsRes.recommendations || []);
      setHotspotData(hotspotsRes || null);
      setWeeklyData(weeklyRes || null);
      setCorrelations(corrRes || null);
      setKpis(kpiRes || null);
      setMunicipalReport(repRes || null);

      // Pre-compute sample safe route for navigation tab
      if (zoneRes.zones && zoneRes.zones.length >= 2) {
        const orig = zoneRes.zones[0];
        const dest = zoneRes.zones[1];
        const routeRes = await api.computeSafeRoute({
          city_id: cityId,
          origin: [orig.location.coordinates[1], orig.location.coordinates[0]],
          destination: [dest.location.coordinates[1], dest.location.coordinates[0]],
          preference: 'coolest_shaded'
        });
        setActiveRoute(routeRes);
      }
    } catch (err) {
      console.error('Error fetching city telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchCityData(selectedCity.id);
    }
  }, [selectedCity]);

  // Handle Deploy Action
  const handleDeployStation = async (payload) => {
    try {
      const res = await api.deployStation(payload);
      if (res.success) {
        // Add new station to state & refresh
        setCoolingStations(prev => [res.deployed_station, ...prev]);
        // Re-fetch recommendations and zones
        if (selectedCity) {
          fetchCityData(selectedCity.id);
        }
      }
      return res;
    } catch (err) {
      console.error('Deploy station error:', err);
      return null;
    }
  };

  // Safe route computation
  const handleCalculateRoute = async (routeReq) => {
    try {
      const res = await api.computeSafeRoute({
        ...routeReq,
        city_id: selectedCity?.id || 'los_angeles'
      });
      setActiveRoute(res);
      setActiveTab('map'); // Switch to map to view polyline
    } catch (err) {
      console.error('Safe route error:', err);
    }
  };

  // Community Report submission
  const handleSubmitCommunityReport = async (reportData) => {
    try {
      return await api.submitCommunityReport(reportData);
    } catch (err) {
      console.error('Submit community report error:', err);
    }
  };

  // Settings update
  const handleSaveSettings = async (newSettings) => {
    try {
      const res = await api.updateSettings(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
      return res;
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        persona={persona}
        onSelectPersona={(p) => {
          setPersona(p);
          setActiveTab('map');
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unit={unit}
        onToggleUnit={() => setUnit(u => u === 'C' ? 'F' : 'C')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenCommunityModal={() => setIsCommunityModalOpen(true)}
        kpis={kpis}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* City Summary Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg">
            <span className="text-[11px] text-slate-400 font-medium">Urban Target Zone</span>
            <div className="text-base font-bold text-white mt-0.5 truncate">
              {selectedCity?.name || 'California Urban Region'}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">California &bull; FortyGuard Microclimate</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg">
            <span className="text-[11px] text-slate-400 font-medium">Top 5% Extreme Hotspots</span>
            <div className="text-base font-bold text-red-400 mt-0.5 flex items-center gap-1.5 font-mono">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              {hotspotData?.top_5_percent_count || 2} Priority Clusters
            </div>
            <span className="text-[10px] text-red-400/80 font-mono">Max Surface: {formatTemp(hotspotData?.max_surface_temp, unit)}</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg">
            <span className="text-[11px] text-slate-400 font-medium">Watchlist Nodes (&gt;35°C)</span>
            <div className="text-base font-bold text-amber-400 mt-0.5 font-mono">
              {hotspotData?.watchlist_above_35_count || 8} Sectors Monitored
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono">Proactive Intervention</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg">
            <span className="text-[11px] text-slate-400 font-medium">Cooling Hubs Deployed</span>
            <div className="text-base font-bold text-cyan-400 mt-0.5 flex items-center gap-1.5 font-mono">
              <Droplet className="w-4 h-4 text-cyan-400" />
              {coolingStations.length} Active Oases
            </div>
            <span className="text-[10px] text-cyan-400/80 font-mono">Avg -4.8°C Relief</span>
          </div>
        </div>

        {/* Tab View Routing */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Interactive Leaflet Thermal Map */}
            <ThermalMap
              selectedCity={selectedCity}
              zones={zones}
              coolingStations={coolingStations}
              topHotspots={hotspotData?.top_hotspots || []}
              activeRoute={activeRoute}
              persona={persona}
              unit={unit}
              onDeployClick={(zone) => setDeployTargetZone(zone)}
              onSetRouteDestination={(zone) => {
                if (zones.length > 0) {
                  handleCalculateRoute({
                    origin: [zones[0].location.coordinates[1], zones[0].location.coordinates[0]],
                    destination: [zone.location.coordinates[1], zone.location.coordinates[0]],
                    preference: 'coolest_shaded'
                  });
                }
              }}
            />

            {/* Quick Context Panel below map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {persona === 'planner' ? (
                <>
                  <HotspotList
                    hotspots={hotspotData?.top_hotspots || []}
                    watchlistCount={hotspotData?.watchlist_above_35_count || 0}
                    unit={unit}
                    onDeployClick={(zone) => setDeployTargetZone(zone)}
                  />
                  <WatchlistPanel
                    watchlist={hotspotData?.watchlist_35c || []}
                    unit={unit}
                  />
                </>
              ) : (
                <>
                  <SafeRoutePlanner
                    zones={zones}
                    onCalculateRoute={handleCalculateRoute}
                    activeRoute={activeRoute}
                    unit={unit}
                  />
                  <HeatHealthCard
                    ambientTemp={selectedCity?.default_ambient_temp || 38.5}
                    wbgtTemp={zones[0]?.wbgt_temp || 31.2}
                    unit={unit}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Planner Tabs */}
        {activeTab === 'hotspots' && (
          <div className="space-y-6">
            <HotspotList
              hotspots={hotspotData?.top_hotspots || []}
              watchlistCount={hotspotData?.watchlist_above_35_count || 0}
              unit={unit}
              onDeployClick={(zone) => setDeployTargetZone(zone)}
            />
            <WatchlistPanel
              watchlist={hotspotData?.watchlist_35c || []}
              unit={unit}
            />
          </div>
        )}

        {activeTab === 'optimizer' && (
          <StationOptimizer
            recommendations={recommendations}
            activeStations={coolingStations}
            unit={unit}
            onDeployRecommendation={(rec) => {
              const matchingZone = zones.find(z => z.id === rec.zone_id) || {
                id: rec.zone_id,
                name: rec.name,
                location: rec.location,
                current_surface_temp: 42.0,
                footfall_hourly: 2500,
                shade_coverage_pct: 15
              };
              setDeployTargetZone(matchingZone);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* 3 Pillars Executive Metrics */}
            <ResilientCityMetrics kpis={kpis} unit={unit} />

            {/* Weekly Temporal Signatures */}
            <WeeklyPatternChart weeklyData={weeklyData} unit={unit} />

            {/* Quantitative Correlations Matrix */}
            <CorrelationChart correlations={correlations} />
          </div>
        )}

        {/* Citizen Tabs */}
        {activeTab === 'safe-route' && (
          <div className="space-y-6">
            <SafeRoutePlanner
              zones={zones}
              onCalculateRoute={handleCalculateRoute}
              activeRoute={activeRoute}
              unit={unit}
            />
            {/* Embedded Map Preview for route */}
            <ThermalMap
              selectedCity={selectedCity}
              zones={zones}
              coolingStations={coolingStations}
              topHotspots={hotspotData?.top_hotspots || []}
              activeRoute={activeRoute}
              persona={persona}
              unit={unit}
            />
          </div>
        )}

        {activeTab === 'cooling-oasis' && (
          <CoolingOasisList
            stations={coolingStations}
            unit={unit}
            onNavigateToStation={(station) => {
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'heat-health' && (
          <div className="space-y-6">
            <HeatHealthCard
              ambientTemp={selectedCity?.default_ambient_temp || 38.5}
              wbgtTemp={zones[0]?.wbgt_temp || 31.2}
              unit={unit}
            />
            <CorrelationChart correlations={correlations} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">FortyGuard HeatShield</span>
            <span>&bull;</span>
            <span>California Urban Pedestrian Resilience Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pillar 1: Resilient Cities</span>
            <span>&bull;</span>
            <span>Pillar 2: Government &amp; Environment</span>
            <span>&bull;</span>
            <span>Pillar 3: Data Analysis</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MunicipalReportModal
        report={municipalReport}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        unit={unit}
      />

      <DeployModal
        targetZone={deployTargetZone}
        isOpen={Boolean(deployTargetZone)}
        onClose={() => setDeployTargetZone(null)}
        onConfirmDeploy={handleDeployStation}
        cityId={selectedCity?.id || 'los_angeles'}
        unit={unit}
      />

      <CommunityReportModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        onSubmitReport={handleSubmitCommunityReport}
        cityId={selectedCity?.id || 'los_angeles'}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
