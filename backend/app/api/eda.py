from fastapi import APIRouter, HTTPException
from app.schemas.payload import EDAResponse
from app.core.pipeline import engine

router = APIRouter(prefix="/analytics", tags=["EDA & Statistics"])

@router.post("/eda", response_model=EDAResponse, summary="Exp 1, 2, 15: Statistical Profiling, Covariance & Python Structures")
@router.get("/eda", response_model=EDAResponse)
async def get_eda_profile():
    try:
        data = engine.compute_eda()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EDA calculation failed: {str(e)}")
