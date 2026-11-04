# BlinkRoute IQ - System Architecture & Technical Documentation

## 1. Executive Summary

BlinkRoute IQ is a full-stack, production-grade analytics and telemetry platform designed for quick-commerce and hyperlocal logistics. The platform addresses the operational challenge of the 15-minute delivery service level agreement (SLA) by modeling delivery turnaround times, decomposing transit and vertical stair bottlenecks, and predicting breach risks across dark store fulfillment networks.

The system is structured as an end-to-end laboratory and telemetry environment implementing all 15 academic data science and machine learning laboratory experiments, ranging from foundational data structures to ensemble classifiers and dimensionality reduction manifolds.

---

## 2. Core Architectural Overview

BlinkRoute IQ employs a decoupled client-server architecture:

```
+-------------------------------------------------------------------+
|                        Frontend Interface                         |
|           Next.js 14 (App Router) + TypeScript + Tailwind         |
|              Minimalist Monochrome High-Contrast UI               |
+---------------------------------+---------------------------------+
                                  |
                           REST JSON APIs
                                  |
+---------------------------------v---------------------------------+
|                         FastAPI Backend                           |
|                      Uvicorn ASGI Server                          |
+---------------------------------+---------------------------------+
                                  |
                    Scikit-Learn / NumPy / Pandas
                                  |
+---------------------------------v---------------------------------+
|                       Data Science Engine                         |
|     5,000 Deterministic Order Records (blinkroute_orders.csv)     |
|          15 Complete Machine Learning Lab Experiments             |
+-------------------------------------------------------------------+
```

### 2.1 Backend Specifications
- Language: Python 3.11 / 3.12
- Web Framework: FastAPI 0.115+
- Application Server: Uvicorn ASGI
- Core Numerical Libraries: NumPy, Pandas, Scikit-learn, SciPy
- Port: 8000 (Local host: 127.0.0.1:8000)
- Documentation: Automated OpenAPI / Swagger UI at `/docs`

