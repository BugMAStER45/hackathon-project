import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

function ToastItem({ toast, onRemove }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 4000);
    return () => clearTimeout(t);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle2 size={14} color='var(--green)' />,
    error:   <XCircle     size={14} color='var(--pink)'  />,
    warning: <AlertTriangle size={14} color='var(--gold)' />,
  };
  const borders = {
    success: 'rgba(0,255,136,0.3)',
    error:   'rgba(255,45,85,0.3)',
    warning: 'rgba(255,215,0,0.3)',
  };

  return (
    <div className={leaving ? 'toast-exit' : 'toast-enter'} style={{
      display:'flex', alignItems:'flex-start', gap:'10px',
      background:'var(--bg2)', border:`1px solid ${borders[toast.type] || 'var(--border)'}`,
      borderRadius:'12px', padding:'12px 14px',
      boxShadow:'0 20px 40px rgba(0,0,0,0.5)', maxWidth:'320px',
    }}>
      <div style={{ marginTop:'1px', flexShrink:0 }}>{icons[toast.type]}</div>
      <div style={{ flex:1 }}>
        {toast.title && <p style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'13px', letterSpacing:'1px', color:'var(--text)', marginBottom:'2px' }}>{toast.title}</p>}
        <p style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'12px', color:'var(--muted2)', lineHeight:1.5 }}>{toast.message}</p>
      </div>
      <button onClick={() => { setLeaving(true); setTimeout(() => onRemove(toast.id), 300); }} style={{
        background:'none', border:'none', cursor:'pointer', color:'var(--muted)', padding:'0', flexShrink:0,
      }}><X size={12} /></button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{
      position:'fixed', top:'80px', right:'16px', zIndex:9999,
      display:'flex', flexDirection:'column', gap:'8px',
      pointerEvents:'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents:'all' }}>
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
