import os
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.payload import HealthResponse
from app.core.pipeline import engine
from app.api.eda import router as eda_router
from app.api.preprocessing import router as preprocessing_router
from app.api.regression import router as regression_router
from app.api.classification import router as classification_router
from app.api.clustering import router as clustering_router
from app.api.simulator import router as simulator_router

app = FastAPI(
    title="BlinkRoute IQ - Quick-Commerce & Hyperlocal Logistics Analytics Platform",
    description="Production-grade AI/ML system demonstrating all 15 Academic Data Science & Machine Learning Laboratory Experiments.",
    version="1.0.0"
)

# CORS Setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Sub-routers under /api
app.include_router(eda_router, prefix="/api")
app.include_router(preprocessing_router, prefix="/api")
app.include_router(regression_router, prefix="/api")
app.include_router(classification_router, prefix="/api")
app.include_router(clustering_router, prefix="/api")
app.include_router(simulator_router, prefix="/api")

@app.get("/", summary="Platform Root")
async def root():
    return {
        "platform": "BlinkRoute IQ",
        "description": "Enterprise Quick-Commerce Delivery Turnaround & SLA Risk Analytics Engine",
        "docs_url": "/docs",
        "status": "online"
    }

@app.get("/api/health", response_model=HealthResponse, summary="System Health & Dark Store Status")
async def health_check():
    df = engine.get_clean_dataframe()
    raw_df = engine.get_raw_dataframe()
    
    total_orders = len(df)
    breach_rate = round(float(df["sla_breached"].mean() * 100), 2)
    mean_eta = round(float(df["total_delivery_time"].mean()), 2)
    stores = sorted(list(df["dark_store_id"].unique()))
    
    summaries = []
    for store in stores:
        sub = df[df["dark_store_id"] == store]
        summaries.append({
            "dark_store_id": store,
            "total_orders": len(sub),
            "avg_delivery_time": round(float(sub["total_delivery_time"].mean()), 2),
            "breach_rate_pct": round(float(sub["sla_breached"].mean() * 100), 2)
        })

    return {
        "status": "healthy",
        "dataset_loaded": True,
        "total_orders": total_orders,
        "sla_breach_rate_pct": breach_rate,
        "mean_delivery_time_min": mean_eta,
        "active_dark_stores": stores,
        "columns": list(raw_df.columns),
        "dark_store_summaries": summaries
    }

@app.get("/api/orders", summary="Real Quick-Commerce Orders Stream")
async def get_orders(limit: int = 50, store: Optional[str] = None):
    df = engine.get_raw_dataframe()
    if store and store != "All":
        df = df[df["dark_store_id"] == store]
    sample = df.head(limit).fillna({
        "vehicle_type": "EV_2W",
        "traffic_density": "Medium",
        "weather_condition": "Clear",
        "customer_floor": 0,
        "elevator_available": 1
    })
    return sample.to_dict(orient="records")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
