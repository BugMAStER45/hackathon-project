import React, { useState, useEffect } from 'react';
import { Flame, Building2, User, MapPin, Thermometer, Clock, AlertTriangle } from 'lucide-react';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', color: 'var(--muted2)', letterSpacing: '1px' }}>
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  );
}

export default function Navbar({
  activeTab, onTabChange, persona, onPersonaChange,
  cityId, onCityChange, unit, onUnitChange,
  tabCounts = {}, kpis = {}, onOpenHAP,
}) {
  const CITY_OPTIONS = [
    { id: 'los_angeles',  label: 'Los Angeles, CA' },
    { id: 'palm_springs', label: 'Palm Springs, CA' },
    { id: 'fresno',       label: 'Fresno, CA' },
    { id: 'sacramento',   label: 'Sacramento, CA' },
    { id: 'san_francisco',label: 'San Francisco, CA' },
  ];

  const plannerTabs = [
    { id: 'map',         label: 'Thermal Map',     icon: '🗺️',  count: null },
    { id: 'hotspots',   label: 'Top 5% Hotspots', icon: '🔥',  count: tabCounts.hotspots },
    { id: 'deployer',   label: 'Cooling Deployer', icon: '❄️',  count: tabCounts.stations },
    { id: 'analytics',  label: '3 Pillars',        icon: '📊',  count: null },
    { id: 'watchlist',  label: 'Watchlist',        icon: '⚠️',  count: tabCounts.watchlist },
  ];

  const citizenTabs = [
    { id: 'map',         label: 'Heat Map',        icon: '🗺️',  count: null },
    { id: 'oasis',       label: 'Cooling Oases',   icon: '💧',  count: tabCounts.stations },
    { id: 'route',       label: 'Safe Route',      icon: '🛡️',  count: null },
    { id: 'health',      label: 'Heat Health',     icon: '🏥',  count: null },
  ];

  const tabs = persona === 'planner' ? plannerTabs : citizenTabs;
  const resilience = kpis?.resilience_score ?? kpis?.resilience_index ?? null;
  const extremeCount = kpis?.extreme_heat_zones ?? tabCounts.hotspots ?? 0;
  const avgTemp = kpis?.avg_surface_temp ?? 42.1;

  return (
    <>
      {/* Emergency Bar */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(255,45,85,0.15), rgba(255,107,53,0.10), rgba(255,45,85,0.15))',
        borderBottom: '1px solid rgba(255,45,85,0.25)',
        padding: '5px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '11px',
        position: 'relative',
        zIndex: 60,
      }}>
        <span style={{
          background: 'rgba(255,45,85,0.15)',
          border: '1px solid rgba(255,45,85,0.4)',
          color: 'var(--pink)',
          fontFamily: 'Space Mono,monospace',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          padding: '3px 10px',
          borderRadius: '4px',
          flexShrink: 0,
        }}>
          ▲ LEVEL 3 – EXTREME HEATWAVE EMERGENCY
        </span>
        <span style={{ color: 'var(--muted2)', fontFamily: 'Space Mono,monospace', fontSize: '9px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          FortyGuard Live Thermal Feed — Extreme surface heat (&gt;45°C) detected across California urban transit hubs.
        </span>
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--muted2)' }}>
            Resilience: <b style={{ color: resilience !== null ? (resilience > 50 ? 'var(--green)' : 'var(--pink)') : 'var(--gold)' }}>
              {resilience !== null ? `${Math.round(resilience)}/100` : '—'}
            </b>
          </span>
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--muted2)' }}>
            &gt;35°C: <b style={{ color: 'var(--orange)' }}>{extremeCount}</b>
          </span>
          <LiveClock />
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        background: 'rgba(6,6,16,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Top row: Logo + City + Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '4px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Flame size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '18px', letterSpacing: '3px', lineHeight: 1, color: 'var(--text)' }}>HEATSHIELD</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', letterSpacing: '2px', color: 'var(--muted2)', lineHeight: 1 }}>FortyGuard Thermal Platform</div>
            </div>
            <span style={{
              background: 'linear-gradient(135deg,rgba(255,107,53,0.2),rgba(255,45,85,0.15))',
              border: '1px solid rgba(255,107,53,0.3)',
              color: 'var(--orange)',
              fontFamily: 'Space Mono,monospace',
              fontSize: '8px', fontWeight: 700, letterSpacing: '1px',
              padding: '2px 7px', borderRadius: '4px',
            }}>CA</span>
          </div>

          {/* City Selector */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '200px' }}>
            <MapPin size={11} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted2)' }} />
            <select
              value={cityId}
              onChange={(e) => onCityChange(e.target.value)}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text)',
                fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: '12px',
                padding: '6px 10px 6px 28px', width: '100%', cursor: 'pointer', outline: 'none',
              }}
            >
              {CITY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {/* Avg Temp */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)',
            borderRadius: '8px', padding: '6px 12px',
          }}>
            <Thermometer size={12} color="var(--orange)" />
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '12px', color: 'var(--orange)', fontWeight: 700 }}>
              {avgTemp.toFixed(1)}°C
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Persona Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3px', gap: '3px' }}>
            {[{id:'planner',icon:<Building2 size={11}/>,label:'City Planner'},
              {id:'citizen',icon:<User size={11}/>,label:'Citizen'}].map(p => (
              <button key={p.id} onClick={() => onPersonaChange(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '12px',
                letterSpacing: '0.5px', transition: 'all 0.2s',
                background: persona === p.id ? 'linear-gradient(135deg,#FF6B35,#FF2D55)' : 'transparent',
                color: persona === p.id ? '#fff' : 'var(--muted2)',
              }}>{p.icon}{p.label}</button>
            ))}
          </div>

          {/* Unit toggle */}
          <button onClick={onUnitChange} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--muted2)',
            fontFamily: 'Space Mono,monospace', fontSize: '11px',
            padding: '6px 10px', cursor: 'pointer',
          }}>°{unit === 'C' ? 'F' : 'C'}</button>

          {/* HAP Report */}
          {persona === 'planner' && (
            <button onClick={onOpenHAP} style={{
              background: 'linear-gradient(135deg,rgba(157,78,221,0.15),rgba(157,78,221,0.08))',
              border: '1px solid rgba(157,78,221,0.3)',
              borderRadius: '8px', color: 'var(--purple)',
              fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '12px',
              padding: '6px 14px', cursor: 'pointer', letterSpacing: '0.5px',
            }}>📋 HAP Report</button>
          )}
        </div>

        {/* Tab Row */}
        <div className="no-scrollbar" style={{
          display: 'flex', gap: '4px', padding: '0 20px',
          overflowX: 'auto', borderTop: '1px solid var(--border)',
        }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
                flexShrink: 0, padding: '9px 16px',
                borderRadius: '10px 10px 0 0',
                border: `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                borderBottomColor: isActive ? 'var(--bg)' : 'transparent',
                background: isActive ? 'var(--bg)' : 'transparent',
                color: isActive ? 'var(--gold)' : 'var(--muted)',
                fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '12px',
                letterSpacing: '0.5px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                marginBottom: '-1px',
              }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count != null && tab.count > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(255,215,0,0.15)' : 'var(--bg3)',
                    border: `1px solid ${isActive ? 'rgba(255,215,0,0.3)' : 'var(--border)'}`,
                    color: isActive ? 'var(--gold)' : 'var(--muted2)',
                    fontFamily: 'Space Mono,monospace', fontSize: '9px', fontWeight: 700,
                    padding: '1px 6px', borderRadius: '10px',
                  }}>{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
