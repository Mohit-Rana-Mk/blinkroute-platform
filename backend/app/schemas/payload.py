from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# ==========================================
# 1. Health & Dataset Preview Schemas
# ==========================================
class DarkStoreSummary(BaseModel):
    dark_store_id: str
    total_orders: int
    avg_delivery_time: float
    breach_rate_pct: float

class HealthResponse(BaseModel):
    status: str
    dataset_loaded: bool
    total_orders: int
    sla_breach_rate_pct: float
    mean_delivery_time_min: float
    active_dark_stores: List[str]
    columns: List[str]
    dark_store_summaries: List[DarkStoreSummary]

# ==========================================
# 2. EDA Schemas (Exp 1, 2, 15)
# ==========================================
class FeatureStats(BaseModel):
    feature: str
    expected_value: float
    mean: float
    variance: float
    std_dev: float
    min: float
    max: float
    median: float

class PythonCoreStructureExp(BaseModel):
    title: str
    description: str
    tuple_sample: List[Any]
    dict_comprehension_stats: Dict[str, Any]
    list_comprehension_filter_count: int

class EDAResponse(BaseModel):
    total_records: int
    features: List[str]
    feature_stats: List[FeatureStats]
    covariance_matrix: List[List[float]]
    correlation_matrix: List[List[float]]
    matrix_labels: List[str]
    exp1_data_structures: PythonCoreStructureExp
    schema_info: Dict[str, Any]

# ==========================================
# 3. Preprocessing Schemas (Exp 3, 4)
# ==========================================
class MissingDataReport(BaseModel):
    column: str
    missing_count: int
    missing_pct: float
    data_type: str
    imputation_strategy: str

class IQROutlierReport(BaseModel):
    feature: str
    q1: float
    q3: float
    iqr: float
    lower_bound: float
    upper_bound: float
    outlier_count: int
    outlier_pct: float
    min_val: float
    max_val: float
    median_val: float
    sample_outliers: List[float]

class ScalingReport(BaseModel):
    feature: str
    raw_mean: float
    raw_std: float
    scaled_mean: float
    scaled_std: float

class PreprocessingResponse(BaseModel):
    missing_data_report: List[MissingDataReport]
    iqr_outliers: List[IQROutlierReport]
    scaling_metrics: List[ScalingReport]
    one_hot_columns: List[str]
    train_samples: int
    test_samples: int
    total_features_after_encoding: int

# ==========================================
# 4. Regression Schemas (Exp 5, 6)
# ==========================================
class RegressionPredictionSample(BaseModel):
    order_id: str
    distance_km: float
    actual_time: float
    predicted_time: float
    residual: float

class RegressionCoefficients(BaseModel):
    feature: str
    coefficient: float
    interpretation: str

class SimpleRegressionResult(BaseModel):
    intercept: float
    slope: float
    r2_score: float
    rmse: float
    mae: float
    equation: str

class MultipleRegressionResult(BaseModel):
    intercept: float
    coefficients: List[RegressionCoefficients]
    r2_score: float
    rmse: float
    mae: float
    equation: str
    prediction_samples: List[RegressionPredictionSample]

class RegressionResponse(BaseModel):
    simple_regression: SimpleRegressionResult
    multiple_regression: MultipleRegressionResult

# ==========================================
# 5. Classification Schemas (Exp 7, 8, 10, 11, 12, 13)
# ==========================================
class ModelLeaderboardItem(BaseModel):
    model_id: str
    model_name: str
    experiment_tag: str
    algorithm_category: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]  # [[TN, FP], [FN, TP]]
    latency_ms: float
    hyperparameters: Dict[str, Any]

class SigmoidCurvePoint(BaseModel):
    z: float
    sigmoid: float

class SigmoidSampleItem(BaseModel):
    order_id: str
    z_score: float
    probability: float
    actual_breached: int

class SigmoidInteractiveData(BaseModel):
    formula: str
    intercept: float
    coefficients: Dict[str, float]
    curve_points: List[SigmoidCurvePoint]
    sample_evaluations: List[SigmoidSampleItem]

class ClassificationResponse(BaseModel):
    leaderboard: List[ModelLeaderboardItem]
    sigmoid_analysis: SigmoidInteractiveData
    test_set_size: int

# ==========================================
# 6. Clustering & PCA Schemas (Exp 9, 14)
# ==========================================
class PCALoading(BaseModel):
    feature: str
    pc1_loading: float
    pc2_loading: float

class ProjectedPoint(BaseModel):
    order_id: str
    dark_store_id: str
    pc1: float
    pc2: float
    kmeans_cluster: int
    hierarchical_cluster: int
    cluster_name: str
    delivery_time: float
    sla_breached: int

class ClusterProfile(BaseModel):
    cluster_id: int
    cluster_name: str
    description: str
    sample_count: int
    avg_distance_km: float
    avg_order_weight_kg: float
    avg_customer_floor: float
    avg_delivery_time: float
    breach_rate_pct: float

class ClusteringPCAResponse(BaseModel):
    explained_variance_ratio: List[float]
    total_explained_variance: float
    pca_loadings: List[PCALoading]
    cluster_profiles: List[ClusterProfile]
    projected_points: List[ProjectedPoint]

# ==========================================
# 7. Real-Time Dispatch Simulator Schemas
# ==========================================
class DispatchPredictRequest(BaseModel):
    distance_km: float = Field(..., ge=0.1, le=10.0, description="Delivery distance in km")
    item_count: int = Field(..., ge=1, le=30, description="Number of items in the order")
    order_weight_kg: float = Field(..., ge=0.1, le=25.0, description="Order weight in kg")
    picker_prep_time_min: float = Field(..., ge=0.5, le=15.0, description="Warehouse picker prep time in min")
    customer_floor: int = Field(..., ge=0, le=30, description="Customer building floor")
    elevator_available: int = Field(..., ge=0, le=1, description="1 if elevator works, 0 otherwise")
    vehicle_type: str = Field(..., description="EV_2W, Petrol_Bike, Bicycle, E_Cart")
    traffic_density: str = Field(..., description="Low, Medium, High, Jam")
    weather_condition: str = Field(..., description="Clear, Rain, Fog, Storm")

class DelayBreakdown(BaseModel):
    picker_prep_time: float
    transit_time: float
    vertical_stair_delay: float
    handover_delay: float
    traffic_weather_penalty: float

class DispatchPredictResponse(BaseModel):
    predicted_eta_minutes: float
    sla_breach_probability: float
    sla_breach_percentage: float
    sigmoid_z_score: float
    operational_status: str  # ON_TIME_SAFE, AT_RISK, CRITICAL_BREACH
    status_color: str
    breakdown: DelayBreakdown
    recommendations: List[str]
