from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from dateutil.relativedelta import relativedelta
from database import fetch_patient_data
from ml_service import predict_xgboost

app = FastAPI(title="API Prediksi Pasien")

class PredictionRequest(BaseModel):
    hari_kedepan: int

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