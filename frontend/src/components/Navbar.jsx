import React, { useState, useEffect } from 'react';
import { Flame, MapPin, Thermometer } from 'lucide-react';

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
  activeTab, onTabChange, cityId, onCityChange, unit, onUnitChange, tabCounts = {}, kpis = {}, onOpenHAP,
}) {
  const CITY_OPTIONS = [
    { id: 'los_angeles',  label: 'Los Angeles, CA' },
    { id: 'palm_springs', label: 'Palm Springs, CA' },
    { id: 'fresno',       label: 'Fresno, CA' },
    { id: 'sacramento',   label: 'Sacramento, CA' },
    { id: 'san_francisco',label: 'San Francisco, CA' },
  ];

  // SIMPLIFIED UI - 3 Tabs Only
  const tabs = [
    { id: 'map',       label: 'Live Map',       icon: '🗺️', count: null },
    { id: 'route',     label: 'Safe Route',     icon: '🛡️', count: null },
    { id: 'analytics', label: 'Analytics',      icon: '📊', count: null },
  ];

  const resilience = kpis?.resilience_score ?? kpis?.resilience_index ?? null;
  const extremeCount = kpis?.extreme_heat_zones ?? tabCounts.hotspots ?? 0;
  const avgTemp = kpis?.avg_surface_temp ?? 0;

  return (
    <>
      {/* Emergency Bar */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(255,45,85,0.15), rgba(255,107,53,0.10), rgba(255,45,85,0.15))',
        borderBottom: '1px solid rgba(255,45,85,0.25)',
        padding: '5px 20px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', position: 'relative', zIndex: 60,
      }}>
        <span style={{
          background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.4)',
          color: 'var(--pink)', fontFamily: 'Space Mono,monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px',
          padding: '3px 10px', borderRadius: '4px', flexShrink: 0,
        }}>
          ▲ LEVEL 3 – EXTREME HEATWAVE
        </span>
        <span style={{ color: 'var(--muted2)', fontFamily: 'Space Mono,monospace', fontSize: '9px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          FortyGuard Live Thermal Feed — Extreme surface heat detected across California.
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
        background: 'rgba(6,6,16,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Top row: Logo + City + Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '4px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #FF6B35, #FF2D55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Flame size={16} color="#fff" /></div>
            <div>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '18px', letterSpacing: '3px', lineHeight: 1, color: 'var(--text)' }}>AEGIS-OASIS</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', letterSpacing: '2px', color: 'var(--muted2)', lineHeight: 1 }}>Urban Resilience Platform</div>
            </div>
          </div>

          {/* City Selector */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '200px', marginLeft: '10px' }}>
            <MapPin size={11} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted2)' }} />
            <select
              value={cityId} onChange={(e) => onCityChange(e.target.value)}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)',
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
              {avgTemp ? avgTemp.toFixed(1) : '—'}°C
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Unit toggle */}
          <button onClick={onUnitChange} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--muted2)',
            fontFamily: 'Space Mono,monospace', fontSize: '11px',
            padding: '6px 10px', cursor: 'pointer',
          }}>°{unit === 'C' ? 'F' : 'C'}</button>

          {/* HAP Report */}
          <button onClick={onOpenHAP} style={{
            background: 'linear-gradient(135deg,rgba(157,78,221,0.15),rgba(157,78,221,0.08))',
            border: '1px solid rgba(157,78,221,0.3)', borderRadius: '8px', color: 'var(--purple)',
            fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '12px',
            padding: '6px 14px', cursor: 'pointer', letterSpacing: '0.5px',
          }}>📋 Generate Report</button>
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
                flexShrink: 0, padding: '9px 24px', borderRadius: '10px 10px 0 0',
                border: `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                borderBottomColor: isActive ? 'var(--bg)' : 'transparent',
                background: isActive ? 'var(--bg)' : 'transparent',
                color: isActive ? 'var(--gold)' : 'var(--muted)',
                fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '13px',
                letterSpacing: '0.5px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '8px', transition: 'all 0.2s', marginBottom: '-1px',
              }}>
                <span>{tab.icon}</span> <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
