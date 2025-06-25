import os
import jwt
import uuid
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.db.models import RefreshToken

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
    
def create_refresh_token(db_session: Session, data: dict, expired_delta: timedelta | None = None) -> str:
    to_encode = {"refresh_token_id": str(uuid.uuid4())}

    if expired_delta is not None:
        expire = datetime.now(timezone.utc) + expired_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=7)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    db_token = RefreshToken(
        id= to_encode["refresh_token_id"],
        user_id=data.get("sub"),
        expires = expire
    )
    
    db_session.add(db_token)
    db_session.commit()
    db_session.refresh(db_token)
    
    return encoded_jwt