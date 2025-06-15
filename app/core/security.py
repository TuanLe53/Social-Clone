import os
import jwt
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed_pw: str) -> bool:
    return pwd_context.verify(password, hashed_pw)

def create_access_token(data: dict, expired_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    
    if expired_delta is not None:
        expire = datetime.now(timezone.utc) + expired_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt
    
