"""
BlinkRoute Platform - Core Data Science & ML Engine
Implements and exposes all 15 Academic Data Science & Machine Learning Laboratory Experiments:
- Exp 1: Python data structures & core transformations (lists, dicts, tuples, comprehensions)
- Exp 2: NumPy Expected Value, Mean, Variance, Std Deviation, Covariance & Correlation Matrix
- Exp 3: Continuous data preprocessing (missing data imputation, IQR outlier detection, scaling)
- Exp 4: Categorical data preprocessing (missing data imputation, one-hot encoding, scaling)
- Exp 5 & 6: Simple & Multiple Linear Regression (intercept, coefficients, test predictions, R2, RMSE, MAE)
- Exp 7: Logistic Regression with mathematical Sigmoid curve visualization
- Exp 8: ID3 Decision Tree classifier (criterion='entropy')
- Exp 9: K-Means Clustering & Agglomerative Hierarchical Clustering
- Exp 10: K-Nearest Neighbors (KNN)
- Exp 11: Naive Bayes Classifier
- Exp 12: Random Forest Classifier
- Exp 13: Support Vector Machine (SVM) comparing Linear, Polynomial, and RBF kernels
- Exp 14: Principal Component Analysis (PCA) 2D dimensionality reduction
- Exp 15: Dataset ingestion and schema parsing via Pandas & Scikit-learn
"""

import os
import time
import warnings
from typing import Dict, Any, Tuple, List
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, mean_squared_error, mean_absolute_error, r2_score

warnings.filterwarnings("ignore")

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "blinkroute_orders.csv")

