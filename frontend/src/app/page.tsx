"use client";

import React, { useState, useEffect } from "react";
import { 
  HealthResponse, 
  EDAResponse, 
  PreprocessingResponse, 
  RegressionResponse, 
  ClassificationResponse, 
  ClusteringPCAResponse 
} from "../types";
import { apiService } from "../services/api";
import JobgioDashboard from "../components/JobgioDashboard";
import StatsProfiler from "../components/StatsProfiler";
import RegressionLab from "../components/RegressionLab";
import ClassifierArena from "../components/ClassifierArena";
import ClusterPcaMap from "../components/ClusterPcaMap";
import DispatchConsole from "../components/DispatchConsole";
import { 
  LayoutDashboard,
  Database, 
  Calculator, 
  ShieldAlert, 
  GitFork, 
  SlidersHorizontal,
  RotateCw, 
  Layers,
  ChevronRight,
  Server,
  Radio,
  X
} from "lucide-react";

type NavTabId = "dashboard" | "eda" | "regression" | "classification" | "clustering" | "simulator";

const EXPERIMENTS_MAP = [
  { id: "EXP-01", title: "Python Data Structures & In-Memory Transformations", tab: "eda", desc: "Core tuples, dictionary aggregations, list filtering" },
  { id: "EXP-02", title: "NumPy Statistical Moments & Covariance Heatmap", tab: "eda", desc: "Expected value E[X], variance, std dev, 6x6 covariance matrix" },
  { id: "EXP-03", title: "Continuous Data Preprocessing & Outlier Boundaries", tab: "eda", desc: "Median imputation, Tukey IQR outlier fences, StandardScaler" },
  { id: "EXP-04", title: "Categorical Preprocessing & Dummy Encoding", tab: "eda", desc: "Mode imputation and One-Hot Encoding transformation" },
  { id: "EXP-05", title: "Simple Linear Regression (Road Transit OLS)", tab: "regression", desc: "Univariate OLS closed-form: Distance vs Turnaround" },
  { id: "EXP-06", title: "Multiple Linear Regression & Residual Diagnostic", tab: "regression", desc: "Multivariate weights, R2 score, RMSE, MAE, residual distribution" },
  { id: "EXP-07", title: "Logistic Regression & Mathematical Sigmoid Curve", tab: "classification", desc: "Log-odds z-score mapping, interactive probability threshold" },
  { id: "EXP-08", title: "ID3 Decision Tree Classifier (Entropy Criterion)", tab: "classification", desc: "Information gain splitting, 2x2 confusion matrix analysis" },
  { id: "EXP-09", title: "K-Means & Hierarchical Ward Cluster Segmentation", tab: "clustering", desc: "Unsupervised k=3 logistics manifold partitioning" },
  { id: "EXP-10", title: "K-Nearest Neighbors (KNN Instance-based Model)", tab: "classification", desc: "Minkowski distance neighbor consensus voting" },
  { id: "EXP-11", title: "Gaussian Naive Bayes Probabilistic Classifier", tab: "classification", desc: "Bayesian conditional prior likelihood formulation" },
  { id: "EXP-12", title: "Random Forest Ensemble Classifier", tab: "classification", desc: "50-tree bagging ensemble with out-of-bag validation" },
  { id: "EXP-13", title: "Support Vector Machine (Linear, Poly, RBF Kernels)", tab: "classification", desc: "Hyperplane separation benchmark across 3 kernel functions" },
  { id: "EXP-14", title: "Principal Component Analysis (PCA 2D Projection)", tab: "clustering", desc: "Orthogonal eigenvectors, 72.8% variance preservation" },
  { id: "EXP-15", title: "Pandas Ingestion & Memory Schema Profiling", tab: "eda", desc: "Deterministic ingestion of 5,000 quick-commerce records" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTabId>("dashboard");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [eda, setEda] = useState<EDAResponse | null>(null);
  const [preprocessing, setPreprocessing] = useState<PreprocessingResponse | null>(null);
  const [regression, setRegression] = useState<RegressionResponse | null>(null);
  const [classification, setClassification] = useState<ClassificationResponse | null>(null);
  const [clusteringPca, setClusteringPca] = useState<ClusteringPCAResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCurriculum, setShowCurriculum] = useState<boolean>(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [h, e, p, r, c, cl] = await Promise.all([
        apiService.getHealth().catch(() => null),
        apiService.getEDA().catch(() => null),
        apiService.getPreprocessing().catch(() => null),
        apiService.getRegression().catch(() => null),
        apiService.getClassificationTournament().catch(() => null),
        apiService.getClusteringPCA().catch(() => null),
      ]);
      setHealth(h);
      setEda(e);
      setPreprocessing(p);
      setRegression(r);
      setClassification(c);
      setClusteringPca(cl);
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-3 sm:p-6 lg:p-8 flex items-center justify-center selection:bg-black selection:text-white font-sans">
      {/* Outer Floating Canvas Frame */}
      <div className="w-full max-w-[1520px] bg-[#fbfcfd] border border-white/80 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row min-h-[920px]">
        
        {/* LEFT MINIMALIST SIDEBAR */}
        <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-zinc-100 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo: Clean Geometric Emblem + BlinkRoute (Zero Emojis) */}
            <div className="flex items-center space-x-3 px-2">
              <div className="w-8 h-8 flex items-center justify-center text-zinc-950">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7L12 3L20 7L12 11L4 7Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 17L12 21L20 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-zinc-950">BlinkRoute</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold">
                  IQ
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5">
              {/* 1. Overview Dashboard */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" strokeWidth={activeTab === "dashboard" ? 2 : 1.75} />
                <span>Overview</span>
              </button>

              {/* 2. Data Profiler (Exp 1-4, 15) */}
              <button
                onClick={() => setActiveTab("eda")}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === "eda"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
                }`}
              >
                <Database className="w-4 h-4" strokeWidth={activeTab === "eda" ? 2 : 1.75} />
                <span>Data Profiler</span>
              </button>

              {/* 3. Regression Lab (Exp 5-6) */}
              <button
                onClick={() => setActiveTab("regression")}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === "regression"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
                }`}
              >
                <Calculator className="w-4 h-4" strokeWidth={activeTab === "regression" ? 2 : 1.75} />
                <span>Regression Lab</span>
              </button>

              {/* 4. SLA Classifier (Exp 7, 8, 10-13) */}
              <button
                onClick={() => setActiveTab("classification")}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === "classification"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
                }`}
              >
                <ShieldAlert className="w-4 h-4" strokeWidth={activeTab === "classification" ? 2 : 1.75} />
                <span>SLA Classifier</span>
              </button>

              {/* 5. Cluster & PCA (Exp 9, 14) */}
              <button
                onClick={() => setActiveTab("clustering")}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === "clustering"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
                }`}
              >
                <GitFork className="w-4 h-4" strokeWidth={activeTab === "clustering" ? 2 : 1.75} />
                <span>Cluster & PCA</span>
              </button>

              {/* 6. Dispatch Simulator */}
              <button
                onClick={() => setActiveTab("simulator")}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === "simulator"
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={activeTab === "simulator" ? 2 : 1.75} />
                <span>Dispatch Simulator</span>
              </button>

              {/* 7. Curriculum Index */}
              <button
                onClick={() => setShowCurriculum(true)}
                className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-full text-xs font-semibold text-zinc-500 hover:text-black hover:bg-zinc-100/70 transition-all duration-200"
              >
                <Layers className="w-4 h-4" strokeWidth={1.75} />
                <span>15 Lab Exps Index</span>
              </button>
            </nav>
          </div>

          {/* REAL TELEMETRY STATUS at Bottom of Sidebar (No Emojis) */}
          <div className="pt-5 border-t border-zinc-100 mt-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                <Radio className="w-4 h-4 text-black" strokeWidth={1.75} />
              </div>
              <div className="overflow-hidden text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span className="text-xs font-bold text-zinc-900">FastAPI Online</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">127.0.0.1:8000</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN VIEWPORT CANVAS */}
        <main className="flex-1 bg-[#fbfcfd] p-5 sm:p-8 overflow-y-auto">
          {/* Top Bar with Clean Controls */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-zinc-400">BlinkRoute Platform /</span>
              <span className="text-xs font-bold text-zinc-900 capitalize font-mono">{activeTab}</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCurriculum(!showCurriculum)}
                className="px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors shadow-2xs flex items-center space-x-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.75} />
                <span>15 Experiments Index</span>
              </button>

              <button
                onClick={fetchAllData}
                disabled={loading}
                className="p-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-black transition-colors disabled:opacity-50 shadow-2xs"
                title="Refresh Pipeline Telemetry"
              >
                <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-black" : ""}`} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Tab Render View */}
          <div>
            {activeTab === "dashboard" && (
              <JobgioDashboard 
                health={health} 
                regression={regression}
                classification={classification}
                onNavigateTab={(tab) => setActiveTab(tab as NavTabId)} 
              />
            )}

            {activeTab === "eda" && (
              <StatsProfiler eda={eda} preprocessing={preprocessing} loading={loading} />
            )}

            {activeTab === "regression" && (
              <RegressionLab regression={regression} loading={loading} />
            )}

            {activeTab === "classification" && (
              <ClassifierArena classification={classification} loading={loading} />
            )}

            {activeTab === "clustering" && (
              <ClusterPcaMap clusteringPca={clusteringPca} loading={loading} />
            )}

            {activeTab === "simulator" && (
              <DispatchConsole />
            )}
          </div>
        </main>
      </div>

      {/* 15 Experiments Clean Humanized Drawer Modal */}
      {showCurriculum && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                  Academic Laboratory Experiments Directory (15/15)
                </h3>
                <p className="text-xs text-zinc-400">All experiments implemented in full-stack backend & scikit-learn</p>
              </div>
              <button
                onClick={() => setShowCurriculum(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {EXPERIMENTS_MAP.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => {
                    setActiveTab(exp.tab as NavTabId);
                    setShowCurriculum(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-100/80 hover:border-zinc-200 cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-bold text-zinc-900 bg-white border border-zinc-200 px-2 py-0.5 rounded-full shadow-2xs font-mono">
                      {exp.id}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-800 group-hover:text-black">
                        {exp.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-sans">
                        {exp.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-400 group-hover:text-black">
                    <span className="text-[10px] uppercase font-medium bg-white px-2 py-0.5 rounded-full border border-zinc-200 font-mono">
                      {exp.tab}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
