import {
  HealthResponse,
  EDAResponse,
  PreprocessingResponse,
  RegressionResponse,
  ClassificationResponse,
  ClusteringPCAResponse
} from "../types";

export const MOCK_HEALTH: HealthResponse = {
  status: "healthy",
  dataset_loaded: true,
  total_orders: 5000,
  sla_breach_rate_pct: 31.54,
  mean_delivery_time_min: 13.65,
  active_dark_stores: [
    "DS-WHITEFIELD",
    "DS-JAYANAGAR",
    "DS-HSR-LAYOUT",
    "DS-INDIRANAGAR",
    "DS-KORAMANGALA"
  ],
  columns: [
    "order_id",
    "dark_store_id",
    "distance_km",
    "item_count",
    "order_weight_kg",
    "order_value_inr",
    "picker_prep_time_min",
    "customer_floor",
    "elevator_available",
    "vehicle_type",
    "traffic_density",
    "weather_condition",
    "time_slot",
    "total_delivery_time",
    "sla_breached"
  ],
  dark_store_summaries: [
    { dark_store_id: "DS-WHITEFIELD", total_orders: 1042, avg_delivery_time: 14.1, breach_rate_pct: 33.8 },
    { dark_store_id: "DS-JAYANAGAR", total_orders: 988, avg_delivery_time: 12.9, breach_rate_pct: 27.4 },
    { dark_store_id: "DS-HSR-LAYOUT", total_orders: 1012, avg_delivery_time: 13.4, breach_rate_pct: 30.2 },
    { dark_store_id: "DS-INDIRANAGAR", total_orders: 975, avg_delivery_time: 13.8, breach_rate_pct: 32.1 },
    { dark_store_id: "DS-KORAMANGALA", total_orders: 983, avg_delivery_time: 14.0, breach_rate_pct: 34.3 },
  ]
};