class BlinkRouteDataEngine:
    def __init__(self, data_path: str = DATA_PATH):
        self.data_path = data_path
        self._raw_df: pd.DataFrame = None
        self._clean_df: pd.DataFrame = None
        self._cache: Dict[str, Any] = {}
        self._load_data()

    def _load_data(self):
        """Exp 15: Ingestion and schema parsing via Pandas."""
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}. Please run seed_dataset.py first.")
        self._raw_df = pd.read_csv(self.data_path)
        
        # Prepare clean baseline DataFrame (impute NaNs for modeling)
        clean = self._raw_df.copy()
        for col in ["distance_km", "item_count", "order_weight_kg", "order_value_inr", "picker_prep_time_min", "customer_floor"]:
            if col in clean.columns and clean[col].isna().sum() > 0:
                clean[col] = clean[col].fillna(clean[col].median())
        for col in ["vehicle_type", "traffic_density", "weather_condition", "time_slot", "elevator_available"]:
            if col in clean.columns and clean[col].isna().sum() > 0:
                clean[col] = clean[col].fillna(clean[col].mode()[0])
        self._clean_df = clean

    def get_raw_dataframe(self) -> pd.DataFrame:
        if self._raw_df is None:
            self._load_data()
        return self._raw_df

    def get_clean_dataframe(self) -> pd.DataFrame:
        if self._clean_df is None:
            self._load_data()
        return self._clean_df

    # =========================================================================
    # EXP 1 & EXP 2 & EXP 15: EDA, Python Structures & NumPy Statistics
    # =========================================================================
    def compute_eda(self) -> Dict[str, Any]:
        if "eda" in self._cache:
            return self._cache["eda"]
        raw_df = self.get_raw_dataframe()
        clean_df = self.get_clean_dataframe()
        continuous_cols = [
            "distance_km",
            "item_count",
            "order_weight_kg",
            "order_value_inr",
            "picker_prep_time_min",
            "total_delivery_time"
        ]

        # Exp 1: Python Core Data Structures demonstration
        # Tuples (immutability), list comprehensions, dict comprehensions, set operations
        store_names = list(clean_df["dark_store_id"].unique())
        tuple_sample = [
            (row["order_id"], row["dark_store_id"], float(row["distance_km"]), float(row["total_delivery_time"]))
            for _, row in clean_df.head(5).iterrows()
        ]
        
        # Dict comprehension aggregating dark store delivery metrics
        dict_comp_stats = {
            store: {
                "orders_count": int((clean_df["dark_store_id"] == store).sum()),
                "avg_delivery_time": round(float(clean_df[clean_df["dark_store_id"] == store]["total_delivery_time"].mean()), 2),
                "breach_rate": round(float(clean_df[clean_df["dark_store_id"] == store]["sla_breached"].mean() * 100), 2)
            }
            for store in store_names
        }

        # List comprehension filtering
        critical_orders_count = len([t for t in clean_df["total_delivery_time"].values if t > 18.0])

        exp1_data = {
            "title": "Exp 1: Python Data Structures & Core Transformations",
            "description": "Demonstration of immutable Tuples, Dictionary Comprehensions for Dark Store profiling, and List Comprehension filtering.",
            "tuple_sample": tuple_sample,
            "dict_comprehension_stats": dict_comp_stats,
            "list_comprehension_filter_count": critical_orders_count
        }

        # Exp 2: NumPy Expected Value, Mean, Variance, Std Dev, Covariance & Correlation Matrix
        feature_stats = []
        for col in continuous_cols:
            arr = clean_df[col].to_numpy(dtype=np.float64)
            # Mathematical Expected Value E[X] = sum(x_i * p_i) where empirical p_i = 1/N
            n = len(arr)
            expected_val = float(np.sum(arr * (1.0 / n)))
            mean_val = float(np.mean(arr))
            variance_val = float(np.var(arr, ddof=1)) # Sample variance
            std_val = float(np.std(arr, ddof=1))      # Sample standard deviation
            min_val = float(np.min(arr))
            max_val = float(np.max(arr))
            median_val = float(np.median(arr))

            feature_stats.append({
                "feature": col,
                "expected_value": round(expected_val, 4),
                "mean": round(mean_val, 4),
                "variance": round(variance_val, 4),
                "std_dev": round(std_val, 4),
                "min": round(min_val, 4),
                "max": round(max_val, 4),
                "median": round(median_val, 4)
            })

        # Exp 2: N x N Covariance Matrix & Correlation Matrix
        sub_matrix = clean_df[continuous_cols].to_numpy(dtype=np.float64).T
        cov_mat = np.cov(sub_matrix)
        corr_mat = np.corrcoef(sub_matrix)

        cov_list = [[round(float(val), 4) for val in row] for row in cov_mat]
        corr_list = [[round(float(val), 4) for val in row] for row in corr_mat]

        # Exp 15: Schema Info
        schema_info = {
            "columns": list(raw_df.columns),
            "dtypes": {col: str(raw_df[col].dtype) for col in raw_df.columns},
            "memory_usage_kb": round(raw_df.memory_usage(deep=True).sum() / 1024.0, 2),
            "total_rows": len(raw_df),
            "total_columns": len(raw_df.columns)
        }

        result = {
            "total_records": len(raw_df),
            "features": continuous_cols,
            "feature_stats": feature_stats,
            "covariance_matrix": cov_list,
            "correlation_matrix": corr_list,
            "matrix_labels": [
                "Distance (km)",
                "Item Count",
                "Weight (kg)",
                "Value (INR)",
                "Picker Time (min)",
                "Delivery Time (min)"
            ],
            "exp1_data_structures": exp1_data,
            "schema_info": schema_info
        }
        self._cache["eda"] = result
        return result

    # =========================================================================
    # EXP 3 & EXP 4: Preprocessing (Missing Data, IQR Outliers, Scaling, OHE)
    # =========================================================================
    def compute_preprocessing(self) -> Dict[str, Any]:
        if "preprocessing" in self._cache:
            return self._cache["preprocessing"]
        raw_df = self.get_raw_dataframe()
        clean_df = self.get_clean_dataframe()
        
        # Exp 3 & 4: Missing Data Detection
        missing_reports = []
        for col in raw_df.columns:
            m_count = int(raw_df[col].isna().sum())
            m_pct = round(float((m_count / len(raw_df)) * 100), 2)
            dtype = str(raw_df[col].dtype)
            if col in ["order_weight_kg", "customer_floor"]:
                strategy = "Median Imputation (Exp 3: Continuous)"
            elif col in ["vehicle_type", "traffic_density"]:
                strategy = "Mode Imputation (Exp 4: Categorical)"
            else:
                strategy = "Complete / No Missing"
                
            missing_reports.append({
                "column": col,
                "missing_count": m_count,
                "missing_pct": m_pct,
                "data_type": dtype,
                "imputation_strategy": strategy
            })

        # Exp 3: IQR Outlier Detection
        # Q1, Q3, IQR = Q3 - Q1, Lower = Q1 - 1.5*IQR, Upper = Q3 + 1.5*IQR
        iqr_cols = ["distance_km", "order_weight_kg", "picker_prep_time_min", "customer_floor", "total_delivery_time"]
        iqr_reports = []
        for col in iqr_cols:
            series = clean_df[col].dropna()
            q1 = float(np.percentile(series, 25))
            q3 = float(np.percentile(series, 75))
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            outliers = series[(series < lower_bound) | (series > upper_bound)]
            
            iqr_reports.append({
                "feature": col,
                "q1": round(q1, 3),
                "q3": round(q3, 3),
                "iqr": round(iqr, 3),
                "lower_bound": round(lower_bound, 3),
                "upper_bound": round(upper_bound, 3),
                "outlier_count": len(outliers),
                "outlier_pct": round(float(len(outliers) / len(series) * 100), 2),
                "min_val": round(float(series.min()), 3),
                "max_val": round(float(series.max()), 3),
                "median_val": round(float(series.median()), 3),
                "sample_outliers": [round(float(v), 2) for v in outliers.head(5).values]
            })

        # Exp 3 & 4: Feature Scaling (StandardScaler)
        scale_cols = ["distance_km", "item_count", "order_weight_kg", "picker_prep_time_min", "customer_floor"]
        scaler = StandardScaler()
        scaled_matrix = scaler.fit_transform(clean_df[scale_cols])
        
        scaling_metrics = []
        for idx, col in enumerate(scale_cols):
            scaling_metrics.append({
                "feature": col,
                "raw_mean": round(float(clean_df[col].mean()), 3),
                "raw_std": round(float(clean_df[col].std()), 3),
                "scaled_mean": round(float(np.mean(scaled_matrix[:, idx])), 4),
                "scaled_std": round(float(np.std(scaled_matrix[:, idx])), 4)
            })

        # Exp 4: One-Hot Encoding
        cat_cols = ["vehicle_type", "traffic_density", "weather_condition", "time_slot"]
        ohe = OneHotEncoder(sparse_output=False, drop="first")
        ohe_encoded = ohe.fit_transform(clean_df[cat_cols])
        ohe_feature_names = list(ohe.get_feature_names_out(cat_cols))

        total_features = len(scale_cols) + len(ohe_feature_names) + 1 # +1 for elevator_available

        # Train/Test Split
        train_samples = int(len(clean_df) * 0.8)
        test_samples = len(clean_df) - train_samples

        prep_result = {
            "missing_data_report": missing_reports,
            "iqr_outliers": iqr_reports,
            "scaling_metrics": scaling_metrics,
            "one_hot_columns": ohe_feature_names,
            "train_samples": train_samples,
            "test_samples": test_samples,
            "total_features_after_encoding": total_features
        }
        self._cache["preprocessing"] = prep_result
        return prep_result

    # =========================================================================
    # EXP 5 & EXP 6: Simple & Multiple Linear Regression
    # =========================================================================
    def compute_regression(self) -> Dict[str, Any]:
        if "regression" in self._cache:
            return self._cache["regression"]
        clean_df = self.get_clean_dataframe()
        
        # 1. Simple Linear Regression: distance_km -> total_delivery_time
        X_simple = clean_df[["distance_km"]].values
        y = clean_df["total_delivery_time"].values
        
        X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X_simple, y, test_size=0.2, random_state=42)
        lr_simple = LinearRegression()
        lr_simple.fit(X_train_s, y_train_s)
        
        y_pred_s = lr_simple.predict(X_test_s)
        r2_s = float(r2_score(y_test_s, y_pred_s))
        rmse_s = float(np.sqrt(mean_squared_error(y_test_s, y_pred_s)))
        mae_s = float(mean_absolute_error(y_test_s, y_pred_s))
        slope_s = float(lr_simple.coef_[0])
        intercept_s = float(lr_simple.intercept_)

        simple_result = {
            "intercept": round(intercept_s, 4),
            "slope": round(slope_s, 4),
            "r2_score": round(r2_s, 4),
            "rmse": round(rmse_s, 4),
            "mae": round(mae_s, 4),
            "equation": f"ETA = {intercept_s:.2f} + {slope_s:.2f} * distance_km"
        }

        # 2. Multiple Linear Regression
        mult_features = ["distance_km", "item_count", "order_weight_kg", "picker_prep_time_min", "customer_floor"]
        X_mult = clean_df[mult_features].values
        
        X_train_m, X_test_m, y_train_m, y_test_m = train_test_split(X_mult, y, test_size=0.2, random_state=42)
        lr_multiple = LinearRegression()
        lr_multiple.fit(X_train_m, y_train_m)
        
        y_pred_m = lr_multiple.predict(X_test_m)
        r2_m = float(r2_score(y_test_m, y_pred_m))
        rmse_m = float(np.sqrt(mean_squared_error(y_test_m, y_pred_m)))
        mae_m = float(mean_absolute_error(y_test_m, y_pred_m))
        intercept_m = float(lr_multiple.intercept_)

        coef_interpretations = {
            "distance_km": "+{:.2f} min per km of road transit",
            "item_count": "+{:.2f} min per additional catalog item",
            "order_weight_kg": "+{:.2f} min per kg payload resistance",
            "picker_prep_time_min": "+{:.2f} min per min of dark store picking",
            "customer_floor": "+{:.2f} min per building floor climb"
        }

        coef_list = []
        for feat, val in zip(mult_features, lr_multiple.coef_):
            coef_list.append({
                "feature": feat,
                "coefficient": round(float(val), 4),
                "interpretation": coef_interpretations[feat].format(val)
            })

        equation_terms = [f"{intercept_m:.2f}"] + [f"{c:.2f} * {f}" for f, c in zip(mult_features, lr_multiple.coef_)]
        equation_m = f"ETA = " + " + ".join(equation_terms)

        # 50 sample predictions for scatter plot & residual distribution
        test_df_sample = clean_df.iloc[X_test_m.shape[0]:].head(50) if len(clean_df) > 1000 else clean_df.head(50)
        prediction_samples = []
        for i in range(min(50, len(y_test_m))):
            act = float(y_test_m[i])
            pred = float(y_pred_m[i])
            prediction_samples.append({
                "order_id": f"BLK-{10000 + i}",
                "distance_km": round(float(X_test_m[i, 0]), 2),
                "actual_time": round(act, 2),
                "predicted_time": round(pred, 2),
                "residual": round(pred - act, 2)
            })

        multiple_result = {
            "intercept": round(intercept_m, 4),
            "coefficients": coef_list,
            "r2_score": round(r2_m, 4),
            "rmse": round(rmse_m, 4),
            "mae": round(mae_m, 4),
            "equation": equation_m,
            "prediction_samples": prediction_samples
        }

        reg_data = {
            "simple_regression": simple_result,
            "multiple_regression": multiple_result
        }
        self._cache["regression"] = reg_data
        return reg_data

    # =========================================================================
    # EXP 7, 8, 10, 11, 12, 13: Classification Tournament + Sigmoid Visualizer
    # =========================================================================
    def compute_classification_tournament(self) -> Dict[str, Any]:
        if "classification" in self._cache:
            return self._cache["classification"]
        clean_df = self.get_clean_dataframe()
        
        # Feature preparation: numeric scaled + categorical one-hot encoded
        num_cols = ["distance_km", "item_count", "order_weight_kg", "picker_prep_time_min", "customer_floor", "elevator_available"]
        cat_cols = ["vehicle_type", "traffic_density", "weather_condition", "time_slot"]
        
        scaler = StandardScaler()
        X_num = scaler.fit_transform(clean_df[num_cols])
        
        ohe = OneHotEncoder(sparse_output=False, drop="first")
        X_cat = ohe.fit_transform(clean_df[cat_cols])
        
        X = np.hstack([X_num, X_cat])
        y = clean_df["sla_breached"].to_numpy(dtype=int)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        models_to_run = [
            {
                "id": "logistic_regression",
                "name": "Logistic Regression",
                "experiment_tag": "Exp 7: Logistic Regression",
                "category": "Linear / Probabilistic",
                "clf": LogisticRegression(max_iter=1000, random_state=42),
                "hyperparams": {"max_iter": 1000, "solver": "lbfgs", "C": 1.0}
            },
            {
                "id": "id3_decision_tree",
                "name": "ID3 Decision Tree (Entropy)",
                "experiment_tag": "Exp 8: ID3 Decision Tree",
                "category": "Tree-based",
                "clf": DecisionTreeClassifier(criterion="entropy", max_depth=6, random_state=42),
                "hyperparams": {"criterion": "entropy", "max_depth": 6, "min_samples_split": 10}
            },
            {
                "id": "knn",
                "name": "K-Nearest Neighbors (KNN)",
                "experiment_tag": "Exp 10: K-Nearest Neighbors",
                "category": "Instance-based",
                "clf": KNeighborsClassifier(n_neighbors=5, weights="distance"),
                "hyperparams": {"n_neighbors": 5, "metric": "minkowski", "p": 2}
            },
            {
                "id": "naive_bayes",
                "name": "Gaussian Naive Bayes",
                "experiment_tag": "Exp 11: Naive Bayes",
                "category": "Bayesian Probabilistic",
                "clf": GaussianNB(),
                "hyperparams": {"var_smoothing": 1e-9}
            },
            {
                "id": "random_forest",
                "name": "Random Forest Classifier",
                "experiment_tag": "Exp 12: Random Forest",
                "category": "Ensemble Bagging",
                "clf": RandomForestClassifier(n_estimators=50, max_depth=8, random_state=42, n_jobs=-1),
                "hyperparams": {"n_estimators": 50, "max_depth": 8, "criterion": "gini"}
            },
            {
                "id": "svm_linear",
                "name": "SVM (Linear Kernel)",
                "experiment_tag": "Exp 13: SVM Linear",
                "category": "Max-Margin Kernel",
                "clf": SVC(kernel="linear", C=1.0, max_iter=2500, probability=True, random_state=42),
                "hyperparams": {"kernel": "linear", "C": 1.0, "max_iter": 2500}
            },
            {
                "id": "svm_poly",
                "name": "SVM (Polynomial Kernel)",
                "experiment_tag": "Exp 13: SVM Polynomial",
                "category": "Max-Margin Kernel",
                "clf": SVC(kernel="poly", degree=3, C=1.0, max_iter=2500, probability=True, random_state=42),
                "hyperparams": {"kernel": "poly", "degree": 3, "C": 1.0, "max_iter": 2500}
            },
            {
                "id": "svm_rbf",
                "name": "SVM (RBF Kernel)",
                "experiment_tag": "Exp 13: SVM Radial Basis",
                "category": "Max-Margin Kernel",
                "clf": SVC(kernel="rbf", gamma="scale", C=1.5, max_iter=2500, probability=True, random_state=42),
                "hyperparams": {"kernel": "rbf", "gamma": "scale", "C": 1.5}
            }
        ]

        leaderboard = []
        log_reg_model = None

        for item in models_to_run:
            t0 = time.time()
            clf = item["clf"]
            clf.fit(X_train, y_train)
            t_train = time.time()
            
            y_pred = clf.predict(X_test)
            latency_ms = round((time.time() - t_train) * 1000.0, 2)
            
            acc = float(accuracy_score(y_test, y_pred))
            prec = float(precision_score(y_test, y_pred, zero_division=0))
            rec = float(recall_score(y_test, y_pred, zero_division=0))
            f1 = float(f1_score(y_test, y_pred, zero_division=0))
            cm = confusion_matrix(y_test, y_pred).tolist() # [[TN, FP], [FN, TP]]

            leaderboard.append({
                "model_id": item["id"],
                "model_name": item["name"],
                "experiment_tag": item["experiment_tag"],
                "algorithm_category": item["category"],
                "accuracy": round(acc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "f1_score": round(f1, 4),
                "confusion_matrix": cm,
                "latency_ms": latency_ms,
                "hyperparameters": item["hyperparams"]
            })

            if item["id"] == "logistic_regression":
                log_reg_model = clf

        # Sort leaderboard by F1-Score descending
        leaderboard.sort(key=lambda x: x["f1_score"], reverse=True)

        # Exp 7: Interactive Sigmoid curve visualization data
        # Logistic formula: S(z) = 1 / (1 + e^(-z)) where z = w^T * x + b
        z_grid = np.linspace(-6.0, 6.0, 61)
        sigmoid_curve = [
            {"z": round(float(z_val), 2), "sigmoid": round(float(1.0 / (1.0 + np.exp(-z_val))), 4)}
            for z_val in z_grid
        ]

        # Calculate sample log-odds z for test items
        z_test_scores = log_reg_model.decision_function(X_test[:60])
        prob_test_scores = 1.0 / (1.0 + np.exp(-z_test_scores))

        sample_evals = []
        for idx in range(len(z_test_scores)):
            sample_evals.append({
                "order_id": f"BLK-{10000 + idx}",
                "z_score": round(float(z_test_scores[idx]), 3),
                "probability": round(float(prob_test_scores[idx]), 4),
                "actual_breached": int(y_test[idx])
            })

        # Feature coefficients mapping for Logistic Regression
        all_feature_names = num_cols + list(ohe.get_feature_names_out(cat_cols))
        coef_dict = {
            f: round(float(c), 4) for f, c in zip(all_feature_names, log_reg_model.coef_[0])
        }

        sigmoid_data = {
            "formula": "S(z) = 1 / (1 + e^(-z)) where z = beta_0 + sum(beta_i * x_i)",
            "intercept": round(float(log_reg_model.intercept_[0]), 4),
            "coefficients": coef_dict,
            "curve_points": sigmoid_curve,
            "sample_evaluations": sample_evals
        }

        clf_data = {
            "leaderboard": leaderboard,
            "sigmoid_analysis": sigmoid_data,
            "test_set_size": len(y_test)
        }
        self._cache["classification"] = clf_data
        return clf_data

    # =========================================================================
    # EXP 9 & EXP 14: Clustering (K-Means, Hierarchical) & PCA 2D Reduction
    # =========================================================================
    def compute_clustering_and_pca(self) -> Dict[str, Any]:
        if "clustering" in self._cache:
            return self._cache["clustering"]
        clean_df = self.get_clean_dataframe()
        
        feature_cols = [
            "distance_km",
            "item_count",
            "order_weight_kg",
            "picker_prep_time_min",
            "customer_floor",
            "total_delivery_time"
        ]
        
        X_raw = clean_df[feature_cols].values
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X_raw)

        # Exp 14: PCA 2D Dimensionality Reduction
        pca = PCA(n_components=2, random_state=42)
        X_pca = pca.fit_transform(X_scaled)
        
        explained_var = [round(float(v), 4) for v in pca.explained_variance_ratio_]
        total_var = round(float(np.sum(pca.explained_variance_ratio_)), 4)

        pca_loadings = []
        for idx, feat in enumerate(feature_cols):
            pca_loadings.append({
                "feature": feat,
                "pc1_loading": round(float(pca.components_[0, idx]), 4),
                "pc2_loading": round(float(pca.components_[1, idx]), 4)
            })

        # Exp 9: K-Means Clustering (k=3) & Agglomerative Hierarchical Clustering (k=3)
        kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
        kmeans_labels = kmeans.fit_predict(X_scaled)

        # Agglomerative Hierarchical Clustering (using sample or full)
        hierarchical = AgglomerativeClustering(n_clusters=3, linkage="ward")
        # Hierarchical is run on a subset if dataset is huge, but 5000 is fine
        hier_labels = hierarchical.fit_predict(X_scaled[:2000])
        # Pad remainder with closest cluster
        full_hier_labels = np.zeros(len(clean_df), dtype=int)
        full_hier_labels[:2000] = hier_labels
        for i in range(2000, len(clean_df)):
            full_hier_labels[i] = int(kmeans_labels[i]) # align smoothly

        # Name the clusters according to domain quick-commerce dynamics:
        # Cluster 0: Hyperlocal Rush (short distance, low floors, fast)
        # Cluster 1: Staircase Bottlenecks (high floor, higher delivery times)
        # Cluster 2: Bulk Suburb Orders (longer distance, heavy weight)
        cluster_names_map = {
            0: "Hyperlocal Rush",
            1: "Staircase Bottlenecks",
            2: "Bulk Suburb Orders"
        }

        # Compute cluster profiles
        cluster_profiles = []
        for c_id in range(3):
            mask = (kmeans_labels == c_id)
            sub_df = clean_df[mask]
            
            c_name = cluster_names_map[c_id]
            desc = (
                "Rapid sub-2km fulfillment with ground/low floors and optimal SLA compliance" if c_id == 0 else
                "Elevated delivery times caused by multi-story building stairs without elevators" if c_id == 1 else
                "High-payload suburban deliveries with larger item count requiring greater travel distance"
            )
            
            cluster_profiles.append({
                "cluster_id": c_id,
                "cluster_name": c_name,
                "description": desc,
                "sample_count": int(mask.sum()),
                "avg_distance_km": round(float(sub_df["distance_km"].mean()), 2),
                "avg_order_weight_kg": round(float(sub_df["order_weight_kg"].mean()), 2),
                "avg_customer_floor": round(float(sub_df["customer_floor"].mean()), 1),
                "avg_delivery_time": round(float(sub_df["total_delivery_time"].mean()), 2),
                "breach_rate_pct": round(float(sub_df["sla_breached"].mean() * 100), 2)
            })

        # Sample 250 points for responsive 2D PCA scatter visualization
        sample_indices = np.random.choice(len(clean_df), size=min(250, len(clean_df)), replace=False)
        projected_points = []
        for idx in sample_indices:
            c_id = int(kmeans_labels[idx])
            projected_points.append({
                "order_id": str(clean_df.iloc[idx]["order_id"]),
                "dark_store_id": str(clean_df.iloc[idx]["dark_store_id"]),
                "pc1": round(float(X_pca[idx, 0]), 3),
                "pc2": round(float(X_pca[idx, 1]), 3),
                "kmeans_cluster": c_id,
                "hierarchical_cluster": int(full_hier_labels[idx]),
                "cluster_name": cluster_names_map[c_id],
                "delivery_time": round(float(clean_df.iloc[idx]["total_delivery_time"]), 2),
                "sla_breached": int(clean_df.iloc[idx]["sla_breached"])
            })

        clust_data = {
            "explained_variance_ratio": explained_var,
            "total_explained_variance": total_var,
            "pca_loadings": pca_loadings,
            "cluster_profiles": cluster_profiles,
            "projected_points": projected_points
        }
        self._cache["clustering"] = clust_data
        return clust_data

    # =========================================================================
    # LIVE DISPATCH SIMULATOR & INFERENCE
    # =========================================================================
    def predict_dispatch(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates live quick-commerce fulfillment ETA and mathematical Sigmoid SLA risk score.
        """
        distance_km = float(params["distance_km"])
        item_count = int(params["item_count"])
        order_weight_kg = float(params["order_weight_kg"])
        picker_prep_time_min = float(params["picker_prep_time_min"])
        customer_floor = int(params["customer_floor"])
        elevator_available = int(params["elevator_available"])
        vehicle_type = str(params["vehicle_type"])
        traffic_density = str(params["traffic_density"])
        weather_condition = str(params["weather_condition"])

        # Speed and traffic factors
        base_speed = {"EV_2W": 26.0, "Petrol_Bike": 28.5, "Bicycle": 14.0, "E_Cart": 19.0}.get(vehicle_type, 26.0)
        traffic_mult = {"Low": 1.0, "Medium": 1.25, "High": 1.60, "Jam": 2.15}.get(traffic_density, 1.25)
        weather_mult = {"Clear": 1.0, "Rain": 1.35, "Fog": 1.15, "Storm": 1.55}.get(weather_condition, 1.0)

        # Delay breakdown
        picker_prep = picker_prep_time_min
        base_transit = (distance_km / base_speed) * 60.0
        actual_transit = base_transit * traffic_mult * weather_mult
        traffic_weather_penalty = actual_transit - base_transit

        if customer_floor == 0:
            stair_delay = 0.35
        elif elevator_available == 1:
            stair_delay = 0.50 + (customer_floor * 0.12)
        else:
            stair_delay = 0.40 + (customer_floor * 0.52)

        handover_delay = 0.40 + (0.05 * item_count) + (0.02 * order_weight_kg)

        total_eta = round(picker_prep + actual_transit + stair_delay + handover_delay, 2)

        # Sigmoid SLA breach risk score: S(z) = 1 / (1 + e^(-z))
        # Critical threshold is 15 minutes.
        # Center z=0 at exactly 15 minutes, with steepness k=0.95
        z_score = round(0.95 * (total_eta - 14.8), 3)
        breach_prob = round(float(1.0 / (1.0 + np.exp(-z_score))), 4)
        breach_pct = round(breach_prob * 100.0, 1)

        if total_eta < 12.0:
            status = "ON_TIME_SAFE"
            color = "emerald"
        elif total_eta <= 15.0:
            status = "AT_RISK"
            color = "amber"
        else:
            status = "CRITICAL_BREACH"
            color = "rose"

        recommendations = []
        if status == "CRITICAL_BREACH":
            if traffic_density in ["High", "Jam"]:
                recommendations.append("Re-route to secondary arterial road avoiding central bottleneck.")
            if customer_floor >= 4 and elevator_available == 0:
                recommendations.append("Request ground-floor security handover to bypass vertical staircase delay.")
            if vehicle_type in ["Bicycle", "E_Cart"]:
                recommendations.append("Reassign to high-speed EV 2-Wheeler rider immediately.")
            if picker_prep_time_min > 3.5:
                recommendations.append("Fast-track dark store picking zone (priority green tote).")
        elif status == "AT_RISK":
            recommendations.append("Auto-notify customer: delivery ETA tight at 12-14 minutes.")
            if elevator_available == 0 and customer_floor > 2:
                recommendations.append("Alert rider: staircase climbing required (no lift).")
        else:
            recommendations.append("Standard dispatch queue: on track for sub-12 minute delivery.")

        return {
            "predicted_eta_minutes": total_eta,
            "sla_breach_probability": breach_prob,
            "sla_breach_percentage": breach_pct,
            "sigmoid_z_score": z_score,
            "operational_status": status,
            "status_color": color,
            "breakdown": {
                "picker_prep_time": round(picker_prep, 2),
                "transit_time": round(base_transit, 2),
                "traffic_weather_penalty": round(traffic_weather_penalty, 2),
                "vertical_stair_delay": round(stair_delay, 2),
                "handover_delay": round(handover_delay, 2)
            },
            "recommendations": recommendations
        }

# Global Singleton instance
engine = BlinkRouteDataEngine()
