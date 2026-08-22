import React from 'react';

function WaterBar({ pct }) {
  const p = Math.min(Math.max(pct || 0, 0), 100);
  const color = p > 60 ? 'var(--green)' : p > 30 ? 'var(--cyan)' : 'var(--orange)';
  return (
    <div style={{ width:'100%', height:'5px', background:'var(--bg3)', borderRadius:'3px', overflow:'hidden', marginTop:'4px' }}>
      <div style={{ height:'100%', width:`${p}%`, background:color, borderRadius:'3px', transition:'width 0.8s ease' }} />
    </div>
  );
}

export default function CoolingOasisList({ stations = [], onNavigateToStation }) {
  if (!stations.length) return (
    <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--muted)' }}>
      <div style={{ fontSize:'36px', marginBottom:'10px' }}>💧</div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'11px', lineHeight:1.9 }}>No cooling stations found.<br/>Load city data to show stations.</div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'9px', letterSpacing:'3px', color:'var(--muted)', marginBottom:'6px' }}>
        ACTIVE COOLING STATIONS — {stations.length}
      </div>
      {stations.map((st, i) => {
        const isActive = (st.status || 'active').toLowerCase() === 'active';
        const waterPct = st.water_level_pct ?? st.water_level ?? (isActive ? 75 : 20);
        return (
          <div key={st.station_id || i} style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'var(--r)', padding:'12px 14px',
            transition:'border-color 0.2s',
          }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'9px', flexShrink:0,
                background: isActive ? 'rgba(0,212,255,0.12)' : 'rgba(100,100,100,0.12)',
                border: `1px solid ${isActive ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px',
              }}>💧</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:'13px', letterSpacing:'0.3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{st.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'3px' }}>
                  <span style={{
                    fontFamily:'Space Mono,monospace', fontSize:'8px', fontWeight:700, letterSpacing:'1px',
                    padding:'2px 7px', borderRadius:'4px',
                    background: isActive ? 'rgba(0,255,136,0.10)' : 'rgba(100,100,100,0.10)',
                    color: isActive ? 'var(--green)' : 'var(--muted)',
                    border: `1px solid ${isActive ? 'rgba(0,255,136,0.25)' : 'var(--border)'}`,
                  }}>● {isActive ? 'ACTIVE' : 'OFFLINE'}</span>
                  {st.capacity && (
                    <span style={{ fontFamily:'Space Mono,monospace', fontSize:'8.5px', color:'var(--muted2)' }}>Cap: {st.capacity}</span>
                  )}
                </div>
                <WaterBar pct={waterPct} />
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', color:'var(--muted2)', marginTop:'3px' }}>Water: {waterPct}%</div>
              </div>
              <button onClick={() => onNavigateToStation && onNavigateToStation(st)} style={{
                background:'rgba(0,212,255,0.10)', border:'1px solid rgba(0,212,255,0.25)',
                borderRadius:'8px', color:'var(--cyan)',
                fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'11px',
                padding:'6px 12px', cursor:'pointer', flexShrink:0, transition:'all 0.2s',
              }}>📍 Navigate</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
