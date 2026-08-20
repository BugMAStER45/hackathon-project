// In production (Render), VITE_API_URL is set to the backend URL.
// In development (Vite proxy), falls back to '/api'.
const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/api' : '/api');

async function fetcher(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  // ── Zones ──
  getZones:  (cityId = 'los_angeles') => fetcher(`${API_BASE}/zones?city_id=${cityId}`),
  getCities: ()                        => fetcher(`${API_BASE}/zones/cities`),

  // ── Heat / Hotspots ──
  getHotspots: (cityId = 'los_angeles') => fetcher(`${API_BASE}/heat/hotspots?city_id=${cityId}`),
  getLiveHeat: (cityId = 'los_angeles') => fetcher(`${API_BASE}/heat/live?city_id=${cityId}`),
  getWatchlist:(cityId = 'los_angeles') => fetcher(`${API_BASE}/heat/watchlist?city_id=${cityId}`),

  // ── Cooling ──
  getStations:       (cityId = 'los_angeles') => fetcher(`${API_BASE}/cooling/stations?city_id=${cityId}`),
  getRecommendations:(cityId = 'los_angeles') => fetcher(`${API_BASE}/cooling/recommendations?city_id=${cityId}`),
  deployStation: (cityId, data) =>
    fetcher(`${API_BASE}/cooling/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, city_id: cityId }),
    }),

  // ── Analytics ──
  getWeeklyPatterns: (cityId = 'los_angeles', days = 14) =>
    fetcher(`${API_BASE}/analytics/weekly-patterns?city_id=${cityId}&days=${days}`),
  getCorrelations: (cityId = 'los_angeles') =>
    fetcher(`${API_BASE}/analytics/correlations?city_id=${cityId}`),
  getKpis: (cityId = 'los_angeles') =>
    fetcher(`${API_BASE}/analytics/kpis?city_id=${cityId}`),

  // ── Safe Route ──
  getSafeRoute: (cityId, params) =>
    fetcher(`${API_BASE}/navigation/safe-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, city_id: cityId }),
    }),

  // ── Reports ──
  getMunicipalReport: (cityId = 'los_angeles') =>
    fetcher(`${API_BASE}/reports/municipal?city_id=${cityId}`),
  submitCommunityReport: (data) =>
    fetcher(`${API_BASE}/reports/community`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  getCommunityReports: (cityId = 'los_angeles') =>
    fetcher(`${API_BASE}/reports/community?city_id=${cityId}`),

  // ── Settings ──
  getSettings: () => fetcher(`${API_BASE}/settings`),
  updateSettings: (data) =>
    fetcher(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};
