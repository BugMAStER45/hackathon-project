const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/api' : '/api');

async function fetcher(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  getZones:  async (cityId = 'los_angeles') => {
    const data = await fetcher(`${API_BASE}/zones?city_id=${cityId}`);
    return data.zones || [];
  },
  getCities: () => fetcher(`${API_BASE}/zones/cities`),

  getHotspots: async (cityId = 'los_angeles') => {
    const data = await fetcher(`${API_BASE}/heat/hotspots?city_id=${cityId}`);
    // Backend uses top_hotspots, fallback to hotspots if it changes
    return data.top_hotspots || data.hotspots || [];
  },
  getWatchlist: async (cityId = 'los_angeles') => {
    const data = await fetcher(`${API_BASE}/heat/watchlist?city_id=${cityId}`);
    return data.watchlist || [];
  },

  getStations: async (cityId = 'los_angeles') => {
    const data = await fetcher(`${API_BASE}/cooling/stations?city_id=${cityId}`);
    return Array.isArray(data) ? data : (data.stations || []);
  },
  getRecommendations: async (cityId = 'los_angeles') => {
    const data = await fetcher(`${API_BASE}/cooling/recommendations?city_id=${cityId}`);
    return Array.isArray(data) ? data : (data.recommendations || []);
  },
  deployStation: (cityId, data) =>
    fetcher(`${API_BASE}/cooling/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, city_id: cityId }),
    }),

  getWeeklyPatterns: (cityId = 'los_angeles', days = 14) =>
    fetcher(`${API_BASE}/analytics/weekly-patterns?city_id=${cityId}&days=${days}`),
  getCorrelations: (cityId = 'los_angeles') =>
    fetcher(`${API_BASE}/analytics/correlations?city_id=${cityId}`),
    
  getKpis: async (cityId = 'los_angeles') => {
    const data = await fetcher(`${API_BASE}/analytics/kpis?city_id=${cityId}`);
    // Map nested fields to root so the frontend metric banners can read them directly
    if (data.resilient_cities_infrastructure) {
       data.resilience_score = data.resilient_cities_infrastructure.urban_resilience_index;
    }
    if (data.data_analysis_correlation) {
       data.avg_surface_temp = data.data_analysis_correlation.city_average_surface_temp_c;
    }
    return data;
  },

  getSafeRoute: (cityId, params) =>
    fetcher(`${API_BASE}/navigation/safe-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, city_id: cityId }),
    }),

  getMunicipalReport: (cityId = 'los_angeles') =>
    fetcher(`${API_BASE}/reports/municipal?city_id=${cityId}`),
};
