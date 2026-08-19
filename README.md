# 🛡️ FortyGuard HeatShield: California Urban Pedestrian Thermal Resilience Platform

An end-to-end urban thermal intelligence platform designed for the **FortyGuard Hackathon**, addressing extreme heatwaves in urban pedestrian environments across California (Los Angeles, Palm Springs, Fresno, Sacramento, San Francisco).

The system integrates **OpenStreetMap (OSM)** pedestrian infrastructure with **FortyGuard's Thermal Microclimate Intelligence**, pinpoints the **Top 5% Extreme Heat Hotspots**, continuously monitors sectors with **temperatures &gt; 35°C**, recommends and simulates **Cooling Station Deployments**, tracks **multi-week heat signatures**, and generates **Municipal Heat Action Plans (HAP)** for city planners.

---

## 🌟 Hackathon Pillars & Areas of Interest

| Area of Interest | Platform Capabilities & Features |
| :--- | :--- |
| **1. Resilient Cities and Infrastructure** | • Pedestrian corridor thermal mapping (transit hubs, walking streets, parks, plazas)<br>• Automated Cooling Station Optimizer (Misting pods, hydration kiosks, shade pergolas)<br>• Microclimate relief simulation (-4.5°C to -6.2°C temperature drop)<br>• Urban shade deficit and canopy gap analysis |
| **2. Government & Environment** | • Official Municipal Heat Action Plan (HAP) Report Generator with PDF/Print export<br>• Real-time Heat Health Alert Levels (Advisory, Watch, Warning, Emergency Level 3)<br>• Emergency action protocols (0-48 hrs) and long-term zoning recommendations<br>• Community crowdsourced heat hazard reporting (broken water fountains, unshaded stops) |
| **3. Data Analysis & Correlation** | • 14-day & 30-day historical heat signature pattern tracking<br>• Nighttime Urban Heat Island (UHI) heat retention telemetry<br>• 24-hour diurnal thermal cycle comparison (asphalt vs. cool pavement vs. shaded park)<br>• Quantitative Correlation Matrices: Albedo vs. Temperature ($r = -0.92$), Tree Canopy vs. Ambient Drop ($r = -0.87$), Pedestrian Footfall vs. Heatstroke Risk |

---

## 🚀 Dual Persona Experience

### 🏛️ 1. City Planner & Government Command Center
- **Interactive Thermal Map**: Real-time Leaflet Dark Matter base with FortyGuard thermal pulse nodes, WBGT heat stress markers, and active cooling station radii.
- **Top 5% Hotspot Pinpoint (P95 Hazard Tier)**: Ranked list of the most hazardous pedestrian nodes with composite risk scores and customized intervention recommendations.
- **&gt; 35°C Watchlist Panel**: Proactive surveillance of urban sectors exceeding 35°C with real-time rate-of-temperature-rise (°C/hr) alerts.
- **Cooling Station Deployer**: Test placement of misting tents, hydration kiosks, or shade pergolas and instantly simulate localized cooling and protected foot traffic.
- **Municipal HAP Report Modal**: Comprehensive executive briefing with downloadable PDF Heat Action Plan.

### 🚶 2. Citizen & Commuter Heat Shield
- **Safe Shaded Route Navigator**: Input origin and destination to calculate a heat-shielded walking route prioritizing shaded sidewalks, tree canopies, and misting hubs (-45% heat stress reduction).
- **Cooling Oasis Finder**: Live directory and map markers for working misting tents, smart hydration fountains, and air-conditioned public respite centers.
- **Heat Health & WBGT Advisory**: Real-time Wet-Bulb Globe Temperature gauge, heatstroke symptom checklist, and an interactive personalized Hydration Intake Calculator (ISO 7243 model).
- **Crowdsourced Hazard Reporter**: Report broken water fountains, unshaded bus stops, or pedestrian heat emergencies directly to city operations.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: **FastAPI** (Python 3.14) with Uvicorn, Motor/AsyncIOMotor, Shapely, Requests, Pydantic v2.
- **Database**: **MongoDB Geospatial** (`2dsphere` indexes on GeoJSON coordinates) with a built-in resilient in-memory fallback store for instant zero-dependency execution.
- **Thermal Engine**: **FortyGuard API integration** + high-fidelity thermodynamic microclimate physics model (solar irradiance $W/m^2$, surface albedo $\alpha$, convective heat transfer $h_c$, WBGT, UHI intensity).
- **Frontend**: **React 18** + **Vite** + **Tailwind CSS** + **Lucide Icons** + **Leaflet / React-Leaflet** + **Recharts** + **Canvas-Confetti**.

---

## ⚡ Quick Start Instructions

### 1. One-Click Launch (Both Backend & Frontend)
```bash
./run_app.sh
```
- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Manual Launch
```bash
# Terminal 1: Backend
cd backend
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## ⚙️ FortyGuard API Configuration

You can configure your live FortyGuard API key either:
1. Via the **UI Settings Modal** (click the gear icon ⚙️ in the top-right navbar).
2. Or via environment variables in `backend/.env`:
```env
FORTYGUARD_API_KEY=your_fortyguard_api_key_here
FORTYGUARD_API_BASE_URL=https://api.fortyguard.com/v1
MONGODB_URL=mongodb://localhost:27017
```

---

## 📊 API Reference

- `GET /api/zones/cities` - Supported California urban focus regions.
- `GET /api/zones?city_id=los_angeles` - OpenStreetMap pedestrian infrastructure nodes.
- `GET /api/heat/live?city_id=los_angeles` - FortyGuard thermal microclimate grid.
- `GET /api/heat/hotspots?city_id=los_angeles` - Top 5% extreme heat hotspots algorithm.
- `GET /api/heat/watchlist?city_id=los_angeles` - Potential hotspots (>35°C threshold surveillance).
- `GET /api/cooling/stations?city_id=los_angeles` - Active cooling stations.
- `GET /api/cooling/recommendations?city_id=los_angeles` - Algorithmic placement recommendations.
- `POST /api/cooling/deploy` - Deploy station & simulate localized temperature drop.
- `GET /api/analytics/weekly-patterns?city_id=los_angeles` - Multi-week diurnal thermal signatures.
- `GET /api/analytics/correlations?city_id=los_angeles` - Material albedo, tree canopy & health correlation matrices.
- `GET /api/analytics/kpis?city_id=los_angeles` - 3 Pillars Resilience KPIs.
- `GET /api/reports/municipal?city_id=los_angeles` - Municipal Heat Action Plan report.
- `POST /api/navigation/safe-route` - Shaded pedestrian navigation engine.
- `POST /api/reports/community` - Crowdsourced heat hazard reporting.
