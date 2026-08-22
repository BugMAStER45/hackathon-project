import React, { useState } from 'react';

const PRIORITY_STYLES = {
  CRITICAL: { color:'var(--pink)',   border:'rgba(255,45,85,0.3)',   bg:'rgba(255,45,85,0.10)'   },
  HIGH:     { color:'var(--orange)', border:'rgba(255,107,53,0.3)',  bg:'rgba(255,107,53,0.10)'  },
  MEDIUM:   { color:'var(--gold)',   border:'rgba(255,215,0,0.3)',   bg:'rgba(255,215,0,0.08)'   },
  LOW:      { color:'var(--cyan)',   border:'rgba(0,212,255,0.3)',   bg:'rgba(0,212,255,0.08)'   },
};

const TYPE_FILTERS = ['ALL','MISTING','SHADE','SHELTER','MOBILE'];

export default function StationOptimizer({ recommendations = [], onDeploy }) {
  const [filter, setFilter] = useState('ALL');
  const [deploying, setDeploying] = useState(null);

  const filtered = filter === 'ALL'
    ? recommendations
    : recommendations.filter(r => r.station_type?.toUpperCase() === filter);

  async function handleDeploy(rec) {
    setDeploying(rec.zone_id);
    try { if (onDeploy) await onDeploy(rec); }
    finally { setDeploying(null); }
  }

  if (!recommendations.length) return (
    <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--muted)' }}>
      <div style={{ fontSize:'36px', marginBottom:'10px' }}>❄️</div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'11px', lineHeight:1.9 }}>No recommendations available.<br/>Load city data to generate placements.</div>
    </div>
  );

  return (
    <div>
      {/* Type filter pills */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
        {TYPE_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'5px 12px', borderRadius:'20px', border:'none', cursor:'pointer', transition:'all 0.2s',
            fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'11px', letterSpacing:'0.5px',
            background: filter===f ? 'linear-gradient(135deg,var(--purple),rgba(90,29,204,0.8))' : 'var(--bg2)',
            color: filter===f ? '#fff' : 'var(--muted)',
            boxShadow: filter===f ? '0 0 12px rgba(157,78,221,0.3)' : 'none',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:'9px', letterSpacing:'3px', color:'var(--muted)', marginBottom:'4px' }}>
          AI PLACEMENT OPTIMIZER — {filtered.length} RECOMMENDATIONS
        </div>
        {filtered.map((rec, i) => {
          const ps = PRIORITY_STYLES[rec.priority?.toUpperCase()] || PRIORITY_STYLES.MEDIUM;
          const tempDrop = rec.temp_drop_celsius ?? rec.estimated_benefit;
          return (
            <div key={rec.zone_id || i} style={{
              background:'var(--bg2)', border:`1px solid ${ps.border}`,
              borderRadius:'var(--r)', overflow:'hidden', transition:'border-color 0.2s',
            }}>
              <div style={{ padding:'12px 14px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'8px' }}>
                  {/* Priority badge */}
                  <span style={{
                    background:ps.bg, color:ps.color, border:`1px solid ${ps.border}`,
                    fontFamily:'Space Mono,monospace', fontSize:'8px', fontWeight:700,
                    letterSpacing:'1px', padding:'3px 8px', borderRadius:'4px', flexShrink:0, marginTop:'2px',
                  }}>{rec.priority || 'MED'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:'13px' }}>{rec.zone_name || `Zone ${rec.zone_id}`}</div>
                    {rec.station_type && (
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'9px', color:'var(--cyan)', marginTop:'2px' }}>{rec.station_type.toUpperCase()} STATION</div>
                    )}
                  </div>
                  {tempDrop != null && (
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'20px', color:'var(--green)', lineHeight:1 }}>-{parseFloat(tempDrop).toFixed(1)}°C</div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', color:'var(--muted2)' }}>TEMP DROP</div>
                    </div>
                  )}
                </div>
                {rec.reasoning && (
                  <p style={{ fontSize:'11.5px', color:'var(--muted2)', lineHeight:1.7, marginBottom:'10px' }}>{rec.reasoning}</p>
                )}
                <button onClick={() => handleDeploy(rec)} disabled={deploying===rec.zone_id} style={{
                  width:'100%', padding:'8px', borderRadius:'8px', cursor:'pointer',
                  background: deploying===rec.zone_id ? 'var(--bg3)' : 'linear-gradient(135deg,rgba(0,255,136,0.15),rgba(0,212,255,0.10))',
                  color: deploying===rec.zone_id ? 'var(--muted)' : 'var(--green)',
                  border: `1px solid ${deploying===rec.zone_id ? 'var(--border)' : 'rgba(0,255,136,0.3)'}`,
                  fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'12px',
                  letterSpacing:'0.5px', transition:'all 0.2s',
                }}>
                  {deploying===rec.zone_id ? '⏳ Deploying…' : '🚀 Deploy Station'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
