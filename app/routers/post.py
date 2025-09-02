from typing import Annotated
from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.post import (
    create_post as create_post_service,
    get_posts_by_user_id,
    get_post_by_id,
    like_post as like_post_service,
    unlike_post as unlike_post_service,
    has_liked_post
)
from app.db.models import User
from app.dependencies import get_current_user
from app.db.database import get_db
from app.schemas.post import PostSchema

import os
import shutil

UPLOAD_DIRECTORY = "./app/statics/post_photos"

os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

router = APIRouter(
    prefix="/post",
)

@router.post("/")
async def create_post(user: Annotated[User, Depends(get_current_user)], content: Annotated[str, Form()], photos: list[UploadFile],  db: Session = Depends(get_db)):
    saved_filenames = []

    for photo in photos:
        file_path = os.path.join(UPLOAD_DIRECTORY, photo.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
            
        saved_filenames.append(photo.filename)
        
    post = create_post_service(
        db_session=db,
        content=content,
        user=user,
        photos=saved_filenames
    )
    
    return post

@router.get("/user/{user_id}", response_model=list[PostSchema])
async def get_posts_by_user(user_id: str, limit: int = 10, offset: int = 0, db: Session = Depends(get_db)):
    posts = get_posts_by_user_id(db_session=db, user_id=user_id, limit=limit, offset=offset)
    return posts

@router.get("/is_liked/{post_id}")
async def is_liked(post_id: str, user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    post = get_post_by_id(db, post_id)
    is_liked = has_liked_post(post, user)
    
    return {"is_liked": is_liked}

@router.post("/like/{post_id}", response_model=PostSchema)
async def like_post(post_id: str, user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=400, detail="Post not found")
    
    updated_post = like_post_service(db, post, user)
    
    return updated_post

@router.delete("/like/{post_id}", response_model=PostSchema)
async def unlike_post(post_id: str, user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=400, detail="Post not found")
    
    updated_post = unlike_post_service(db, post, user)
    
    return updated_post