"use client";

import React, { useState } from "react";
import { ClusteringPCAResponse } from "../types";
import { 
  GitFork, 
  Compass, 
  Layers, 
  Users
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface ClusterPcaMapProps {
  clusteringPca: ClusteringPCAResponse | null;
  loading: boolean;
}

export default function ClusterPcaMap({ clusteringPca, loading }: ClusterPcaMapProps) {
  const [clusterAlgorithm, setClusterAlgorithm] = useState<"kmeans" | "hierarchical">("kmeans");
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<number | "all">("all");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
        <span className="text-xs text-zinc-600 font-mono">
          Standardizing features, computing PCA 2D projections and clustering manifolds...
        </span>
      </div>
    );
  }

  if (!clusteringPca) {
    return (
      <div className="p-8 text-center bg-white border border-zinc-200 rounded-3xl text-xs font-mono text-zinc-500">
        No clustering and PCA telemetry available.
      </div>
    );
  }

  const {
    explained_variance_ratio: explainedVar,
    total_explained_variance: totalVar,
    pca_loadings: loadings,
    cluster_profiles: profiles,
    projected_points: points,
  } = clusteringPca;

  const clusterColors = [
    "#000000", // Black: Hyperlocal Rush
    "#4b5563", // Dark Charcoal: Staircase Bottlenecks
    "#9ca3af", // Slate Grey: Bulk Suburb Orders
  ];

  // Filter points based on cluster selection
  const filteredPoints = points.filter((p) => {
    const clusterId = clusterAlgorithm === "kmeans" ? p.kmeans_cluster : p.hierarchical_cluster;
    if (selectedClusterFilter === "all") return true;
    return clusterId === selectedClusterFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-zinc-200 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
            <GitFork className="w-4 h-4 text-black" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                Order Topology & Latent Manifold Projection
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-semibold">
                EXP 09 & EXP 14
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Principal Component Analysis (PCA 2D) • Unsupervised K-Means (k=3) & Agglomerative Hierarchical Ward
            </p>
          </div>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
          <button
            onClick={() => setClusterAlgorithm("kmeans")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              clusterAlgorithm === "kmeans"
                ? "bg-black text-white shadow-xs"
                : "text-zinc-600 hover:text-black hover:bg-zinc-100"
            }`}
          >
            K-Means (k=3)
          </button>
          <button
            onClick={() => setClusterAlgorithm("hierarchical")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              clusterAlgorithm === "hierarchical"
                ? "bg-black text-white shadow-xs"
                : "text-zinc-600 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Hierarchical Ward (k=3)
          </button>
        </div>
      </div>

      {/* Variance Explained & PCA Dimensionality Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
            First Principal Component (PC₁)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
              {(explainedVar[0] * 100).toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-zinc-700">Eigenvalue λ₁</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
            Primary transit distance, items payload, and overall delivery duration.
          </p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
            Second Principal Component (PC₂)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
              {(explainedVar[1] * 100).toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-zinc-700">Eigenvalue λ₂</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
            Orthogonal vertical climb delay (customer floor) vs dark store prep.
          </p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
            Cumulative 2D Explained Variance
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-zinc-950 tabular-nums font-mono">
              {(totalVar * 100).toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-zinc-700">λ₁ + λ₂</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
            72.8% of high-dimensional hyperlocal variance preserved in clean 2D plane.
          </p>
        </div>
      </div>

      {/* 2D PCA Scatter Visualization & Loadings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Scatter Projection (8 cols) */}
        <div className="lg:col-span-8 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs">
          <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-zinc-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-black" strokeWidth={1.75} />
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                  2D PCA Latent Space Scatter Projection (n=120 samples)
                </h3>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                Current Clustering Algorithm: <span className="text-zinc-950 font-bold uppercase">{clusterAlgorithm}</span>
              </p>
            </div>

            {/* Filter by cluster */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-zinc-500 font-medium">Filter:</span>
              <button
                onClick={() => setSelectedClusterFilter("all")}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedClusterFilter === "all" 
                    ? "bg-black text-white shadow-2xs" 
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                ALL
              </button>
              {profiles.map((p) => (
                <button
                  key={p.cluster_id}
                  onClick={() => setSelectedClusterFilter(p.cluster_id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    selectedClusterFilter === p.cluster_id
                      ? "bg-black text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: clusterColors[p.cluster_id] }} />
                  <span>{p.cluster_name.split(" ")[0].toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 15, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                <XAxis 
                  type="number" 
                  dataKey="pc1" 
                  name="PC1" 
                  stroke="#374151" 
                  fontSize={11}
                  tickLine={false}
                  label={{ value: "Principal Component 1 (Transit & Item Load)", position: "insideBottom", offset: -10, fill: "#111827", fontSize: 11, fontWeight: 500 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="pc2" 
                  name="PC2" 
                  stroke="#374151" 
                  fontSize={11}
                  tickLine={false}
                  label={{ value: "Principal Component 2 (Vertical Stairs & Floor)", angle: -90, position: "insideLeft", offset: 12, fill: "#111827", fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: "2 2", stroke: "#000000" }} 
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload;
                    const cId = clusterAlgorithm === "kmeans" ? data.kmeans_cluster : data.hierarchical_cluster;
                    return (
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-lg text-xs space-y-1">
                        <p className="font-bold text-zinc-950">{data.order_id} • {data.dark_store_id}</p>
                        <p className="font-semibold text-zinc-800">
                          Segment: {data.cluster_name}
                        </p>
                        <p className="text-zinc-600">Turnaround: <span className="text-black font-bold tabular-nums">{data.delivery_time} min</span></p>
                        <p className="text-zinc-600">
                          15m SLA: <span className={data.sla_breached === 1 ? "text-zinc-950 font-bold" : "text-zinc-700 font-medium"}>
                            {data.sla_breached === 1 ? "SLA BREACHED" : "ON TIME"}
                          </span>
                        </p>
                        <p className="text-zinc-400 text-[10px] font-mono">PC1: {data.pc1}, PC2: {data.pc2}</p>
                      </div>
                    );
                  }}
                />
                <Scatter name="Cluster Points" data={filteredPoints}>
                  {filteredPoints.map((entry, index) => {
                    const cId = clusterAlgorithm === "kmeans" ? entry.kmeans_cluster : entry.hierarchical_cluster;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={clusterColors[cId]} 
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 mt-2 pt-3 border-t border-zinc-100">
            <span>Projection: Scikit-learn PCA(n_components=2)</span>
            <span>Hover on point to inspect order duration and dark store hub</span>
          </div>
        </div>

        {/* PCA Eigenvector Feature Loadings (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white border border-zinc-200 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-zinc-100">
              <Layers className="w-4 h-4 text-black" strokeWidth={1.75} />
              <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                Eigenvector Loadings (Exp 14)
              </h3>
            </div>
            <p className="text-xs text-zinc-600 mb-3">
              Weights of original standardized variables on orthogonal PC axes:
            </p>

            <div className="space-y-2 text-xs">
              {loadings.map((load) => (
                <div key={load.feature} className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70">
                  <div className="text-zinc-950 font-bold font-mono text-xs mb-1">
                    {load.feature}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="text-zinc-800">
                      PC1: <span className="font-bold tabular-nums text-black">{load.pc1_loading > 0 ? `+${load.pc1_loading}` : load.pc1_loading}</span>
                    </div>
                    <div className="text-zinc-800">
                      PC2: <span className="font-bold tabular-nums text-black">{load.pc2_loading > 0 ? `+${load.pc2_loading}` : load.pc2_loading}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-100">
            PCA removes multicollinearity while preserving variance in 2D space.
          </div>
        </div>
      </div>

      {/* Cluster Profiles Characterization Cards (Exp 9) */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-black" strokeWidth={1.75} />
          <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
            Logistical Operational Segments (Exp 9: K-Means Profiles)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {profiles.map((profile) => {
            const color = clusterColors[profile.cluster_id];
            return (
              <div 
                key={profile.cluster_id}
                className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-xs relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: color }}
                />
                
                <div className="flex items-center justify-between mb-2 pt-1">
                  <span className="font-bold text-zinc-950 flex items-center space-x-2 text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span>{profile.cluster_name}</span>
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 font-mono font-semibold text-zinc-800">
                    n={profile.sample_count}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 mb-3 min-h-[32px] leading-relaxed">
                  {profile.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-zinc-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Mean Distance:</span>
                    <span className="text-zinc-950 font-semibold tabular-nums">{profile.avg_distance_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Mean Floor:</span>
                    <span className="text-zinc-950 font-semibold tabular-nums">{profile.avg_customer_floor}th floor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Mean Weight:</span>
                    <span className="text-zinc-950 font-semibold tabular-nums">{profile.avg_order_weight_kg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Mean Turnaround:</span>
                    <span className="text-zinc-950 font-bold tabular-nums">{profile.avg_delivery_time} min</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-zinc-100">
                    <span className="text-zinc-600 font-medium">SLA Breach Rate:</span>
                    <span className="font-bold tabular-nums text-zinc-950">
                      {profile.breach_rate_pct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
