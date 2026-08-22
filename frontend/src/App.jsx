import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ThermalMap from './components/Map/ThermalMap';
import HotspotList from './components/Planner/HotspotList';
import StationOptimizer from './components/Planner/StationOptimizer';
import SafeRoutePlanner from './components/Citizen/SafeRoutePlanner';
import WeeklyPatternChart from './components/Analytics/WeeklyPatternChart';
import CorrelationChart from './components/Analytics/CorrelationChart';
import ResilientCityMetrics from './components/Analytics/ResilientCityMetrics';
import MunicipalReportModal from './components/Planner/MunicipalReportModal';
import ToastContainer from './components/Common/Toast';
import { MapSkeleton, CardSkeleton, MetricBannerSkeleton } from './components/Common/LoadingSkeleton';
import { api } from './services/api';

let _toastId = 0;

export default function App() {
  const [entered,     setEntered]   = useState(false);
  const [cityId,      setCityId]    = useState('los_angeles');
  const [activeTab,   setActiveTab] = useState('map');
  const [unit,        setUnit]      = useState('C');

  const [zones,           setZones]           = useState([]);
  const [hotspots,        setHotspots]        = useState([]);
  const [stations,        setStations]        = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [kpis,            setKpis]            = useState({});
  const [weeklyData,      setWeeklyData]      = useState(null);
  const [correlationData, setCorrelationData] = useState(null);

  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [toasts,   setToasts]   = useState([]);
  const [activeRoute,      setActiveRoute]      = useState(null);
  const [showHAP,          setShowHAP]          = useState(false);
  const [retryCount,       setRetryCount]       = useState(0);

  function addToast(type, title, message) {
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, type, title, message }]);
  }
  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  const fetchCityData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [z, h, st, rec, k, weekly, corr] = await Promise.all([
        api.getZones(cityId).catch(() => []),
        api.getHotspots(cityId).catch(() => []),
        api.getStations(cityId).catch(() => []),
        api.getRecommendations(cityId).catch(() => []),
        api.getKpis(cityId).catch(() => ({})),
        api.getWeeklyPatterns(cityId).catch(() => null),
        api.getCorrelations(cityId).catch(() => null),
      ]);
      setZones(z);
      setHotspots(h);
      setStations(st);
      setRecommendations(rec);
      setKpis(k);
      setWeeklyData(weekly);
      setCorrelationData(corr);
      addToast('success', 'Data Loaded', `Live thermal data for ${cityId.replace(/_/g,' ')} loaded.`);
    } catch (e) {
      setError(e.message);
      addToast('error', 'Backend Offline', 'Could not reach API. Retry or check backend.');
    } finally {
      setLoading(false);
    }
  }, [cityId, retryCount]);

  useEffect(() => { 
    if (entered) fetchCityData(); 
  }, [entered, fetchCityData]);

  async function handleDeployStation(rec) {
    try {
      await api.deployStation({ zone_id: rec.zone_id, station_type: rec.station_type, city_id: cityId });
      const st = await api.getStations(cityId);
      setStations(st);
      addToast('success', 'Station Deployed', `Cooling station deployed in ${rec.zone_name}.`);
    } catch(e) {
      addToast('error', 'Deploy Failed', e.message);
    }
  }

  function handleRouteCalculated(route) {
    setActiveRoute(route);
    setActiveTab('map');
    addToast('success', 'Route Calculated', 'Safe route plotted on map.');
  }

  // ── CONTENT PANELS ──────────────────────────────────
  function renderMainContent() {
    switch(activeTab) {
      case 'map':
        return (
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 600px' }}>
              {loading ? <MapSkeleton /> : (
                <ThermalMap zones={zones} stations={stations} activeRoute={activeRoute} unit={unit} />
              )}
            </div>
            <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="cosmic-card" style={{ padding: '20px' }}>
                {loading ? <CardSkeleton count={3} /> : <HotspotList zones={hotspots} unit={unit} />}
              </div>
              <div className="cosmic-card" style={{ padding: '20px' }}>
                {loading ? <CardSkeleton count={2} /> : <StationOptimizer recommendations={recommendations} onDeploy={handleDeployStation} />}
              </div>
            </div>
          </div>
        );
      case 'route':
        return (
          <div className="cosmic-card" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <SafeRoutePlanner zones={zones} onRouteCalculated={handleRouteCalculated} />
          </div>
        );
      case 'analytics':
        return loading ? <CardSkeleton count={3} /> : (
          <div style={{ display:'flex', flexDirection:'column', gap:'16px', maxWidth: '1000px', margin: '0 auto' }}>
            <ResilientCityMetrics kpis={kpis} />
            <WeeklyPatternChart data={weeklyData} unit={unit} />
            <CorrelationChart data={correlationData} unit={unit} />
          </div>
        );
      default: return null;
    }
  }

  if (!entered) {
    return <LandingPage onEnter={() => setEntered(true)} />;
  }

  // ── METRIC BANNER ────────────────────────────────────
  const metricItems = [
    { label: 'Resilience Score', value: kpis.resilience_score != null ? `${Math.round(kpis.resilience_score)}/100` : '—', color: 'var(--green)' },
    { label: 'Extreme Zones',   value: hotspots.length || '—', color: 'var(--pink)'   },
    { label: 'Cooling Stations',value: stations.length || '—', color: 'var(--cyan)'   },
    { label: 'Avg Temp',        value: kpis.avg_surface_temp != null ? `${kpis.avg_surface_temp.toFixed(1)}°C` : '—', color: 'var(--orange)' },
  ];

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <Navbar
        activeTab={activeTab}        onTabChange={setActiveTab}
        cityId={cityId}              onCityChange={(c) => { setCityId(c); }}
        unit={unit}                  onUnitChange={() => setUnit(u => u === 'C' ? 'F' : 'C')}
        tabCounts={{ hotspots: hotspots.length, stations: stations.length }}
        kpis={kpis}                  onOpenHAP={() => setShowHAP(true)}
      />

      {loading ? <MetricBannerSkeleton /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
          {metricItems.map(m => (
            <div key={m.label} style={{ background: 'var(--bg2)', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', letterSpacing:'2px', color:'var(--muted)' }}>{m.label.toUpperCase()}</div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'22px', color: m.color, letterSpacing:'1px', lineHeight:1 }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div style={{ margin:'16px 20px', background:'rgba(255,45,85,0.08)', border:'1px solid rgba(255,45,85,0.25)', borderRadius:'12px', padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{ fontSize:'20px' }}>⚠️</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'16px', letterSpacing:'2px', color:'var(--pink)' }}>BACKEND OFFLINE</div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:'10px', color:'var(--muted2)', marginTop:'3px' }}>{error}</div>
          </div>
          <button onClick={() => setRetryCount(c => c + 1)} style={{ background:'linear-gradient(135deg,rgba(255,45,85,0.15),rgba(255,107,53,0.10))', border:'1px solid rgba(255,45,85,0.3)', borderRadius:'8px', color:'var(--pink)', fontFamily:'Bebas Neue,sans-serif', fontSize:'14px', letterSpacing:'1.5px', padding:'8px 18px', cursor:'pointer' }}>RETRY NOW</button>
        </div>
      )}

      <div style={{ padding:'16px 20px 40px', maxWidth:'1600px', margin:'0 auto' }}>
        {renderMainContent()}
      </div>

      {showHAP && <MunicipalReportModal cityId={cityId} onClose={() => setShowHAP(false)} />}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
