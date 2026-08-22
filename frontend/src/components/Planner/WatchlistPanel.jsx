import React from 'react';
import { formatTemp, getHeatRiskLevel } from '../../utils/thermalCalculators';

const RISK_STYLES = {
  EXTREME:   { bg:'rgba(255,45,85,0.12)',   color:'var(--pink)',   border:'rgba(255,45,85,0.3)',   dot:'#FF2D55' },
  HIGH:      { bg:'rgba(255,107,53,0.12)',  color:'var(--orange)', border:'rgba(255,107,53,0.3)',  dot:'#FF6B35' },
  WATCHLIST: { bg:'rgba(255,215,0,0.10)',   color:'var(--gold)',   border:'rgba(255,215,0,0.3)',   dot:'#FFD700' },
  MODERATE:  { bg:'rgba(0,212,255,0.10)',   color:'var(--cyan)',   border:'rgba(0,212,255,0.3)',   dot:'#00D4FF' },
};

export default function WatchlistPanel({ zones = [], unit = 'C' }) {
  if (!zones.length) return (
    <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--muted)' }}>
      <div style={{ fontSize:'36px', marginBottom:'10px' }}>✅</div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'11px', lineHeight:1.9 }}>No zones on watchlist.<br/>All sectors within safe thresholds.</div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'9px', letterSpacing:'3px', color:'var(--muted)', marginBottom:'6px' }}>
        HEAT RISK WATCHLIST — {zones.length} ZONES &gt;35°C
      </div>
      {zones.map((zone, i) => {
        const temp = zone.current_surface_temp || 0;
        const risk = getHeatRiskLevel(temp);
        const s    = RISK_STYLES[risk] || RISK_STYLES.MODERATE;
        return (
          <div key={zone.zone_id || i} className="animate-fade-slide" style={{
            background:'var(--bg2)', border:`1px solid ${s.border}`,
            borderRadius:'var(--r)', padding:'12px 14px',
            display:'flex', alignItems:'center', gap:'12px',
            transition:'border-color 0.2s',
            animationDelay: `${i * 0.04}s`,
          }}>
            {/* Status dot */}
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:s.dot, flexShrink:0, boxShadow:`0 0 8px ${s.dot}` }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {zone.zone_name || `Zone ${zone.zone_id}`}
              </div>
              {zone.surface_material && (
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8.5px', color:'var(--muted2)', marginTop:'2px' }}>{zone.surface_material}</div>
              )}
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'20px', color:s.color, lineHeight:1 }}>{formatTemp(temp, unit)}</div>
              <span style={{
                background:s.bg, color:s.color, border:`1px solid ${s.border}`,
                fontFamily:'Space Mono,monospace', fontSize:'8px', fontWeight:700,
                letterSpacing:'1px', padding:'2px 7px', borderRadius:'4px', marginTop:'3px', display:'inline-block',
              }}>{risk}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
