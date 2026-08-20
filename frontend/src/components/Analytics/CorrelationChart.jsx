import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell
} from 'recharts';
import { Network } from 'lucide-react';

const tooltipStyle = {
  backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px',
};

export default function CorrelationChart({ correlations }) {
  const [activeTab, setActiveTab] = useState('material');
  if (!correlations) return null;

  const tabs = [
    { id: 'material', label: 'Material vs Temp' },
    { id: 'canopy',   label: 'Canopy % vs Cooling' },
    { id: 'footfall', label: 'Heat vs Illness' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-slide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Data Correlation Matrix
              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/40 font-data">
                Pillar 3
              </span>
            </h3>
            <p className="text-xs text-slate-400">Surface albedo vs microclimate heat vs health incident correlations</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        {activeTab === 'material' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={correlations.material_correlation} layout="vertical" margin={{ bottom: 18, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number" domain={[20, 55]}
                stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Avg Surface Temp (°C)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 11 }}
              />
              <YAxis
                dataKey="material" type="category"
                stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} width={130}
                label={{ value: 'Material', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`${val}°C`, 'Avg Surface Temp']} />
              <Bar dataKey="avg_surface_temp" radius={[0, 6, 6, 0]}>
                {correlations.material_correlation.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={
                      entry.avg_surface_temp >= 45 ? '#ef4444'
                      : entry.avg_surface_temp >= 40 ? '#f97316'
                      : entry.avg_surface_temp >= 35 ? '#eab308'
                      : '#10b981'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'canopy' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={correlations.canopy_cooling_curve} margin={{ bottom: 18, left: 14 }}>
              <defs>
                <linearGradient id="canopyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="canopy_cover_pct"
                stroke="#64748b" unit="%" tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Canopy Cover (%)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Temp Drop (°C)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="surface_drop_c" stroke="#10b981" strokeWidth={2.5} fill="url(#canopyGrad)" name="Surface Temp Drop (°C)" />
              <Area type="monotone" dataKey="ambient_drop_c" stroke="#06b6d4" strokeWidth={2}   fillOpacity={0.2}        fill="#06b6d4"               name="Ambient Air Drop (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'footfall' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={correlations.footfall_vs_heat} margin={{ bottom: 18, left: 14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="temp_bracket"
                stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }}
                label={{ value: 'Temperature Bracket', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }}
              />
              <YAxis
                stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Rate / Volume', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="heatstroke_risk_rate" fill="#ef4444" radius={[6, 6, 0, 0]} name="Heat Illness Rate (per 10k)" />
              <Bar dataKey="water_need_liters_hr"  fill="#06b6d4" radius={[6, 6, 0, 0]} name="Water Requirement (L/hr)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
