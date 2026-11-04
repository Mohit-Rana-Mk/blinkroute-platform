"use client";

import React, { useState, useEffect } from "react";
import { DispatchPredictRequest, DispatchPredictResponse } from "../types";
import { apiService } from "../services/api";
import { 
  SlidersHorizontal, 
  Clock, 
  RotateCcw,
  CheckCircle,
  Activity
} from "lucide-react";

const PRESETS: Record<string, DispatchPredictRequest> = {
  sprint: {
    distance_km: 0.85,
    item_count: 2,
    order_weight_kg: 0.8,
    picker_prep_time_min: 1.4,
    customer_floor: 0,
    elevator_available: 1,
    vehicle_type: "EV_2W",
    traffic_density: "Low",
    weather_condition: "Clear",
  },
  monsoon: {
    distance_km: 3.4,
    item_count: 5,
    order_weight_kg: 3.2,
    picker_prep_time_min: 2.8,
    customer_floor: 3,
    elevator_available: 1,
    vehicle_type: "Petrol_Bike",
    traffic_density: "Jam",
    weather_condition: "Storm",
  },
  staircase: {
    distance_km: 1.9,
    item_count: 4,
    order_weight_kg: 4.5,
    picker_prep_time_min: 2.2,
    customer_floor: 8,
    elevator_available: 0,
    vehicle_type: "EV_2W",
    traffic_density: "Medium",
    weather_condition: "Clear",
  },
  bulk: {
    distance_km: 4.2,
    item_count: 14,
    order_weight_kg: 11.5,
    picker_prep_time_min: 4.8,
    customer_floor: 2,
    elevator_available: 1,
    vehicle_type: "Petrol_Bike",
    traffic_density: "High",
    weather_condition: "Rain",
  },
};

