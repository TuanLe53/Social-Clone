import os
import jwt
from datetime import timedelta, datetime
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.services.user import get_user_by_email, get_user_by_id, create_user, get_provider_by_provider_id, create_auth_provider, create_user_with_auth_provider, get_token_by_id, get_token_by_user, delete_token
from app.services.external_api.github import get_github_user
from app.schemas.user import RegisterUser, LoginUser, Token
from app.db.database import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token

load_dotenv()

router = APIRouter(
    prefix="/auth",
)

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

@router.get("/login/github")
async def github_login():
    return RedirectResponse(url=f"{GITHUB_AUTH_URL}?client_id={GITHUB_CLIENT_ID}&scope=user&state=login", status_code=302)

@router.get("/register/github")
async def github_register():
    return RedirectResponse(url=f"{GITHUB_AUTH_URL}?client_id={GITHUB_CLIENT_ID}&scope=user&state=register", status_code=302)
 
@router.get("/github-code")
async def github_code(response: Response, code: str, state: str, db: Session = Depends(get_db)):
    if state not in ["login", "register"]:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    elif state == "login":
        github_user = await get_github_user(code=code)
        
        existing_provider = get_provider_by_provider_id(db, str(github_user["id"]), "github")
        if not existing_provider:
            raise HTTPException(status_code=404, detail="GitHub account not linked")
        
        user = existing_provider.user
        
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expired_delta= timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        response.set_cookie(
            key="access_token",
            value=access_token
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer"
        )
        
    else:
        github_user = await get_github_user(code=code)
        existing_user = get_user_by_email(db, github_user["email"])
        
        if existing_user:
            existing_provider = get_provider_by_provider_id(db, str(github_user["id"]), "github")
            if existing_provider:
                return {"message": "User already registered with GitHub"}

            create_auth_provider(db, existing_user.id, "github", github_user["id"])
            
            return {"message": "Github account linked successfully"}
        
        user = create_user_with_auth_provider(db, github_user["login"], github_user["email"])
        create_auth_provider(db, user.id, "github", github_user["id"])
        
        return {"message": "Success", "user": user}

@router.post("/register")
async def register_user(request: RegisterUser, db: Session = Depends(get_db)):
    is_email_exists = get_user_by_email(db, request.email)
    
    if is_email_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = create_user(db, request)
    
    return {
        "message": "Registration successful",
        "user_id": new_user.id
        }
    
@router.post("/login")
async def login(request: LoginUser, response: Response, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expired_delta= timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    existed_refresh_token = get_token_by_user(db, user.id)
    if existed_refresh_token:
        delete_token(db, existed_refresh_token.id)
    
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_refresh_token(
        db_session=db,
        data={"sub": str(user.id)},
        expired_delta= timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=int(refresh_token_expires.total_seconds()),
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer"
    )
    
@router.post("/refresh")
async def refresh_access_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token_from_cookie = request.cookies.get("refresh_token")
    
    if not refresh_token_from_cookie:
        raise HTTPException(
            status_code=401,
            detail="Refresh token not found in cookie",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    try:
        payload = jwt.decode(refresh_token_from_cookie, SECRET_KEY, algorithms=[ALGORITHM])
        token_id = payload.get("refresh_token_id")
        if not token_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    db_token = get_token_by_id(db, token_id)
    
    if not db_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh token not found or already revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if datetime.utcnow() > db_token.expires:
        # Nếu refresh token hết hạn, đánh dấu là đã bị vô hiệu hóa trong DB
        delete_token(db, db_token.id)
        raise HTTPException(
            status_code=401,
            detail="Refresh token expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user_id = db_token.user_id
    user = get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found for refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expired_delta= timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Xóa refresh token cũ
    delete_token(db, db_token.id)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_refresh_token(
        db_session=db,
        data={"sub": str(user.id)},
        expired_delta= timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=int(refresh_token_expires.total_seconds()),
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer"
    )