from fastapi import APIRouter, HTTPException
from app.schemas.payload import ClusteringPCAResponse
from app.core.pipeline import engine

router = APIRouter(prefix="/analytics", tags=["Clustering & PCA"])

@router.post("/clustering-pca", response_model=ClusteringPCAResponse, summary="Exp 9, 14: K-Means, Hierarchical Clustering & PCA 2D")
@router.get("/clustering-pca", response_model=ClusteringPCAResponse)
async def get_clustering_and_pca():
    try:
        data = engine.compute_clustering_and_pca()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering & PCA analysis failed: {str(e)}")
