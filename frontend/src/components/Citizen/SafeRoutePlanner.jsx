import React, { useState, useEffect } from 'react';

export default function SafeRoutePlanner({ zones = [], onRouteCalculated }) {
  const [originId,      setOriginId]      = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [preference,    setPreference]    = useState('shade');
  const [loading,       setLoading]       = useState(false);
  const [result,        setResult]        = useState(null);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    if (zones.length >= 2 && !originId) {
      setOriginId(zones[0].zone_id);
      setDestinationId(zones[1].zone_id);
    }
  }, [zones]);

  async function handleCalculate() {
    if (!originId || !destinationId || originId === destinationId) {
      setError('Please select two different zones.'); return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch('/api/navigation/safe-route', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ origin_zone_id: originId, destination_zone_id: destinationId, preference }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
      if (onRouteCalculated) onRouteCalculated(data);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'9px', letterSpacing:'3px', color:'var(--muted)' }}>SAFE ROUTE NAVIGATOR</div>

      {/* Zone selectors */}
      {[{label:'ORIGIN', value:originId, set:setOriginId}, {label:'DESTINATION', value:destinationId, set:setDestinationId}].map(({label,value,set}) => (
        <div key={label}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', letterSpacing:'2px', color:'var(--muted2)', marginBottom:'6px' }}>{label}</div>
          <select value={value} onChange={e=>set(e.target.value)} style={{
            width:'100%', background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'8px', color:'var(--text)',
            fontFamily:'Rajdhani,sans-serif', fontWeight:600, fontSize:'13px',
            padding:'9px 12px', outline:'none', cursor:'pointer',
          }}>
            <option value=''>— Select Zone —</option>
            {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
          </select>
        </div>
      ))}

      {/* Preference */}
      <div>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', letterSpacing:'2px', color:'var(--muted2)', marginBottom:'8px' }}>ROUTING PREFERENCE</div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {[{id:'shade',label:'🌳 Max Shade'},{id:'cool',label:'❄️ Coolest Path'},{id:'fast',label:'⚡ Fastest'}].map(p => (
            <button key={p.id} onClick={()=>setPreference(p.id)} style={{
              flex:1, padding:'8px 10px', borderRadius:'8px', border:'none', cursor:'pointer', transition:'all 0.2s',
              background: preference===p.id ? 'linear-gradient(135deg,rgba(0,255,136,0.15),rgba(0,212,255,0.10))' : 'var(--bg2)',
              color: preference===p.id ? 'var(--green)' : 'var(--muted)',
              outline: `1px solid ${preference===p.id ? 'rgba(0,255,136,0.3)' : 'var(--border)'}`,
              fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'12px',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Calculate button */}
      <button onClick={handleCalculate} disabled={loading} style={{
        padding:'11px', borderRadius:'10px', border:'none', cursor: loading ? 'wait' : 'pointer',
        background: loading ? 'var(--bg3)' : 'linear-gradient(135deg,#00FF88,#00D4FF)',
        color: loading ? 'var(--muted)' : '#060610',
        fontFamily:'Bebas Neue,sans-serif', fontSize:'16px', letterSpacing:'2px', transition:'all 0.2s',
      }}>{loading ? 'CALCULATING SAFE ROUTE…' : '🛡️ CALCULATE SAFE ROUTE'}</button>

      {error && (
        <div style={{ background:'rgba(255,45,85,0.08)', border:'1px solid rgba(255,45,85,0.25)', borderRadius:'8px', padding:'10px 14px', color:'var(--pink)', fontFamily:'Space Mono,monospace', fontSize:'11px' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{ background:'var(--bg2)', border:'1px solid rgba(0,255,136,0.25)', borderRadius:'var(--r)', padding:'14px', display:'flex', flexDirection:'column', gap:'8px' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:'9px', letterSpacing:'2px', color:'var(--green)', marginBottom:'4px' }}>✅ SAFE ROUTE CALCULATED</div>
          {result.total_distance_km != null && (
            <div style={{ display:'flex', gap:'10px' }}>
              <div style={{ background:'var(--bg3)', borderRadius:'8px', padding:'8px 14px', textAlign:'center', flex:1, border:'1px solid var(--border)' }}>
                <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'22px', color:'var(--cyan)' }}>{result.total_distance_km?.toFixed(2)} km</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', color:'var(--muted)' }}>DISTANCE</div>
              </div>
              {result.avg_shade_pct != null && (
                <div style={{ background:'var(--bg3)', borderRadius:'8px', padding:'8px 14px', textAlign:'center', flex:1, border:'1px solid var(--border)' }}>
                  <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'22px', color:'var(--green)' }}>{result.avg_shade_pct?.toFixed(0)}%</div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:'8px', color:'var(--muted)' }}>SHADE COVER</div>
                </div>
              )}
            </div>
          )}
          {result.safety_notes && (
            <p style={{ fontSize:'11.5px', color:'var(--muted2)', lineHeight:1.7 }}>{result.safety_notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
