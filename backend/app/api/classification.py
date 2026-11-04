from fastapi import APIRouter, HTTPException
from app.schemas.payload import ClassificationResponse
from app.core.pipeline import engine

router = APIRouter(prefix="/models", tags=["Classification Tournament"])

@router.post("/classification-tournament", response_model=ClassificationResponse, summary="Exp 7, 8, 10, 11, 12, 13: 6 Classifiers, SVM Kernels & Sigmoid Curve")
@router.get("/classification-tournament", response_model=ClassificationResponse)
async def get_classification_tournament():
    try:
        data = engine.compute_classification_tournament()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification tournament failed: {str(e)}")