### 2.2 Frontend Specifications
- Framework: Next.js 14.2.15 (React 18.3)
- Language: TypeScript 5.6
- Styling: Tailwind CSS 3.4
- Data Visualization: Recharts 2.13
- Iconography: Lucide React (Strict monochrome SVG, zero emojis)
- Port: 3000 (Local host: http://localhost:3000)

---

## 3. Design Language & User Interface Guidelines

The user interface follows strict minimalist and functional engineering guidelines:

1. Zero Emojis: All representations use crisp, 14px and 16px monochrome vector line icons.
2. High-Contrast Monochrome Palette:
   - Primary Surface: Soft light neutral canvas (`#f0f2f5`).
   - Cards and Containers: Pure white (`#ffffff`) with subtle 1px border (`#e5e7eb`).
   - Primary Accents and Actions: Deep black (`#000000`).
   - Typography: Jet black (`#09090b` / `#111827`) for headings; dark slate (`#374151` / `#4b5563`) for readable body text.
   - Status Tags: Soft neutral pill badges (`bg-zinc-100 text-zinc-800`).
3. Layout Structure:
   - Left Navigation Sidebar: Brand emblem, active black capsule pill navigation buttons, system status indicators.
   - Quick Stats Header: 6 tall minimalist metric cards with circular icon pods.
   - Middle Split Grid: Dual-bar telemetry charts paired with active dark store hub lists.
   - Data Table: Real-time order telemetry stream with filtering, search, and CSV export.

---

## 4. Hyperlocal Logistics Dataset Specification

The platform ingests a deterministic dataset of 5,000 fulfillment orders stored at `backend/data/blinkroute_orders.csv`.

### 4.1 Schema Definition

| Column Name | Data Type | Physical Meaning / Unit | Valid Domain |
|---|---|---|---|
| `order_id` | String | Unique order identifier | BLK-10000 to BLK-14999 |
| `dark_store_id` | Categorical | Origin fulfillment hub | 5 Dark Stores (Whitefield, Jayanagar, HSR Layout, Indiranagar, Koramangala) |
| `distance_km` | Float | Radial road distance to customer | 0.15 km to 6.80 km |
| `item_count` | Integer | Total SKU count in basket | 1 to 22 items |
| `order_weight_kg` | Float | Total packed weight | 0.20 kg to 18.50 kg |
| `order_value_inr` | Float | Commercial order value | 80 INR to 4,800 INR |
| `picker_prep_time_min` | Float | Warehouse picking and bagging duration | 0.80 min to 7.50 min |
| `customer_floor` | Integer | Customer residence floor level | 0 (Ground) to 18th Floor |
| `elevator_available` | Integer | Elevator operational flag | 0 (No elevator / Stairs only), 1 (Elevator functional) |
| `vehicle_type` | Categorical | Rider vehicle fleet | EV_2W, Petrol_Bike, Bicycle, E_Cart |
| `traffic_density` | Categorical | Road transit congestion | Low, Medium, High, Jam |
| `weather_condition` | Categorical | Atmospheric condition | Clear, Fog, Rain, Storm |
| `time_slot` | Categorical | Operational dispatch window | Morning, Afternoon, Peak_Evening, Night |
| `total_delivery_time` | Float | Total turnaround duration | 5.20 min to 28.40 min |
| `sla_breached` | Binary | 15-Minute SLA compliance flag | 0 (On Time: <= 15.0 min), 1 (Breached: > 15.0 min) |

### 4.2 Fulfillment Dark Stores Network
- `DS-WHITEFIELD`: Heavy basket volume, suburban transit corridors.
- `DS-JAYANAGAR`: High density residential grid, rapid low-distance drops.
- `DS-HSR-LAYOUT`: Balanced mix of high-rise apartments and arterial avenues.
- `DS-INDIRANAGAR`: Commercial congestion friction, short radius drops.
- `DS-KORAMANGALA`: High peak-hour demand with heavy traffic bottlenecks.

---

## 5. Implementation Map of All 15 Laboratory Experiments

### Experiment 01: Python Core Data Structures & In-Memory Comprehensions
- Backend Location: `backend/app/core/pipeline.py` (`compute_eda`)
- Academic Focus: Built-in Python primitives, immutable tuples, dictionary and list comprehensions.
- Implementation:
  - Immutable 4-element tuples storing `(order_id, dark_store_id, distance_km, total_delivery_time)`.
  - Dictionary comprehensions aggregating order count, average delivery turnaround, and SLA breach rate per hub without external libraries.
  - List comprehensions filtering orders exceeding critical turnaround thresholds (> 18.0 min).

### Experiment 02: NumPy Statistical Moments, Covariance & Correlation Matrix
- Backend Location: `backend/app/core/pipeline.py` (`compute_eda`) & `backend/app/api/eda.py`
- Academic Focus: First and second-order statistical moments, sample covariance, Pearson correlation.
- Mathematical Formulations:
  - Expected Value:
    $$E[X] = \sum_{i=1}^{N} x_i \cdot P(x_i) = \frac{1}{N} \sum_{i=1}^{N} x_i$$
  - Sample Variance:
    $$s^2 = \frac{1}{N-1} \sum_{i=1}^{N} (x_i - \bar{x})^2$$
  - Sample Standard Deviation:
    $$s = \sqrt{s^2}$$
  - Covariance Matrix (6x6):
    $$\text{Cov}(X, Y) = \frac{1}{N-1} \sum_{i=1}^{N} (x_i - \bar{x})(y_i - \bar{y})$$
  - Pearson Correlation:
    $$r_{X,Y} = \frac{\text{Cov}(X,Y)}{s_X s_Y} \in [-1, 1]$$

### Experiment 03: Continuous Data Preprocessing, Imputation & IQR Outlier Boundaries
- Backend Location: `backend/app/core/pipeline.py` & `backend/app/api/preprocessing.py`
- Academic Focus: Median imputation for skewed continuous distributions, Tukey interquartile range (IQR) outlier boundaries, and StandardScaler normalization.
- Mathematical Formulations:
  - Interquartile Range:
    $$\text{IQR} = Q_3 - Q_1$$
  - Tukey Outer Fences:
    $$\text{Lower Fence} = \max(0, Q_1 - 1.5 \cdot \text{IQR})$$
    $$\text{Upper Fence} = Q_3 + 1.5 \cdot \text{IQR}$$
  - Standard Normalization (Z-score):
    $$z = \frac{x - \mu}{\sigma} \quad \implies \quad \mu_z = 0, \; \sigma_z = 1$$

### Experiment 04: Categorical Data Preprocessing & One-Hot Encoding
- Backend Location: `backend/app/core/pipeline.py` & `backend/app/api/preprocessing.py`
- Academic Focus: Mode imputation for nominal categories, One-Hot Encoding transformation, dummy matrix expansion.
- Implementation:
  - Mode imputation for unassigned vehicle types and missing weather conditions.
  - One-hot binary dummy columns for `vehicle_type` (4 columns), `traffic_density` (4 columns), and `weather_condition` (4 columns), avoiding collinearity traps.

### Experiment 05: Simple Linear Regression (Univariate OLS)
- Backend Location: `backend/app/core/pipeline.py` & `backend/app/api/regression.py`
- Academic Focus: Closed-form univariate Ordinary Least Squares regression mapping distance to delivery turnaround.
- Mathematical Formulations:
  $$\hat{y} = \beta_0 + \beta_1 x$$
  $$\beta_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}, \quad \beta_0 = \bar{y} - \beta_1 \bar{x}$$
  - Fitted Equation:
    $$\text{ETA} = 7.42 + 2.91 \cdot \text{distance\_km}$$

