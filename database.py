import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

def get_db_engine():
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASS")
    host = os.getenv("DB_HOST")
    db_name = os.getenv("DB_NAME")
    
    # Validasi keamanan
    if not all([user, password, host, db_name]):
        raise ValueError("Kredensial database pada file .env tidak lengkap atau tidak ditemukan!")
    
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