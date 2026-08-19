import React, { useState } from 'react';
import { X, AlertTriangle, Send, MapPin, CheckCircle, Flame, Droplet } from 'lucide-react';

export default function CommunityReportModal({
  isOpen,
  onClose,
  onSubmitReport,
  cityId
}) {
  const [hazardType, setHazardType] = useState('unshaded_bus_stop');
  const [description, setDescription] = useState('');
  const [reportedTemp, setReportedTemp] = useState('42');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmitReport({
      city_id: cityId,
      coordinates: [-118.2518, 34.0488],
      hazard_type: hazardType,
      description,
      reported_temp: parseFloat(reportedTemp) || null
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Report Urban Heat Hazard
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Hazard Report Verified &amp; Logged!</h4>
            <p className="text-xs text-slate-400">
              City planners and FortyGuard emergency cooling teams have been notified of this location.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Hazard Type
              </label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="unshaded_bus_stop">Unshaded Bus / Transit Stop (Extreme Sun)</option>
                <option value="broken_water_fountain">Broken / Out-of-Service Water Fountain</option>
                <option value="scorching_pavement">Overheating Asphalt Corridor (&gt; 45°C)</option>
                <option value="heat_exhaustion_incident">Pedestrian Heat Distress Hotspot</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Estimated Surface / Ambient Temp (°C)
              </label>
              <input
                type="number"
                value={reportedTemp}
                onChange={(e) => setReportedTemp(e.target.value)}
                placeholder="e.g. 42"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Description &amp; Location Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe shade conditions, broken infrastructure, or crowd density..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting Report...' : 'Submit Crowdsourced Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
