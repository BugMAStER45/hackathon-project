# 🌡️ FortyGuard HeatShield — California Urban Thermal Resilience Platform

> **FortyGuard Hackathon 2024** | Resilient Cities & Infrastructure · Government & Environment · Data Analysis & Correlation

A full-stack platform that identifies pedestrian zones under extreme heat risk across California cities, deploys AI-driven cooling station recommendations, and generates actionable intelligence reports for city planners.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** (React) | https://heatshield-frontend.onrender.com |
| **API** (FastAPI) | https://heatshield-api.onrender.com |
| **API Docs** (Swagger) | https://heatshield-api.onrender.com/docs |

---

## 🏗️ Architecture

```
Browser (React + Leaflet + Recharts)
        │  HTTPS
        ▼
FastAPI Backend (Python 3.11, Uvicorn)
        │
        ├── FortyGuard Thermal API  (Live heat data)
        ├── OpenStreetMap Service   (Pedestrian zones)
        ├── MongoDB Atlas           (Geospatial data store)
        └── Physics Engine         (WBGT, UHI, Heat Index)
```

### California Cities Covered
| City | Lat / Lng | Default Temp |
|------|-----------|--------------|
| Los Angeles (Downtown) | 34.0488, -118.2518 | 38.5°C |
| Palm Springs | 33.8247, -116.5413 | 43.2°C |
| Fresno | 36.7468, -119.7726 | 40.1°C |
| Sacramento | 38.5816, -121.4944 | 37.8°C |
| San Francisco | 37.7793, -122.4192 | 32.4°C |

---

## ☁️ One-Click Cloud Deployment

### Deploy Backend + Frontend to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/BugMAStER45/hackathon-project)

**Or manually:**
1. Go to [render.com](https://render.com) → New → Blueprint
2. Connect your GitHub repo `BugMAStER45/hackathon-project`
3. Render auto-reads `render.yaml` and creates both services
4. Set `MONGODB_URL` to your MongoDB Atlas connection string
5. Done ✅

### Deploy Frontend to Vercel (Alternative)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BugMAStER45/hackathon-project&root=frontend)

1. Connect GitHub repo → set **Root Directory** to `frontend`
2. Add env var: `VITE_API_URL=https://heatshield-api.onrender.com`
3. Deploy → get a `*.vercel.app` URL instantly

---

## ⚡ Local Development

```bash
# Clone
git clone https://github.com/BugMAStER45/hackathon-project.git
cd hackathon-project

# Configure env
cp .env.example .env
# Edit .env and set FORTYGUARD_API_KEY

# One-command start (installs everything automatically)
./run_app.sh
```

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FORTYGUARD_API_KEY` | FortyGuard thermal data API key | ✅ |
| `MONGODB_URL` | MongoDB Atlas connection string | Optional (uses in-memory fallback) |
| `DB_NAME` | MongoDB database name | Optional |
| `VITE_API_URL` | Backend API URL (frontend only, production) | Production only |

---

## 🗺️ API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | System health + API status |
| GET | `/api/zones/cities` | List California cities |
| GET | `/api/zones?city_id=los_angeles` | Pedestrian zones + OSM data |
| GET | `/api/heat/live?city_id=...` | Live FortyGuard thermal feed |
| GET | `/api/heat/hotspots?city_id=...` | Top 5% extreme heat hotspots |
| GET | `/api/heat/watchlist?city_id=...` | >35°C risk sectors |
| GET | `/api/cooling/stations?city_id=...` | Active cooling stations |
| GET | `/api/cooling/recommendations?city_id=...` | AI placement optimizer |
| POST | `/api/cooling/deploy` | Deploy new cooling station |
| GET | `/api/analytics/weekly-patterns?city_id=...` | 14-day heat signatures |
| GET | `/api/analytics/correlations?city_id=...` | Material/canopy/footfall correlations |
| GET | `/api/analytics/kpis?city_id=...` | 3 Pillars Resilience KPIs |
| GET | `/api/reports/municipal?city_id=...` | City planner Heat Action Plan |
| POST | `/api/navigation/safe-route` | Safe shaded pedestrian route |

---

## 🎯 Hackathon Pillars Mapping

| Pillar | Features |
|--------|----------|
| **Resilient Cities & Infrastructure** | Cooling station placement optimizer, Top 5% hotspot identification, Safe route navigator |
| **Government & Environment** | Municipal Heat Action Plan report, >35°C watchlist, Nighttime UHI retention tracking |
| **Data Analysis & Correlation** | 14-day thermal signatures, Material vs Temp correlations, Canopy coverage analytics |

---

## 🧑‍💻 Tech Stack

**Backend**: Python 3.11, FastAPI, Uvicorn, Motor (MongoDB async), httpx, Pydantic v2  
**Frontend**: React 18, Vite, Tailwind CSS, Leaflet (maps), Recharts (analytics), Lucide icons  
**Data**: FortyGuard Thermal API, OpenStreetMap pedestrian data  
**Database**: MongoDB Atlas (geospatial `2dsphere` index)  
**Deployment**: Render (Docker), Vercel (Static CDN)

---

*Built with ❤️ for the FortyGuard Hackathon — tackling extreme heat for communities worldwide.*
