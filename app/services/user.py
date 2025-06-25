from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.db.models import User, AuthProvider, RefreshToken
from app.schemas.user import RegisterUser
from app.core.security import hash_password

def get_token_by_id(db_session: Session, token_id: str) -> RefreshToken:
    return db_session.query(RefreshToken).filter(RefreshToken.id == token_id).first()

def get_token_by_user(db_session: Session, user_id: str) -> RefreshToken:
    return db_session.query(RefreshToken).filter(RefreshToken.user_id == user_id).first()

def delete_token(db_session: Session, token_id: str) -> None:
    token = get_token_by_id(db_session, token_id)
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    
    db_session.delete(token)
    db_session.commit()

def get_user_by_email(db_session: Session, email: str) -> User:
    return db_session.query(User).filter(User.email == email).first()

def get_user_by_id(db_session: Session, user_id: str) -> User:
    if not isinstance(user_id, UUID):
        try:
            user_id = UUID(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid UUID")
    return db_session.query(User).filter(User.id == user_id).first()

def create_user(db_session: Session, register_data: RegisterUser) -> User:
    hash = hash_password(register_data.password)
    request_dict = register_data.model_dump()
    request_dict.update({"password": hash})
    
    user = User(**request_dict)
    
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    return user

def create_user_with_auth_provider(db_session: Session, username: str, email: str) -> User:
    user = User(
        username=username,
        email = email
    )
    
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    return user

def get_provider_by_provider_id(db_session: Session, provider_id: str, provider: str) -> AuthProvider:
    return db_session.query(AuthProvider).filter(
        AuthProvider.provider_id == provider_id,
        AuthProvider.provider == provider
    ).first()
    
def create_auth_provider(db_session: Session, user_id: str, provider: str, provider_id: str) -> AuthProvider:
    auth_provider = AuthProvider(
        user_id=user_id,
        provider=provider,
        provider_id=provider_id
    )
    
    db_session.add(auth_provider)
    db_session.commit()
    
    return auth_provider

def follow_user(db_session: Session, user_id: str, following_id: str) -> User:
    follower = get_user_by_id(db_session, user_id)
    following = get_user_by_id(db_session, following_id)
    
    if not follower or not following:
        raise HTTPException(status_code=400, detail="User not found")
    
    if following in follower.following:
        return following
    
    follower.following.append(following)
    
    db_session.commit()
    
    return following
    
def unfollow_user(db_session: Session, user_id: str, following_id: str) -> User:
    follower = get_user_by_id(db_session, user_id)
    following = get_user_by_id(db_session, following_id)
    
    if not follower or not following:
        raise HTTPException(status_code=400, detail="User not found")
    
    if following not in follower.following:
        raise HTTPException(status_code=400, detail="User not followed")
    
    follower.following.remove(following)
    db_session.commit()
    
    return following

def get_followers_by_user_id(db_session: Session, user_id: str) -> list[User]:
    user = get_user_by_id(db_session, user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    return user.followers

def get_following_by_user_id(db_session: Session, user_id: str) -> list[User]:
    user = get_user_by_id(db_session, user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    return user.following