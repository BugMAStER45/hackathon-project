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
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error:   <XCircle className="w-4 h-4 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  };
  const borders = {
    success: 'border-emerald-500/40',
    error:   'border-red-500/40',
    warning: 'border-amber-500/40',
  };

  return (
    <div className={`flex items-start gap-3 bg-slate-900 border ${
      borders[toast.type] || 'border-slate-700'
    } rounded-xl px-4 py-3 shadow-2xl max-w-sm text-sm ${
      leaving ? 'toast-exit' : 'toast-enter'
    }`}>
      {icons[toast.type]}
      <div className="flex-1">
        {toast.title && <p className="font-bold text-white text-xs">{toast.title}</p>}
        <p className="text-slate-300 text-xs leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => { setLeaving(true); setTimeout(() => onRemove(toast.id), 300); }}
        className="text-slate-500 hover:text-slate-200 transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  );
}
