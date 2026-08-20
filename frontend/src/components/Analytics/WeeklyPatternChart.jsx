import React, { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, Clock, Calendar } from 'lucide-react';

const tooltipStyle = {
  backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px',
};

export default function WeeklyPatternChart({ weeklyData, unit }) {
  const [viewMode, setViewMode] = useState('weekly');
  if (!weeklyData) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-slide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Multi-Week Heat Signatures
              <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/40 font-data">
                14-Day Telemetry
              </span>
            </h3>
            <p className="text-xs text-slate-400">Tracking nighttime UHI retention &amp; peak solar heating cycles</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'weekly' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> 14-Day
          </button>
          <button
            onClick={() => setViewMode('diurnal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'diurnal' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> 24-Hour
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        {viewMode === 'weekly' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData.daily_trends} margin={{ bottom: 18, left: 14 }}>
              <defs>
                <linearGradient id="surfaceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ambientGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="uhiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Date', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={['dataMin - 3', 'dataMax + 3']}
                label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`${val}°C`, '']} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="surface_max"        stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#surfaceGrad)" name="Max Surface Temp (°C)" />
              <Area type="monotone" dataKey="ambient_max"        stroke="#f97316" strokeWidth={2}   fillOpacity={1} fill="url(#ambientGrad)" name="Peak Ambient Air (°C)" />
              <Area type="monotone" dataKey="surface_night_uhi"  stroke="#8b5cf6" strokeWidth={1.8} fillOpacity={1} fill="url(#uhiGrad)"     name="Nighttime UHI (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData.hourly_diurnal_curve} margin={{ bottom: 18, left: 14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={[20, 60]}
                label={{ value: 'Surface Temp (°C)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`${val}°C`, '']} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="asphalt_surface"        stroke="#ef4444" strokeWidth={2.5} dot={false} name="Dark Asphalt" />
              <Line type="monotone" dataKey="cool_pavement_surface"  stroke="#38bdf8" strokeWidth={2}   dot={false} name="High-Albedo Pavement" />
              <Line type="monotone" dataKey="shaded_park_surface"    stroke="#10b981" strokeWidth={2}   dot={false} name="Shaded Park" />
              <Line type="monotone" dataKey="ambient_air"            stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Ambient Air" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
