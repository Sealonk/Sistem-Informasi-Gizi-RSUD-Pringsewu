from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

# Menggunakan HTTPBearer karena login diproses di Node.js, bukan di FastAPI
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not SECRET_KEY:
        raise HTTPException(status_code=500, detail="JWT_SECRET belum dikonfigurasi di .env")
    
    try:
        # Ekstrak token dari header "Authorization: Bearer <token>"
        token = credentials.credentials
        
        # Dekode token menggunakan secret key yang sama dengan Node.js
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesi berakhir, silakan login ulang.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token akses tidak valid.")