# BlinkRoute IQ — Hyperlocal Quick-Commerce Analytics Platform

**BlinkRoute IQ** is a production-grade Quick-Commerce & Hyperlocal Logistics Analytics Platform. It predicts order delivery turnaround times, decomposes transit/last-mile delays, and evaluates 15-minute SLA breach risks across dark store networks.

The platform implements and showcases **all 15 Academic Data Science & Machine Learning Laboratory Experiments** inside a full-stack decoupled architecture.

## Enterprise Design Language & Architecture (Anti-AI Laws)
- **Zero Emojis**: Strictly 14px / 16px Lucide-React SVG icons (`strokeWidth={1.5}`).
- **Zero AI Clichés**: No gradient mesh blobs, no bubbly glassmorphism, no rounded buttons.
- **Palette**: Neutral slate/zinc dark-first theme (`bg-zinc-950`, `border-zinc-800`, `text-zinc-200`) with precise semantic accents (Operational Emerald `#10b981`, Warning Amber `#f59e0b`, Critical Crimson `#f43f5e`, Data Blue `#3b82f6`).
- **Typography**: Inter sans-serif labels; strict monospace (`tabular-nums`) for all metrics, coefficients, coordinates, and coordinates.
- **High Information Density**: 1px crisp borders, micro-labels (`text-[10px] uppercase tracking-wider text-zinc-500`), compact data tables, 5px solid status pips.

---

## All 15 Laboratory Experiments Implementation Map

| Experiment | Title | Backend Location | Frontend Component & UI |
|---|---|---|---|
| **Exp 1** | Python Data Structures & Core Transformations | `app/core/pipeline.py` (`compute_eda`) | Tab 1: Expandable Python Tuples & Dict Comprehension Explorer |
| **Exp 2** | NumPy Expected Value, Mean, Variance, Std Dev, Covariance & Correlation Matrix | `app/core/pipeline.py` & `app/api/eda.py` | Tab 1: Statistical Moment Cards & Interactive $N \times N$ Heatmap |
| **Exp 3** | Continuous Data Preprocessing (Missing Imputation, IQR Outliers, Scaling) | `app/core/pipeline.py` & `app/api/preprocessing.py` | Tab 1: Tukey's IQR Fences, StandardScaler metrics, Median Imputer |
| **Exp 4** | Categorical Preprocessing (Missing Imputation, One-Hot Encoding) | `app/core/pipeline.py` & `app/api/preprocessing.py` | Tab 1: Mode Imputation & One-Hot Encoded Dummy Variable badges |
| **Exp 5** | Simple Linear Regression ($X \to y$) | `app/core/pipeline.py` & `app/api/regression.py` | Tab 2: Distance vs. Delivery Turnaround, Intercept & Slope |
| **Exp 6** | Multiple Linear Regression (Multivariate OLS) | `app/core/pipeline.py` & `app/api/regression.py` | Tab 2: Partial Derivative Weights, $R^2$, RMSE, MAE, Scatter & Residual Histogram |
| **Exp 7** | Logistic Regression & Sigmoid Curve | `app/core/pipeline.py` & `app/api/classification.py` | Tab 3: Interactive Draggable Sigmoid Curve Dial $S(z) = \frac{1}{1+e^{-z}}$ |
| **Exp 8** | ID3 Decision Tree Classifier | `app/core/pipeline.py` (`criterion='entropy'`) | Tab 3: Tournament Leaderboard & $2 \times 2$ Confusion Matrix |
| **Exp 9** | K-Means & Agglomerative Hierarchical Clustering | `app/core/pipeline.py` & `app/api/clustering.py` | Tab 4: Logistics Segmentation (Hyperlocal Rush, Staircase Bottlenecks, Bulk Suburb) |
| **Exp 10** | K-Nearest Neighbors (KNN) | `app/core/pipeline.py` (`KNeighborsClassifier`) | Tab 3: Distance-Weighted Neighbor Classification |
| **Exp 11** | Gaussian Naive Bayes Classifier | `app/core/pipeline.py` (`GaussianNB`) | Tab 3: Bayesian Probabilistic SLA Classifier |
| **Exp 12** | Random Forest Classifier | `app/core/pipeline.py` (`RandomForestClassifier`) | Tab 3: 50-Estimator Ensemble Bagging Leaderboard |
| **Exp 13** | Support Vector Machine (Linear, Poly, RBF Kernels) | `app/core/pipeline.py` (`SVC` kernels comparison) | Tab 3: Linear vs. Polynomial (degree=3) vs. Radial Basis Function (RBF) |
| **Exp 14** | Principal Component Analysis (PCA 2D) | `app/core/pipeline.py` (`PCA(n_components=2)`) | Tab 4: 2D Latent Space Scatter, Eigenvector Loadings, 72.8% Variance |
| **Exp 15** | Dataset Ingestion & Schema Parsing via Pandas | `backend/data/seed_dataset.py` & `pipeline.py` | Tab 1: Ingestion of 5,000 deterministic records, memory & dtypes profiling |

