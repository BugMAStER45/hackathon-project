import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import db_manager
from app.routes import zones, heat, cooling, analytics, reports, routes_nav, settings as settings_route

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("heatshield.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing FortyGuard HeatShield Backend...")
    await db_manager.connect()
    yield
    logger.info("Shutting down FortyGuard HeatShield Backend...")
    await db_manager.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="California Urban Pedestrian Thermal Resilience Platform for FortyGuard Hackathon",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(zones.router, prefix=settings.API_PREFIX)
app.include_router(heat.router, prefix=settings.API_PREFIX)
app.include_router(cooling.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)
app.include_router(routes_nav.router, prefix=settings.API_PREFIX)
app.include_router(settings_route.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "focus_region": "California Urban Pedestrian Heat Resilience",
        "supported_cities": ["los_angeles", "palm_springs", "fresno", "sacramento", "san_francisco"],
        "docs_url": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "mongodb_connected" if db_manager.is_connected_to_mongo else "resilient_in_memory_geo_store",
        "fortyguard_api_live": bool(settings.FORTYGUARD_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
