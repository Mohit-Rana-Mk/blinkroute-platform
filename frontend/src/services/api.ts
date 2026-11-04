import {
  HealthResponse,
  EDAResponse,
  PreprocessingResponse,
  RegressionResponse,
  ClassificationResponse,
  ClusteringPCAResponse,
  DispatchPredictRequest,
  DispatchPredictResponse,
  OrderRecord,
} from "../types";
import {
  MOCK_HEALTH,
  MOCK_EDA,
  MOCK_PREPROCESSING,
  MOCK_REGRESSION,
  MOCK_CLASSIFICATION,
  MOCK_CLUSTERING_PCA
} from "./mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function fetchJsonWithFallback<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (fallback) return fallback;
      throw new Error(`API Error [${res.status}]`);
    }

    return await res.json();
  } catch (err: any) {
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

export const apiService = {
  getHealth: (): Promise<HealthResponse> => 
    fetchJsonWithFallback<HealthResponse>("/api/health", undefined, MOCK_HEALTH),
  
  getEDA: (): Promise<EDAResponse> => 
    fetchJsonWithFallback<EDAResponse>("/api/analytics/eda", { method: "POST" }, MOCK_EDA),
    
  getPreprocessing: (): Promise<PreprocessingResponse> => 
    fetchJsonWithFallback<PreprocessingResponse>("/api/analytics/preprocessing", { method: "POST" }, MOCK_PREPROCESSING),
    
  getRegression: (): Promise<RegressionResponse> => 
    fetchJsonWithFallback<RegressionResponse>("/api/models/regression", { method: "POST" }, MOCK_REGRESSION),
    
  getClassificationTournament: (): Promise<ClassificationResponse> => 
    fetchJsonWithFallback<ClassificationResponse>("/api/models/classification-tournament", { method: "POST" }, MOCK_CLASSIFICATION),
    
  getClusteringPCA: (): Promise<ClusteringPCAResponse> => 
    fetchJsonWithFallback<ClusteringPCAResponse>("/api/analytics/clustering-pca", { method: "POST" }, MOCK_CLUSTERING_PCA),
    
  getOrders: (limit: number = 50, store?: string): Promise<OrderRecord[]> => 
    fetchJsonWithFallback<OrderRecord[]>(`/api/orders?limit=${limit}${store ? `&store=${encodeURIComponent(store)}` : ""}`, undefined, []),
    
  predictDispatch: async (payload: DispatchPredictRequest): Promise<DispatchPredictResponse> => {
    try {
      return await fetchJsonWithFallback<DispatchPredictResponse>("/api/dispatch/predict", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      // Local heuristic simulation fallback matching DispatchPredictResponse
      const transitEstimate = payload.distance_km * 2.8;
      const verticalDelay = payload.elevator_available ? payload.customer_floor * 0.2 : payload.customer_floor * 0.55;
      const trafficPenalty = payload.traffic_density === "Jam" ? 3.5 : payload.traffic_density === "Medium" ? 1.5 : 0.5;
      const weatherPenalty = payload.weather_condition === "Storm" ? 4.0 : payload.weather_condition === "Rain" ? 2.2 : 0;
      const totalTime = Number((transitEstimate + payload.picker_prep_time_min + verticalDelay + trafficPenalty + weatherPenalty + 3.0).toFixed(1));
      
      const breachProb = Math.min(0.99, Math.max(0.01, Number((1 / (1 + Math.exp(-(totalTime - 14.5) / 1.5))).toFixed(3))));
      const breachPct = Number((breachProb * 100).toFixed(1));
      const status = totalTime > 15.0 ? "CRITICAL_BREACH" : totalTime > 13.0 ? "AT_RISK" : "ON_TIME_SAFE";
      const color = status === "CRITICAL_BREACH" ? "#f43f5e" : status === "AT_RISK" ? "#f59e0b" : "#10b981";

      return {
        predicted_eta_minutes: totalTime,
        sla_breach_probability: breachProb,
        sla_breach_percentage: breachPct,
        sigmoid_z_score: Number(((totalTime - 14.5) / 1.5).toFixed(2)),
        operational_status: status,
        status_color: color,
        breakdown: {
          picker_prep_time: payload.picker_prep_time_min,
          transit_time: Number(transitEstimate.toFixed(1)),
          vertical_stair_delay: Number(verticalDelay.toFixed(1)),
          handover_delay: 2.0,
          traffic_weather_penalty: Number((trafficPenalty + weatherPenalty).toFixed(1))
        },
        recommendations: [
          totalTime > 15.0 ? "Assign high-priority EV runner" : "Standard dispatch pipeline optimal",
          payload.customer_floor > 5 && !payload.elevator_available ? "Vertical climb buffer added" : "Normal access detected"
        ]
      };
    }
  },
};