export const MOCK_EDA: EDAResponse = {
  total_records: 5000,
  features: ["distance_km", "item_count", "order_weight_kg", "picker_prep_time_min", "customer_floor", "total_delivery_time"],
  feature_stats: [
    { feature: "distance_km", expected_value: 2.14, mean: 2.14, variance: 1.12, std_dev: 1.06, min: 0.2, max: 5.8, median: 2.05 },
    { feature: "item_count", expected_value: 4.82, mean: 4.82, variance: 6.45, std_dev: 2.54, min: 1, max: 15, median: 4.0 },
    { feature: "order_weight_kg", expected_value: 3.42, mean: 3.42, variance: 4.28, std_dev: 2.07, min: 0.2, max: 12.5, median: 3.1 },
    { feature: "picker_prep_time_min", expected_value: 2.85, mean: 2.85, variance: 1.05, std_dev: 1.02, min: 0.8, max: 6.5, median: 2.7 },
    { feature: "customer_floor", expected_value: 3.12, mean: 3.12, variance: 6.18, std_dev: 2.49, min: 0, max: 14, median: 3.0 },
    { feature: "total_delivery_time", expected_value: 13.65, mean: 13.65, variance: 14.32, std_dev: 3.78, min: 5.2, max: 27.8, median: 13.4 },
  ],
  matrix_labels: ["Dist", "Items", "Weight", "Prep", "Floor", "ETA"],
  covariance_matrix: [
    [1.12, 0.34, 0.41, 0.08, 0.05, 3.25],
    [0.34, 6.45, 3.82, 0.95, 0.12, 2.18],
    [0.41, 3.82, 4.28, 0.72, 0.15, 2.45],
    [0.08, 0.95, 0.72, 1.05, 0.02, 1.84],
    [0.05, 0.12, 0.15, 0.02, 6.18, 1.42],
    [3.25, 2.18, 2.45, 1.84, 1.42, 14.32]
  ],
  correlation_matrix: [
    [1.00, 0.13, 0.19, 0.07, 0.02, 0.81],
    [0.13, 1.00, 0.73, 0.36, 0.02, 0.23],
    [0.19, 0.73, 1.00, 0.34, 0.03, 0.31],
    [0.07, 0.36, 0.34, 1.00, 0.01, 0.47],
    [0.02, 0.02, 0.03, 0.01, 1.00, 0.15],
    [0.81, 0.23, 0.31, 0.47, 0.15, 1.00]
  ],
  exp1_data_structures: {
    title: "Python Tuples & In-Memory Comprehensions",
    description: "Evaluated over 5,000 quick-commerce records using list and dictionary comprehensions.",
    tuple_sample: [
      ["ORD-9401", "DarkStore_Central", 1.8, 12.4],
      ["ORD-9402", "DarkStore_Indiranagar", 3.2, 16.8],
      ["ORD-9403", "DarkStore_Koramangala", 0.9, 9.5],
      ["ORD-9404", "DarkStore_Whitefield", 4.1, 18.2],
      ["ORD-9405", "DarkStore_HSR", 2.3, 13.9]
    ],
    dict_comprehension_stats: {
      "DarkStore_Central": { orders_count: 1120, avg_delivery_time: 14.2, breach_rate: 34.2 },
      "DarkStore_Indiranagar": { orders_count: 980, avg_delivery_time: 12.8, breach_rate: 28.5 },
      "DarkStore_Koramangala": { orders_count: 1045, avg_delivery_time: 13.5, breach_rate: 30.8 },
      "DarkStore_Whitefield": { orders_count: 915, avg_delivery_time: 14.6, breach_rate: 36.1 },
      "DarkStore_HSR": { orders_count: 940, avg_delivery_time: 13.1, breach_rate: 27.9 }
    },
    list_comprehension_filter_count: 1577
  },
  schema_info: {
    columns: ["order_id", "dark_store_id", "distance_km", "item_count", "order_weight_kg", "picker_prep_time_min", "customer_floor", "elevator_available", "vehicle_type", "traffic_density", "weather_condition", "total_delivery_time", "sla_breached"],
    dtypes: {
      order_id: "object",
      dark_store_id: "object",
      distance_km: "float64",
      item_count: "int64",
      order_weight_kg: "float64",
      picker_prep_time_min: "float64",
      customer_floor: "int64",
      elevator_available: "int64",
      vehicle_type: "object",
      traffic_density: "object",
      weather_condition: "object",
      total_delivery_time: "float64",
      sla_breached: "int64"
    },
    memory_usage_kb: 508.4,
    total_rows: 5000,
    total_columns: 13
  }
};

export const MOCK_PREPROCESSING: PreprocessingResponse = {
  missing_data_report: [
    { column: "customer_floor", missing_count: 112, missing_pct: 2.24, data_type: "int64", imputation_strategy: "Median (floor 3)" },
    { column: "elevator_available", missing_count: 85, missing_pct: 1.70, data_type: "int64", imputation_strategy: "Mode (1 - Available)" },
    { column: "weather_condition", missing_count: 64, missing_pct: 1.28, data_type: "object", imputation_strategy: "Mode (Clear)" },
    { column: "picker_prep_time_min", missing_count: 42, missing_pct: 0.84, data_type: "float64", imputation_strategy: "Median (2.70 min)" },
  ],
  iqr_outliers: [
    {
      feature: "total_delivery_time",
      q1: 10.9,
      q3: 16.2,
      iqr: 5.3,
      lower_bound: 2.95,
      upper_bound: 24.15,
      outlier_count: 48,
      outlier_pct: 0.96,
      min_val: 5.2,
      max_val: 27.8,
      median_val: 13.4,
      sample_outliers: [25.4, 26.1, 27.8, 24.9, 25.0]
    },
    {
      feature: "distance_km",
      q1: 1.35,
      q3: 2.85,
      iqr: 1.50,
      lower_bound: 0.0,
      upper_bound: 5.10,
      outlier_count: 31,
      outlier_pct: 0.62,
      min_val: 0.2,
      max_val: 5.8,
      median_val: 2.05,
      sample_outliers: [5.2, 5.4, 5.8, 5.3, 5.6]
    }
  ],
  scaling_metrics: [
    { feature: "distance_km", raw_mean: 2.14, raw_std: 1.06, scaled_mean: 0.0, scaled_std: 1.0 },
    { feature: "item_count", raw_mean: 4.82, raw_std: 2.54, scaled_mean: 0.0, scaled_std: 1.0 },
    { feature: "order_weight_kg", raw_mean: 3.42, raw_std: 2.07, scaled_mean: 0.0, scaled_std: 1.0 },
    { feature: "picker_prep_time_min", raw_mean: 2.85, raw_std: 1.02, scaled_mean: 0.0, scaled_std: 1.0 }
  ],
  one_hot_columns: [
    "vehicle_type_EV_2W",
    "vehicle_type_Petrol_Bike",
    "vehicle_type_Cycle",
    "traffic_density_Low",
    "traffic_density_Medium",
    "traffic_density_Jam",
    "weather_condition_Clear",
    "weather_condition_Rain",
    "weather_condition_Storm"
  ],
  train_samples: 4000,
  test_samples: 1000,
  total_features_after_encoding: 18
};

