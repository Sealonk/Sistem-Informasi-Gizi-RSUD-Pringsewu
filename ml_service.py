import pandas as pd
import numpy as np
import xgboost as xgb
import holidays
import json

# Load model & features saat server menyala
xgb_model = xgb.XGBRegressor()
xgb_model.load_model("models/xgboost_model.json")
with open("models/features.json", "r") as f:
    feature_list = json.load(f)

EVENT_KEYWORDS = {
    "is_imlek": "Lunar New Year",
    "is_idulfitri": "Eid al-Fitr",
    "is_idulfitri_sec": "Eid al-Fitr Second Day",
    "is_iduladha": "Eid al-Adha",
    "is_waisak": "Vesak Day",
    "is_natal": "Christmas Day",
    "is_nyepi": "Day of Silence",
}

def aggregate_daily(df):
    df = df.copy()
    df = df.drop_duplicates(subset=["no_rawat"]).reset_index(drop=True)
    df["tgl_masuk"] = pd.to_datetime(df["tgl_masuk"], errors="coerce")
    df["tgl_keluar"] = pd.to_datetime(df["tgl_keluar"], errors="coerce")
    df = df.dropna(subset=["tgl_masuk", "tgl_keluar"])
    df = df[df["tgl_keluar"] >= df["tgl_masuk"]].reset_index(drop=True)
    
    # Explode tanggal seperti logika Ikhwan untuk menghitung pasien aktif per hari
    df["tanggal"] = [
        list(pd.date_range(start=s, end=e, freq="D")) 
        for s, e in zip(df["tgl_masuk"], df["tgl_keluar"])
    ]
    df = df.explode("tanggal").reset_index(drop=True)
    daily = df.groupby("tanggal").size().reset_index(name="jumlah_pasien").sort_values("tanggal").reset_index(drop=True)
    return daily

def feature_engineering(df):
    df = df.copy()
    df["tanggal"] = pd.to_datetime(df["tanggal"])
    
    # Weekend
    df["is_weekend"] = df["tanggal"].dt.weekday.isin([5, 6]).astype(int)
    
    # Holidays
    years = df["tanggal"].dt.year.unique()
    indo = holidays.Indonesia(years=years)
    holiday_df = pd.DataFrame(list(indo.items()), columns=["tanggal", "holiday_name"])
    holiday_df["tanggal"] = pd.to_datetime(holiday_df["tanggal"])
    
    # Event Features (H-7 to H+7)
    for column_name, event_name in EVENT_KEYWORDS.items():
        event_dates = holiday_df.loc[holiday_df["holiday_name"].str.contains(event_name, case=False, na=False), "tanggal"]
        df[column_name] = 0
        for date in event_dates:
            start = date - pd.Timedelta(days=7)
            end = date + pd.Timedelta(days=7)
            df.loc[(df["tanggal"] >= start) & (df["tanggal"] <= end), column_name] = 1
            
    # National Holiday
    df["is_libur_nasional"] = df["tanggal"].isin(holiday_df["tanggal"]).astype(int)
    return df.reset_index(drop=True)

# PERUBAHAN: Tambahkan parameter tanggal_awal_prediksi
def predict_xgboost(historical_df, periods, tanggal_eksekusi):
    # 1. Agregasi & Ekstraksi Fitur
    daily_df = aggregate_daily(historical_df)
    
    # Konversi hari eksekusi menjadi datetime
    tanggal_cutoff = pd.to_datetime(tanggal_eksekusi)
    
    # Batasi data historis mentok HANYA sampai hari ini (tidak ada data besok yang bocor)
    daily_df = daily_df[daily_df["tanggal"] <= tanggal_cutoff].copy()
    
    if len(daily_df) < 30:
        raise ValueError("Data historis sebelum tanggal prediksi kurang dari 30 hari, tidak bisa membuat lag_30.")
        
    # Generate tanggal prediksi dimulai dari BESOK (H+1)
    besok = tanggal_cutoff + pd.Timedelta(days=1)
    future_dates = pd.date_range(start=besok, periods=periods, freq="D")
    future_df = pd.DataFrame({"tanggal": future_dates})
    future_df = feature_engineering(future_df)
    
    # 2. Recursive Forecasting
    history = daily_df["jumlah_pasien"].tolist()
    predictions = []
    
    for i in range(len(future_df)):
        row = future_df.iloc[[i]].copy()
        
        lags = {
            "lag_1": history[-1],
            "lag_7": history[-7],
            "lag_14": history[-14],
            "lag_21": history[-21],
            "lag_30": history[-30],
        }
        for key, val in lags.items():
            row[key] = val
            
        row_features = row[feature_list]
        prediction = xgb_model.predict(row_features)[0]
        predictions.append(prediction)
        
        history.append(float(prediction))
        if len(history) > 40:
            history.pop(0) 

    # 3. Finalisasi Output
    result = future_df.copy()
    result["prediksi"] = pd.Series(predictions).clip(lower=0).round().astype(int)
    
    summary = {
        "total": int(result["prediksi"].sum()),
        "average": float(round(result["prediksi"].mean(), 2)),
        "maximum": int(result["prediksi"].max()),
        "minimum": int(result["prediksi"].min())
    }
    
    result["tanggal"] = result["tanggal"].dt.strftime("%Y-%m-%d")
    return result[["tanggal", "prediksi"]].to_dict(orient="records"), summary