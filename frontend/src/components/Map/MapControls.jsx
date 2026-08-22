import React from 'react';

export default function MapControls({
  layers, onToggleLayer, onChangeBaseMap, activeBaseMap,
  tempFilter, onChangeTempFilter,
}) {
  return (
    <div style={{
      position: 'absolute', top: '12px', right: '12px', zIndex: 400,
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {/* Overlays */}
      <div style={{
        background: 'rgba(11,11,28,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
        padding: '12px', minWidth: '148px',
      }}>
        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', letterSpacing:'2px', color:'var(--muted2)', marginBottom:'8px' }}>OVERLAYS</p>
        {[
          { key: 'heatGrid',        icon: '🔥', label: 'Thermal Grid'    },
          { key: 'coolingStations', icon: '💧', label: 'Cooling Stations' },
          { key: 'safeRoute',       icon: '🛡️', label: 'Safe Route'      },
        ].map(({ key, icon, label }) => (
          <label key={key} style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', marginBottom:'6px' }}>
            <div
              onClick={() => onToggleLayer(key)}
              style={{
                width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer',
                background: layers[key] ? 'var(--purple)' : 'var(--bg3)',
                border: `1px solid ${layers[key] ? 'var(--purple)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              {layers[key] && <span style={{ fontSize: '9px', color: '#fff' }}>✓</span>}
            </div>
            <span style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:600, fontSize:'12px', color: layers[key] ? 'var(--text)' : 'var(--muted)' }}>
              {icon} {label}
            </span>
          </label>
        ))}
      </div>

      {/* Basemap */}
      <div style={{
        background: 'rgba(11,11,28,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
        padding: '12px',
      }}>
        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', letterSpacing:'2px', color:'var(--muted2)', marginBottom:'8px' }}>BASEMAP</p>
        <div style={{ display:'flex', gap:'4px' }}>
          {[{id:'dark',label:'Dark'},{id:'satellite',label:'Sat'},{id:'streets',label:'Streets'}].map(bm => (
            <button key={bm.id} onClick={() => onChangeBaseMap(bm.id)} style={{
              flex: 1, padding: '5px 4px',
              background: activeBaseMap === bm.id
                ? 'linear-gradient(135deg,var(--purple),rgba(90,29,204,0.8))'
                : 'var(--bg3)',
              border: `1px solid ${activeBaseMap === bm.id ? 'rgba(157,78,221,0.5)' : 'var(--border)'}`,
              borderRadius: '6px', color: activeBaseMap === bm.id ? '#fff' : 'var(--muted)',
              fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'10px',
              cursor:'pointer', transition:'all 0.2s',
            }}>{bm.label}</button>
          ))}
        </div>
      </div>

      {/* Temp Filter */}
      <div style={{
        background: 'rgba(11,11,28,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
        padding: '12px',
      }}>
        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', letterSpacing:'2px', color:'var(--muted2)', marginBottom:'8px' }}>THERMAL FILTER</p>
        <div style={{ display:'flex', gap:'4px' }}>
          {[{id:'all',label:'All'},{id:'35',label:'>35°C'},{id:'40',label:'>40°C'}].map(f => (
            <button key={f.id} onClick={() => onChangeTempFilter(f.id)} style={{
              flex:1, padding:'5px 4px',
              background: tempFilter === f.id
                ? 'linear-gradient(135deg,var(--orange),var(--pink))'
                : 'var(--bg3)',
              border: `1px solid ${tempFilter === f.id ? 'rgba(255,107,53,0.4)' : 'var(--border)'}`,
              borderRadius:'6px', color: tempFilter === f.id ? '#fff' : 'var(--muted)',
              fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'10px',
              cursor:'pointer', transition:'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
