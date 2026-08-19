import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Database, Sliders, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.fortyguard.com/v1');
  const [extremeThresh, setExtremeThresh] = useState(40.0);
  const [watchlistThresh, setWatchlistThresh] = useState(35.0);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setApiKey(settings.fortyguard_api_key || '');
      setBaseUrl(settings.fortyguard_api_base_url || 'https://api.fortyguard.com/v1');
      setExtremeThresh(settings.heat_extreme_threshold || 40.0);
      setWatchlistThresh(settings.heat_watchlist_threshold || 35.0);
    }
  }, [settings]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSaveSettings({
      fortyguard_api_key: apiKey,
      fortyguard_api_base_url: baseUrl,
      mongodb_url: settings?.mongodb_url || 'mongodb://localhost:27017',
      heat_extreme_threshold: parseFloat(extremeThresh),
      heat_watchlist_threshold: parseFloat(watchlistThresh)
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white">
              FortyGuard API &amp; System Configuration
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Settings Saved Successfully!</h4>
            <p className="text-xs text-slate-400">
              FortyGuard thermal pipelines and alert thresholds have been re-calibrated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* FortyGuard API Key Section */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Key className="w-3.5 h-3.5 text-orange-400" />
                FortyGuard Thermal API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your FortyGuard API Key (e.g. fg_live_...)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                When provided, live FortyGuard microclimate telemetry is fetched. Otherwise, the high-precision thermodynamic physics engine is used.
              </p>
            </div>

            {/* FortyGuard API Endpoint */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-300">
                FortyGuard API Base URL
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* Threshold adjustments */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  &gt; 35°C Watchlist Threshold
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={watchlistThresh}
                  onChange={(e) => setWatchlistThresh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Extreme Risk Threshold (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={extremeThresh}
                  onChange={(e) => setExtremeThresh(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 font-mono"
                />
              </div>
            </div>

            {/* Database connection status */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Geospatial Database Layer</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                MongoDB 2dsphere Active
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/20"
            >
              {saving ? 'Updating Settings...' : 'Save Configuration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
