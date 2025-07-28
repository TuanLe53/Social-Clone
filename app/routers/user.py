from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated
from uuid import UUID

from app.db.database import get_db
from app.db.models import User
from app.schemas.user import UserProfile
from app.dependencies import get_current_user
from app.services.user import follow_user, unfollow_user, get_followers_by_user_id, get_following_by_user_id, get_user_by_username, search_users_by_username, is_user_follows

router = APIRouter(
    prefix="/user",
)

@router.get("/{username}", response_model=UserProfile)
async def get_user_profile(username: str, db: Session = Depends(get_db)):
    is_user_exists = get_user_by_username(db, username)
    if not is_user_exists:
        raise HTTPException(status_code=404, detail="User not found.")
    
    return is_user_exists

@router.get("/search/", response_model=list[UserProfile])
async def search_user_profile(username: str, limit: int = 10, offset: int = 0, db: Session = Depends(get_db)):
    return search_users_by_username(db, username, limit, offset)

@router.post("/follow/")
async def following_user(user: Annotated[User, Depends(get_current_user)], following_id: UUID, db: Session = Depends(get_db)):
    if user.id == following_id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself.")
    
    following_user = follow_user(db, user.id, following_id)
    
    return {"message": f"User {user.username} followed user with username: {following_user.username}"}

@router.delete("/follow/")
async def unfollowing_user(user: Annotated[User, Depends(get_current_user)], following_id: UUID, db: Session = Depends(get_db)):
    if user.id == following_id:
        raise HTTPException(status_code=400, detail="You cannot unfollow yourself.")
    
    unfollowed_user = unfollow_user(db, user.id, following_id)
    
    return {"message": f"User {user.username} unfollowed user with username: {unfollowed_user.username}"}

@router.get("/is_following/{user_id}")
async def is_following_user(user_id: str, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    is_followed = is_user_follows(db, current_user.id, user_id)
    return {"is_following": is_followed}


@router.get("/followers/", response_model=list[UserProfile])
async def get_followers(user_id: UUID, db: Session = Depends(get_db)):
    followers = get_followers_by_user_id(db, user_id)
    return followers

@router.get("/followings/", response_model=list[UserProfile])
async def get_followers(user_id: UUID, db: Session = Depends(get_db)):
    followings = get_following_by_user_id(db, user_id)
    return followings