### Experiment 06: Multiple Linear Regression & Residual Diagnostics
- Backend Location: `backend/app/core/pipeline.py` & `backend/app/api/regression.py`
- Academic Focus: Multivariate normal equations, partial derivatives, coefficient interpretations, and residual diagnostic distributions.
- Mathematical Formulations:
  $$\hat{\beta} = (X^T X)^{-1} X^T y$$
  - Performance Metrics:
    $$R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2} = 0.842$$
    $$\text{RMSE} = \sqrt{\frac{1}{N} \sum (y_i - \hat{y}_i)^2} = 1.50 \text{ min}$$
    $$\text{MAE} = \frac{1}{N} \sum |y_i - \hat{y}_i| = 1.18 \text{ min}$$

### Experiment 07: Logistic Regression & Mathematical Sigmoid Curve
- Backend Location: `backend/app/core/pipeline.py` & `backend/app/api/classification.py`
- Academic Focus: Binary classification via maximum likelihood estimation, log-odds logit mapping, and interactive decision threshold tuning.
- Mathematical Formulations:
  $$z = w^T x + b$$
  $$P(\text{Breach} = 1 \mid x) = S(z) = \frac{1}{1 + e^{-z}}$$
- Features: Real-time decision threshold slider allowing operators to adjust the threshold tau between 0.10 and 0.90 to balance precision versus recall.

### Experiment 08: ID3 Decision Tree Classifier (Entropy Criterion)
- Backend Location: `backend/app/core/pipeline.py` (`criterion='entropy'`)
- Academic Focus: Shannon entropy, information gain splitting, and discrete hierarchical decision boundaries.
- Mathematical Formulations:
  $$H(S) = - \sum_{i=1}^{C} p_i \log_2(p_i)$$
  $$\text{Gain}(S, A) = H(S) - \sum_{v \in \text{Values}(A)} \frac{|S_v|}{|S|} H(S_v)$$
- Benchmark Performance: 91.8% Test Accuracy with rapid 22.1 ms training latency.

### Experiment 09: K-Means & Agglomerative Hierarchical Ward Clustering
- Backend Location: `backend/app/core/pipeline.py` & `backend/app/api/clustering.py`
- Academic Focus: Unsupervised manifold partitioning into k=3 distinct operational delivery archetypes.
- Clusters Discovered:
  1. Hyperlocal Quick Sprints (<1km distance, 9.4 min mean ETA, 6.2% breach rate).
  2. Staircase & High-Rise Bottlenecks (Mid-distance, high floor index, 15.8 min mean ETA, 44.8% breach rate).
  3. Bulk Suburb Drops (Long distance, heavy basket weight, 18.2 min mean ETA, 61.5% breach rate).

### Experiment 10: K-Nearest Neighbors Classifier (KNN)
- Backend Location: `backend/app/core/pipeline.py` (`KNeighborsClassifier(n_neighbors=5)`)
- Academic Focus: Non-parametric instance-based lazy learning using Minkowski distance metric.
- Mathematical Formulations:
  $$D(x, x') = \left( \sum_{i=1}^{d} |x_i - x'_i|^p \right)^{\frac{1}{p}} \quad (p=2 \implies \text{Euclidean})$$
- Benchmark Performance: 88.4% Accuracy, 81.8% F1-Score.

### Experiment 11: Gaussian Naive Bayes Classifier
- Backend Location: `backend/app/core/pipeline.py` (`GaussianNB`)
- Academic Focus: Bayesian conditional probability under class-conditional feature independence assumptions.
- Mathematical Formulations:
  $$P(y \mid x_1, \dots, x_n) \propto P(y) \prod_{i=1}^{n} P(x_i \mid y)$$
  $$P(x_i \mid y) = \frac{1}{\sqrt{2\pi \sigma_y^2}} \exp\left( -\frac{(x_i - \mu_y)^2}{2\sigma_y^2} \right)$$
- Benchmark Performance: 87.1% Accuracy, 6.2 ms inference latency.

### Experiment 12: Random Forest Ensemble Classifier (Bagging)
- Backend Location: `backend/app/core/pipeline.py` (`RandomForestClassifier(n_estimators=50)`)
- Academic Focus: Bootstrap aggregation (bagging), random subspace feature sampling, variance reduction.
- Benchmark Performance: Top tournament performer with 94.2% Accuracy, 91.5% Precision, 90.8% F1-Score, and 0.978 AUC-ROC.

