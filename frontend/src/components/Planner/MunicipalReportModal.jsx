import React, { useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Flame, 
  ShieldAlert, 
  CheckCircle, 
  FileText, 
  Calendar, 
  Building2, 
  DollarSign, 
  Users, 
  TrendingDown 
} from 'lucide-react';
import { formatTemp } from '../../utils/thermalCalculators';

export default function MunicipalReportModal({
  report,
  isOpen,
  onClose,
  unit
}) {
  const reportRef = useRef(null);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Action Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Municipal Heat Action Plan (HAP) Report
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Report ID: {report.report_id}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div ref={reportRef} className="p-6 overflow-y-auto space-y-6 text-slate-200 bg-slate-900 printable-area">
          {/* Document Header */}
          <div className="border-b-2 border-orange-500/50 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-orange-400 font-semibold">
                  Official Municipal Thermal Assessment
                </span>
                <h1 className="text-2xl font-extrabold text-white mt-1">
                  {report.city_name} Heat Action &amp; Microclimate Resilience Plan
                </h1>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Generated on {new Date(report.generated_at).toLocaleString()} | Powered by FortyGuard
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {report.emergency_level}
                </span>
                <div className="text-xs text-slate-400 mt-1">
                  Resilience Score: <strong className="text-emerald-400">{report.resilience_score}/100</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-orange-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Executive Summary
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.executive_summary}
            </p>
          </div>

          {/* Key Findings List */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-300 mb-2">
              Key Thermal Findings
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {report.key_findings.map((item, idx) => (
                <li key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2 text-slate-300">
                  <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 5% Extreme Hotspots Table */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-red-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Priority Top 5% Heat Hazard Hotspots
            </h4>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Rank</th>
                    <th className="p-2.5">Location</th>
                    <th className="p-2.5">Surface Temp</th>
                    <th className="p-2.5">WBGT</th>
                    <th className="p-2.5">Daily Pedestrians</th>
                    <th className="p-2.5">Recommended Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {report.top_hotspots.map((spot) => (
                    <tr key={spot.zone_id} className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-bold text-red-400">#{spot.rank}</td>
                      <td className="p-2.5 font-semibold text-white">{spot.name}</td>
                      <td className="p-2.5 font-mono font-bold text-orange-400">{formatTemp(spot.surface_temp, unit)}</td>
                      <td className="p-2.5 font-mono text-amber-400">{formatTemp(spot.wbgt_temp, unit)}</td>
                      <td className="p-2.5 font-mono text-slate-300">{spot.lives_protected_daily?.toLocaleString()}</td>
                      <td className="p-2.5 text-amber-200/90">{spot.recommended_intervention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Items: Immediate vs Long-term */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30">
              <h5 className="text-xs font-bold text-orange-400 uppercase font-mono mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Immediate Emergency Actions (0-48 hrs)
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {report.immediate_actions.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
              <h5 className="text-xs font-bold text-emerald-400 uppercase font-mono mb-2 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" /> Long-Term Urban Interventions
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {report.long_term_urban_planning_recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Budget & Social ROI */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Total Commuters Shielded Daily</span>
                <div className="text-xl font-bold text-white">
                  {report.estimated_lives_shielded_daily?.toLocaleString()} Pedestrians
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Estimated Municipal Budget</span>
                <div className="text-xl font-bold text-cyan-300">
                  ${report.estimated_budget_usd?.toLocaleString()} USD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
