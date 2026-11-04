"use client";

import React, { useState } from "react";
import { EDAResponse, PreprocessingResponse } from "../types";
import { 
  Database, 
  BarChart2, 
  Layers, 
  AlertCircle, 
  Cpu
} from "lucide-react";

interface StatsProfilerProps {
  eda: EDAResponse | null;
  preprocessing: PreprocessingResponse | null;
  loading: boolean;
}

export default function StatsProfiler({ eda, preprocessing, loading }: StatsProfilerProps) {
  const [matrixMode, setMatrixMode] = useState<"correlation" | "covariance">("correlation");
  const [selectedIqrFeature, setSelectedIqrFeature] = useState<string>("total_delivery_time");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
        <span className="text-xs text-zinc-600 font-mono">
          Ingesting Pandas schema and computing covariance matrix...
        </span>
      </div>
    );
  }

  if (!eda || !preprocessing) {
    return (
      <div className="p-8 text-center bg-white border border-zinc-200 rounded-3xl text-xs font-mono text-zinc-500">
        No dataset profile telemetry available. Verify backend is running on port 8000.
      </div>
    );
  }

  const activeIqr = preprocessing.iqr_outliers.find(
    (item) => item.feature === selectedIqrFeature
  ) || preprocessing.iqr_outliers[0];

  const getHeatmapColor = (val: number, isCorr: boolean) => {
    if (isCorr) {
      if (val >= 0.7) return "bg-black text-white font-bold";
      if (val >= 0.3) return "bg-zinc-200 text-zinc-950 font-semibold";
      if (val >= -0.1) return "bg-zinc-50 text-zinc-700";
      return "bg-zinc-100 text-zinc-900 font-medium";
    }
    return "bg-zinc-50 text-zinc-900 font-medium";
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Scope Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
            <Database className="w-4 h-4 text-black" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                Data Profiler & Statistical Foundations
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-semibold">
                EXP 01, 02, 03, 04, 15
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Pandas DataFrame Ingestion • NumPy Expected Values E[X], Variance, Covariance & IQR Fences
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-800">
            Memory: <span className="font-bold text-black">{eda.schema_info.memory_usage_kb} KB</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-800">
            Dataset: <span className="font-bold text-black">{eda.total_records.toLocaleString()} Rows</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-800">
            Features: <span className="font-bold text-black">{preprocessing.total_features_after_encoding} Dim</span>
          </div>
        </div>
      </div>

      {/* Section 1: NumPy Continuous Feature Statistical Moments Cards (Exp 2) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-black" strokeWidth={1.75} />
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
              NumPy Statistical Moments & Central Tendency (Exp 2)
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            E[X] = Σ xᵢ·P(xᵢ) | Var = Σ(x - μ)² / (N-1) | σ = √Var
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eda.feature_stats.map((stat) => {
            const iqrMatch = preprocessing.iqr_outliers.find((iqr) => iqr.feature === stat.feature);
            return (
              <div 
                key={stat.feature}
                className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                  <span className="text-xs font-bold text-zinc-950 font-mono">
                    {stat.feature}
                  </span>
                  <span className="text-xs text-zinc-600 font-mono">
                    Median: <span className="font-bold text-black tabular-nums">{stat.median}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Expected Val E[X]</span>
                    <span className="text-sm font-bold text-black tabular-nums font-mono">{stat.expected_value}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Mean (μ)</span>
                    <span className="text-sm font-bold text-zinc-900 tabular-nums font-mono">{stat.mean}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Variance (σ²)</span>
                    <span className="text-xs font-semibold text-zinc-800 tabular-nums font-mono">{stat.variance}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block font-medium">Std Dev (σ)</span>
                    <span className="text-xs font-semibold text-zinc-800 tabular-nums font-mono">±{stat.std_dev}</span>
                  </div>
                </div>

                {iqrMatch && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-600">IQR Outliers:</span>
                    <span className="font-bold text-zinc-950 tabular-nums font-mono">
                      {iqrMatch.outlier_count} orders ({iqrMatch.outlier_pct}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Multivariate Association Matrix & IQR Outliers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Heatmap (8 cols) */}
        <div className="lg:col-span-8 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
          <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-zinc-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-black" strokeWidth={1.75} />
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                  Multivariate Association Matrix (Exp 2)
                </h3>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                {matrixMode === "correlation" 
                  ? "Pearson Correlation: r = Cov(X,Y) / (σ_x · σ_y) ∈ [-1, 1]" 
                  : "Covariance Matrix: Cov(X,Y) = Σ(x - μ_x)(y - μ_y) / (N - 1)"}
              </p>
            </div>

            <div className="flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
              <button
                onClick={() => setMatrixMode("correlation")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  matrixMode === "correlation"
                    ? "bg-black text-white shadow-2xs"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                }`}
              >
                Correlation
              </button>
              <button
                onClick={() => setMatrixMode("covariance")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  matrixMode === "covariance"
                    ? "bg-black text-white shadow-2xs"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                }`}
              >
                Covariance
              </button>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-600 text-left">
                  <th className="p-2.5 text-[11px] uppercase font-bold text-black">Feature</th>
                  {eda.matrix_labels.map((label, idx) => (
                    <th key={idx} className="p-2.5 text-center text-[11px] uppercase font-bold text-black min-w-[70px]">
                      {label.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {(matrixMode === "correlation" ? eda.correlation_matrix : eda.covariance_matrix).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-50/70">
                    <td className="p-2.5 text-zinc-950 font-bold whitespace-nowrap text-xs">
                      {eda.matrix_labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="p-1 text-center">
                        <div
                          className={`py-1.5 px-2 rounded-lg text-xs tabular-nums transition-colors ${getHeatmapColor(
                            val,
                            matrixMode === "correlation"
                          )}`}
                          title={`${eda.matrix_labels[rIdx]} × ${eda.matrix_labels[cIdx]}: ${val}`}
                        >
                          {val.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 mt-4 pt-3 border-t border-zinc-100">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-black" />
              <span className="font-medium text-zinc-800">High Positive (&gt; 0.7)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <span className="font-medium text-zinc-800">Moderate (0.3 to 0.7)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-100 border border-zinc-300" />
              <span className="font-medium text-zinc-800">Neutral (-0.1 to 0.3)</span>
            </span>
          </div>
        </div>

        {/* IQR Outlier Boundary Visualizer (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-black" strokeWidth={1.75} />
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                  IQR Outliers (Exp 3)
                </h3>
              </div>
              <select
                value={selectedIqrFeature}
                onChange={(e) => setSelectedIqrFeature(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-semibold rounded-full px-3 py-1 outline-none"
              >
                {preprocessing.iqr_outliers.map((item) => (
                  <option key={item.feature} value={item.feature}>
                    {item.feature}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-zinc-600 mb-3">
              Tukey Fences: Q1 - 1.5*IQR to Q3 + 1.5*IQR
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Interquartile Range:</span>
                  <span className="text-black font-bold font-mono tabular-nums">{activeIqr.iqr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Q1 (25th Percentile):</span>
                  <span className="text-zinc-900 font-semibold font-mono tabular-nums">{activeIqr.q1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Q3 (75th Percentile):</span>
                  <span className="text-zinc-900 font-semibold font-mono tabular-nums">{activeIqr.q3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Median (Q2):</span>
                  <span className="text-zinc-950 font-bold font-mono tabular-nums">{activeIqr.median_val}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">LOWER FENCE</span>
                  <span className="text-zinc-950 font-bold font-mono tabular-nums text-sm">{activeIqr.lower_bound}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">UPPER FENCE</span>
                  <span className="text-zinc-950 font-bold font-mono tabular-nums text-sm">{activeIqr.upper_bound}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/60">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-700 font-medium">Detected Outliers:</span>
                  <span className="font-bold text-black tabular-nums font-mono">
                    {activeIqr.outlier_count} orders ({activeIqr.outlier_pct}%)
                  </span>
                </div>
                {activeIqr.sample_outliers.length > 0 && (
                  <div className="text-xs text-zinc-600 mt-1">
                    <span>Sample Tail: </span>
                    <span className="text-black font-mono font-semibold">
                      {activeIqr.sample_outliers.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 mt-4 pt-3 border-t border-zinc-100">
            Outliers in turnaround represent security delays, punctures, or extreme downpours.
          </div>
        </div>
      </div>

      {/* Section 3: Data Preprocessing Pipeline (Exp 3 & 4) */}
      <div className="p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-zinc-100">
          <Layers className="w-4 h-4 text-black" strokeWidth={1.75} />
          <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
            Preprocessing Pipeline: Imputation, Scaling & Encoding (Exp 3 & 4)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Missing data imputation */}
          <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60">
            <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider block mb-3">
              Missing Value Imputation (Exp 3 & 4)
            </span>
            <div className="space-y-2 text-xs">
              {preprocessing.missing_data_report
                .filter((r) => r.missing_count > 0)
                .map((r) => (
                  <div key={r.column} className="flex justify-between items-center py-1.5 border-b border-zinc-200/60 last:border-0">
                    <span className="text-zinc-800 font-mono font-semibold">{r.column}</span>
                    <div className="text-right">
                      <span className="text-black font-bold tabular-nums font-mono">{r.missing_count} nulls</span>
                      <span className="text-[11px] text-zinc-500 block">{r.imputation_strategy.split("(")[0]}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* StandardScaler Report */}
          <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60">
            <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider block mb-3">
              StandardScaler: z = (x - μ) / σ (Exp 3)
            </span>
            <div className="space-y-2 text-xs font-mono">
              {preprocessing.scaling_metrics.map((scale) => (
                <div key={scale.feature} className="py-1.5 border-b border-zinc-200/60 last:border-0">
                  <div className="text-zinc-950 font-bold mb-0.5">{scale.feature}</div>
                  <div className="flex justify-between text-zinc-600 text-[11px]">
                    <span>Raw: μ={scale.raw_mean}, σ={scale.raw_std}</span>
                    <span className="font-semibold text-black">Scaled: μ=0, σ=1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* One-Hot Encoding */}
          <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60">
            <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider block mb-3">
              One-Hot Encoded Dummies (Exp 4)
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {preprocessing.one_hot_columns.map((col) => (
                <span
                  key={col}
                  className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-zinc-800 font-mono text-[11px] font-medium"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
