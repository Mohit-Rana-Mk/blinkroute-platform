export interface DarkStoreSummary {
  dark_store_id: string;
  total_orders: number;
  avg_delivery_time: number;
  breach_rate_pct: number;
}

export interface OrderRecord {
  order_id: string;
  dark_store_id: string;
  distance_km: number;
  item_count: number;
  order_weight_kg: number;
  order_value_inr?: number;
  picker_prep_time_min: number;
  customer_floor: number;
  elevator_available: number;
  vehicle_type: string;
  traffic_density: string;
  weather_condition: string;
  total_delivery_time: number;
  sla_breached: number;
}

export interface HealthResponse {
  status: string;
  dataset_loaded: boolean;
  total_orders: number;
  sla_breach_rate_pct: number;
  mean_delivery_time_min: number;
  active_dark_stores: string[];
  columns: string[];
  dark_store_summaries: DarkStoreSummary[];
}

export interface FeatureStats {
  feature: string;
  expected_value: number;
  mean: number;
  variance: number;
  std_dev: number;
  min: number;
  max: number;
  median: number;
}

export interface PythonCoreStructureExp {
  title: string;
  description: string;
  tuple_sample: [string, string, number, number][];
  dict_comprehension_stats: Record<string, {
    orders_count: number;
    avg_delivery_time: number;
    breach_rate: number;
  }>;
  list_comprehension_filter_count: number;
}

export interface EDAResponse {
  total_records: number;
  features: string[];
  feature_stats: FeatureStats[];
  covariance_matrix: number[][];
  correlation_matrix: number[][];
  matrix_labels: string[];
  exp1_data_structures: PythonCoreStructureExp;
  schema_info: {
    columns: string[];
    dtypes: Record<string, string>;
    memory_usage_kb: number;
    total_rows: number;
    total_columns: number;
  };
}

export interface MissingDataReport {
  column: string;
  missing_count: number;
  missing_pct: number;
  data_type: string;
  imputation_strategy: string;
}

export interface IQROutlierReport {
  feature: string;
  q1: number;
  q3: number;
  iqr: number;
  lower_bound: number;
  upper_bound: number;
  outlier_count: number;
  outlier_pct: number;
  min_val: number;
  max_val: number;
  median_val: number;
  sample_outliers: number[];
}

export interface ScalingReport {
  feature: string;
  raw_mean: number;
  raw_std: number;
  scaled_mean: number;
  scaled_std: number;
}

export interface PreprocessingResponse {
  missing_data_report: MissingDataReport[];
  iqr_outliers: IQROutlierReport[];
  scaling_metrics: ScalingReport[];
  one_hot_columns: string[];
  train_samples: number;
  test_samples: number;
  total_features_after_encoding: number;
}

export interface RegressionPredictionSample {
  order_id: string;
  distance_km: number;
  actual_time: number;
  predicted_time: number;
  residual: number;
}

export interface RegressionCoefficients {
  feature: string;
  coefficient: number;
  interpretation: string;
}

export interface SimpleRegressionResult {
  intercept: number;
  slope: number;
  r2_score: number;
  rmse: number;
  mae: number;
  equation: string;
}

export interface MultipleRegressionResult {
  intercept: number;
  coefficients: RegressionCoefficients[];
  r2_score: number;
  rmse: number;
  mae: number;
  equation: string;
  prediction_samples: RegressionPredictionSample[];
}

export interface RegressionResponse {
  simple_regression: SimpleRegressionResult;
  multiple_regression: MultipleRegressionResult;
}

export interface ModelLeaderboardItem {
  model_id: string;
  model_name: string;
  experiment_tag: string;
  algorithm_category: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][]; // [[TN, FP], [FN, TP]]
  latency_ms: number;
  hyperparameters: Record<string, any>;
}

export interface SigmoidCurvePoint {
  z: number;
  sigmoid: number;
}

export interface SigmoidSampleItem {
  order_id: string;
  z_score: number;
  probability: number;
  actual_breached: number;
}

export interface SigmoidInteractiveData {
  formula: string;
  intercept: number;
  coefficients: Record<string, number>;
  curve_points: SigmoidCurvePoint[];
  sample_evaluations: SigmoidSampleItem[];
}

export interface ClassificationResponse {
  leaderboard: ModelLeaderboardItem[];
  sigmoid_analysis: SigmoidInteractiveData;
  test_set_size: number;
}

export interface PCALoading {
  feature: string;
  pc1_loading: number;
  pc2_loading: number;
}

export interface ProjectedPoint {
  order_id: string;
  dark_store_id: string;
  pc1: number;
  pc2: number;
  kmeans_cluster: number;
  hierarchical_cluster: number;
  cluster_name: string;
  delivery_time: number;
  sla_breached: number;
}

export interface ClusterProfile {
  cluster_id: number;
  cluster_name: string;
  description: string;
  sample_count: number;
  avg_distance_km: number;
  avg_order_weight_kg: number;
  avg_customer_floor: number;
  avg_delivery_time: number;
  breach_rate_pct: number;
}

export interface ClusteringPCAResponse {
  explained_variance_ratio: number[];
  total_explained_variance: number;
  pca_loadings: PCALoading[];
  cluster_profiles: ClusterProfile[];
  projected_points: ProjectedPoint[];
}

export interface DispatchPredictRequest {
  distance_km: number;
  item_count: number;
  order_weight_kg: number;
  picker_prep_time_min: number;
  customer_floor: number;
  elevator_available: number;
  vehicle_type: string;
  traffic_density: string;
  weather_condition: string;
}

export interface DelayBreakdown {
  picker_prep_time: number;
  transit_time: number;
  vertical_stair_delay: number;
  handover_delay: number;
  traffic_weather_penalty: number;
}

export interface DispatchPredictResponse {
  predicted_eta_minutes: number;
  sla_breach_probability: number;
  sla_breach_percentage: number;
  sigmoid_z_score: number;
  operational_status: "ON_TIME_SAFE" | "AT_RISK" | "CRITICAL_BREACH";
  status_color: string;
  breakdown: DelayBreakdown;
  recommendations: string[];
}
