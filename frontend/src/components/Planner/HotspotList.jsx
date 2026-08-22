import React, { useState } from 'react';
import { formatTemp, getHeatRiskLevel } from '../../utils/thermalCalculators';

const RISK_STYLES = {
  EXTREME:   { bg:'rgba(255,45,85,0.12)',   color:'var(--pink)',   border:'rgba(255,45,85,0.3)'   },
  HIGH:      { bg:'rgba(255,107,53,0.12)',  color:'var(--orange)', border:'rgba(255,107,53,0.3)'  },
  WATCHLIST: { bg:'rgba(255,215,0,0.10)',   color:'var(--gold)',   border:'rgba(255,215,0,0.3)'   },
  MODERATE:  { bg:'rgba(0,212,255,0.10)',   color:'var(--cyan)',   border:'rgba(0,212,255,0.3)'   },
};

function RiskPill({ risk }) {
  const s = RISK_STYLES[risk] || RISK_STYLES.MODERATE;
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontFamily: 'Space Mono,monospace', fontSize: '8px', fontWeight: 700,
      letterSpacing: '1px', padding: '2px 8px', borderRadius: '4px',
    }}>{risk}</span>
  );
}

function HotspotCard({ zone, rank, unit }) {
  const [open, setOpen] = useState(false);
  const temp  = zone.current_surface_temp || 0;
  const risk  = getHeatRiskLevel(temp);
  const rs    = RISK_STYLES[risk] || RISK_STYLES.MODERATE;

  const rankColors = ['#FFD700','#C0C0C0','#CD7F32','#9D4EDD','#00D4FF'];
  const rankColor  = rankColors[rank - 1] || 'var(--muted2)';

  return (
    <div style={{
      background: 'var(--bg2)', border: `1px solid ${open ? rs.border : 'var(--border)'}`,
      borderRadius: 'var(--r)', overflow: 'hidden', transition: 'border-color 0.2s',
      cursor: 'pointer',
    }} onClick={() => setOpen(o => !o)}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px' }}>
        <div style={{
          width:'28px', height:'28px', borderRadius:'7px', flexShrink:0,
          background: `rgba(${rank<=3?'255,215,0':'157,78,221'},0.12)`,
          border: `1px solid ${rankColor}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Space Mono,monospace', fontSize:'11px', fontWeight:700, color: rankColor,
        }}>#{rank}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:'13px', letterSpacing:'0.3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {zone.zone_name || `Zone ${zone.zone_id}`}
          </div>
          {zone.pedestrian_density && (
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8.5px', color:'var(--muted2)', marginTop:'2px' }}>
              Density: {zone.pedestrian_density}
            </div>
          )}
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'20px', color: rs.color, letterSpacing:'1px', lineHeight:1 }}>
            {formatTemp(temp, unit)}
          </div>
          <div style={{ marginTop:'3px' }}><RiskPill risk={risk} /></div>
        </div>
        <span style={{ fontSize:'9px', color:'var(--muted)', marginLeft:'4px', transition:'transform 0.2s', display:'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </div>

      {/* Expanded Stats */}
      {open && (
        <div style={{ borderTop:'1px solid var(--border)', padding:'12px 14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
          {[
            { label:'Surface Temp',    value: formatTemp(temp, unit),                                 color: rs.color },
            { label:'Material',        value: zone.surface_material || '—',                            color:'var(--muted2)' },
            { label:'Canopy Cover',    value: zone.canopy_coverage != null ? `${zone.canopy_coverage}%` : '—', color:'var(--cyan)'   },
            { label:'Footfall Index',  value: zone.footfall_index  != null ? zone.footfall_index       : '—', color:'var(--purple)' },
          ].map(stat => (
            <div key={stat.label} style={{ background:'var(--bg3)', borderRadius:'8px', padding:'8px 10px', border:'1px solid var(--border)' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', color:'var(--muted)', letterSpacing:'1px', marginBottom:'3px' }}>{stat.label.toUpperCase()}</div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'12px', fontWeight:700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HotspotList({ zones = [], unit = 'C' }) {
  if (!zones.length) return (
    <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--muted)' }}>
      <div style={{ fontSize:'36px', marginBottom:'10px' }}>🌡️</div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'11px', lineHeight:1.9 }}>No extreme heat hotspots detected.<br/>All zones within normal parameters.</div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'9px', letterSpacing:'3px', color:'var(--muted)', marginBottom:'6px' }}>
        TOP 5% EXTREME HEAT HOTSPOTS — {zones.length} ZONES
      </div>
      {zones.map((zone, i) => (
        <HotspotCard key={zone.zone_id || i} zone={zone} rank={i + 1} unit={unit} />
      ))}
    </div>
  );
}
