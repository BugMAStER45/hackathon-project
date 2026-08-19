const API_BASE = '/api';

export const api = {
  // Cities
  async getCities() {
    const res = await fetch(`${API_BASE}/zones/cities`);
    return res.json();
  },

  // Pedestrian Zones & OSM
  async getPedestrianZones(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/zones?city_id=${cityId}`);
    return res.json();
  },

  // FortyGuard Thermal & Hotspots
  async getLiveHeat(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/heat/live?city_id=${cityId}`);
    return res.json();
  },

  async getTopHotspots(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/heat/hotspots?city_id=${cityId}`);
    return res.json();
  },

  async getWatchlist(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/heat/watchlist?city_id=${cityId}`);
    return res.json();
  },

  // Cooling Stations
  async getCoolingStations(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/cooling/stations?city_id=${cityId}`);
    return res.json();
  },

  async getCoolingRecommendations(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/cooling/recommendations?city_id=${cityId}`);
    return res.json();
  },

  async deployStation(data) {
    const res = await fetch(`${API_BASE}/cooling/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Analytics & Correlations
  async getWeeklyPatterns(cityId = 'los_angeles', days = 14) {
    const res = await fetch(`${API_BASE}/analytics/weekly-patterns?city_id=${cityId}&days=${days}`);
    return res.json();
  },

  async getCorrelations(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/analytics/correlations?city_id=${cityId}`);
    return res.json();
  },

  async getResilienceKPIs(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/analytics/kpis?city_id=${cityId}`);
    return res.json();
  },

  // Reports
  async getMunicipalReport(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/reports/municipal?city_id=${cityId}`);
    return res.json();
  },

  async submitCommunityReport(data) {
    const res = await fetch(`${API_BASE}/reports/community`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getCommunityReports(cityId = 'los_angeles') {
    const res = await fetch(`${API_BASE}/reports/community?city_id=${cityId}`);
    return res.json();
  },

  // Safe Navigation
  async computeSafeRoute(data) {
    const res = await fetch(`${API_BASE}/navigation/safe-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(data) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
