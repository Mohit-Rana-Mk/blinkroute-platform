from fastapi import APIRouter, HTTPException
from app.schemas.payload import RegressionResponse
from app.core.pipeline import engine

router = APIRouter(prefix="/models", tags=["Regression"])

@router.post("/regression", response_model=RegressionResponse, summary="Exp 5, 6: Simple & Multiple Linear Regression")
@router.get("/regression", response_model=RegressionResponse)
async def get_regression_models():
    try:
        data = engine.compute_regression()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regression modeling failed: {str(e)}")