export const MOCK_REGRESSION: RegressionResponse = {
  simple_regression: {
    intercept: 7.42,
    slope: 2.91,
    r2_score: 0.658,
    rmse: 2.21,
    mae: 1.74,
    equation: "Turnaround = 7.42 + 2.91 * distance_km"
  },
  multiple_regression: {
    intercept: 4.18,
    r2_score: 0.842,
    rmse: 1.50,
    mae: 1.18,
    equation: "Turnaround = 4.18 + 2.65*distance + 0.98*prep + 0.42*floor",
    coefficients: [
      { feature: "distance_km", coefficient: 2.65, interpretation: "+2.65 min per additional kilometer traveled" },
      { feature: "picker_prep_time_min", coefficient: 0.98, interpretation: "+0.98 min per minute of warehouse picker delay" },
      { feature: "customer_floor", coefficient: 0.42, interpretation: "+0.42 min added for staircase / elevator vertical transit" },
      { feature: "traffic_density_Jam", coefficient: 3.12, interpretation: "+3.12 min penalty during peak gridlock traffic" },
      { feature: "weather_condition_Rain", coefficient: 2.05, interpretation: "+2.05 min added for slick roads and rider safety" },
      { feature: "order_weight_kg", coefficient: 0.18, interpretation: "+0.18 min per additional kilogram of load" }
    ],
    prediction_samples: [
      { order_id: "ORD-101", distance_km: 1.2, actual_time: 10.4, predicted_time: 10.1, residual: 0.3 },
      { order_id: "ORD-102", distance_km: 2.5, actual_time: 14.8, predicted_time: 14.2, residual: 0.6 },
      { order_id: "ORD-103", distance_km: 3.8, actual_time: 18.2, predicted_time: 17.9, residual: 0.3 },
      { order_id: "ORD-104", distance_km: 0.9, actual_time: 9.1, predicted_time: 9.4, residual: -0.3 },
      { order_id: "ORD-105", distance_km: 2.1, actual_time: 13.5, predicted_time: 13.3, residual: 0.2 },
      { order_id: "ORD-106", distance_km: 4.4, actual_time: 21.0, predicted_time: 20.4, residual: 0.6 },
      { order_id: "ORD-107", distance_km: 1.6, actual_time: 11.8, predicted_time: 12.0, residual: -0.2 },
      { order_id: "ORD-108", distance_km: 3.1, actual_time: 16.4, predicted_time: 16.0, residual: 0.4 },
      { order_id: "ORD-109", distance_km: 2.8, actual_time: 15.2, predicted_time: 15.5, residual: -0.3 },
      { order_id: "ORD-110", distance_km: 1.9, actual_time: 12.9, predicted_time: 12.7, residual: 0.2 }
    ]
  }
};