---

## Quick-Start Guide

### 1. Prerequisites
- **Python**: 3.11 or 3.12+
- **Node.js**: v18+ (v22+ supported)
- **npm**: v9+

---

### 2. Backend Setup (FastAPI)

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Generate the deterministic 5,000-order Quick-Commerce dataset:
   ```bash
   python data/seed_dataset.py
   ```
   *Creates `backend/data/blinkroute_orders.csv` (5,000 rows, 31.5% SLA breach rate, controlled real-world missing values and anomalies).*

5. Boot the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - API Root: `http://localhost:8000`
   - Interactive Swagger API Documentation: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/api/health`

---

### 3. Frontend Setup (Next.js 14 + Tailwind + Recharts)

1. Open a second terminal window:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *(Or run production server: `npm run build` followed by `npm run start`)*

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## System Architecture

```
blinkroute-platform/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entrypoint, CORS, exception handling
│   │   ├── api/
│   │   │   ├── eda.py               # Exp 1, 2, 15: NumPy stats, covariance matrix
│   │   │   ├── preprocessing.py     # Exp 3, 4: Missing data, IQR outliers, scaling
│   │   │   ├── regression.py        # Exp 5, 6: Simple & Multiple Linear Regression
│   │   │   ├── classification.py    # Exp 7, 8, 10, 11, 12, 13: 8 Classifiers + Sigmoid
│   │   │   ├── clustering.py        # Exp 9, 14: K-Means, Hierarchical, PCA 2D
│   │   │   └── simulator.py         # Live single-order ETA & SLA inference
│   │   ├── core/
│   │   │   └── pipeline.py          # Unified data engine & ML experiments
│   │   └── schemas/
│   │       └── payload.py           # Pydantic v2 schemas for all payloads
│   ├── data/
│   │   ├── blinkroute_orders.csv    # Primary dataset (5,000 records)
│   │   └── seed_dataset.py          # Deterministic data generation script
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── globals.css          # Glassmorphism, neon highlights, dark mode
    │   │   ├── layout.tsx           # Dashboard root layout shell
    │   │   └── page.tsx             # Master tabbed workspace with 15 experiments modal
    │   ├── components/
    │   │   ├── StatsProfiler.tsx    # Tab 1: Covariance heatmap & IQR boxplot visualizer
    │   │   ├── RegressionLab.tsx    # Tab 2: Slope/intercept metrics & Actual vs. Predicted
    │   │   ├── ClassifierArena.tsx  # Tab 3: Model leaderboard, SVM kernels, Sigmoid dial
    │   │   ├── ClusterPcaMap.tsx    # Tab 4: 2D PCA scatter plot with K-Means clusters
    │   │   └── DispatchConsole.tsx  # Tab 5: Live order simulator with real-time ETA
    │   ├── services/
    │   │   └── api.ts               # Typed fetch client
    │   └── types/
    │       └── index.ts             # TypeScript interfaces matching backend Pydantic
    ├── tailwind.config.js
    ├── next.config.mjs
    └── package.json
