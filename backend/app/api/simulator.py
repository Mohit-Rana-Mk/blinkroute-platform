from fastapi import APIRouter, HTTPException
from app.schemas.payload import DispatchPredictRequest, DispatchPredictResponse
from app.core.pipeline import engine

router = APIRouter(prefix="/dispatch", tags=["Live Simulator"])

@router.post("/predict", response_model=DispatchPredictResponse, summary="Live Quick-Commerce Order Fulfillment ETA & SLA Risk Predictor")
async def predict_dispatch_order(order: DispatchPredictRequest):
    try:
        prediction = engine.predict_dispatch(order.model_dump())
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