export const MOCK_CLASSIFICATION: ClassificationResponse = {
  leaderboard: [
    {
      model_id: "random_forest",
      model_name: "Random Forest (50 Trees)",
      experiment_tag: "EXP-12",
      algorithm_category: "Ensemble Bagging",
      accuracy: 0.942,
      precision: 0.915,
      recall: 0.902,
      f1_score: 0.908,
      latency_ms: 124.5,
      hyperparameters: { n_estimators: 50, criterion: "gini" },
      confusion_matrix: [[658, 26], [32, 284]]
    },
    {
      model_id: "id3_tree",
      model_name: "ID3 Decision Tree (Entropy)",
      experiment_tag: "EXP-08",
      algorithm_category: "Decision Tree",
      accuracy: 0.918,
      precision: 0.865,
      recall: 0.879,
      f1_score: 0.872,
      latency_ms: 22.1,
      hyperparameters: { criterion: "entropy" },
      confusion_matrix: [[641, 43], [39, 277]]
    },
    {
      model_id: "svm_rbf",
      model_name: "SVM (RBF Kernel)",
      experiment_tag: "EXP-13",
      algorithm_category: "Support Vector Machine",
      accuracy: 0.926,
      precision: 0.887,
      recall: 0.873,
      f1_score: 0.880,
      latency_ms: 215.3,
      hyperparameters: { kernel: "rbf", C: 1.0 },
      confusion_matrix: [[651, 35], [39, 275]]
    },
    {
      model_id: "logistic_regression",
      model_name: "Logistic Regression (Sigmoid)",
      experiment_tag: "EXP-07",
      algorithm_category: "Linear Probabilistic",
      accuracy: 0.895,
      precision: 0.835,
      recall: 0.838,
      f1_score: 0.836,
      latency_ms: 14.8,
      hyperparameters: { penalty: "l2", C: 1.0 },
      confusion_matrix: [[631, 52], [53, 264]]
    },
    {
      model_id: "knn",
      model_name: "K-Nearest Neighbors (k=5)",
      experiment_tag: "EXP-10",
      algorithm_category: "Instance-Based",
      accuracy: 0.884,
      precision: 0.812,
      recall: 0.825,
      f1_score: 0.818,
      latency_ms: 8.4,
      hyperparameters: { n_neighbors: 5, metric: "minkowski" },
      confusion_matrix: [[624, 60], [56, 260]]
    },
    {
      model_id: "gaussian_nb",
      model_name: "Gaussian Naive Bayes",
      experiment_tag: "EXP-11",
      algorithm_category: "Bayesian",
      accuracy: 0.871,
      precision: 0.785,
      recall: 0.829,
      f1_score: 0.806,
      latency_ms: 6.2,
      hyperparameters: { var_smoothing: 1e-9 },
      confusion_matrix: [[610, 71], [58, 261]]
    },
    {
      model_id: "svm_poly",
      model_name: "SVM (Polynomial d=3)",
      experiment_tag: "EXP-13",
      algorithm_category: "Support Vector Machine",
      accuracy: 0.908,
      precision: 0.854,
      recall: 0.854,
      f1_score: 0.854,
      latency_ms: 184.2,
      hyperparameters: { kernel: "poly", degree: 3 },
      confusion_matrix: [[639, 46], [46, 269]]
    },
    {
      model_id: "svm_linear",
      model_name: "SVM (Linear Kernel)",
      experiment_tag: "EXP-13",
      algorithm_category: "Support Vector Machine",
      accuracy: 0.892,
      precision: 0.829,
      recall: 0.835,
      f1_score: 0.832,
      latency_ms: 95.6,
      hyperparameters: { kernel: "linear" },
      confusion_matrix: [[629, 54], [54, 263]]
    }
  ],
  sigmoid_analysis: {
    formula: "S(z) = 1 / (1 + e^-z)",
    intercept: -2.14,
    coefficients: { distance_km: 1.42, picker_prep: 0.65 },
    curve_points: Array.from({ length: 41 }, (_, i) => {
      const z = Number((-4 + i * 0.2).toFixed(1));
      return { z, sigmoid: Number((1 / (1 + Math.exp(-z))).toFixed(4)) };
    }),
    sample_evaluations: [
      { order_id: "ORD-901", z_score: -1.8, probability: 0.14, actual_breached: 0 },
      { order_id: "ORD-902", z_score: 1.5, probability: 0.82, actual_breached: 1 },
      { order_id: "ORD-903", z_score: 0.2, probability: 0.55, actual_breached: 1 },
      { order_id: "ORD-904", z_score: -0.6, probability: 0.35, actual_breached: 0 },
      { order_id: "ORD-905", z_score: 2.4, probability: 0.92, actual_breached: 1 }
    ]
  },
  test_set_size: 1000
};

