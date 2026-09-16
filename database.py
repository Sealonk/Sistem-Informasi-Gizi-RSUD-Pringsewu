import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

load_dotenv()

def get_db_engine():
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASS")
    db_name = os.getenv("DB_NAME")

    # Cloud Run / Cloud SQL Unix Socket
    unix_socket = os.getenv("INSTANCE_UNIX_SOCKET")

    # Local development / TCP
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT", "3306")

    if not all([user, password, db_name]):
        raise ValueError(
            "DB_USER, DB_PASS, atau DB_NAME belum dikonfigurasi."
        )

    if unix_socket:
        db_url = URL.create(
            drivername="mysql+pymysql",
            username=user,
            password=password,
            database=db_name,
            query={
                "unix_socket": unix_socket
            }
        )

        print(f"Database mode: Cloud SQL Unix Socket")
        print(f"Socket: {unix_socket}")

    else:
        if not host:
            raise ValueError(
                "DB_HOST belum dikonfigurasi untuk koneksi lokal."
            )

        db_url = URL.create(
            drivername="mysql+pymysql",
            username=user,
            password=password,
            host=host,
            port=int(port),
            database=db_name
        )

        print(f"Database mode: TCP")
        print(f"Host: {host}:{port}")

    return create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=1800
    )


def fetch_patient_data(start_date, end_date):
    engine = get_db_engine()

    query = f"""
        SELECT no_rawat, tgl_masuk, tgl_keluar
        FROM kamar_inap
        WHERE tgl_masuk >= '{start_date}'
          AND tgl_masuk <= '{end_date}'
    """

    df = pd.read_sql(query, con=engine)
    return df