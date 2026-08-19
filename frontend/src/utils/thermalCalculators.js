export const formatTemp = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined) return '--';
  if (unit === 'F') {
    return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  }
  return `${celsius.toFixed(1)}°C`;
};

export const getTempColor = (tempC) => {
  if (tempC >= 45) return '#ef4444'; // Red extreme
  if (tempC >= 40) return '#f97316'; // Orange high
  if (tempC >= 35) return '#eab308'; // Amber watchlist
  if (tempC >= 30) return '#3b82f6'; // Blue moderate
  return '#10b981'; // Green cool
};

export const getTempBgClass = (tempC) => {
  if (tempC >= 45) return 'bg-red-500/20 text-red-400 border-red-500/40';
  if (tempC >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
  if (tempC >= 35) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  if (tempC >= 30) return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
  return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
};

export const getRiskBadge = (level) => {
  switch (level?.toLowerCase()) {
    case 'extreme':
      return {
        label: 'Extreme Danger',
        color: 'bg-red-500/20 text-red-300 border-red-500/50',
        dot: 'bg-red-500 animate-ping'
      };
    case 'high':
      return {
        label: 'High Risk',
        color: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
        dot: 'bg-orange-500'
      };
    case 'warning':
      return {
        label: 'Watchlist (>35°C)',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        dot: 'bg-amber-400'
      };
    default:
      return {
        label: 'Safe Microclimate',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        dot: 'bg-emerald-400'
      };
  }
};

export const getWBGTLevel = (wbgt) => {
  if (wbgt >= 32.2) {
    return { level: 'Extreme', desc: 'Suspend strenuous outdoor activity; immediate heatstroke risk.', color: 'text-red-400' };
  }
  if (wbgt >= 30.1) {
    return { level: 'Severe', desc: 'Heavy stress. 45 min rest per 15 min work required.', color: 'text-orange-400' };
  }
  if (wbgt >= 28.0) {
    return { level: 'Moderate', desc: 'Drink 1 liter water/hr. Frequent rest in shade.', color: 'text-amber-400' };
  }
  return { level: 'Low', desc: 'Normal outdoor conditions. Standard hydration.', color: 'text-emerald-400' };
};

export const getStationIcon = (type) => {
  switch (type) {
    case 'misting_tent':
      return 'CloudFog';
    case 'solar_cooling_pod':
      return 'SunMedium';
    case 'hydration_kiosk':
      return 'Droplet';
    case 'tree_canopy_shelter':
      return 'Trees';
    default:
      return 'ShieldCheck';
  }
};
