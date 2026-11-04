"""
BlinkRoute Platform - Deterministic Dataset Generator
Generates 5,000 quick-commerce hyperlocal delivery records.
Features realistic logistics physics: transit speeds, traffic multipliers,
picker preparation times, vertical delivery stairs penalties, and controlled outliers.
"""

import os
import numpy as np
import pandas as pd

def generate_blinkroute_dataset(n_samples: int = 5000, seed: int = 42, output_path: str = None) -> pd.DataFrame:
    np.random.seed(seed)
    
    dark_stores = [
        "DS-KORAMANGALA",
        "DS-INDIRANAGAR",
        "DS-HSR-LAYOUT",
        "DS-WHITEFIELD",
        "DS-JAYANAGAR"
    ]
    
    vehicle_types = ["EV_2W", "Petrol_Bike", "Bicycle", "E_Cart"]
    vehicle_probs = [0.45, 0.35, 0.12, 0.08]
    vehicle_base_speed_kmh = {
        "EV_2W": 26.0,
        "Petrol_Bike": 28.5,
        "Bicycle": 14.0,
        "E_Cart": 19.0
    }
    
    traffic_levels = ["Low", "Medium", "High", "Jam"]
    traffic_probs = [0.25, 0.40, 0.25, 0.10]
    traffic_multipliers = {
        "Low": 1.0,
        "Medium": 1.25,
        "High": 1.60,
        "Jam": 2.15
    }
    
    weather_conditions = ["Clear", "Rain", "Fog", "Storm"]
    weather_probs = [0.70, 0.18, 0.08, 0.04]
    weather_multipliers = {
        "Clear": 1.0,
        "Rain": 1.35,
        "Fog": 1.15,
        "Storm": 1.55
    }
    
    time_slots = ["Morning_Rush", "Afternoon_Lull", "Evening_Peak", "Late_Night"]
    time_slot_probs = [0.30, 0.20, 0.40, 0.10]
    
    # 1. Primary Identifiers & Logistics features
    order_ids = [f"BLK-{10000 + i}" for i in range(n_samples)]
    assigned_dark_stores = np.random.choice(dark_stores, size=n_samples)
    
    # Hyperlocal distance in km (gamma distribution skewed towards 1.2 - 2.8 km, with rare tail up to 6.5 km)
    raw_distances = np.random.gamma(shape=2.5, scale=0.85, size=n_samples)
    distances_km = np.clip(np.round(raw_distances, 2), 0.35, 6.80)
    
    # Items: Poisson distributed around 4 items
    raw_items = np.random.poisson(lam=4.2, size=n_samples) + 1
    item_counts = np.clip(raw_items, 1, 14)
    
    # Weight in kg (correlated with item count + random product variance)
    order_weights = np.round(item_counts * np.random.uniform(0.3, 0.9, size=n_samples) + np.random.uniform(0.1, 0.5, size=n_samples), 2)
    order_weights = np.clip(order_weights, 0.25, 12.50)
    
    # Order value in INR: ₹120 to ₹3,800
    base_item_price = np.random.uniform(90, 260, size=n_samples)
    order_values = np.round(item_counts * base_item_price + np.random.uniform(20, 150, size=n_samples), 2)
    
    # Dark store picker preparation time: 1.2 to 6.5 minutes
    picker_prep_times = np.round(1.2 + (item_counts * 0.28) + np.random.normal(0.4, 0.25, size=n_samples), 2)
    picker_prep_times = np.clip(picker_prep_times, 1.10, 6.80)
    
    # Customer building floor: 0 (ground) to 16
    customer_floors = np.random.choice(np.arange(0, 17), size=n_samples, p=[0.22] + [0.78 / 16] * 16)
    
    # Elevator availability: higher floors usually have elevators, but 18% of buildings lack working elevators
    elevator_available = []
    for fl in customer_floors:
        if fl == 0:
            elevator_available.append(1)
        elif fl <= 3:
            elevator_available.append(np.random.choice([1, 0], p=[0.65, 0.35]))
        else:
            elevator_available.append(np.random.choice([1, 0], p=[0.88, 0.12]))
    elevator_available = np.array(elevator_available)
    
    # Categorical attributes
    vehicles = np.random.choice(vehicle_types, size=n_samples, p=vehicle_probs)
    traffic = np.random.choice(traffic_levels, size=n_samples, p=traffic_probs)
    weather = np.random.choice(weather_conditions, size=n_samples, p=weather_probs)
    slots = np.random.choice(time_slots, size=n_samples, p=time_slot_probs)
    
    # 2. Physics-based delivery duration calculation
    total_delivery_times = []
    for i in range(n_samples):
        v = vehicles[i]
        tr = traffic[i]
        w = weather[i]
        d = distances_km[i]
        prep = picker_prep_times[i]
        fl = customer_floors[i]
        el = elevator_available[i]
        n_items = item_counts[i]
        
        # Transit time in minutes: (d / speed_kmh) * 60 * traffic * weather
        speed_kmh = vehicle_base_speed_kmh[v]
        transit_min = (d / speed_kmh) * 60.0 * traffic_multipliers[tr] * weather_multipliers[w]
        
        # Last-mile doorstep climb:
        if fl == 0:
            stair_min = 0.35
        elif el == 1:
            stair_min = 0.50 + (fl * 0.12)
        else:
            stair_min = 0.40 + (fl * 0.52)  # Physical climbing without elevator
            
        # Handover time
        handover_min = 0.40 + (0.05 * n_items)
        
        # Random noise
        noise = np.random.normal(0, 0.45)
        
        # Total duration
        duration = prep + transit_min + stair_min + handover_min + noise
        
        # Inject controlled real-world operational outliers (~2.2% chance: gate access dispute, phone unanswered, puncture)
        if np.random.rand() < 0.022:
            duration += np.random.uniform(5.5, 11.0)
            
        total_delivery_times.append(round(max(4.5, float(duration)), 2))
        
    total_delivery_times = np.array(total_delivery_times)
    
    # 15-Minute SLA Breach flag (1 if > 15.0 min, else 0)
    sla_breached = (total_delivery_times > 15.0).astype(int)
    
    # Assemble DataFrame
    df = pd.DataFrame({
        "order_id": order_ids,
        "dark_store_id": assigned_dark_stores,
        "distance_km": distances_km,
        "item_count": item_counts,
        "order_weight_kg": order_weights,
        "order_value_inr": order_values,
        "picker_prep_time_min": picker_prep_times,
        "customer_floor": customer_floors,
        "elevator_available": elevator_available,
        "vehicle_type": vehicles,
        "traffic_density": traffic,
        "weather_condition": weather,
        "time_slot": slots,
        "total_delivery_time": total_delivery_times,
        "sla_breached": sla_breached
    })
    
    # Inject ~1.5% controlled NaNs in a few columns to make Exp 3 & 4 authentic (missing value imputation)
    # Keeping total_delivery_time, sla_breached, and order_id clean.
    nan_mask_weight = np.random.rand(n_samples) < 0.018
    df.loc[nan_mask_weight, "order_weight_kg"] = np.nan
    
    nan_mask_floor = np.random.rand(n_samples) < 0.015
    df.loc[nan_mask_floor, "customer_floor"] = np.nan
    
    nan_mask_traffic = np.random.rand(n_samples) < 0.012
    df.loc[nan_mask_traffic, "traffic_density"] = np.nan
    
    nan_mask_vehicle = np.random.rand(n_samples) < 0.010
    df.loc[nan_mask_vehicle, "vehicle_type"] = np.nan

    if output_path:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        df.to_csv(output_path, index=False)
        print(f"Dataset successfully created at: {output_path} with {len(df)} records.")
        print(f"SLA Breach Rate: {df['sla_breached'].mean() * 100:.2f}%")
        print(f"Mean Delivery Time: {df['total_delivery_time'].mean():.2f} min")
        print(f"Missing Values:\n{df.isna().sum()[df.isna().sum() > 0]}")
        
    return df

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    target_csv = os.path.join(current_dir, "blinkroute_orders.csv")
    generate_blinkroute_dataset(n_samples=5000, seed=42, output_path=target_csv)