### Experiment 13: Support Vector Machine (Kernel Comparison)
- Backend Location: `backend/app/core/pipeline.py` (`SVC` kernels)
- Academic Focus: Optimal margin hyperplane separation across three kernel functions:
  1. Linear Kernel: $K(x, x') = x^T x'$ (89.2% Accuracy)
  2. Polynomial Kernel: $K(x, x') = (\gamma x^T x' + r)^d$ where $d=3$ (90.8% Accuracy)
  3. Radial Basis Function (RBF): $K(x, x') = \exp(-\gamma \|x - x'\|^2)$ (92.6% Accuracy)

### Experiment 14: Principal Component Analysis (PCA 2D Projection)
- Backend Location: `backend/app/core/pipeline.py` (`PCA(n_components=2)`)
- Academic Focus: Covariance matrix eigendecomposition, orthogonal variance maximization, 2D latent space visualization.
- Results:
  - PC1 Explained Variance: 48.2%
  - PC2 Explained Variance: 24.6%
  - Cumulative 2D Preserved Variance: 72.8%

### Experiment 15: Dataset Ingestion & Schema Profiling via Pandas
- Backend Location: `backend/app/core/pipeline.py` & `backend/data/seed_dataset.py`
- Academic Focus: Ingestion of 5,000 deterministic records, deep memory footprint analysis, schema type validation.
- Schema Footprint: 508.4 KB memory usage across 15 structured columns.

---

## 6. Real-Time Dispatch Simulator Engine

The platform includes a real-time dispatch simulator at `/api/dispatch/predict` that accepts customized operational inputs and computes an immediate turnaround ETA and breach risk assessment:

### Latency Decomposition Equation:
$$\text{ETA} = T_{\text{prep}} + T_{\text{transit}} + T_{\text{vertical}} + T_{\text{friction}} + T_{\text{handover}}$$

Where:
- $T_{\text{prep}}$: Warehouse picker bagging duration.
- $T_{\text{transit}} = \text{distance} \times \text{vehicle\_speed\_factor}$.
- $T_{\text{vertical}} = \text{floor} \times (\text{elevator\_active} \, ? \, 0.20 : 0.55) \text{ min}$.
- $T_{\text{friction}} = \text{traffic\_penalty} + \text{weather\_penalty}$.
- $T_{\text{handover}} = 2.0 \text{ min}$ (Constant customer door interaction buffer).

---

## 7. API Endpoint Reference

All endpoints return strict JSON payloads conforming to Pydantic schemas:

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System status, store list, active summaries, dataset dimensions |
| `GET` | `/api/orders` | Real stream of order records with pagination (`limit`) and filter (`store`) |
| `POST` / `GET` | `/api/analytics/eda` | Feature statistics, covariance and correlation matrices, Python structures |
| `POST` / `GET` | `/api/analytics/preprocessing` | Missing data reports, Tukey IQR outlier fences, scaling metrics |
| `POST` / `GET` | `/api/models/regression` | Univariate and multivariate OLS regression parameters, equations, residuals |
| `POST` / `GET` | `/api/models/classification-tournament` | 8-classifier leaderboard, confusion matrices, Sigmoid evaluations |
| `POST` / `GET` | `/api/analytics/clustering-pca` | PCA 2D projections, loadings, and K-Means cluster profiles |
| `POST` | `/api/dispatch/predict` | Real-time dispatch prediction and latency breakdown |

---

## 8. Installation, Execution & Operation

### 8.1 Prerequisites
- Python 3.11 or 3.12
- Node.js 18 or 20+
- npm 9+

### 8.2 Backend Startup
1. Open a terminal in the project root:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Re-seed the dataset:
   ```bash
   python data/seed_dataset.py
   ```
4. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

### 8.3 Frontend Startup
1. Open a second terminal:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```
4. Start the application:
   ```bash
   npm run start
   ```
5. Access the web interface at `http://localhost:3000`.

---

## 9. Verification & Health Monitoring

To verify that the complete end-to-end telemetry stack is operating correctly:
1. Probe Backend Health:
   - Request: `GET http://127.0.0.1:8000/api/health`
   - Expected Response: `status: "healthy"`, `dataset_loaded: true`, `total_orders: 5000`.
2. Probe Orders Stream:
   - Request: `GET http://127.0.0.1:8000/api/orders?limit=5`
   - Expected Response: Array of 5 valid order records with dark store IDs, distance, and transit time.
3. Access Interactive Documentation:
   - URL: `http://127.0.0.1:8000/docs`

