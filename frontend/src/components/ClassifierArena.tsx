"use client";

import React, { useState, useMemo } from "react";
import { ClassificationResponse } from "../types";
import { 
  ShieldAlert, 
  Target, 
  SlidersHorizontal,
  CheckCircle, 
  Cpu
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface ClassifierArenaProps {
  classification: ClassificationResponse | null;
  loading: boolean;
}

export default function ClassifierArena({ classification, loading }: ClassifierArenaProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("random_forest");
  const [decisionThreshold, setDecisionThreshold] = useState<number>(0.50);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
        <span className="text-xs text-zinc-600 font-mono">
          Training 8 classifiers (Logistic, ID3, KNN, Naive Bayes, Random Forest, SVM Linear/Poly/RBF)...
        </span>
      </div>
    );
  }

  if (!classification) {
    return (
      <div className="p-8 text-center bg-white border border-zinc-200 rounded-3xl text-xs font-mono text-zinc-500">
        No classifier tournament telemetry available.
      </div>
    );
  }

  const { leaderboard, sigmoid_analysis: sigmoid, test_set_size } = classification;
  const selectedModel = leaderboard.find((m) => m.model_id === selectedModelId) || leaderboard[0];

  // Confusion matrix values
  const cm = selectedModel.confusion_matrix;
  const tn = cm[0][0];
  const fp = cm[0][1];
  const fn = cm[1][0];
  const tp = cm[1][1];

  const precision = tp + fp > 0 ? (tp / (tp + fp)) : 0;
  const recall = tp + fn > 0 ? (tp / (tp + fn)) : 0;
  const specificity = tn + fp > 0 ? (tn / (tn + fp)) : 0;

  // Dynamic Sigmoid threshold calculations
  const thresholdMetrics = useMemo(() => {
    let dynTP = 0, dynFP = 0, dynFN = 0, dynTN = 0;
    sigmoid.sample_evaluations.forEach((item) => {
      const predictedBreach = item.probability >= decisionThreshold ? 1 : 0;
      if (predictedBreach === 1 && item.actual_breached === 1) dynTP++;
      else if (predictedBreach === 1 && item.actual_breached === 0) dynFP++;
      else if (predictedBreach === 0 && item.actual_breached === 1) dynFN++;
      else dynTN++;
    });

    const dynPrec = dynTP + dynFP > 0 ? dynTP / (dynTP + dynFP) : 0;
    const dynRec = dynTP + dynFN > 0 ? dynTP / (dynTP + dynFN) : 0;
    const dynF1 = dynPrec + dynRec > 0 ? (2 * dynPrec * dynRec) / (dynPrec + dynRec) : 0;
    const cutoffZ = Math.log(decisionThreshold / (1 - decisionThreshold));

    return {
      tp: dynTP,
      fp: dynFP,
      fn: dynFN,
      tn: dynTN,
      precision: dynPrec,
      recall: dynRec,
      f1: dynF1,
      cutoffZ: Number(cutoffZ.toFixed(2)),
    };
  }, [decisionThreshold, sigmoid.sample_evaluations]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
            <ShieldAlert className="w-4 h-4 text-black" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                SLA Classifier Tournament Arena
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-semibold">
                EXP 07, 08, 10, 11, 12, 13
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Benchmark 8 models on 15-Minute SLA breach target • Stratified 80/20 test split (n={test_set_size})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-800 font-medium">
            Target: <span className="font-bold text-black">sla_breached (1/0)</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-800 font-medium">
            Models: <span className="font-bold text-black">8 Evaluated</span>
          </span>
        </div>
      </div>

      {/* Model Tournament Leaderboard Table */}
      <div className="p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-black" strokeWidth={1.75} />
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
              Model Performance Benchmark (Sorted by F1-Score)
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Click any row to load its 2x2 confusion matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-600">
                <th className="py-2.5 px-3 font-bold text-black uppercase">Rank</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">Model Name</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">Algorithm Family</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">Tag</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">Accuracy</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">Precision</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">Recall</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">F1-Score</th>
                <th className="py-2.5 px-3 font-bold text-black uppercase">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {leaderboard.map((model, idx) => {
                const isSelected = model.model_id === selectedModelId;
                return (
                  <tr
                    key={model.model_id}
                    onClick={() => setSelectedModelId(model.model_id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-zinc-100/90 font-bold" : "hover:bg-zinc-50/70"
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-black">#{idx + 1}</td>
                    <td className="py-2.5 px-3 text-zinc-950 font-sans font-bold flex items-center space-x-1.5">
                      {isSelected && <span className="w-2 h-2 rounded-full bg-black inline-block" />}
                      <span>{model.model_name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-600 font-sans">{model.algorithm_category}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-black font-semibold text-[10px]">
                        {model.experiment_tag}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-black tabular-nums">
                      {(model.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-zinc-900 tabular-nums">
                      {(model.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-zinc-900 tabular-nums">
                      {(model.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 font-bold text-black tabular-nums">
                      {(model.f1_score * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500 tabular-nums">{model.latency_ms} ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive: Metrics & 2x2 Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Confusion Matrix (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-black" strokeWidth={1.75} />
              <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                2×2 Confusion Matrix: {selectedModel.model_name}
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Test Sample: {test_set_size}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono mb-4">
            {/* True Negative */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">
                TRUE NEGATIVE (TN)
              </span>
              <span className="text-2xl font-bold text-black tabular-nums">{tn}</span>
              <span className="text-[11px] text-zinc-500 block mt-1">Predicted On-Time, Actual On-Time</span>
            </div>

            {/* False Positive (Type I) */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">
                FALSE POSITIVE (FP)
              </span>
              <span className="text-2xl font-bold text-black tabular-nums">{fp}</span>
              <span className="text-[11px] text-zinc-500 block mt-1">False Alarm (Type I Error)</span>
            </div>

            {/* False Negative (Type II) */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">
                FALSE NEGATIVE (FN)
              </span>
              <span className="text-2xl font-bold text-black tabular-nums">{fn}</span>
              <span className="text-[11px] text-zinc-500 block mt-1">Missed Breach (Type II Error)</span>
            </div>

            {/* True Positive */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">
                TRUE POSITIVE (TP)
              </span>
              <span className="text-2xl font-bold text-black tabular-nums">{tp}</span>
              <span className="text-[11px] text-zinc-500 block mt-1">Correctly Intercepted SLA Breach</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-3 border-t border-zinc-100">
            <div>
              <span className="text-zinc-500 block text-[11px]">Precision (TP / TP+FP)</span>
              <span className="font-bold text-black text-sm tabular-nums">{(precision * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Recall (Sensitivity)</span>
              <span className="font-bold text-black text-sm tabular-nums">{(recall * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Specificity (TN / TN+FP)</span>
              <span className="font-bold text-black text-sm tabular-nums">{(specificity * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Hyperparameters & Formulation (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-zinc-100">
              <CheckCircle className="w-4 h-4 text-black" strokeWidth={1.75} />
              <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                Model Hyperparameters
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                <span className="text-[11px] text-zinc-500 uppercase block mb-1">Trained Configuration</span>
                <pre className="text-xs text-zinc-900 font-bold overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedModel.hyperparameters, null, 2)}
                </pre>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Algorithm Family:</span>
                  <span className="font-bold text-zinc-950 font-sans">{selectedModel.algorithm_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Inference Latency:</span>
                  <span className="font-bold text-black tabular-nums">{selectedModel.latency_ms} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Lab Experiment ID:</span>
                  <span className="font-bold text-black font-mono">{selectedModel.experiment_tag}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 mt-4 pt-3 border-t border-zinc-100">
            Trained with Scikit-learn on balanced class-weighted log-loss optimization.
          </div>
        </div>
      </div>

      {/* Logistic Regression Sigmoid Curve (Exp 07) */}
      <div className="p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-black" strokeWidth={1.75} />
            <div>
              <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                Logistic Sigmoid Curve Dial: S(z) = 1 / (1 + e^-z) (Exp 07)
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">
                Interactive decision threshold tuning for logistics dispatch risk tolerance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-zinc-600">Threshold (τ):</span>
              <span className="font-bold text-black px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 tabular-nums">
                {decisionThreshold.toFixed(2)}
              </span>
            </div>

            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={decisionThreshold}
              onChange={(e) => setDecisionThreshold(parseFloat(e.target.value))}
              className="w-36 sm:w-48 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sigmoid.curve_points} margin={{ top: 10, right: 15, bottom: 20, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
              <XAxis dataKey="z" stroke="#374151" fontSize={11} label={{ value: "Log-Odds Logit z", position: "insideBottom", offset: -10, fill: "#111827", fontSize: 11, fontWeight: 500 }} />
              <YAxis domain={[0, 1]} stroke="#374151" fontSize={11} label={{ value: "Breach Probability P(y=1|x)", angle: -90, position: "insideLeft", offset: 15, fill: "#111827", fontSize: 11, fontWeight: 500 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2.5 bg-white border border-zinc-200 rounded-xl shadow-md text-xs font-mono">
                        <p className="text-zinc-600">z: {payload[0].payload.z}</p>
                        <p className="font-bold text-black">Probability: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={decisionThreshold} stroke="#000000" strokeDasharray="4 4" label={{ value: `Threshold τ = ${decisionThreshold}`, fill: "#000000", fontSize: 11, position: "insideTopRight" }} />
              <Line type="monotone" dataKey="sigmoid" stroke="#000000" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-zinc-100 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">Cutoff Logit z*</span>
            <span className="font-bold text-black text-sm">{thresholdMetrics.cutoffZ}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">Precision at τ</span>
            <span className="font-bold text-black text-sm">{(thresholdMetrics.precision * 100).toFixed(1)}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">Recall at τ</span>
            <span className="font-bold text-black text-sm">{(thresholdMetrics.recall * 100).toFixed(1)}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">F1-Score at τ</span>
            <span className="font-bold text-black text-sm">{(thresholdMetrics.f1 * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
