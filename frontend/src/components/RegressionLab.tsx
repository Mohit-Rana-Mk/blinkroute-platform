"use client";

import React, { useState } from "react";
import { RegressionResponse } from "../types";
import { 
  Calculator, 
  TrendingUp, 
  Layers, 
  BarChart2
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

interface RegressionLabProps {
  regression: RegressionResponse | null;
  loading: boolean;
}

export default function RegressionLab({ regression, loading }: RegressionLabProps) {
  const [activeTab, setActiveTab] = useState<"multiple" | "simple">("multiple");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
        <span className="text-xs text-zinc-600 font-mono">
          Fitting OLS Normal Equations and computing coefficient weights...
        </span>
      </div>
    );
  }

  if (!regression) {
    return (
      <div className="p-8 text-center bg-white border border-zinc-200 rounded-3xl text-xs font-mono text-zinc-500">
        No regression modeling telemetry available.
      </div>
    );
  }

  const { simple_regression: simple, multiple_regression: multiple } = regression;
  const currentModel = activeTab === "multiple" ? multiple : simple;

  // Prepare scatter data for Actual vs Predicted
  const scatterData = multiple.prediction_samples.map((sample) => ({
    actual: sample.actual_time,
    predicted: sample.predicted_time,
    residual: sample.residual,
    orderId: sample.order_id,
    distance: sample.distance_km,
  }));

  // Residual histogram bins
  const residualBins: Record<string, number> = {
    "Below -3m": 0,
    "-3 to -1m": 0,
    "-1 to +1m": 0,
    "+1 to +3m": 0,
    "Above +3m": 0,
  };

  multiple.prediction_samples.forEach((s) => {
    const r = s.residual;
    if (r < -3) residualBins["Below -3m"]++;
    else if (r < -1) residualBins["-3 to -1m"]++;
    else if (r <= 1) residualBins["-1 to +1m"]++;
    else if (r <= 3) residualBins["+1 to +3m"]++;
    else residualBins["Above +3m"]++;
  });

  const residualHistogramData = Object.entries(residualBins).map(([bin, count]) => ({
    bin,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
            <Calculator className="w-4 h-4 text-black" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                Fulfillment Turnaround Regression Lab
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-semibold">
                EXP 05 & EXP 06
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Ordinary Least Squares (OLS) Normal Equations: β = (XᵀX)⁻¹ Xᵀy
            </p>
          </div>
        </div>

        {/* Model Switcher */}
        <div className="flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
          <button
            onClick={() => setActiveTab("multiple")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "multiple"
                ? "bg-black text-white shadow-xs"
                : "text-zinc-600 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Multiple OLS (Exp 6)
          </button>
          <button
            onClick={() => setActiveTab("simple")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "simple"
                ? "bg-black text-white shadow-xs"
                : "text-zinc-600 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Simple OLS (Exp 5)
          </button>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
            Coefficient of Determination (R²)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
              {(currentModel.r2_score * 100).toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-zinc-700 tabular-nums">R²={currentModel.r2_score}</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
            Total turnaround variance explained by the fitted regression model.
          </p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
            Root Mean Squared Error (RMSE)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
              {currentModel.rmse.toFixed(2)}m
            </span>
            <span className="text-xs font-semibold text-zinc-700">√MSE</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
            Penalizes large delivery deviations heavily for SLA reliability.
          </p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
            Mean Absolute Error (MAE)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
              {currentModel.mae.toFixed(2)}m
            </span>
            <span className="text-xs font-semibold text-zinc-700">Avg |e|</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
            Expected linear prediction error across test order drop-offs.
          </p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
            Baseline Intercept (β₀)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
              {currentModel.intercept.toFixed(2)}m
            </span>
            <span className="text-xs font-semibold text-zinc-700">Fixed Overhead</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
            Staging, bag sealing, and rider assignment duration.
          </p>
        </div>
      </div>

      {/* Regression Equation Formula Banner */}
      <div className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-xs">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold block mb-1">
          Fitted Hypothesis Function h_θ(x):
        </span>
        <span className="text-sm text-zinc-950 font-mono font-bold break-all">
          {currentModel.equation}
        </span>
      </div>

      {/* Multiple Regression Coefficients Interpretation Table */}
      {activeTab === "multiple" && (
        <div className="p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-zinc-100">
            <TrendingUp className="w-4 h-4 text-black" strokeWidth={1.75} />
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
              Marginal Coefficient Effects (Partial Derivatives ∂ETA/∂x_i)
            </h3>
          </div>
          <p className="text-xs text-zinc-600 mb-4">
            Each weight quantifies the partial turnaround delta per unit increment, holding other logistical conditions constant.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-600">
                  <th className="py-2.5 px-3 font-bold text-black uppercase">Feature</th>
                  <th className="py-2.5 px-3 font-bold text-black uppercase">Coefficient (Weight)</th>
                  <th className="py-2.5 px-3 font-bold text-black uppercase">Direction</th>
                  <th className="py-2.5 px-3 font-bold text-black uppercase">Operational Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono">
                {multiple.coefficients.map((c) => (
                  <tr key={c.feature} className="hover:bg-zinc-50/70">
                    <td className="py-2.5 px-3 font-bold text-zinc-950">{c.feature}</td>
                    <td className="py-2.5 px-3 font-bold text-black tabular-nums">
                      {c.coefficient > 0 ? `+${c.coefficient}` : c.coefficient}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        c.coefficient > 0 ? "bg-zinc-200 text-zinc-900" : "bg-zinc-100 text-zinc-700"
                      }`}>
                        {c.coefficient > 0 ? "Increases ETA" : "Decreases ETA"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-700 font-sans">{c.interpretation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visualizations: Actual vs Predicted Scatter & Residual Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Actual vs Predicted Scatter */}
        <div className="lg:col-span-7 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-zinc-100">
            <BarChart2 className="w-4 h-4 text-black" strokeWidth={1.75} />
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
              Actual vs. Predicted Turnaround Scatter (n=10 sample orders)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                <XAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual (min)" 
                  stroke="#374151" 
                  fontSize={11}
                  label={{ value: "Actual Delivery Time (min)", position: "insideBottom", offset: -10, fill: "#111827", fontSize: 11, fontWeight: 500 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="predicted" 
                  name="Predicted (min)" 
                  stroke="#374151" 
                  fontSize={11}
                  label={{ value: "Predicted ETA (min)", angle: -90, position: "insideLeft", offset: 12, fill: "#111827", fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: "2 2", stroke: "#000000" }} 
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-lg text-xs space-y-1">
                        <p className="font-bold text-zinc-950">{data.orderId}</p>
                        <p className="text-zinc-700">Actual: <span className="font-bold text-black">{data.actual} min</span></p>
                        <p className="text-zinc-700">Predicted: <span className="font-bold text-black">{data.predicted} min</span></p>
                        <p className="text-zinc-600">Residual error: {data.residual > 0 ? `+${data.residual}` : data.residual} min</p>
                      </div>
                    );
                  }}
                />
                <Scatter name="Fitted Predictions" data={scatterData} fill="#000000" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Residual Distribution Histogram */}
        <div className="lg:col-span-5 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-zinc-100">
            <Layers className="w-4 h-4 text-black" strokeWidth={1.75} />
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
              Residual Error Distribution
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={residualHistogramData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                <XAxis dataKey="bin" stroke="#374151" fontSize={10} tickLine={false} dy={8} />
                <YAxis stroke="#374151" fontSize={11} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 bg-white border border-zinc-200 rounded-xl shadow-md text-xs">
                          <p className="font-semibold text-zinc-900">{payload[0].payload.bin}</p>
                          <p className="font-bold text-black mt-0.5">{payload[0].value} orders</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
