from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from database import fetch_patient_data
from ml_service import predict_xgboost

app = FastAPI(title="API Prediksi Pasien")

class PredictionRequest(BaseModel):
    hari_kedepan: int

@app.get("/api/info-historis")
def get_historical_info():
    try:
        hari_ini = datetime.now().date()
        
        tanggal_akhir = hari_ini - timedelta(days=1)
        tanggal_awal = tanggal_akhir - relativedelta(years=1)
        
        df_raw = fetch_patient_data(tanggal_awal.strftime("%Y-%m-%d"), tanggal_akhir.strftime("%Y-%m-%d"))
        
        jumlah_hari = (tanggal_akhir - tanggal_awal).days + 1
        total_pasien = len(df_raw)
        
        return {
            "tanggal_awal": tanggal_awal.strftime("%Y-%m-%d"),
            "tanggal_akhir": tanggal_akhir.strftime("%Y-%m-%d"),
            "jumlah_hari": jumlah_hari,
            "total_pasien": total_pasien
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan internal: {str(e)}")

@app.post("/api/predict")
def predict_patients(req: PredictionRequest):
    if not (1 <= req.hari_kedepan <= 365):
        raise HTTPException(status_code=400, detail="Periode prediksi harus antara 1-365 hari")

    try:
        hari_ini = datetime.now().date()

        start_date = hari_ini - relativedelta(years=1) 
        
        df_raw = fetch_patient_data(start_date.strftime("%Y-%m-%d"), hari_ini.strftime("%Y-%m-%d"))
        
        if df_raw.empty:
            raise HTTPException(status_code=404, detail="Data pasien tidak ditemukan untuk rentang waktu ini.")

        table_data, summary = predict_xgboost(df_raw, req.hari_kedepan, hari_ini.strftime("%Y-%m-%d"))
        
        return {
            "summary": summary,
            "data": table_data
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan internal: {str(e)}")