export default function DispatchConsole() {
  const [params, setParams] = useState<DispatchPredictRequest>(PRESETS.sprint);
  const [prediction, setPrediction] = useState<DispatchPredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>("sprint");

  const runPrediction = async (inputParams: DispatchPredictRequest) => {
    setLoading(true);
    try {
      const res = await apiService.predictDispatch(inputParams);
      setPrediction(res);
    } catch (err) {
      console.error("Live dispatch telemetry error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction(params);
  }, [params]);

  const handlePreset = (key: string) => {
    setActivePreset(key);
    setParams(PRESETS[key]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
            <SlidersHorizontal className="w-4 h-4 text-black" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                Live Hyperlocal Dispatch Simulator
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-semibold">
                INFERENCE ENGINE
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Real-time fulfillment turnaround & Sigmoid SLA breach risk scoring P(Breach) = 1 / (1 + e^-z)
            </p>
          </div>
        </div>

        {/* Operational Presets */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-zinc-500 font-medium mr-1">Presets:</span>
          {[
            { key: "sprint", label: "Sub-1km Sprint" },
            { key: "monsoon", label: "Monsoon Gridlock" },
            { key: "staircase", label: "High-Rise Stairs" },
            { key: "bulk", label: "Bulk Suburb" },
          ].map((preset) => (
            <button
              key={preset.key}
              onClick={() => handlePreset(preset.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activePreset === preset.key
                  ? "bg-black text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-black"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Input Parameters Controls (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
              Order Dispatch Conditions
            </h3>
            <button
              onClick={() => handlePreset("sprint")}
              className="text-xs text-zinc-500 hover:text-black flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Distance */}
            <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-zinc-700">Delivery Distance:</span>
                <span className="font-bold text-black font-mono tabular-nums">{params.distance_km} km</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="8.0"
                step="0.1"
                value={params.distance_km}
                onChange={(e) => setParams({ ...params, distance_km: parseFloat(e.target.value) })}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Prep Time */}
            <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-zinc-700">Warehouse Prep Time:</span>
                <span className="font-bold text-black font-mono tabular-nums">{params.picker_prep_time_min} min</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.2"
                value={params.picker_prep_time_min}
                onChange={(e) => setParams({ ...params, picker_prep_time_min: parseFloat(e.target.value) })}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Customer Floor */}
            <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-zinc-700">Customer Floor:</span>
                <span className="font-bold text-black font-mono tabular-nums">{params.customer_floor}th Floor</span>
              </div>
              <input
                type="range"
                min="0"
                max="18"
                step="1"
                value={params.customer_floor}
                onChange={(e) => setParams({ ...params, customer_floor: parseInt(e.target.value) })}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Items Count */}
            <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-zinc-700">Order Items:</span>
                <span className="font-bold text-black font-mono tabular-nums">{params.item_count} items ({params.order_weight_kg} kg)</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={params.item_count}
                onChange={(e) => {
                  const items = parseInt(e.target.value);
                  setParams({ 
                    ...params, 
                    item_count: items,
                    order_weight_kg: Number((items * 0.8).toFixed(1))
                  });
                }}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
          </div>

          {/* Categorical Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <label className="text-zinc-600 block mb-1 font-medium">Vehicle Fleet:</label>
              <select
                value={params.vehicle_type}
                onChange={(e) => setParams({ ...params, vehicle_type: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-bold text-zinc-900 outline-none"
              >
                <option value="EV_2W">EV 2-Wheeler</option>
                <option value="Petrol_Bike">Petrol Bike</option>
                <option value="Bicycle">Bicycle</option>
                <option value="E_Cart">Electric Cart</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-600 block mb-1 font-medium">Traffic Density:</label>
              <select
                value={params.traffic_density}
                onChange={(e) => setParams({ ...params, traffic_density: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-bold text-zinc-900 outline-none"
              >
                <option value="Low">Low Friction</option>
                <option value="Medium">Moderate Flow</option>
                <option value="High">Dense Traffic</option>
                <option value="Jam">Gridlock Jam</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-600 block mb-1 font-medium">Weather Condition:</label>
              <select
                value={params.weather_condition}
                onChange={(e) => setParams({ ...params, weather_condition: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-bold text-zinc-900 outline-none"
              >
                <option value="Clear">Clear Sky</option>
                <option value="Fog">Morning Fog</option>
                <option value="Rain">Monsoon Rain</option>
                <option value="Storm">Heavy Thunderstorm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prediction Results & Delay Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-black" strokeWidth={1.75} />
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                  Inference Prediction
                </h3>
              </div>
              {prediction && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-950">
                  {prediction.operational_status.replace(/_/g, " ")}
                </span>
              )}
            </div>

            {prediction && (
              <div className="space-y-4">
                {/* Big Estimated ETA */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">
                    Predicted Total Delivery ETA
                  </span>
                  <div className="text-4xl font-bold text-zinc-950 font-mono tracking-tight tabular-nums">
                    {prediction.predicted_eta_minutes} <span className="text-lg text-zinc-600 font-sans">min</span>
                  </div>
                  <div className="text-xs text-zinc-600 mt-2 font-mono">
                    SLA Breach Probability: <span className="font-bold text-black">{prediction.sla_breach_percentage}%</span>
                  </div>
                </div>

                {/* Delay Breakdown Components */}
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase block">Decomposed Latencies</span>
                  
                  <div className="p-3 rounded-xl border border-zinc-200 bg-white space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Transit Duration:</span>
                      <span className="font-bold text-zinc-950 tabular-nums">+{prediction.breakdown.transit_time} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Warehouse Prep:</span>
                      <span className="font-bold text-zinc-950 tabular-nums">+{prediction.breakdown.picker_prep_time} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Staircase / Elevator:</span>
                      <span className="font-bold text-zinc-950 tabular-nums">+{prediction.breakdown.vertical_stair_delay} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Traffic & Weather Penalty:</span>
                      <span className="font-bold text-zinc-950 tabular-nums">+{prediction.breakdown.traffic_weather_penalty} min</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {prediction.recommendations.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-bold text-zinc-700 uppercase block">Dispatch Strategy</span>
                    {prediction.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-zinc-800">
                        <CheckCircle className="w-3.5 h-3.5 text-black shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-zinc-500 mt-4 pt-3 border-t border-zinc-100">
            Powered by Scikit-learn Multiple Regression & Sigmoid probability mapping.
          </div>
        </div>
      </div>
    </div>
  );
}
