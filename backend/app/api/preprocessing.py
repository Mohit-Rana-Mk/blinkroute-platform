from fastapi import APIRouter, HTTPException
from app.schemas.payload import PreprocessingResponse
from app.core.pipeline import engine

router = APIRouter(prefix="/analytics", tags=["Preprocessing"])

@router.post("/preprocessing", response_model=PreprocessingResponse, summary="Exp 3, 4: Missing Data, IQR Outliers, Scaling & One-Hot Encoding")
@router.get("/preprocessing", response_model=PreprocessingResponse)
async def get_preprocessing_pipeline():
    try:
        data = engine.compute_preprocessing()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preprocessing calculation failed: {str(e)}")