export const MOCK_CLUSTERING_PCA: ClusteringPCAResponse = {
  explained_variance_ratio: [0.482, 0.246],
  total_explained_variance: 0.728,
  pca_loadings: [
    { feature: "distance_km", pc1_loading: 0.582, pc2_loading: -0.142 },
    { feature: "item_count", pc1_loading: 0.421, pc2_loading: 0.612 },
    { feature: "order_weight_kg", pc1_loading: 0.465, pc2_loading: 0.584 },
    { feature: "picker_prep_time_min", pc1_loading: 0.384, pc2_loading: -0.215 },
    { feature: "customer_floor", pc1_loading: 0.354, pc2_loading: -0.478 }
  ],
  cluster_profiles: [
    {
      cluster_id: 0,
      cluster_name: "Hyperlocal Quick Sprint (<1km)",
      description: "Low distance orders delivered under 10 minutes",
      sample_count: 2150,
      avg_distance_km: 0.95,
      avg_order_weight_kg: 2.8,
      avg_customer_floor: 1.2,
      avg_delivery_time: 9.4,
      breach_rate_pct: 6.2
    },
    {
      cluster_id: 1,
      cluster_name: "High-Rise Staircase Bottlenecks",
      description: "Mid-distance vertical climb orders with elevator delays",
      sample_count: 1620,
      avg_distance_km: 2.45,
      avg_order_weight_kg: 5.2,
      avg_customer_floor: 5.8,
      avg_delivery_time: 15.8,
      breach_rate_pct: 44.8
    },
    {
      cluster_id: 2,
      cluster_name: "Heavy Bulk Grocery Suburb Transit",
      description: "Long range heavy basket orders with high traffic friction",
      sample_count: 1230,
      avg_distance_km: 3.85,
      avg_order_weight_kg: 8.9,
      avg_customer_floor: 2.1,
      avg_delivery_time: 18.2,
      breach_rate_pct: 61.5
    }
  ],
  projected_points: Array.from({ length: 120 }, (_, i) => {
    const cluster = i % 3;
    const baseOffset = cluster === 0 ? [-2.2, -1.2] : cluster === 1 ? [0.4, 1.8] : [2.5, -0.6];
    const pc1 = baseOffset[0] + (Math.sin(i * 1.5) * 1.4);
    const pc2 = baseOffset[1] + (Math.cos(i * 1.7) * 1.2);
    return {
      order_id: `ORD-${9100 + i}`,
      dark_store_id: "DarkStore_Central",
      pc1: Number(pc1.toFixed(2)),
      pc2: Number(pc2.toFixed(2)),
      kmeans_cluster: cluster,
      hierarchical_cluster: cluster,
      cluster_name: cluster === 0 ? "Hyperlocal" : cluster === 1 ? "Staircase" : "Bulk",
      delivery_time: Number((10 + cluster * 4 + Math.sin(i) * 3).toFixed(1)),
      sla_breached: cluster === 2 ? (i % 4 !== 0 ? 1 : 0) : cluster === 1 ? (i % 2 === 0 ? 1 : 0) : (i % 8 === 0 ? 1 : 0)
    };
  })
};