```

---

## Experiments Summary

### 1. Data Profiler & Mathematical Foundations (Exp 1, 2, 3, 4, 15)
- **NumPy Moments**: Computes Empirical Expected Value $E[X]$, Variance $\sigma^2 = E[(X - \mu)^2]$, Standard Deviation $\sigma$, and full $6 \times 6$ Covariance Matrix $\text{Cov}(X_i, X_j)$ and Pearson Correlation Matrix $r_{ij}$.
- **Preprocessing Pipeline**: Detects nulls, applies Median Imputation on continuous variables and Mode Imputation on nominal categories. Implements Tukey's IQR rule: $Q_1 - 1.5 \times IQR$ and $Q_3 + 1.5 \times IQR$. Applies `StandardScaler` transforming features to $\mathcal{N}(0, 1)$ and `OneHotEncoder` on vehicle, traffic, weather, and time slots.
- **Python Structures (Exp 1)**: Demonstrates tuples, dictionary comprehensions for dark store aggregation, and list comprehension filtering.

### 2. Fulfillment Turnaround Regression Lab (Exp 5, 6)
- **Simple Linear Regression (Exp 5)**: Evaluates road transit effect: $\text{ETA} = 5.75 + 3.70 \times \text{distance\_km}$.
- **Multiple Linear Regression (Exp 6)**: Fits Ordinary Least Squares (OLS) closed-form solution: $\hat{\beta} = (X^T X)^{-1} X^T y$. Yields partial derivative time added per kilometer ($+3.58$ min/km), per building floor without lift ($+0.28$ min/floor), per item count, and picker prep time. Displays $R^2$, RMSE, MAE, Actual vs. Predicted scatter plot with $y = x$ reference line, and residual error distribution histogram.

### 3. SLA Classifier Tournament Arena (Exp 7, 8, 10, 11, 12, 13)
- Benchmarks 8 ML models on the 15-minute SLA breach target:
  1. **Logistic Regression** (Exp 7)
  2. **ID3 Decision Tree** (`criterion='entropy'`) (Exp 8)
  3. **K-Nearest Neighbors** (`n_neighbors=5`) (Exp 10)
  4. **Gaussian Naive Bayes** (Exp 11)
  5. **Random Forest** (Exp 12)
  6. **SVM — Linear Kernel** (Exp 13)
  7. **SVM — Polynomial Kernel (degree=3)** (Exp 13)
  8. **SVM — RBF Kernel** (Exp 13)
- Ranks models on Accuracy, Precision, Recall, and F1-Score with an interactive $2 \times 2$ Confusion Matrix (`TN`, `FP`, `FN`, `TP`, `FPR`, `Sensitivity`, `Specificity`).
- **Interactive Sigmoid Curve Visualizer (Exp 7)**: Plots $S(z) = \frac{1}{1 + e^{-z}}$. Includes a live draggable threshold slider ($p \in [0.10, 0.90]$) that dynamically recalculates precision, recall, and F1-score in real-time.

### 4. Cluster & PCA Latent Space Topology (Exp 9, 14)
- **PCA 2D (Exp 14)**: Reduces high-dimensional hyperlocal space into $PC_1$ (43.8% variance) and $PC_2$ (29.0% variance), capturing over 72.8% cumulative variance.
- **Clustering (Exp 9)**: Fits K-Means ($k=3$) and Hierarchical Agglomerative Clustering ($k=3$, Ward linkage). Identifies 3 operational segments:
  - *Cluster 0 — Hyperlocal Rush*: Sub-1.5km orders, rapid transit, high SLA compliance.
  - *Cluster 1 — Staircase Bottlenecks*: Multi-story buildings without elevators, high delivery turnaround.
  - *Cluster 2 — Bulk Suburb Orders*: Higher payload weight, longer transit radius.

### 5. Live Dispatch Simulator (Real-Time Inference)
- Interactive console with physical sliders for distance, dark store picker prep, building floor, working elevator toggle, payload weight, item count, rider vehicle, traffic level, and weather.
- Computes real-time fulfillment ETA (minutes) and Sigmoid SLA breach probability $P(\text{Breach}) = \frac{1}{1 + e^{-z}}$.
- Assigns operational status badges (`ON_TIME_SAFE`, `AT_RISK`, `CRITICAL_BREACH`) and actionable recommendations (e.g., ground-floor security handover, priority green tote pass, EV 2W reassignment).
- Quick scenario preset buttons: *Sub-1km Sprint*, *Monsoon Jam*, *Floor 8 No Lift*, and *12kg Heavy Cart*.
