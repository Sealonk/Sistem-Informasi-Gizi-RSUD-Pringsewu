import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

def get_db_engine():
    user = os.getenv("DB_USER", "root")
    password = os.getenv("DB_PASS", "root")
    host = os.getenv("DB_HOST", "127.0.0.1")
    db_name = os.getenv("DB_NAME", "db_gizi_pringsewu")
    
    # Menggunakan SQLAlchemy engine dengan format mysql+pymysql
    db_url = f"mysql+pymysql://{user}:{password}@{host}/{db_name}"
    return create_engine(db_url)

def fetch_patient_data(start_date, end_date):
    engine = get_db_engine()
    
    query = f"""
        SELECT no_rawat, tgl_masuk, tgl_keluar 
        FROM kamar_inap 
        WHERE tgl_masuk >= '{start_date}' AND tgl_masuk <= '{end_date}'
    """
    
    # Membaca SQL dengan engine SQLAlchemy (tidak perlu conn.close() secara manual)
    df = pd.read_sql(query, con=engine)
    return df